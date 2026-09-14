import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

const requestSchema = z
  .object({
    email: z.string().trim().email().max(255),

    fname: z.string().trim().min(2).max(100),

    lname: z.string().trim().min(1).max(100),

    country: z.string().trim().min(2).max(100),

    sbacousticsinterest: z.boolean(),

    sbaudienceinterest: z.boolean(),

    gRecaptchaToken: z.string().min(1).max(4096),

    hp_company: z.string().max(200).optional(),

    elapsedMs: z.number().int().min(0).max(60 * 60 * 1000),

    requestId: z.string().uuid(),
  })
  .refine(
    (data) =>
      data.sbacousticsinterest ||
      data.sbaudienceinterest,
    {
      message: "Please select at least one newsletter.",
      path: ["sbacousticsinterest"],
    }
  );

const RATE_LIMIT_WINDOW = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 3;

const IDEMPOTENCY_WINDOW = 24 * 60 * 60 * 1000;

const MIN_FORM_TIME = 3000;

const MAX_BODY_BYTES = 32_000;

const RECAPTCHA_MIN_SCORE = 0.6;


type RateLimitEntry = {
  count: number;
  resetAt: number;
};


type IdempotencyEntry = {
  createdAt: number;
  response: Record<string, unknown>;
};


const rateLimitStore = new Map<
  string,
  RateLimitEntry
>();


const idempotencyStore = new Map<
  string,
  IdempotencyEntry
>();


function cleanupStores() {
  const now = Date.now();

  for (const [key, value] of rateLimitStore) {
    if (value.resetAt <= now) {
      rateLimitStore.delete(key);
    }
  }

  for (const [key, value] of idempotencyStore) {
    if (
      now - value.createdAt >
      IDEMPOTENCY_WINDOW
    ) {
      idempotencyStore.delete(key);
    }
  }
}


function getClientIp(
  request: NextRequest
) {
  const forwardedFor =
    request.headers.get("x-forwarded-for");

  if (forwardedFor) {
    return (
      forwardedFor
        .split(",")[0]
        ?.trim() || "unknown"
    );
  }

  return (
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}


function isRateLimited(ip: string) {
  cleanupStores();

  const now = Date.now();

  const existing =
    rateLimitStore.get(ip);

  if (
    !existing ||
    existing.resetAt <= now
  ) {
    rateLimitStore.set(ip, {
      count: 1,
      resetAt:
        now + RATE_LIMIT_WINDOW,
    });

    return false;
  }

  if (
    existing.count >=
    RATE_LIMIT_MAX
  ) {
    return true;
  }

  existing.count += 1;

  return false;
}


function isDisposableEmail(
  email: string
) {
  const disposableDomains =
    new Set([
      "mailinator.com",
      "guerrillamail.com",
      "10minutemail.com",
      "tempmail.com",
      "throwawaymail.com",
    ]);

  const domain =
    email
      .split("@")[1]
      ?.toLowerCase();

  return domain
    ? disposableDomains.has(domain)
    : false;
}


async function verifyRecaptcha(
  token: string,
  request: NextRequest
) {
  const secret =
    process.env.RECAPTCHA_SECRET_KEY;

  if (!secret) {
    return {
      valid: false,
      status: 503,
      reason:
        "Spam protection is not configured.",
    };
  }

  const response = await fetch(
    "https://www.google.com/recaptcha/api/siteverify",
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/x-www-form-urlencoded",
      },

      body: new URLSearchParams({
        secret,
        response: token,
        remoteip: getClientIp(request),
      }),

      cache: "no-store",
    }
  );

  if (!response.ok) {
    return {
      valid: false,
      status: 503,
      reason:
        "Spam verification is temporarily unavailable.",
    };
  }

  const data =
    (await response.json()) as {
      success?: boolean;
      score?: number;
      action?: string;
      hostname?: string;
    };

  if (data.success !== true) {
    return {
      valid: false,
      status: 403,
      reason:
        "Spam verification failed.",
    };
  }

  if (
    typeof data.score !== "number" ||
    data.score < RECAPTCHA_MIN_SCORE
  ) {
    return {
      valid: false,
      status: 403,
      reason:
        "Spam verification failed.",
    };
  }

  if (
    data.action !==
    "newsletterSubmit"
  ) {
    return {
      valid: false,
      status: 403,
      reason:
        "Invalid spam verification action.",
    };
  }

  const allowedHostnames =
    new Set([
      "sbacoustics.com",
      "www.sbacoustics.com",
      "webdemosbe.xyz",
      "www.webdemosbe.xyz",
      "localhost",
    ]);

  if (
    data.hostname &&
    !allowedHostnames.has(
      data.hostname
    )
  ) {
    return {
      valid: false,
      status: 403,
      reason:
        "Invalid spam verification hostname.",
    };
  }

  return {
    valid: true,
    status: 200,
    score: data.score,
  };
}


export async function POST(
  request: NextRequest
) {
  try {
    const contentLength =
      Number(
        request.headers.get(
          "content-length"
        ) ?? "0"
      );

    if (
      contentLength >
      MAX_BODY_BYTES
    ) {
      return NextResponse.json(
        {
          error:
            "Request is too large.",
        },
        {
          status: 413,
        }
      );
    }


    const ip =
      getClientIp(request);

    if (isRateLimited(ip)) {
      return NextResponse.json(
        {
          error:
            "Too many requests. Please try again later.",
        },
        {
          status: 429,
        }
      );
    }


    const body =
      await request.json();


    const validation =
      requestSchema.safeParse(body);


    if (!validation.success) {
      return NextResponse.json(
        {
          error:
            "Invalid form submission.",
        },
        {
          status: 400,
        }
      );
    }


    const {
      email,
      fname,
      lname,
      country,
      sbacousticsinterest,
      sbaudienceinterest,
      gRecaptchaToken,
      hp_company,
      elapsedMs,
      requestId,
    } = validation.data;


    const previous =
      idempotencyStore.get(
        requestId
      );

    if (
      previous &&
      Date.now() -
        previous.createdAt <=
        IDEMPOTENCY_WINDOW
    ) {
      return NextResponse.json(
        previous.response
      );
    }


    // Honeypot
    if (hp_company?.trim()) {
      const responseData = {
        message: "success",
      };

      idempotencyStore.set(
        requestId,
        {
          createdAt: Date.now(),
          response:
            responseData,
        }
      );

      return NextResponse.json(
        responseData
      );
    }


    // Minimum form completion time
    if (
      elapsedMs <
      MIN_FORM_TIME
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid submission.",
        },
        {
          status: 400,
        }
      );
    }


    // Disposable email
    if (
      isDisposableEmail(email)
    ) {
      const responseData = {
        message: "success",
      };

      idempotencyStore.set(
        requestId,
        {
          createdAt: Date.now(),
          response:
            responseData,
        }
      );

      return NextResponse.json(
        responseData
      );
    }


    // reCAPTCHA verification
    const recaptcha =
      await verifyRecaptcha(
        gRecaptchaToken,
        request
      );


    if (!recaptcha.valid) {
      return NextResponse.json(
        {
          error:
            recaptcha.reason,
        },
        {
          status:
            recaptcha.status,
        }
      );
    }


    // Mailchimp configuration
    const API_KEY =
      process.env.MAILCHIMP_API_KEY;

    const API_SERVER =
      process.env.MAILCHIMP_API_SERVER;

    const AUDIENCE_ID =
      process.env.MAILCHIMP_AUDIENCE_ID;


    if (
      !API_KEY ||
      !API_SERVER ||
      !AUDIENCE_ID
    ) {
      return NextResponse.json(
        {
          error:
            "Newsletter service is not configured.",
        },
        {
          status: 503,
        }
      );
    }


    // Mailchimp API URL
    const url =
      `https://${API_SERVER}.api.mailchimp.com/3.0/lists/${AUDIENCE_ID}/members`;


    // Mailchimp data
    const mailchimpData = {
      email_address: email,

      status: "subscribed",

      merge_fields: {
        FNAME: fname,
        LNAME: lname,
        MMERGE7: country,
      },

      interests: {
        ed2808e891:
          sbacousticsinterest,

        a7b8b98cc4:
          sbaudienceinterest,
      },
    };


    try {
      const response =
        await axios.post(
          url,
          mailchimpData,
          {
            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                `api_key ${API_KEY}`,
            },
          }
        );


      if (
        response.status === 200
      ) {
        const responseData = {
          message: "success",
        };

        idempotencyStore.set(
          requestId,
          {
            createdAt:
              Date.now(),

            response:
              responseData,
          }
        );

        return NextResponse.json(
          responseData
        );
      }


      return NextResponse.json(
        {
          error:
            "Failed to subscribe.",
        },
        {
          status:
            response.status,
        }
      );

    } catch (error) {

      if (
        axios.isAxiosError(error)
      ) {
        console.error(
          "Mailchimp error:",
          error.response?.status,
          error.response?.data
        );


        if (
          error.response?.data
            ?.title ===
          "Member Exists"
        ) {
          const responseData = {
            message: "already",
          };

          idempotencyStore.set(
            requestId,
            {
              createdAt:
                Date.now(),

              response:
                responseData,
            }
          );

          return NextResponse.json(
            responseData
          );
        }
      }


      return NextResponse.json(
        {
          error:
            "Failed to subscribe to newsletter.",
        },
        {
          status: 502,
        }
      );
    }

  } catch (error) {

    console.error(
      "Newsletter error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Something went wrong. Please try again.",
      },
      {
        status: 500,
      }
    );
  }
}
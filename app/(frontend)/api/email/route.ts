// import { EmailConfirmation, EmailTemplate } from '@/components/resendemail';
// import { type NextRequest, NextResponse } from 'next/server';
// import { Resend } from 'resend';

// const toNoReplyEmail = (email: string) => {
//   const domain = email.split('@')[1];
//   // return `noreply@${domain}`;
//   return `noreply@webdemosbe.xyz`;
// };
// const resend = new Resend(process.env.RESEND_API_KEY);

// export async function POST(request: NextRequest) {
//   const body = await request.json();

//   const {
//     email,
//     name,
//     country,
//     subject,
//     message,
//     website,
//     fromemail,
//     hp_company,
//     elapsedMs,
//     old = false
//   } = body;   
//   if(old){
//     if (typeof hp_company === 'string' && hp_company.trim() !== '') {
//       return NextResponse.json(
//         { error: "Invalid submission company" },
//         { status: 500 }
//       );
//     }
//     if (typeof elapsedMs !== 'number' || elapsedMs < 3000) {
//       return NextResponse.json(
//         { error: "Invalid submission time" },
//         { status: 500 }
//       );
//     }
//   }
//   // const { data, error } = await resend.batch.send([
//   //   // Email to user
//   //   {
//   //     from: `${website} <${toNoReplyEmail(fromemail)}>`,
//   //     to: [email],
//   //     subject: "We received your message!",
//   //     react: EmailConfirmation({ name, website }),
//   //   },
//   //   // Email to team
//   //   {
//   //     from: `${website} <${toNoReplyEmail(fromemail)}>`,
//   //     to: [`${process.env.MY_EMAIL}`, "backup@sbacoustics.com"],
//   //     subject: subject,
//   //     react: EmailTemplate({ name, email, country, subject, message, website }),
//   //   },
//   // ]);

//     //DEVELOPMENT ONLY
//    const { data, error } = await resend.emails.send(
//     // // Email to user
//     // {
//     //   from: `${website} <${toNoReplyEmail(fromemail)}>`,
//     //   to: [email],
//     //   subject: "We received your message!",
//     //   react: EmailConfirmation({ name, website }),
//     // },
//     // Email to team
//     {
//       from: `${website} <${toNoReplyEmail(fromemail)}>`,
//       to: [
//         // `${process.env.MY_EMAIL}`, 
//         "alfonskerja@gmail.com",
//         "it.04@sinarbajaelectric.com",
//       ],
//       subject: subject,
//       react: EmailTemplate({ name, email, country, subject, message, website }),
//     },
//   );

//   if (error) {
//     return NextResponse.json(
//       { error: error.message },
//       { status: 500 }
//     );
//   }

//   return NextResponse.json({
//     message: "Email sent",
//     data,
//   });
// }







import { EmailTemplate } from "@/components/resendemail";
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";

const resend = new Resend(process.env.RESEND_API_KEY);

const requestSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(255),
  country: z.string().trim().min(2).max(100),
  subject: z.string().trim().min(5).max(200),
  message: z.string().trim().min(10).max(5000),
  gRecaptchaToken: z.string().min(1).max(4096),
  hp_company: z.string().max(200).optional(),
  elapsedMs: z.number().int().min(0).max(60 * 60 * 1000),
  requestId: z.string().uuid(),
});

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

const rateLimitStore = new Map<string, RateLimitEntry>();
const idempotencyStore = new Map<string, IdempotencyEntry>();

function cleanupStores() {
  const now = Date.now();

  for (const [key, value] of rateLimitStore) {
    if (value.resetAt <= now) rateLimitStore.delete(key);
  }

  for (const [key, value] of idempotencyStore) {
    if (now - value.createdAt > IDEMPOTENCY_WINDOW) {
      idempotencyStore.delete(key);
    }
  }
}

function getClientIp(request: NextRequest) {
  // Only use forwarded headers when they are set by your trusted hosting proxy.
  const forwardedFor = request.headers.get("x-forwarded-for");

  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }

  return request.headers.get("x-real-ip") || "unknown";
}

function isRateLimited(ip: string) {
  cleanupStores();

  const now = Date.now();
  const existing = rateLimitStore.get(ip);

  if (!existing || existing.resetAt <= now) {
    rateLimitStore.set(ip, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW,
    });

    return false;
  }

  if (existing.count >= RATE_LIMIT_MAX) {
    return true;
  }

  existing.count += 1;
  return false;
}

function containsSpam(value: string) {
  const spamPatterns = [
    /\bviagra\b/i,
    /\bcasino\b/i,
    /\bcrypto investment\b/i,
    /\bseo service\b/i,
    /\bbuy backlinks\b/i,
    /\btelegram\b.*\bcontact\b/i,
    /\bwhatsapp\b.*\bcontact\b/i,
    /\bguaranteed traffic\b/i,
    /\bincrease your ranking\b/i,
  ];

  return spamPatterns.some((pattern) => pattern.test(value));
}

function hasTooManyLinks(value: string) {
  const links =
    value.match(/(?:https?:\/\/|www\.)[^\s]+/gi) ?? [];

  return links.length > 2;
}

function isDisposableEmail(email: string) {
  const disposableDomains = new Set([
    "mailinator.com",
    "guerrillamail.com",
    "10minutemail.com",
    "tempmail.com",
    "throwawaymail.com",
  ]);

  const domain = email.split("@")[1]?.toLowerCase();
  return domain ? disposableDomains.has(domain) : false;
}

async function verifyRecaptcha(token: string, request: NextRequest) {
  const secret = process.env.RECAPTCHA_SECRET_KEY;

  if (!secret) {
    return {
      valid: false,
      status: 503,
      reason: "Spam protection is not configured.",
    };
  }

  const response = await fetch(
    "https://www.google.com/recaptcha/api/siteverify",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        secret,
        response: token,
        remoteip: getClientIp(request),
      }),
      cache: "no-store",
    },
  );

  if (!response.ok) {
    return {
      valid: false,
      status: 503,
      reason: "Spam verification is temporarily unavailable.",
    };
  }

  const data = (await response.json()) as {
    success?: boolean;
    score?: number;
    action?: string;
    hostname?: string;
  };

  if (data.success !== true) {
    return {
      valid: false,
      status: 403,
      reason: "Spam verification failed.",
    };
  }

  if (typeof data.score !== "number" || data.score < RECAPTCHA_MIN_SCORE) {
    return {
      valid: false,
      status: 403,
      reason: "Spam verification failed.",
    };
  }

  if (data.action !== "contactFormSubmit") {
    return {
      valid: false,
      status: 403,
      reason: "Invalid spam verification action.",
    };
  }

  const allowedHostnames = new Set([
    "sbacoustics.com",
    "www.sbacoustics.com",
    "webdemosbe.xyz",
    "www.webdemosbe.xyz",
    "localhost",
  ]);

  if (data.hostname && !allowedHostnames.has(data.hostname)) {
    return {
      valid: false,
      status: 403,
      reason: "Invalid spam verification hostname.",
    };
  }

  return {
    valid: true,
    status: 200,
    score: data.score,
  };
}

export async function POST(request: NextRequest) {
  try {
    const contentLength = Number(
      request.headers.get("content-length") ?? "0",
    );

    if (contentLength > MAX_BODY_BYTES) {
      return NextResponse.json(
        { error: "Request is too large." },
        { status: 413 },
      );
    }

    const body = await request.json();

    const validation = requestSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid form submission." },
        { status: 400 },
      );
    }

    const {
      name,
      email,
      country,
      subject,
      message,
      gRecaptchaToken,
      hp_company,
      elapsedMs,
      requestId,
    } = validation.data;

    const previous = idempotencyStore.get(requestId);

    if (
      previous &&
      Date.now() - previous.createdAt <= IDEMPOTENCY_WINDOW
    ) {
      return NextResponse.json(previous.response);
    }

    if (hp_company?.trim()) {
      const response = { message: "Email sent" };

      idempotencyStore.set(requestId, {
        createdAt: Date.now(),
        response,
      });

      return NextResponse.json(response);
    }

    if (elapsedMs < MIN_FORM_TIME) {
      return NextResponse.json(
        { error: "Invalid submission." },
        { status: 400 },
      );
    }

    const fullContent = `${subject} ${message}`;

    if (
      containsSpam(fullContent) ||
      hasTooManyLinks(fullContent) ||
      isDisposableEmail(email)
    ) {
      const response = { message: "Email sent" };

      idempotencyStore.set(requestId, {
        createdAt: Date.now(),
        response,
      });

      return NextResponse.json(response);
    }

    const recaptcha = await verifyRecaptcha(
      gRecaptchaToken,
      request,
    );

    if (!recaptcha.valid) {
      return NextResponse.json(
        { error: recaptcha.reason },
        { status: recaptcha.status },
      );
    }

    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { error: "Email service is not configured." },
        { status: 503 },
      );
    }

    const { data, error } = await resend.emails.send(
      {
        from:
          "SB Acoustics Contact Form <noreply@webdemosbe.xyz>",
        replyTo: email,
        to: [
          "alfonskerja@gmail.com",
          "it.04@sinarbajaelectric.com",
        ],
        subject,
        react: EmailTemplate({
          name,
          email,
          country,
          subject,
          message,
          website: "SB Acoustics",
        }),
      },
      {
        idempotencyKey: `contact-form/${requestId}`,
      },
    );

    if (error) {
      console.error("Resend error:", error);

      return NextResponse.json(
        { error: "Failed to send email." },
        { status: 502 },
      );
    }

    const response = {
      message: "Email sent",
      data,
    };

    idempotencyStore.set(requestId, {
      createdAt: Date.now(),
      response,
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error("Contact form error:", error);

    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
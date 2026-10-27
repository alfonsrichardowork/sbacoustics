"use client"

import { FormEvent, useRef, useState } from "react"
import { useGoogleReCaptcha } from "react-google-recaptcha-v3"

import "./catalogues.css"

type FormValues = {
  email: string
  fname: string
  lname: string
  country: string
  sbacousticsinterest: boolean
  sbaudienceinterest: boolean
  hp_company: string
}

type FormErrors = Partial<
  Record<
    | "email"
    | "fname"
    | "lname"
    | "country"
    | "newsletter",
    string
  >
>

const MIN_FILL_MS = 3000

const initialValues: FormValues = {
  email: "",
  fname: "",
  lname: "",
  country: "",
  sbacousticsinterest: false,
  sbaudienceinterest: false,
  hp_company: "",
}


// Safari-compatible UUID generator
function createRequestId() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
    /[xy]/g,
    function (c) {
      const r = Math.floor(Math.random() * 16)

      const v =
        c === "x"
          ? r
          : (r & 0x3) | 0x8

      return v.toString(16)
    }
  )
}


function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {}

  if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      values.email
    )
  ) {
    errors.email =
      "Please enter a valid email address."
  }

  if (
    values.fname.trim().length < 2
  ) {
    errors.fname =
      "First Name must be at least 2 characters."
  }

  if (
    values.lname.trim().length < 1
  ) {
    errors.lname =
      "Last Name must be at least 1 character."
  }

  if (
    values.country.trim().length < 2
  ) {
    errors.country =
      "Please enter a valid country name."
  }


  // At least one newsletter must be selected
  if (
    !values.sbacousticsinterest &&
    !values.sbaudienceinterest
  ) {
    errors.newsletter =
      "Please select at least one newsletter."
  }

  return errors
}


export default function NewsletterClient() {

  const {
    executeRecaptcha
  } = useGoogleReCaptcha()


  const [values, setValues] =
    useState<FormValues>({
      ...initialValues,
    })


  const [errors, setErrors] =
    useState<FormErrors>({})


  const [loading, setLoading] =
    useState(false)


  const [notice, setNotice] =
    useState<{
      type: "success" | "error" | "already"
      text: string
    }>()


  const mountedAt =
    useRef(Date.now())


  const updateValue = (
    name: keyof FormValues,
    value: string | boolean
  ) => {

    setValues((current) => ({
      ...current,
      [name]: value,
    }))


    setErrors((current) => ({
      ...current,

      [name]:
        undefined,

      newsletter:
        undefined,
    }))


    setNotice(undefined)
  }


  const onSubmit = async (
    event: FormEvent
  ) => {

    event.preventDefault()


    const nextErrors =
      validate(values)


    setErrors(nextErrors)


    if (
      Object.keys(nextErrors).length > 0
    ) {
      return
    }


    const elapsedMs =
      Date.now() -
      mountedAt.current


    // Honeypot:
    // Pretend success so bots do not know
    // they were detected.
    if (
      values.hp_company.trim() !== ""
    ) {

      setNotice({
        type: "success",

        text:
          "Thank you for subscribing! We will keep you updated with our latest news and promotions.",
      })

      return
    }


    // Form completed too quickly
    if (
      elapsedMs < MIN_FILL_MS
    ) {

      setNotice({
        type: "success",

        text:
          "Thank you for subscribing! We will keep you updated with our latest news and promotions.",
      })

      return
    }


    setLoading(true)
    setNotice(undefined)


    try {

      if (!executeRecaptcha) {
        throw new Error(
          "reCAPTCHA is not available. Please try again."
        )
      }


      const gRecaptchaToken =
        await executeRecaptcha(
          "newsletterSubmit"
        )


      const requestId =
        createRequestId()


      const response =
        await fetch(
          "/api/newsletter",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({

              // API required fields
              email:
                values.email,

              fname:
                values.fname,

              lname:
                values.lname,

              country:
                values.country,

              sbacousticsinterest:
                values.sbacousticsinterest,

              sbaudienceinterest:
                values.sbaudienceinterest,

              hp_company:
                values.hp_company,

              gRecaptchaToken,

              elapsedMs,

              requestId,
            }),
          }
        )


      const data =
        await response.json()


      if (!response.ok) {

        throw new Error(
          data.error ||
          "Newsletter subscription failed."
        )
      }


      // Handle already subscribed
      if (
        data.message === "already"
      ) {

        setNotice({
          type: "already",

          text:
            "Thank you for your excitement! This email address is already subscribed to our updates.",
        })

        return
      }


      // Reset form after success
      setValues({
        ...initialValues,
      })


      mountedAt.current =
        Date.now()


      setNotice({
        type: "success",

        text:
          "Thank you for subscribing! We will keep you updated with our latest news and promotions.",
      })

    } catch (error) {

      console.error(
        "Newsletter subscription error:",
        error
      )


      setNotice({
        type: "error",

        text:
          "Please try again or contact us directly at info@sbacoustics.com or +6231 748 00 11.",
      })

    } finally {

      setLoading(false)

    }
  }


  return (

    <div className="newsletter-parent">

      <h1
        style={{
          fontSize: "30px",
          lineHeight: "1.2",
          fontWeight: 700,
          marginBottom: "24px",
          textAlign: "center",
        }}
      >
        Newsletter Signup
      </h1>


      <form
        onSubmit={onSubmit}
        noValidate
        style={{
          padding: "16px",
          borderWidth: "1px",
          borderRadius: "8px",
        }}
      >


        {/* Email */}

        <div
          style={{
            paddingBottom: "8px",
          }}
        >

          <label
            htmlFor="email"
            style={{
              fontWeight: 600,
            }}
          >
            Email:{" "}

            <span
              style={{
                color: "#ef4444",
              }}
            >
              *
            </span>

          </label>


          <input
            type="email"
            name="email"
            id="email"
            className="input-style"
            placeholder="What is your email address?"
            value={values.email}
            onChange={(event) =>
              updateValue(
                "email",
                event.target.value
              )
            }
            disabled={loading}
          />


          {errors.email && (
            <p
              style={{
                color: "#991b1b",
                fontSize: "13px",
                marginTop: "4px",
              }}
            >
              {errors.email}
            </p>
          )}

        </div>


        {/* First Name */}

        <div
          style={{
            paddingBottom: "8px",
          }}
        >

          <label
            htmlFor="fname"
            style={{
              fontWeight: 600,
            }}
          >
            First Name:
          </label>


          <input
            type="text"
            name="fname"
            id="fname"
            className="input-style"
            placeholder="What is your first name?"
            value={values.fname}
            onChange={(event) =>
              updateValue(
                "fname",
                event.target.value
              )
            }
            disabled={loading}
          />


          {errors.fname && (
            <p
              style={{
                color: "#991b1b",
                fontSize: "13px",
                marginTop: "4px",
              }}
            >
              {errors.fname}
            </p>
          )}

        </div>


        {/* Last Name */}

        <div
          style={{
            paddingBottom: "8px",
          }}
        >

          <label
            htmlFor="lname"
            style={{
              fontWeight: 600,
            }}
          >
            Last Name:
          </label>


          <input
            type="text"
            name="lname"
            id="lname"
            className="input-style"
            placeholder="What is your last name?"
            value={values.lname}
            onChange={(event) =>
              updateValue(
                "lname",
                event.target.value
              )
            }
            disabled={loading}
          />


          {errors.lname && (
            <p
              style={{
                color: "#991b1b",
                fontSize: "13px",
                marginTop: "4px",
              }}
            >
              {errors.lname}
            </p>
          )}

        </div>


        {/* Country */}

        <div
          style={{
            paddingBottom: "8px",
          }}
        >

          <label
            htmlFor="country"
            style={{
              fontWeight: 600,
            }}
          >
            Country:
          </label>


          <input
            type="text"
            name="country"
            id="country"
            className="input-style"
            placeholder="What is your country?"
            value={values.country}
            onChange={(event) =>
              updateValue(
                "country",
                event.target.value
              )
            }
            disabled={loading}
          />


          {errors.country && (
            <p
              style={{
                color: "#991b1b",
                fontSize: "13px",
                marginTop: "4px",
              }}
            >
              {errors.country}
            </p>
          )}

        </div>


        {/* Newsletter Selection */}

        <div
          style={{
            paddingBottom: "8px",
          }}
        >

          <label
            style={{
              fontWeight: 600,
            }}
          >
            Select Newsletter:{" "}

            <span
              style={{
                color: "#ef4444",
              }}
            >
              *
            </span>

          </label>

        </div>


        {/* SB Acoustics */}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginInlineStart: "8px",
            marginInlineEnd: "8px",
            paddingBottom: "4px",
          }}
        >

          <input
            type="checkbox"
            id="sbacoustics"
            name="sbacousticsinterest"
            className="checkbox-style"
            checked={
              values.sbacousticsinterest
            }
            onChange={(event) =>
              updateValue(
                "sbacousticsinterest",
                event.target.checked
              )
            }
            disabled={loading}
          />


          <label
            htmlFor="sbacoustics"
            style={{
              cursor: "pointer",

              fontWeight:
                values.sbacousticsinterest
                  ? 600
                  : 400,
            }}
          >
            SB Acoustics
          </label>

        </div>


        {/* SB Audience */}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginInlineStart: "8px",
            marginInlineEnd: "8px",
            paddingBottom: "4px",
          }}
        >

          <input
            type="checkbox"
            id="sbaudience"
            name="sbaudienceinterest"
            className="checkbox-style"
            checked={
              values.sbaudienceinterest
            }
            onChange={(event) =>
              updateValue(
                "sbaudienceinterest",
                event.target.checked
              )
            }
            disabled={loading}
          />


          <label
            htmlFor="sbaudience"
            style={{
              cursor: "pointer",

              fontWeight:
                values.sbaudienceinterest
                  ? 600
                  : 400,
            }}
          >
            SB Audience
          </label>

        </div>


        {errors.newsletter && (
          <p
            style={{
              color: "#991b1b",
              fontSize: "13px",
              marginTop: "4px",
            }}
          >
            {errors.newsletter}
          </p>
        )}


        {/* Honeypot */}

        <div
          style={{
            display: 'none'
          }}
          aria-hidden="true"
        >

          <label htmlFor="hp_company">
            Company
          </label>


          <input
            id="hp_company"
            name="hp_company"
            type="text"
            value={values.hp_company}
            onChange={(event) =>
              updateValue(
                "hp_company",
                event.target.value
              )
            }
            tabIndex={-1}
            autoComplete="off"
          />

        </div>


        {/* Submit */}

        <div
          style={{
            paddingTop: "20px",
          }}
        >

          <button
            type="submit"
            disabled={loading}
            style={{
              backgroundColor: "#e6001b",
              color: "#ffffff",
              padding: "6px",
              borderRadius: "8px",
              cursor:
                loading
                  ? "default"
                  : "pointer",
            }}
          >

            {loading
              ? "Subscribing..."
              : "Subscribe"}

          </button>

        </div>


        {/* Response Notice */}

        {notice && (

          <div
            role="status"
            style={{
              marginTop: "8px",
              padding: "10px 14px",
              borderRadius: "4px",
              fontSize: "14px",
              lineHeight: "1.5",

              backgroundColor:
                notice.type === "success"
                  ? "#dcfce7"
                  : notice.type === "already"
                    ? "#fef3c7"
                    : "#fee2e2",

              color:
                notice.type === "success"
                  ? "#166534"
                  : notice.type === "already"
                    ? "#92400e"
                    : "#991b1b",

              border:
                notice.type === "success"
                  ? "1px solid #86efac"
                  : notice.type === "already"
                    ? "1px solid #fcd34d"
                    : "1px solid #fca5a5",
            }}
          >

            <div
              style={{
                fontWeight: 600,
                marginBottom: "3px",
              }}
            >

              {notice.type === "success"
                ? "You have subscribed!"
                : notice.type === "already"
                  ? "This email has already subscribed!"
                  : "Newsletter subscription failed!"}

            </div>


            <div
              style={{
                fontSize: "13px",
                opacity: 0.9,
              }}
            >
              {notice.text}
            </div>

          </div>

        )}

      </form>

    </div>
  )
}
"use client"

import { FormEvent, useEffect, useState } from "react";
import axios from "axios";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { useToast } from "@/components/hooks/use-toast";
import GoogleCaptchaWrapper from "@/components/GoogleCaptchaWrapper";
import './catalogues.css'


export default function NewsletterClient() {
  const [email, setEmail] = useState<string>("");
  const [fname, setFName] = useState<string>("");
  const [lname, setLName] = useState<string>("");
  const [country, setCountry] = useState<string>("");
  const [sbacousticsinterest, setSBAcoustics] = useState<boolean>(false);
  const [sbaudienceinterest, setSBAudience] = useState<boolean>(false);
  const [status, setStatus] = useState<"success" | "error" | "loading" | "idle"
  >("idle");
  const [responseMsg, setResponseMsg] = useState<string>("");
  const [run, setRun] = useState<boolean>(false);
  const {executeRecaptcha} = useGoogleReCaptcha();
  const { toast } = useToast()


  async function handleSubscribe(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    
    // Validation
    if (!email.trim()) {
      setStatus("error");
      setResponseMsg("Please enter an email address");
      toast({
        variant: "destructive",
        title: "Email Required",
        description: "Please enter a valid email address.",
      });
      return;
    }

    if (!sbacousticsinterest && !sbaudienceinterest) {
      setStatus("error");
      setResponseMsg("Please select at least one newsletter");
      toast({
        variant: "destructive",
        title: "Newsletter Selection Required",
        description: "Please select at least one newsletter to subscribe to.",
      });
      return;
    }

    setStatus("loading");
    try {
      let gRecaptchaToken = null;

      // Get reCAPTCHA token if available
      if (executeRecaptcha) {
        try {
          gRecaptchaToken = await executeRecaptcha('newsletterSubmit');
        } catch (recaptchaErr) {
          console.warn("[v0] reCAPTCHA token generation failed:", recaptchaErr);
        }
      }

      // Verify reCAPTCHA token if we have one
      if (gRecaptchaToken) {
        const response_reCaptcha = await axios({
          method: "POST",
          url: "/api/recaptcha",
          data: {
            gRecaptchaToken,
          },
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
          },
        });
    
        if (response_reCaptcha?.data?.success !== true) {
          setStatus("error");
          setResponseMsg("reCAPTCHA verification failed");
          toast({
            variant: "destructive",
            title: "Verification Failed",
            description: "reCAPTCHA verification failed. Please try again.",
          });
          return;
        }
      }

      // Subscribe to newsletter
      const response = await axios.post("/api/newsletter", { 
        email, 
        fname, 
        lname, 
        country, 
        sbacousticsinterest, 
        sbaudienceinterest 
      });

      setStatus("success");
      setEmail("");
      setFName("");
      setLName("");
      setCountry("");
      setSBAcoustics(false);
      setSBAudience(false);
      setResponseMsg(response.data.message);
      setRun(true);
    } catch (err) {
      setStatus("error");
      if (axios.isAxiosError(err)) {
        setResponseMsg(err.response?.data.error || "An error occurred");
      } else {
        setResponseMsg("An unexpected error occurred");
      }
      setRun(true);
    }
  }

  useEffect(() => {
    {run && status === "success" ? responseMsg === 'success'?
        toast({
          variant: "default",
          title: "You have subscribed!",
          description: "Thank you for subscribing! We'll keep you updated with our latest news and promotions.",
          className: "bg-green-400 border-none"
        })
      : 
      responseMsg === "already"?
        toast({
          variant: "default",
          title: "This email have already subscribed!",
          description: "Thank you for your excitement!",
          className: "bg-yellow-400 border-none"
        })
      :
        toast({
          variant: "destructive",
          title: "Email sending failed!",
          description: "Please try again or contact us directly at info@sbacoustics.com or +6231 748 00 11.",
        })
        : null
      }
  }, [run, status, toast, responseMsg])

  return (
    <GoogleCaptchaWrapper>
      <div className="newsletter-parent">
        <h1 style={{
          fontSize: '30px',
          lineHeight: '1.2',
          fontWeight: 700,
          marginBottom: '24px',
          textAlign: 'center'
        }}>
          Newsletter Signup
        </h1>

        <form onSubmit={handleSubscribe} style={{
          padding: '16px',
          borderWidth: '1px',
          borderRadius: '8px',

        }}>
          <div style={{
            paddingBottom: '8px'
          }}>
            <label htmlFor="email" style={{
              fontWeight: 600
            }}>Email: <span style={{
              color: '#ef4444'
            }}>*</span></label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="What is your email address?"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={status == "loading"}
              required
            />
          </div>
          <div style={{
            paddingBottom: '8px'
          }}>
            <label htmlFor="fname" style={{
              fontWeight: 600
            }}>First Name:</label>
            <input
              type="text"
              name="fname"
              id="fname"
              placeholder="What is your first name?"
              value={fname}
              onChange={(e) => setFName(e.target.value)}
              disabled={status == "loading"}
            />
          </div>
          <div style={{
            paddingBottom: '8px'
          }}>
            <label htmlFor="lname" style={{
              fontWeight: 600
            }}>Last Name:</label>
            <input
              type="text"
              name="lname"
              id="lname"
              placeholder="What is your last name?"
              value={lname}
              onChange={(e) => setLName(e.target.value)}
              disabled={status == "loading"}
            />
          </div>
          <div style={{
            paddingBottom: '8px'
          }}>
            <label htmlFor="country" style={{
              fontWeight: 600
            }}>Country:</label>
            <input
              type="text"
              name="country"
              id="country"
              placeholder="What is your country?"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              disabled={status == "loading"}
            />
          </div>
          <div style={{
            paddingBottom: '8px'
          }}>
            <label style={{
              fontWeight: 600
            }}>Select Newsletter: <span style={{
              color: '#ef4444'
            }}>*</span></label>
          </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              marginInlineStart: '8px',
              marginInlineEnd: '8px',
              paddingBottom: '4px'
            }}>
              <input
                type="checkbox"
                id="sbacoustics"
                checked={sbacousticsinterest}
                onChange={(e) => setSBAcoustics(e.target.checked)}
                disabled={status === "loading"}
              />
              <label style={{
                cursor: 'pointer',
                fontWeight: sbacousticsinterest ? 600 : 400
              }} htmlFor="sbacoustics">
                SB Acoustics
              </label>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              marginInlineStart: '8px',
              marginInlineEnd: '8px',
              paddingBottom: '4px'
            }}>
              <input
                type="checkbox"
                id="sbaudience"
                checked={sbaudienceinterest}
                onChange={(e) => setSBAudience(e.target.checked)}
                disabled={status === "loading"}
              />
              <label style={{
                cursor: 'pointer',
                fontWeight: sbaudienceinterest ? 600 : 400
              }} htmlFor="sbaudience">
                SB Audience
              </label>
            </div>
          <div style={{
            paddingTop: '20px'
          }}>
            <button
              type="submit"
              disabled={status == "loading"}
            >
                {status == "loading" ? (
                <div
                  style={{ 
                    marginRight: '8px'
                  }}
                >
                  Loading...
                </div>
              ) : (
                'Send'
              )}
              {status == "loading" ? "Subscribing..." : "Subscribe"}
            </button>
          </div>
        </form>
      </div>
      </GoogleCaptchaWrapper>
   );
}

"use client"

import { FormEvent, useEffect, useState } from "react";
import axios from "axios";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/hooks/use-toast";
import { Send } from "lucide-react";
import { motion } from 'framer-motion';
import PageLoader from "@/components/pageLoader";
import GoogleCaptchaWrapper from "@/components/GoogleCaptchaWrapper";


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
    setStatus("loading");
    try {
      if (!executeRecaptcha){
        console.log("Recaptcha Token not Available!")
        return;
      }
      const gRecaptchaToken = await executeRecaptcha('newsletterSubmit')

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
  
      if (response_reCaptcha?.data?.success === true) {

        const response = await axios.post("/api/newsletter", { email, fname, lname, country, sbacousticsinterest, sbaudienceinterest });

        setStatus("success");
        setEmail("");
        setFName("");
        setLName("");
        setCountry("");
        setSBAcoustics(false);
        setSBAudience(false);
        setResponseMsg(response.data.message);
      } else {
        setStatus("error");
        return
      }
    } catch (err) {
      
      setStatus("error");
      if (axios.isAxiosError(err)) {
        setStatus("error");
        setResponseMsg(err.response?.data.error);
      }
    } finally{
      setRun(true)
    }
  }

  useEffect(() => {
    {run && status === "success" ? responseMsg === 'success'?
        toast({
          variant: "default",
          title: "Email Sent Successfully!",
          description: "Thank you for reaching out. We will get back to you.",
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
      <div className="2xl:px-80 xl:px-60 lg:px-12 px-8 py-16">
        <h1 className='text-3xl font-bold mb-6 text-center'>
          Newsletter Signup
        </h1>

        <form onSubmit={handleSubscribe} className="p-4 border rounded-md shadow-lg">
          <div className="pb-2">
            <Label htmlFor="email" className="font-semibold">Email:</Label>
            <Input
              type="email"
              name="email"
              id="email"
              placeholder="What is your email address?"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={status == "loading"}
            />
          </div>
          <div className="pb-2">
            <Label htmlFor="fname" className="font-semibold">First Name:</Label>
            <Input
              type="text"
              name="fname"
              id="fname"
              placeholder="What is your first name?"
              value={fname}
              onChange={(e) => setFName(e.target.value)}
              disabled={status == "loading"}
            />
          </div>
          <div className="pb-2">
            <Label htmlFor="lname" className="font-semibold">Last Name:</Label>
            <Input
              type="text"
              name="lname"
              id="lname"
              placeholder="What is your last name?"
              value={lname}
              onChange={(e) => setLName(e.target.value)}
              disabled={status == "loading"}
            />
          </div>
          <div className="pb-2">
            <Label htmlFor="country" className="font-semibold">Country:</Label>
            <Input
              type="text"
              name="country"
              id="country"
              placeholder="What is your country?"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              disabled={status == "loading"}
            />
          </div>
          <div className="pb-2">
            <Label className="font-semibold">Select Newsletter:</Label>
          </div>
            <div className="flex items-center space-x-2 pb-1">
              <Checkbox id="sbacoustics" onClick={() => (sbacousticsinterest? setSBAcoustics(false): setSBAcoustics(true))}/>
              <Label className={`${sbacousticsinterest ? 'font-semibold': ''}`}>
                SB Acoustics
              </Label>
            </div>
            <div className="flex items-center space-x-2 pb-1">
              <Checkbox id="sbaudience" onClick={() => (sbaudienceinterest? setSBAudience(false): setSBAudience(true))}/>
              <Label className={`${sbaudienceinterest ? 'font-semibold': ''}`}>
                SB Audience
              </Label>
            </div>
          <div className="pt-5">
            <Button
              type="submit"
              disabled={status == "loading"}
            >
                {status == "loading" ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="mr-2"
                >
                  <Send className="h-4 w-4" />
                </motion.div>
              ) : (
                <Send className="mr-2 h-4 w-4" />
              )}
              {status == "loading" ? "Subscribing..." : "Subscribe"}
            </Button>
          </div>
        </form>
      </div>
      </GoogleCaptchaWrapper>
   );
}

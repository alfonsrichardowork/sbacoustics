// "use client"

// import { FormEvent, useEffect, useState } from "react";
// import axios from "axios";
// import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
// import { Label } from "@/components/ui/label";
// import { Input } from "@/components/ui/input";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Button } from "@/components/ui/button";
// import { useToast } from "@/components/hooks/use-toast";
// import { Loader2, Send } from "lucide-react";
// import { motion } from 'framer-motion';
// import GoogleCaptchaWrapper from "@/components/GoogleCaptchaWrapper";
// import z from "zod";


// const formSchema = z.object({
//   email: z.string().trim().email({
//     message: "Please enter a valid email address.",
//   }),
//   fname: z.string().trim().min(2, {
//     message: "Name must be at least 2 characters.",
//   }),
//   lname: z.string().trim().min(1, {
//     message: "Name must be at least 1 characters.",
//   }),
//   country: z.string().trim().min(2, {
//     message: "Please enter a valid country name.",
//   }),
//   sbacoustics_subscribe: z.boolean().optional(),
//   sbaudience_subscribe: z.boolean().optional(),
//   hp_company: z.string().optional(),
// });


// export default function NewsletterClient() {
//   const [email, setEmail] = useState<string>("");
//   const [fname, setFName] = useState<string>("");
//   const [lname, setLName] = useState<string>("");
//   const [country, setCountry] = useState<string>("");
//   const [sbacousticsinterest, setSBAcoustics] = useState<boolean>(false);
//   const [sbaudienceinterest, setSBAudience] = useState<boolean>(false);
//   const [status, setStatus] = useState<"success" | "error" | "loading" | "idle"
//   >("idle");
//   const [responseMsg, setResponseMsg] = useState<string>("");
//   const [run, setRun] = useState<boolean>(false);
//   const {executeRecaptcha} = useGoogleReCaptcha();
//   const { toast } = useToast()


//   async function handleSubscribe(e: FormEvent<HTMLFormElement>) {
//     e.preventDefault();
    
//     // Validation
//     if (!email.trim()) {
//       setStatus("error");
//       setResponseMsg("Please enter an email address");
//       toast({
//         variant: "destructive",
//         title: "Email Required",
//         description: "Please enter a valid email address.",
//       });
//       return;
//     }

//     if (!sbacousticsinterest && !sbaudienceinterest) {
//       setStatus("error");
//       setResponseMsg("Please select at least one newsletter");
//       toast({
//         variant: "destructive",
//         title: "Newsletter Selection Required",
//         description: "Please select at least one newsletter to subscribe to.",
//       });
//       return;
//     }

//     setStatus("loading");
//     try {
//       let gRecaptchaToken = null;

//       // Get reCAPTCHA token if available
//       if (executeRecaptcha) {
//         try {
//           gRecaptchaToken = await executeRecaptcha('newsletterSubmit');
//         } catch (recaptchaErr) {
//           console.warn("[v0] reCAPTCHA token generation failed:", recaptchaErr);
//         }
//       }

//       // Verify reCAPTCHA token if we have one
//       if (gRecaptchaToken) {
//         const response_reCaptcha = await axios({
//           method: "POST",
//           url: "/api/recaptcha",
//           data: {
//             gRecaptchaToken,
//           },
//           headers: {
//             Accept: "application/json, text/plain, */*",
//             "Content-Type": "application/json",
//           },
//         });
    
//         if (response_reCaptcha?.data?.success !== true) {
//           setStatus("error");
//           setResponseMsg("reCAPTCHA verification failed");
//           toast({
//             variant: "destructive",
//             title: "Verification Failed",
//             description: "reCAPTCHA verification failed. Please try again.",
//           });
//           return;
//         }
//       }

//       // Subscribe to newsletter
//       const response = await axios.post("/api/newsletter", { 
//         email, 
//         fname, 
//         lname, 
//         country, 
//         sbacousticsinterest, 
//         sbaudienceinterest 
//       });

//       setStatus("success");
//       setEmail("");
//       setFName("");
//       setLName("");
//       setCountry("");
//       setSBAcoustics(false);
//       setSBAudience(false);
//       setResponseMsg(response.data.message);
//       setRun(true);
//     } catch (err) {
//       setStatus("error");
//       if (axios.isAxiosError(err)) {
//         setResponseMsg(err.response?.data.error || "An error occurred");
//       } else {
//         setResponseMsg("An unexpected error occurred");
//       }
//       setRun(true);
//     }
//   }

//   useEffect(() => {
//     {run && status === "success" ? responseMsg === 'success'?
//         toast({
//           variant: "default",
//           title: "You have subscribed!",
//           description: "Thank you for subscribing! We'll keep you updated with our latest news and promotions.",
//           className: "bg-green-400 border-none"
//         })
//       : 
//       responseMsg === "already"?
//         toast({
//           variant: "default",
//           title: "This email have already subscribed!",
//           description: "Thank you for your excitement!",
//           className: "bg-yellow-400 border-none"
//         })
//       :
//         toast({
//           variant: "destructive",
//           title: "Email sending failed!",
//           description: "Please try again or contact us directly at info@sbacoustics.com or +6231 748 00 11.",
//         })
//         : null
//       }
//   }, [run, status, toast, responseMsg])

//   return (
//     <GoogleCaptchaWrapper>
//       <div className="2xl:px-80 xl:px-60 lg:px-12 px-8 py-16">
//         <h1 className='text-3xl font-bold mb-6 text-center'>
//           Newsletter Signup
//         </h1>

//         <form onSubmit={handleSubscribe} className="p-4 border rounded-md shadow-lg">
//           <div className="pb-2">
//             <Label htmlFor="email" className="font-semibold">Email: <span className="text-red-500">*</span></Label>
//             <Input
//               type="email"
//               name="email"
//               id="email"
//               placeholder="What is your email address?"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               disabled={status == "loading"}
//               required
//             />
//           </div>
//           <div className="pb-2">
//             <Label htmlFor="fname" className="font-semibold">First Name:</Label>
//             <Input
//               type="text"
//               name="fname"
//               id="fname"
//               placeholder="What is your first name?"
//               value={fname}
//               onChange={(e) => setFName(e.target.value)}
//               disabled={status == "loading"}
//             />
//           </div>
//           <div className="pb-2">
//             <Label htmlFor="lname" className="font-semibold">Last Name:</Label>
//             <Input
//               type="text"
//               name="lname"
//               id="lname"
//               placeholder="What is your last name?"
//               value={lname}
//               onChange={(e) => setLName(e.target.value)}
//               disabled={status == "loading"}
//             />
//           </div>
//           <div className="pb-2">
//             <Label htmlFor="country" className="font-semibold">Country:</Label>
//             <Input
//               type="text"
//               name="country"
//               id="country"
//               placeholder="What is your country?"
//               value={country}
//               onChange={(e) => setCountry(e.target.value)}
//               disabled={status == "loading"}
//             />
//           </div>
//           <div className="pb-2">
//             <Label className="font-semibold">Select Newsletter: <span className="text-red-500">*</span></Label>
//           </div>
//             <div className="flex items-center space-x-2 pb-1">
//               <Checkbox 
//                 id="sbacoustics" 
//                 checked={sbacousticsinterest}
//                 onCheckedChange={(checked) => setSBAcoustics(checked === true)}
//                 disabled={status == "loading"}
//               />
//               <Label className={`${sbacousticsinterest ? 'font-semibold': ''} cursor-pointer`} htmlFor="sbacoustics">
//                 SB Acoustics
//               </Label>
//             </div>
//             <div className="flex items-center space-x-2 pb-1">
//               <Checkbox 
//                 id="sbaudience" 
//                 checked={sbaudienceinterest}
//                 onCheckedChange={(checked) => setSBAudience(checked === true)}
//                 disabled={status == "loading"}
//               />
//               <Label className={`${sbaudienceinterest ? 'font-semibold': ''} cursor-pointer`} htmlFor="sbaudience">
//                 SB Audience
//               </Label>
//             </div>
//           <div className="pt-5">
//             <Button
//               type="submit"
//               disabled={status == "loading"}
//             >
//                 {status == "loading" ? (
//                 <motion.div
//                   animate={{ rotate: 360 }}
//                   transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
//                   className="mr-2"
//                 >
//                   <Loader2 className="h-4 w-4" />
//                 </motion.div>
//               ) : (
//                 <Send className="mr-2 h-4 w-4" />
//               )}
//               {status == "loading" ? "Subscribing..." : "Subscribe"}
//             </Button>
//           </div>
//         </form>
//       </div>
//       </GoogleCaptchaWrapper>
//    );
// }














"use client"

import { useEffect, useState } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/hooks/use-toast";
import { Loader2, Send } from "lucide-react";
import { motion } from 'framer-motion';
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const formSchema = z
  .object({
    email: z.string().trim().email({
      message: "Please enter a valid email address.",
    }),
    fname: z.string().trim().min(2, {
      message: "Name must be at least 2 characters.",
    }),
    lname: z.string().trim().min(1, {
      message: "Name must be at least 1 character.",
    }),
    country: z.string().trim().min(2, {
      message: "Please enter a valid country name.",
    }),
    sbacousticsinterest: z.boolean(),
    sbaudienceinterest: z.boolean(),
    hp_company: z.string().optional(),
  })
  .refine(
    (data) =>
      data.sbacousticsinterest || data.sbaudienceinterest,
    {
      message: "Please select at least one newsletter.",
      path: ["sbacousticsinterest"],
    }
  );

export default function NewsletterClient() {
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false)
  const {executeRecaptcha} = useGoogleReCaptcha();
  const { toast } = useToast()
  const [formLoadedAt, setFormLoadedAt] = useState(() => Date.now());
  const [hpCompany, setHpCompany] = useState("");
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      fname: "",
      lname: "",
      country: "",
      sbacousticsinterest: false,
      sbaudienceinterest: false
    },
  });


  const onSubmit = async (
    values: z.infer<typeof formSchema>,
  ) => {
    setLoading(true);
  
    try {
      if (!executeRecaptcha) {
        throw new Error(
          "reCAPTCHA is not available. Please try again.",
        );
      }
  
      const gRecaptchaToken = await executeRecaptcha(
        "newsletterSubmit",
      );
  
      const requestId = crypto.randomUUID();
  
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
          hp_company: hpCompany,
          gRecaptchaToken,
          elapsedMs: Date.now() - formLoadedAt,
          requestId,
        }),
      });
  
      const data = await response.json();
  
      console.log("response: ", data)
      if (!response.ok) {
        throw new Error(
          data.error || "Newsletter subscribe failed.",
        );
      }
  
      form.reset();
      setHpCompany("");
      setFormLoadedAt(Date.now());
      
      if(data.message === 'already'){
        toast({
          title: "This email have already subscribed!",
          description: "Thank you for your excitement!",
          className: "bg-yellow-400 border-none"
        })
      }
      else {
        toast({
          title: "You have subscribed!",
          description: "Thank you for subscribing! We'll keep you updated with our latest news and promotions.",
          className: "bg-green-400 border-none",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Subscription failed!",
        description: "Please try again or contact us directly at info@sbacoustics.com or +6231 748 00 11.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
      <div className="2xl:px-80 xl:px-60 lg:px-12 px-8 py-16">
        <h1 className='text-3xl font-bold mb-6 text-center'>
          Newsletter Signup
        </h1>

        {/* <form onSubmit={handleSubscribe} className="p-4 border rounded-md shadow-lg">
          <div className="pb-2">
            <Label htmlFor="email" className="font-semibold">Email: <span className="text-red-500">*</span></Label>
            <Input
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
            <Label className="font-semibold">Select Newsletter: <span className="text-red-500">*</span></Label>
          </div>
            <div className="flex items-center space-x-2 pb-1">
              <Checkbox 
                id="sbacoustics" 
                checked={sbacousticsinterest}
                onCheckedChange={(checked) => setSBAcoustics(checked === true)}
                disabled={status == "loading"}
              />
              <Label className={`${sbacousticsinterest ? 'font-semibold': ''} cursor-pointer`} htmlFor="sbacoustics">
                SB Acoustics
              </Label>
            </div>
            <div className="flex items-center space-x-2 pb-1">
              <Checkbox 
                id="sbaudience" 
                checked={sbaudienceinterest}
                onCheckedChange={(checked) => setSBAudience(checked === true)}
                disabled={status == "loading"}
              />
              <Label className={`${sbaudienceinterest ? 'font-semibold': ''} cursor-pointer`} htmlFor="sbaudience">
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
                  <Loader2 className="h-4 w-4" />
                </motion.div>
              ) : (
                <Send className="mr-2 h-4 w-4" />
              )}
              {status == "loading" ? "Subscribing..." : "Subscribe"}
            </Button>
          </div>
        </form> */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="md:space-y-4 space-y-2">
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                left: "-9999px",
                width: "1px",
                height: "1px",
                overflow: "hidden",
              }}
            >
              <label htmlFor="hp_company">
                Company
              </label>

              <input
                id="hp_company"
                name="hp_company"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={hpCompany}
                onChange={(e) =>
                  setHpCompany(e.target.value)
                }
              />
            </div>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='md:text-sm text-xs'>Email</FormLabel>
                  <FormControl>
                    <Input disabled={loading} type="email" placeholder="example@example.com" className='md:text-sm text-xs' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="fname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='md:text-sm text-xs'>First Name</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Your first name"  className='md:text-sm text-xs' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='md:text-sm text-xs'>Last Name</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Your last name"  className='md:text-sm text-xs' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='md:text-sm text-xs'>Country</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Which country are you from" className='md:text-sm text-xs' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="space-y-2 pb-4">
              <FormLabel className="md:text-sm text-xs">
                Select Newsletter
              </FormLabel>

              <FormField
                control={form.control}
                name="sbaudienceinterest"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox
                          id="sbaudience"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={loading}
                        />
                      </FormControl>

                      <Label
                        htmlFor="sbaudience"
                        className={`cursor-pointer ${
                          field.value ? "font-semibold" : ""
                        }`}
                      >
                        SB Audience
                      </Label>
                    </div>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="sbacousticsinterest"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox
                          id="sbacoustics"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={loading}
                        />
                      </FormControl>

                      <Label
                        htmlFor="sbacoustics"
                        className={`cursor-pointer ${
                          field.value ? "font-semibold" : ""
                        }`}
                      >
                        SB Acoustics
                      </Label>
                    </div>

                    <FormMessage />
                  </FormItem>
                )}
              />

              
            </div>
          </form>
        </Form>
          <Button 
            onClick={form.handleSubmit(onSubmit)}
            disabled={loading} 
            className="w-full"
          >
            {loading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="mr-2"
              >
                <Loader2 className="h-4 w-4" />
              </motion.div>
            ) : (
              <Send className="mr-2 h-4 w-4" />
            )}
            {loading ? "Subscribing..." : "Subscribe"}
          </Button>
      </div>
   );
}

'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { Loader2, Map, MapPin, Send } from 'lucide-react';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Phone } from 'lucide-react';
import { Mail } from 'lucide-react';
import { useToast } from '@/components/hooks/use-toast';
import Link from 'next/link';
import { brand } from '@prisma/client';
import { Skeleton } from './ui/skeleton';
import { Empty, EmptyContent, EmptyDescription, EmptyMedia, EmptyTitle } from './ui/empty';
// import { sendEmail } from './testresend';

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  country: z.string().min(2, { message: "Please enter a valid country name." }),
  subject: z.string().min(5, { message: "Subject must be at least 5 characters." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
});

type Props = {
  oneBrand: brand | undefined
};

export default function Contact({ oneBrand }: Props) {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isLoadingLoader, setIsLoadingLoader] = useState(true);
  const [mounted, setMounted] = useState(false)
  const { toast } = useToast()
  const { executeRecaptcha } = useGoogleReCaptcha();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      country: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    setSuccess(false);
    setError(false);

    try {
      if (!executeRecaptcha) {
        throw new Error("reCAPTCHA not available");
      }

      const gRecaptchaToken = await executeRecaptcha('contactFormSubmit');

      const recaptchaResponse = await axios.post("/api/recaptcha", { gRecaptchaToken });

      if (recaptchaResponse.data.success) {
        const response = await fetch('/api/email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values),
        });

        if (response.ok) {
          setSuccess(true);
          form.reset();
        } else {
          throw new Error('Message failed to send');
        }
      } else {
        throw new Error('reCAPTCHA verification failed');
      }
    } catch (error) {
      setError(true);
      // toast.error("Failed to send email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if(success || error) {
      if (success) {
        toast({
          variant: "default",
          title: "Message Sent Successfully!",
          description: "Thank you for reaching out. We will get back to you.",
          className: "bg-green-400 border-none"
        })
      } else if (error) {
        toast({
          variant: "destructive",
          title: "Message failed to send!",
          description: "Please try again or contact us directly at info@sbacoustics.com or +6231 748 00 11.",
        })
      }
    }
    setSuccess(false)
    setError(false)
  }, [success, error, toast])

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className=" md:px-16 md:py-8 px-8 py-4">
      <div className='bg-background py-6 md:shadow-md md:shadow-foreground/50'>
      <div className="text-center mb-6">
          <div className="text-4xl font-bold text-foreground mb-4">Contact</div>
        </div>

        <div className="md:flex grid grid-cols-1">
        <div className="md:w-3/5 w-full md:order-1 order-2 md:pt-0 pt-4 h-full">
        {oneBrand &&
          <Card className=' border-none'>
              {/* <CardHeader>
                <CardTitle>Our Location</CardTitle>
              </CardHeader> */}
              <CardContent className='bg-background text-foreground'>
                <div className="aspect-w-16 aspect-h-9 rounded-lg pt-1">
                {mounted && oneBrand.maps !== '' && oneBrand.maps !== null ?
                  <div className="relative flex items-center justify-center w-full h-96 z-10">
                    {isLoadingLoader && (
                    <Skeleton className="w-full h-full" />
                    )}
                    <iframe src={oneBrand.maps} className='w-full h-full' onLoad={() => setIsLoadingLoader(false)} ></iframe>
                  </div>
                  :
                  <Empty className='w-full min-h-96 z-10 bg-foreground/20'>
                    <EmptyMedia variant="icon">
                      <Map />
                    </EmptyMedia>
                    <EmptyContent>
                      <EmptyTitle>No Maps Available</EmptyTitle>
                      <EmptyDescription></EmptyDescription>
                    </EmptyContent>
                  </Empty>
                }
                </div>
                <div className='space-y-2 pt-4'>
                  <h2 className='sr-only'>Sinar Baja Electric Address</h2>
                  <div className="flex items-center space-x-4">
                    <MapPin className="h-6 w-6 text-gray-600" />
                    <h3>{oneBrand.address}</h3>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Phone className="h-6 w-6 text-gray-600" />
                    <h3>{oneBrand.telephone}</h3>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Mail className="h-6 w-6 text-gray-600" />
                    <h3>{oneBrand.email}</h3>
                  </div>
                </div>
              </CardContent>
            </Card> 
          }
            <div className='flex justify-center pt-4'>
              <Button asChild>
                <Link href="/aboutus">
                  Find Out More About Us!
                </Link>
              </Button>
            </div>        
          </div>

        <div className='md:w-2/5 w-full md:order-2 order-1 md:pr-6 pl-0'>
        {/* <Button onClick={() => sendEmail()}>TEST RESEND</Button> */}
          <Card className='rounded-none border-none md:shadow-md md:shadow-foreground/50 bg-transparent text-foreground'>
            <CardHeader>
              <CardTitle>Send us a message</CardTitle>
              <CardDescription className='text-foreground/50'>Fill out the form below and we will get back to you</CardDescription>
            </CardHeader>
            <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input disabled={loading} placeholder="Your full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input disabled={loading} type="email" placeholder="example@example.com" {...field} />
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
                    <FormLabel>Country</FormLabel>
                    <FormControl>
                      <Input disabled={loading} placeholder="Which country are you contacting us from" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject</FormLabel>
                    <FormControl>
                      <Input disabled={loading} placeholder="What is the subject you are contacting us about" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message</FormLabel>
                    <FormControl>
                      <Textarea 
                        disabled={loading} 
                        placeholder="Write a detailed message here" 
                        className="min-h-[120px]" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </CardContent>
        <CardFooter>
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
                <Send className="h-4 w-4" />
              </motion.div>
            ) : (
              <Send className="mr-2 h-4 w-4" />
            )}
            {loading ? "Sending..." : "Send Message"}
          </Button>
        </CardFooter>
          </Card>
        </div>
      </div>
      </div>
    </div>
  );
}
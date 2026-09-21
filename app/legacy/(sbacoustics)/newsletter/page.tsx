import GoogleCaptchaWrapper from "@/components/GoogleCaptchaWrapper";
import NewsletterClient from "./pageClient";
import { Suspense } from "react";


export default function Newsletter() {
  return (
    <Suspense fallback={<></>}>
      <GoogleCaptchaWrapper>
        <NewsletterClient />
      </GoogleCaptchaWrapper>
    </Suspense>
  )
}

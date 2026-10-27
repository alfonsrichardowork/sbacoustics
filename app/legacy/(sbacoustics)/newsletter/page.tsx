import { connection } from "next/server";
import GoogleCaptchaWrapper from "@/components/GoogleCaptchaWrapper";
import NewsletterClient from "./pageClient";
import { Suspense } from "react";


export default async function Newsletter() {
  await connection();
  return (
    <Suspense fallback={<></>}>
      <GoogleCaptchaWrapper>
        <NewsletterClient />
      </GoogleCaptchaWrapper>
    </Suspense>
  )
}

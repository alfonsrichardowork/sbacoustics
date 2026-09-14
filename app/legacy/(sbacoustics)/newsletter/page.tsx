import GoogleCaptchaWrapper from "@/components/GoogleCaptchaWrapper";
import NewsletterClient from "./pageClient";

export default function Newsletter() {
  return (
    <GoogleCaptchaWrapper>
      <NewsletterClient />
    </GoogleCaptchaWrapper>
  )
}

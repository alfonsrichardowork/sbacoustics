import { Dot } from 'lucide-react'

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="py-8 md:p-12 text-center">
          <h1 className="text-2xl font-bold md:text-4xl">
            SB Acoustics Privacy Policy
          </h1>
          <p className="mt-2 md:text-sm text-[10px]">
            Last Updated: June 24, 2026
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-6xl px-6 pb-8 md:pt-8 pt-4 md:pb-16">
        <div className="space-y-8">
          {/* Introduction */}
          <section>
            <h2 className="md:text-xl font-bold text-base">
              1. Introduction
            </h2>
            <p className="md:mt-4 mt-2 md:text-sm text-xs">
              SB Acoustics ("SB Acoustics", "we", "our", or "us") respects your
              privacy and is committed to protecting any personal information you
              provide while using our website.
              This Privacy Policy explains what information we collect, how we use
              it, and the choices available to you regarding your information.
              By accessing or using this website, you acknowledge that you have
              read and understood this Privacy Policy.
            </p>
          </section>

          {/* Information We Collect */}
          <section>
            <h2 className="md:text-xl font-bold text-base">
              2. Information We Collect
            </h2>

            <h3 className="md:mt-4 mt-2 md:text-base text-xs font-bold">
              Information You Provide
            </h3>
            <p className="mt-2 md:text-sm text-xs">
              We may collect information that you voluntarily provide when:
            </p>
            <ul className='mt-0'>
              <li className="flex items-center gap-2 md:text-sm text-xs">
                <span><Dot size={4} strokeWidth={20} /></span>
                <span>Submitting a contact form</span>
              </li>
              <li className="flex items-center gap-2 md:text-sm text-xs">
                <span><Dot size={4} strokeWidth={20} /></span>
                <span>Subscribing our newsletter</span>
              </li>
              <li className="flex items-center gap-2 md:text-sm text-xs">
                <span><Dot size={4} strokeWidth={20} /></span>
                <span>Requesting information about products or services</span>
              </li>
              <li className="flex items-center gap-2 md:text-sm text-xs">
                <span><Dot size={4} strokeWidth={20} /></span>
                <span>Sending inquiries via email</span>
              </li>
            </ul>

            <p className="mt-2 md:text-sm text-xs">
              This information may include:
            </p>
            <ul className='mt-0'>
              <li className="flex items-center gap-2 md:text-sm text-xs">
                <span><Dot size={4} strokeWidth={20} /></span>
                <span>Name</span>
              </li>
              <li className="flex items-center gap-2 md:text-sm text-xs">
                <span><Dot size={4} strokeWidth={20} /></span>
                <span>Email address</span>
              </li>
              <li className="flex items-center gap-2 md:text-sm text-xs">
                <span><Dot size={4} strokeWidth={20} /></span>
                <span>Company name</span>
              </li>
              <li className="flex items-center gap-2 md:text-sm text-xs">
                <span><Dot size={4} strokeWidth={20} /></span>
                <span>Country or location</span>
              </li>
              <li className="flex items-center gap-2 md:text-sm text-xs">
                <span><Dot size={4} strokeWidth={20} /></span>
                <span>Any information included in your message</span>
              </li>
            </ul>

            <h3 className="mt-4 md:text-base text-xs font-bold">
              Information Collected Automatically
            </h3>
            <p className="mt-2 md:text-sm text-xs">
              When you visit our website, certain information may be collected
              automatically, including:
            </p>
            <ul className='mt-0'>
              <li className="flex items-center gap-2 md:text-sm text-xs">
                <span><Dot size={4} strokeWidth={20} /></span>
                <span>IP address</span>
              </li>
              <li className="flex items-center gap-2 md:text-sm text-xs">
                <span><Dot size={4} strokeWidth={20} /></span>
                <span>Browser type and version</span>
              </li>
              <li className="flex items-center gap-2 md:text-sm text-xs">
                <span><Dot size={4} strokeWidth={20} /></span>
                <span>Device information</span>
              </li>
              <li className="flex items-center gap-2 md:text-sm text-xs">
                <span><Dot size={4} strokeWidth={20} /></span>
                <span>Operating system</span>
              </li>
              <li className="flex items-center gap-2 md:text-sm text-xs">
                <span><Dot size={4} strokeWidth={20} /></span>
                <span>Referring website</span>
              </li>
              <li className="flex items-center gap-2 md:text-sm text-xs">
                <span><Dot size={4} strokeWidth={20} /></span>
                <span>Pages visited</span>
              </li>
              <li className="flex items-center gap-2 md:text-sm text-xs">
                <span><Dot size={4} strokeWidth={20} /></span>
                <span>Date and time of access</span>
              </li>
              <li className="flex items-center gap-2 md:text-sm text-xs">
                <span><Dot size={4} strokeWidth={20} /></span>
                <span>Website usage statistics</span>
              </li>
            </ul>
          </section>

          {/* How We Use Your Information */}
          <section>
            <h2 className="md:text-xl font-bold text-base">
              3. How We Use Your Information
            </h2>
            <p className="md:mt-4 mt-2 md:text-sm text-xs">
              We use collected information to:
            </p>
            <ul className='mt-0'>
              <li className="flex items-center gap-2 md:text-sm text-xs">
                <span><Dot size={4} strokeWidth={20} /></span>
                <span>Respond to inquiries and requests</span>
              </li>
              <li className="flex items-center gap-2 md:text-sm text-xs">
                <span><Dot size={4} strokeWidth={20} /></span>
                <span>Provide customer support</span>
              </li>
              <li className="flex items-center gap-2 md:text-sm text-xs">
                <span><Dot size={4} strokeWidth={20} /></span>
                <span>Improve website performance and user experience</span>
              </li>
              <li className="flex items-center gap-2 md:text-sm text-xs">
                <span><Dot size={4} strokeWidth={20} /></span>
                <span>Analyze website traffic and usage trends</span>
              </li>
              <li className="flex items-center gap-2 md:text-sm text-xs">
                <span><Dot size={4} strokeWidth={20} /></span>
                <span>Display the nearest distributor based on your approximate location</span>
              </li>
              <li className="flex items-center gap-2 md:text-sm text-xs">
                <span><Dot size={4} strokeWidth={20} /></span>
                <span>Maintain website security and functionality</span>
              </li>
              <li className="flex items-center gap-2 md:text-sm text-xs">
                <span><Dot size={4} strokeWidth={20} /></span>
                <span>Comply with legal obligations</span>
              </li>
            </ul>
            <p className="mt-0 md:text-[12px] text-[10px]">
              We do not sell, rent, or trade personal information to third parties.
            </p>
          </section>

          {/* Cookies and Similar Technologies */}
          <section>
            <h2 className="md:text-xl font-bold text-base">
              4. Cookies and Similar Technologies
            </h2>
            <p className="md:mt-4 mt-2 md:text-sm text-xs">
              Our website uses cookies and similar technologies to improve
              functionality and understand website usage.
            </p>

            <h3 className="mt-4 md:text-base text-xs font-bold">
              Essential Cookies
            </h3>
            <p className="mt-2 md:text-sm text-xs">
              Essential cookies are required for the website to function properly.
              These cookies may be used to:
            </p>
            <ul className='mt-0'>
              <li className="flex items-center gap-2 md:text-sm text-xs">
                <span><Dot size={4} strokeWidth={20} /></span>
                <span>Remember cookie consent preferences</span>
              </li>
              <li className="flex items-center gap-2 md:text-sm text-xs">
                <span><Dot size={4} strokeWidth={20} /></span>
                <span>Improve security</span>
              </li>
              <li className="flex items-center gap-2 md:text-sm text-xs">
                <span><Dot size={4} strokeWidth={20} /></span>
                <span>Enable basic website features (searchbox and comparison functionality)</span>
              </li>
            </ul>
            <p className="mt-0 md:text-[12px] text-[10px]">
              Because these cookies are necessary for website operation, they cannot be disabled through our cookie preference settings
            </p>

            <h3 className="mt-4 md:text-base text-xs font-bold">
              Analytics Cookies
            </h3>
            <p className="mt-2 md:text-sm text-xs">
              Analytics cookies help us understand how visitors interact with our
              website. These cookies may collect information such as:
            </p>
            <ul className='mt-0'>
              <li className="flex items-center gap-2 md:text-sm text-xs">
                <span><Dot size={4} strokeWidth={20} /></span>
                <span>Pages visited</span>
              </li>
              <li className="flex items-center gap-2 md:text-sm text-xs">
                <span><Dot size={4} strokeWidth={20} /></span>
                <span>Time spent on pages</span>
              </li>
              <li className="flex items-center gap-2 md:text-sm text-xs">
                <span><Dot size={4} strokeWidth={20} /></span>
                <span>Navigation behavior</span>
              </li>
              <li className="flex items-center gap-2 md:text-sm text-xs">
                <span><Dot size={4} strokeWidth={20} /></span>
                <span>Device and browser information</span>
              </li>
              <li className="flex items-center gap-2 md:text-sm text-xs">
                <span><Dot size={4} strokeWidth={20} /></span>
                <span>User location</span>
              </li>
            </ul>
            <p className="mt-0 md:text-[12px] text-[10px]">
              Analytics cookies are optional and are only enabled when you provide consent through our cookie preferences banner. You may change your cookie preferences at any time through the website&apos;s cookie settings
            </p>
          </section>

          {/* Third-Party Services */}
          <section>
            <h2 className="md:text-xl font-bold text-base">
              5. Third-Party Services
            </h2>
            <p className="md:mt-4 mt-2 md:text-sm text-xs">
              We may use trusted third-party service providers to assist with:
            </p>
            <ul className='mt-0'>
              <li className="flex items-center gap-2 md:text-sm text-xs">
                <span><Dot size={4} strokeWidth={20} /></span>
                <span>Website analytics</span>
              </li>
              <li className="flex items-center gap-2 md:text-sm text-xs">
                <span><Dot size={4} strokeWidth={20} /></span>
                <span>Website hosting</span>
              </li>
              <li className="flex items-center gap-2 md:text-sm text-xs">
                <span><Dot size={4} strokeWidth={20} /></span>
                <span>Website performance and content delivery services</span>
              </li>
              <li className="flex items-center gap-2 md:text-sm text-xs">
                <span><Dot size={4} strokeWidth={20} /></span>
                <span>Security monitoring</span>
              </li>
              <li className="flex items-center gap-2 md:text-sm text-xs">
                <span><Dot size={4} strokeWidth={20} /></span>
                <span>Bot detection and spam prevention services</span>
              </li>
              <li className="flex items-center gap-2 md:text-sm text-xs">
                <span><Dot size={4} strokeWidth={20} /></span>
                <span>Email delivery and communication services</span>
              </li>
              <li className="flex items-center gap-2 md:text-sm text-xs">
                <span><Dot size={4} strokeWidth={20} /></span>
                <span>Interactive maps used on distributor page</span>
              </li>
              <li className="flex items-center gap-2 md:text-sm text-xs">
                <span><Dot size={4} strokeWidth={20} /></span>
                <span>Location services used to help identify nearby distributors</span>
              </li>
            </ul>
            <p className="mt-0 md:text-[12px] text-[10px]">
              These providers may process information on our behalf solely for the purposes described in this Privacy Policy. Certain third-party services may also collect information directly from your device or browser in accordance with their own privacy practices. We encourage you to review the privacy policies of those services for more information
            </p>
          </section>

          {/* Data Sharing */}
          <section>
            <h2 className="md:text-xl font-bold text-base">
              6. Data Sharing
            </h2>
            <p className="md:mt-4 mt-2 md:text-sm text-xs">
              We do not sell, rent, or trade personal information. Information may
              be disclosed only when:
            </p>
            <ul className='mt-0'>
              <li className="flex items-center gap-2 md:text-sm text-xs">
                <span><Dot size={4} strokeWidth={20} /></span>
                <span>Required by applicable law, regulation, or legal process</span>
              </li>
              <li className="flex items-center gap-2 md:text-sm text-xs">
                <span><Dot size={4} strokeWidth={20} /></span>
                <span>Necessary to protect our rights, property, or safety</span>
              </li>
              <li className="flex items-center gap-2 md:text-sm text-xs">
                <span><Dot size={4} strokeWidth={20} /></span>
                <span>Required to investigate, prevent, or address security incidents, fraud, or misuse of our services</span>
              </li>
              <li className="flex items-center gap-2 md:text-sm text-xs">
                <span><Dot size={4} strokeWidth={20} /></span>
                <span>Shared with trusted service providers that perform services on our behalf and are contractually obligated to protect the information</span>
              </li>
            </ul>
          </section>

          {/* Data Retention */}
          <section>
            <h2 className="md:text-xl font-bold text-base">
              7. Data Retention
            </h2>
            <p className="md:mt-4 mt-2 md:text-sm text-xs">
              We retain personal information only for as long as reasonably
              necessary to:
            </p>
            <ul className='mt-0'>
              <li className="flex items-center gap-2 md:text-sm text-xs">
                <span><Dot size={4} strokeWidth={20} /></span>
                <span>Fulfill the purposes described in this Privacy Policy</span>
              </li>
              <li className="flex items-center gap-2 md:text-sm text-xs">
                <span><Dot size={4} strokeWidth={20} /></span>
                <span>Respond to inquiries and support requests</span>
              </li>
              <li className="flex items-center gap-2 md:text-sm text-xs">
                <span><Dot size={4} strokeWidth={20} /></span>
                <span>Meet legal, regulatory, or contractual obligations</span>
              </li>
            </ul>
            <p className="mt-0 md:text-[12px] text-[10px]">
              When information is no longer required, it will be securely deleted or anonymized where appropriate
            </p>
          </section>

          {/* Data Security */}
          <section>
            <h2 className="md:text-xl font-bold text-base">
              8. Data Security
            </h2>
            <p className="md:mt-4 mt-2 md:text-sm text-xs">
              We implement reasonable technical and organizational measures to
              protect personal information from:
            </p>
            <ul className='mt-0'>
              <li className="flex items-center gap-2 md:text-sm text-xs">
                <span><Dot size={4} strokeWidth={20} /></span>
                <span>Unauthorized access</span>
              </li>
              <li className="flex items-center gap-2 md:text-sm text-xs">
                <span><Dot size={4} strokeWidth={20} /></span>
                <span>Loss or destruction</span>
              </li>
              <li className="flex items-center gap-2 md:text-sm text-xs">
                <span><Dot size={4} strokeWidth={20} /></span>
                <span>Misuse</span>
              </li>
              <li className="flex items-center gap-2 md:text-sm text-xs">
                <span><Dot size={4} strokeWidth={20} /></span>
                <span>Unauthorized modification</span>
              </li>
              <li className="flex items-center gap-2 md:text-sm text-xs">
                <span><Dot size={4} strokeWidth={20} /></span>
                <span>Unauthorized disclosure</span>
              </li>
            </ul>
            <p className="mt-0 md:text-[12px] text-[10px]">
              While we strive to protect personal information using commercially reasonable safeguards, no method of transmission over the internet or electronic storage is completely secure. Therefore, we cannot guarantee absolute security of your information
            </p>
          </section>

          {/* International Visitors */}
          <section>
            <h2 className="md:text-xl font-bold text-base">
              9. International Visitors
            </h2>
            <p className="md:mt-4 mt-2 md:text-sm text-xs">
              If you access our website from outside the country in which our systems or service providers are located, your information may be transferred to, stored, and processed in countries that may have different data protection laws than those in your jurisdiction. By using our website, you acknowledge that such transfers may occur where permitted by applicable law.
            </p>
          </section>

          {/* Your Rights */}
          <section>
            <h2 className="md:text-xl font-bold text-base">
              10. Your Rights
            </h2>
            <p className="md:mt-4 mt-2 md:text-sm text-xs">
              Depending on your location and applicable laws, you may have rights regarding your personal information, including:
            </p>
            <ul className='mt-0'>
              <li className="flex items-center gap-2 md:text-sm text-xs">
                <span><Dot size={4} strokeWidth={20} /></span>
                <span>Request access to the personal information we hold about you</span>
              </li>
              <li className="flex items-center gap-2 md:text-sm text-xs">
                <span><Dot size={4} strokeWidth={20} /></span>
                <span>Request correction of inaccurate or incomplete information</span>
              </li>
              <li className="flex items-center gap-2 md:text-sm text-xs">
                <span><Dot size={4} strokeWidth={20} /></span>
                <span>Request deletion of your personal information, subject to legal or operational requirements</span>
              </li>
              <li className="flex items-center gap-2 md:text-sm text-xs">
                <span><Dot size={4} strokeWidth={20} /></span>
                <span>Withdraw consent for optional cookies and similar technologies</span>
              </li>
              <li className="flex items-center gap-2 md:text-sm text-xs">
                <span><Dot size={4} strokeWidth={20} /></span>
                <span>Object to certain uses of your personal information where permitted by law</span>
              </li>
            </ul>
            <p className="mt-0 md:text-[12px] text-[10px]">
              Requests may be submitted using the contact information below.
            </p>
          </section>

          {/* Children's Privacy */}
          <section>
            <h2 className="md:text-xl font-bold text-base">
              11. Children&apos;s Privacy
            </h2>
            <p className="md:mt-4 mt-2 md:text-sm text-xs">
              This website is not intended for children under the age of 13, and we do not knowingly collect personal information from children. If we become aware that personal information has been collected from a child without appropriate consent, we will take reasonable steps to delete such information.
            </p>
          </section>

          {/* Changes to This Privacy Policy */}
          <section>
            <h2 className="md:text-xl font-bold text-base">
              12. Changes to This Privacy Policy
            </h2>
            <p className="md:mt-4 mt-2 md:text-sm text-xs">
              We may update this Privacy Policy from time to time. Any changes will
              be posted on this page together with an updated revision date.
              Continued use of the website after changes become effective
              constitutes acceptance of the updated Privacy Policy.
            </p>
          </section>

          {/* Contact Us */}
          <section>
            <h2 className="md:text-xl font-bold text-base">
              13. Contact Us
            </h2>
            <p className="md:mt-4 mt-2 md:text-sm text-xs">
              If you have questions regarding this Privacy Policy or our handling
              of personal information, please contact us:
            </p>
              
            <ul className='mt-0'>
              <li className="flex items-center gap-2 md:text-sm text-xs">
                <span><Dot size={4} strokeWidth={20} /></span>
                <span>
                  <p className='md:text-sm text-xs'>
                    Email:{' '}
                    <a
                      href="mailto:info@sbacoustics.com"
                      className="text-primary hover:underline"
                    >
                      info@sbacoustics.com
                    </a>
                  </p>
                </span>
              </li>
              <li className="flex items-center gap-2 md:text-sm text-xs">
                <span><Dot size={4} strokeWidth={20} /></span>
                <span>
                  <p className='md:text-sm text-xs'>
                    Website:{' '}
                    <a
                      href="https://sbacoustics.com"
                      className="text-primary hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      sbacoustics.com
                    </a>
                  </p>
                </span>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </main>
  )
}

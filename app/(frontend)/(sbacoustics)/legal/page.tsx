import Link from "next/link";

export default function TermsOfUsePage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="py-8 md:p-12 text-center">
          <h1 className="text-2xl font-bold md:text-4xl">
            SB Acoustics Terms of Use
          </h1>
          <p className="mt-2 md:text-sm text-[10px]">
            Last Updated: June 24, 2026
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-6xl px-6 pb-8 md:pt-8 pt-4 md:pb-16">
        <div className="space-y-8">
          {/* 1. Acceptance of Terms */}
          <section>
            <h2 className="md:text-xl font-bold text-base">
              1. Acceptance of Terms
            </h2>
            <p className="md:mt-4 mt-2 md:text-sm text-xs">
              By accessing or using the SB Acoustics website ("Website"), you agree to be bound by these Terms of Use and all applicable laws and regulations. If you do not agree with these Terms, please do not use this website.
            </p>
          </section>

          {/* 2. Website Purpose */}
          <section>
            <h2 className="md:text-xl font-bold text-base">
              2. Website Purpose
            </h2>
            <p className="md:mt-4 mt-2 md:text-sm text-xs">
              This website is provided for informational purposes, including product information, technical resources, distributor information, company information, and communication with SB Acoustics.
            </p>
            <p className="mt-2 md:text-sm text-xs">
              We reserve the right to modify, suspend, or discontinue any aspect of the website at any time without prior notice.
            </p>
          </section>

          {/* 3. Use of the Website */}
          <section>
            <h2 className="md:text-xl font-bold text-base">
              3. Use of the Website
            </h2>
            <p className="md:mt-4 mt-2 md:text-sm text-xs">
              You agree to use the website only for lawful purposes and in a manner that does not:
            </p>
            <ul className="mt-2 space-y-1">
              <li className="md:text-sm text-xs">
                • Violate any applicable law or regulation
              </li>
              <li className="md:text-sm text-xs">
                • Interfere with the operation or security of the website
              </li>
              <li className="md:text-sm text-xs">
                • Attempt to gain unauthorized access to systems, networks, or data
              </li>
              <li className="md:text-sm text-xs">
                • Distribute malicious software, viruses, or harmful code
              </li>
              <li className="md:text-sm text-xs">
                • Misrepresent your identity or provide false information through forms or communications
              </li>
            </ul>
          </section>

          {/* 4. Intellectual Property */}
          <section>
            <h2 className="md:text-xl font-bold text-base">
              4. Intellectual Property
            </h2>
            <p className="md:mt-4 mt-2 md:text-sm text-xs">
              Unless otherwise stated, all content on this website, including text, graphics, images, logos, product information, documents, software, and other materials, is owned by or licensed to SB Acoustics and is protected by applicable intellectual property laws.
            </p>
            <p className="mt-2 md:text-sm text-xs">
              You may view, download, and print materials from the website for personal, informational, or internal business use. You may not reproduce, distribute, modify, publish, or commercially exploit website content without prior written permission.
            </p>
          </section>

          {/* 5. Product Information */}
          <section>
            <h2 className="md:text-xl font-bold text-base">
              5. Product Information
            </h2>
            <p className="md:mt-4 mt-2 md:text-sm text-xs">
              We strive to ensure that product descriptions, specifications, technical data, and other information are accurate and up to date. However, we do not guarantee that all information on the website is complete, accurate, current, or free from errors.
            </p>
            <p className="mt-2 md:text-sm text-xs">
              Product specifications, availability, and documentation may be updated or changed without notice.
            </p>
          </section>

          {/* 6. Third-Party Links and Services */}
          <section>
            <h2 className="md:text-xl font-bold text-base">
              6. Third-Party Links and Services
            </h2>
            <p className="md:mt-4 mt-2 md:text-sm text-xs">
              The website may contain links to third-party websites, services, maps, or other resources for your convenience.
            </p>
            <p className="mt-2 md:text-sm text-xs">
              SB Acoustics does not control and is not responsible for the content, privacy practices, availability, or operation of third-party websites or services. Accessing such services is at your own risk.
            </p>
          </section>

          {/* 7. Distributor Information */}
          <section>
            <h2 className="md:text-xl font-bold text-base">
              7. Distributor Information
            </h2>
            <p className="md:mt-4 mt-2 md:text-sm text-xs">
              Distributor information and locations are provided for convenience only. While we strive to maintain accurate information, distributor details, locations, availability, and contact information may change without notice.
            </p>
            <p className="mt-2 md:text-sm text-xs">
              SB Acoustics is not responsible for the products, services, pricing, or business practices of independent distributors.
            </p>
          </section>

          {/* 8. Disclaimer of Warranties */}
          <section>
            <h2 className="md:text-xl font-bold text-base">
              8. Disclaimer of Warranties
            </h2>
            <p className="md:mt-4 mt-2 md:text-sm text-xs">
              The website and its content are provided on an "as is" and "as available" basis.
            </p>
            <p className="mt-2 md:text-sm text-xs">
              To the fullest extent permitted by law, SB Acoustics disclaims all warranties, express or implied, including warranties of merchantability, fitness for a particular purpose, accuracy, availability, and non-infringement.
            </p>
            <p className="mt-2 md:text-sm text-xs">
              We do not guarantee that the website will be uninterrupted, error-free, secure, or free of harmful components.
            </p>
          </section>

          {/* 9. Limitation of Liability */}
          <section>
            <h2 className="md:text-xl font-bold text-base">
              9. Limitation of Liability
            </h2>
            <p className="md:mt-4 mt-2 md:text-sm text-xs">
              To the fullest extent permitted by law, SB Acoustics shall not be liable for any direct, indirect, incidental, consequential, special, or punitive damages arising out of or related to your use of, or inability to use, the website.
            </p>
            <p className="mt-2 md:text-sm text-xs">
              This limitation applies even if SB Acoustics has been advised of the possibility of such damages.
            </p>
          </section>

          {/* 10. Privacy */}
          <section>
            <h2 className="md:text-xl font-bold text-base">
              10. Privacy
            </h2>
            <p className="md:mt-4 mt-2 md:text-sm text-xs">
              Your use of the website is also governed by our Privacy Policy, which describes how information may be collected, used, and protected.
            </p>
          </section>

          {/* 11. Changes to These Terms */}
          <section>
            <h2 className="md:text-xl font-bold text-base">
              11. Changes to These Terms
            </h2>
            <p className="md:mt-4 mt-2 md:text-sm text-xs">
              We may update these Terms of Use from time to time. Changes become effective when posted on this page. Continued use of the website after changes are posted constitutes acceptance of the revised Terms.
            </p>
          </section>

          {/* 12. Governing Law */}
          <section>
            <h2 className="md:text-xl font-bold text-base">
              12. Governing Law
            </h2>
            <p className="md:mt-4 mt-2 md:text-sm text-xs">
              These Terms of Use shall be governed by and construed in accordance with the laws applicable to SB Acoustics, without regard to conflict of law principles.
            </p>
          </section>

          {/* 13. Contact Information */}
          <section>
            <h2 className="md:text-xl font-bold text-base">
              13. Contact Information
            </h2>
            <p className="md:mt-4 mt-2 md:text-sm text-xs">
              If you have any questions regarding these Terms of Use, please contact us
              through the contact information provided on this website or click{" "}
              <Link href="/contact" className="underline text-primary">
                here
              </Link>
              .
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}

import "./privacy.css"

type PolicySection = {
  title: string
  paragraphs?: string[]
  subsections?: { title: string; paragraphs?: string[]; items?: string[]; closing?: string }[]
  items?: string[]
  closing?: string
}

const sections: PolicySection[] = [
  {
    title: "1. Introduction",
    paragraphs: [
      'SB Acoustics ("SB Acoustics", "we", "our", or "us") respects your privacy and is committed to protecting any personal information you provide while using our website. This Privacy Policy explains what information we collect, how we use it, and the choices available to you regarding your information. By accessing or using this website, you acknowledge that you have read and understood this Privacy Policy.',
    ],
  },
  {
    title: "2. Information We Collect",
    subsections: [
      {
        title: "Information You Provide",
        paragraphs: ["We may collect information that you voluntarily provide when:"],
        items: ["Submitting a contact form", "Subscribing our newsletter", "Requesting information about products or services", "Sending inquiries via email"],
      },
      {
        title: "Information may include",
        items: ["Name", "Email address", "Company name", "Country or location", "Any information included in your message"],
      },
      {
        title: "Information Collected Automatically",
        paragraphs: ["When you visit our website, certain information may be collected automatically, including:"],
        items: ["IP address", "Browser type and version", "Device information", "Operating system", "Referring website", "Pages visited", "Date and time of access", "Website usage statistics"],
      },
    ],
  },
  {
    title: "3. How We Use Your Information",
    paragraphs: ["We use collected information to:"],
    items: ["Respond to inquiries and requests", "Provide customer support", "Improve website performance and user experience", "Analyze website traffic and usage trends", "Display the nearest distributor based on your approximate location", "Maintain website security and functionality", "Comply with legal obligations"],
    closing: "We do not sell, rent, or trade personal information to third parties.",
  },
  {
    title: "4. Cookies and Similar Technologies",
    paragraphs: ["Our website uses cookies and similar technologies to improve functionality and understand website usage."],
    subsections: [
      { title: "Essential Cookies", paragraphs: ["Essential cookies are required for the website to function properly. These cookies may be used to:"], items: ["Remember cookie consent preferences", "Improve security", "Enable basic website features (searchbox and comparison functionality)"], closing: "Because these cookies are necessary for website operation, they cannot be disabled through our cookie preference settings" },
      { title: "Analytics Cookies", paragraphs: ["Analytics cookies help us understand how visitors interact with our website. These cookies may collect information such as:"], items: ["Pages visited", "Time spent on pages", "Navigation behavior", "Device and browser information", "User location"], closing: "Analytics cookies are optional and are only enabled when you provide consent through our cookie preferences banner. You may change your cookie preferences at any time through the website's cookie settings" },
    ],
  },
  {
    title: "5. Third-Party Services",
    paragraphs: ["We may use trusted third-party service providers to assist with:"],
    items: ["Website analytics", "Website hosting", "Website performance and content delivery services", "Security monitoring", "Bot detection and spam prevention services", "Email delivery and communication services", "Interactive maps used on distributor page", "Location services used to help identify nearby distributors"],
    closing: "These providers may process information on our behalf solely for the purposes described in this Privacy Policy. Certain third-party services may also collect information directly from your device or browser in accordance with their own privacy practices. We encourage you to review the privacy policies of those services for more information",
  },
  { title: "6. Data Sharing", paragraphs: ["We do not sell, rent, or trade personal information. Information may be disclosed only when:"], items: ["Required by applicable law, regulation, or legal process", "Necessary to protect our rights, property, or safety", "Required to investigate, prevent, or address security incidents, fraud, or misuse of our services", "Shared with trusted service providers that perform services on our behalf and are contractually obligated to protect the information"] },
  { title: "7. Data Retention", paragraphs: ["We retain personal information only for as long as reasonably necessary to:"], items: ["Fulfill the purposes described in this Privacy Policy", "Respond to inquiries and support requests", "Meet legal, regulatory, or contractual obligations"], closing: "When information is no longer required, it will be securely deleted or anonymized where appropriate" },
  { title: "8. Data Security", paragraphs: ["We implement reasonable technical and organizational measures to protect personal information from:"], items: ["Unauthorized access", "Loss or destruction", "Misuse", "Unauthorized modification", "Unauthorized disclosure"], closing: "While we strive to protect personal information using commercially reasonable safeguards, no method of transmission over the internet or electronic storage is completely secure. Therefore, we cannot guarantee absolute security of your information" },
  { title: "9. International Visitors", paragraphs: ["If you access our website from outside the country in which our systems or service providers are located, your information may be transferred to, stored, and processed in countries that may have different data protection laws than those in your jurisdiction. By using our website, you acknowledge that such transfers may occur where permitted by applicable law."] },
  { title: "10. Your Rights", paragraphs: ["Depending on your location and applicable laws, you may have rights regarding your personal information, including:"], items: ["Request access to the personal information we hold about you", "Request correction of inaccurate or incomplete information", "Request deletion of your personal information, subject to legal or operational requirements", "Withdraw consent for optional cookies and similar technologies", "Object to certain uses of your personal information where permitted by law"], closing: "Requests may be submitted using the contact information below." },
  { title: "11. Children's Privacy", paragraphs: ["This website is not intended for children under the age of 13, and we do not knowingly collect personal information from children. If we become aware that personal information has been collected from a child without appropriate consent, we will take reasonable steps to delete such information."] },
  { title: "12. Changes to This Privacy Policy", paragraphs: ["We may update this Privacy Policy from time to time. Any changes will be posted on this page together with an updated revision date. Continued use of the website after changes become effective constitutes acceptance of the updated Privacy Policy."] },
]

function BulletList({ items }: { items: string[] }) {
  return <ul className="privacy-list">{items.map((item) => <li key={item}><span className="privacy-dot" aria-hidden="true" /> <span>{item}</span></li>)}</ul>
}

export default function PrivacyPolicy() {
  return <main className="privacy-page">
    <header className="privacy-header"><div className="privacy-header-inner"><h1>SB Acoustics Privacy Policy</h1><p>Last Updated: June 24, 2026</p></div></header>
    <div className="privacy-content"><div className="privacy-sections">
      {sections.map((section) => <section className="privacy-section" key={section.title}>
        <h2>{section.title}</h2>
        {section.paragraphs?.map((paragraph) => <p className="privacy-paragraph" key={paragraph}>{paragraph}</p>)}
        {section.items && <BulletList items={section.items} />}
        {section.subsections?.map((subsection) => <div className="privacy-subsection" key={subsection.title}><h3>{subsection.title}</h3>{subsection.paragraphs?.map((paragraph) => <p className="privacy-paragraph" key={paragraph}>{paragraph}</p>)}{subsection.items && <BulletList items={subsection.items} />}{subsection.closing && <p className="privacy-note">{subsection.closing}</p>}</div>)}
        {section.closing && <p className="privacy-note">{section.closing}</p>}
      </section>)}
      <section className="privacy-section"><h2>13. Contact Us</h2><p className="privacy-paragraph">If you have questions regarding this Privacy Policy or our handling of personal information, please contact us:</p><BulletList items={["Email: info@sbacoustics.com", "Website: sbacoustics.com"]} /></section>
    </div></div>
  </main>
}

export { PrivacyPolicy }

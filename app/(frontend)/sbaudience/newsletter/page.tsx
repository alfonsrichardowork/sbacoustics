import NewsletterClientSBAudience from "./pageClient";

export default function NewsletterSBAudience() {
  const baseUrl = process.env.NEXT_PUBLIC_ROOT_URL ?? 'http://localhost:3000';

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": `Newsletter | SB Audience`,
    "url": `${baseUrl}/sbaudience/newsletter`,
    "logo": `${baseUrl}/images/sbaudience/logo_sbaudience.webp`,
  };

  return (
    <>      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <NewsletterClientSBAudience />
    </>
   );
}

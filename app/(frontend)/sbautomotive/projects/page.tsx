export default function ProjectsSBAutomotivePage() {
  const baseUrl = process.env.NEXT_PUBLIC_ROOT_URL ?? 'http://localhost:3000';

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": `Projects | SB Automotive`,
    "url": `${baseUrl}/sbautomotive/projects`,
    "logo": `${baseUrl}/images/sbautomotive/logo_sbautomotive_white.webp`,
  };
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="bg-white">
        <h1 className="sr-only">Projects | SB Automotive</h1>
      </div>
    </>
  );
}

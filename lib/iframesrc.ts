export function extractIframeSrc(html: string): string | undefined {
  const match = html.match(/<iframe[^>]+src="([^"]+)"/i);
  return match?.[1];
}
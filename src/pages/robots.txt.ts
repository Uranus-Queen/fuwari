import type { APIRoute } from "astro";

const robotsTxt = `
User-agent: *
Allow: /
Disallow: /_astro/
Disallow: /api/

Sitemap: ${new URL("sitemap-index.xml", import.meta.env.SITE).href}

# Host
Host: ${new URL(import.meta.env.SITE).hostname}

# Crawl-delay
Crawl-delay: 10
`.trim();

export const GET: APIRoute = () => {
	return new Response(robotsTxt, {
		headers: {
			"Content-Type": "text/plain; charset=utf-8",
		},
	});
};
import rss from "@astrojs/rss";
import { getSortedPosts } from "@utils/content-utils";
import { url } from "@utils/url-utils";
import type { APIContext } from "astro";
import MarkdownIt from "markdown-it";
import sanitizeHtml from "sanitize-html";
import { siteConfig } from "@/config";

const parser = new MarkdownIt();

function stripInvalidXmlChars(str: string): string {
	return str.replace(
		// biome-ignore lint/suspicious/noControlCharactersInRegex: https://www.w3.org/TR/xml/#charsets
		/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F\uFDD0-\uFDEF\uFFFE\uFFFF]/g,
		"",
	);
}

// 限制description长度在160个字符以内，这是SEO推荐的最大长度
function truncateDescription(description: string, maxLength: number = 160): string {
	if (description.length <= maxLength) {
		return description;
	}
	return description.substring(0, maxLength - 3) + '...';
}

export async function GET(context: APIContext) {
	const blog = await getSortedPosts();

	return rss({
		title: siteConfig.title,
		description: truncateDescription(siteConfig.subtitle || "No description"),
		site: context.site ?? "https://zhangjun.xyz/",
		items: blog.map((post) => {
			const content =
				typeof post.body === "string" ? post.body : String(post.body || "");
			const cleanedContent = stripInvalidXmlChars(content);
			return {
				title: post.data.title,
				pubDate: post.data.published,
				description: truncateDescription(post.data.description || ""),
				link: url(`/posts/${post.slug}/`),
				content: sanitizeHtml(parser.render(cleanedContent), {
					allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
				}),
			};
		}),
		customData: `<language>${siteConfig.lang}</language>
		<lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
		<docs>https://validator.w3.org/feed/docs/rss2.html</docs>`,
	});
}
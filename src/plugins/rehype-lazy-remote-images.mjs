/**
 * Astro 7: remote images from post bodies are served by image.ikaros.page.
 * Astro's optimizer only runs on <Image> usages, so at minimum make remote
 * images lazy-load and async-decode to keep the main thread free.
 */
export function rehypeLazyRemoteImages() {
	/**
	 * @param {import('hast').Root} tree
	 */
	return (tree) => {
		const visit = (node) => {
			for (const child of node.children ?? []) {
				if (child.type === "element") {
					if (child.tagName === "img") {
						const src = child.properties?.src;
						if (typeof src === "string" && /^https?:\/\//.test(src)) {
							child.properties.loading = "lazy";
							child.properties.decoding = "async";
						}
					}
					visit(child);
				}
			}
		};
		visit(tree);
	};
}

import { dimensionFor } from "./image-dimensions.mjs";

/**
 * Astro 7: remote images from post bodies are served by image.ikaros.page.
 * - lazy-load + async-decode to keep the main thread free
 * - reserve width/height (from the known-dimensions map) so the layout never jumps
 * - wrap standalone images in a shimmer placeholder box; the image fades in on load
 *   (see src/styles/img-loading.css + initImageReveal in Layout.astro)
 */
export function rehypeLazyRemoteImages() {
	/**
	 * @param {import('hast').Root} tree
	 */
	return (tree) => {
		const visit = (node) => {
			const children = node.children ?? [];
			for (let i = 0; i < children.length; i++) {
				const child = children[i];
				if (child.type !== "element") continue;
				if (child.tagName === "img") {
					const src = child.properties?.src;
					if (typeof src === "string" && /^https?:\/\//.test(src)) {
						child.properties.loading = "lazy";
						child.properties.decoding = "async";
						child.properties.dataReveal = "";
						const dim = dimensionFor(src);
						if (dim) {
							child.properties.width = dim.w;
							child.properties.height = dim.h;
						}
						// standalone image paragraph -> wrap in a shimmer placeholder box
						const solo =
							node.tagName === "p" &&
							node.children.every(
								(c) =>
									c === child ||
									(c.type === "text" && !c.value.trim()),
							);
						if (solo) {
							const span = {
								type: "element",
								tagName: "span",
								properties: { className: ["img-reveal"] },
								children: [child],
							};
							node.children = [span];
							continue; // don't descend into the moved img again
						}
					}
				}
				visit(child);
			}
		};
		visit(tree);
	};
}

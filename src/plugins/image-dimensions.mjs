/**
 * Measured natural size of every remote image on image.ikaros.page.
 * Used to reserve layout space (aspect-ratio) before the bytes arrive,
 * so the loading animation never causes a layout shift.
 */
export const imageDimensions = {
	"6905c809bd354.webp": { w: 1600, h: 900 },
	"6905c80a8c109.webp": { w: 1600, h: 1200 },
	"6905c809307d9.webp": { w: 1440, h: 652 },
	"6905c8096e1ca.webp": { w: 1440, h: 1080 },
	"6905c8093ff7e.webp": { w: 1600, h: 1200 },
	"690ad5e1eca75.webp": { w: 1180, h: 1200 },
	"6909b8c6df551.webp": { w: 1600, h: 900 },
	"6909b8c706201.webp": { w: 1600, h: 900 },
	"6909b8c8131f8.webp": { w: 1600, h: 900 },
	"6919e17544d84.webp": { w: 1600, h: 889 },
	"6919e16417e47.webp": { w: 1600, h: 900 },
	"6919e329e12b3.webp": { w: 1600, h: 900 },
	"690ad4317feb6.webp": { w: 800, h: 600 },
	"6905dbc6d37b9.jpg": { w: 1600, h: 900 },
};

export function dimensionFor(src) {
	if (typeof src !== "string") return null;
	const file = src.split("/").pop()?.split("?")[0];
	if (!file || !file.includes(".")) return null;
	return imageDimensions[file] || null;
}

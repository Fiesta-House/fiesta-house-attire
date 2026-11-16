import type { AssetRecord } from "@/lib/api";

export const RECENT_MASTERPIECES_COUNT = 15;

export const studioFallbackImages = [
  "https://res.cloudinary.com/qk1mtcwx/image/upload/f_auto,q_auto,w_1400/v1794864050/fiesta-house-site-static/IMG_5587.jpg",
  "https://res.cloudinary.com/qk1mtcwx/image/upload/f_auto,q_auto,w_1400/v1794864043/fiesta-house-site-static/IMG_4156.jpg",
  "https://res.cloudinary.com/qk1mtcwx/image/upload/f_auto,q_auto,w_1400/v1794864045/fiesta-house-site-static/IMG_5033.jpg",
  "https://res.cloudinary.com/qk1mtcwx/image/upload/f_auto,q_auto,w_1400/v1794864037/fiesta-house-site-static/34_.jpg",
  "https://res.cloudinary.com/qk1mtcwx/image/upload/f_auto,q_auto,w_1400/v1794864041/fiesta-house-site-static/IMGL5485.jpg",
  "https://res.cloudinary.com/qk1mtcwx/image/upload/f_auto,q_auto,w_1400/v1794864052/fiesta-house-site-static/IMG_6287.jpg",
];

export const homeImageKey = (src: string): string => {
  const url = new URL(src, "https://local.invalid");
  const path = decodeURIComponent(url.pathname)
    .replace("/storage/v1/render/image/public/", "/storage/v1/object/public/")
    .replace("/storage/v1/object/sign/", "/storage/v1/object/public/");
  return `${url.origin}${path}`;
};

const studioFallbackKeys = new Set(studioFallbackImages.map(homeImageKey));

export const splitHomeGallery = (assets: AssetRecord[]) => {
  const studioImages: string[] = [];
  const recentAssets: AssetRecord[] = [];
  const seen = new Set<string>();

  for (const asset of assets) {
    const key = homeImageKey(asset.url);
    if (seen.has(key)) continue;
    seen.add(key);
    let hash = 2166136261;
    for (const character of key) hash = Math.imul(hash ^ character.charCodeAt(0), 16777619);
    if (studioFallbackKeys.has(key) || (hash >>> 0) < 0x80000000) studioImages.push(asset.url);
    else if (recentAssets.length < RECENT_MASTERPIECES_COUNT) recentAssets.push(asset);
  }

  for (const image of studioFallbackImages) {
    if (studioImages.length >= 6) break;
    if (!seen.has(homeImageKey(image))) studioImages.push(image);
  }

  return { studioImages, recentAssets };
};
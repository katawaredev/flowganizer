import { initSeo } from "remix-seo";

export const { getSeo, getSeoMeta, getSeoLinks } = initSeo({
  // Pass any SEO defaults for your site here.
  // If individual routes do not provide their own meta and link tags,
  // the tags generated by the defaults will be used.
  title: "Flõwganizer",
  titleTemplate: "%s | Flõwganizer",
  description: "Organize your digital life",
});

export const manifest = [
  {
    key: "any",
    rel: "icon",
    href: `/~/favicon.ico`,
    sizes: "any",
  },
  {
    key: "16x16",
    rel: "icon",
    href: `/~/favicon.ico`,
    sizes: "16x16",
  },
  {
    key: "32x32",
    rel: "icon",
    href: `/~/favicon.ico-32x32`,
    sizes: "32x32",
  },
  {
    rel: "manifest",
    href: `/~/site.webmanifest`,
  },
  {
    rel: "apple-touch-icon",
    href: `/~/apple-touch-icon.png`,
  },
];
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/generate", "/history", "/api/"],
      },
    ],
    sitemap: "https://www.pikname.com/sitemap.xml",
  };
}

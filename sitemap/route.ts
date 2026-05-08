import { NextResponse } from "next/server"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
const HOST = SITE_URL.replace(/\/+$/, "")
const LAST_MODIFIED = new Date().toISOString().split("T")[0]

const PUBLIC_ROUTES = [
  "/",
  "/locations",
  "/jobs",
  "/services",
  "/contact",
  "/signup",
  "/login",
  "/terms",
]

const LOCATION_ROUTES = [
  "/locations/nairobi",
  "/locations/mombasa",
  "/locations/kisumu",
  "/locations/eldoret",
  "/locations/nyeri",
]

export function GET() {
  const allRoutes = [...PUBLIC_ROUTES, ...LOCATION_ROUTES]
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">\n${allRoutes.map(
    (route) =>
      `  <url>\n    <loc>${HOST}${route}</loc>\n    <lastmod>${LAST_MODIFIED}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>`
  ).join("\n")}\n</urlset>`

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml;charset=UTF-8",
    },
  })
}

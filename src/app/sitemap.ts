import { MetadataRoute } from "next";
import connectDB from "@/lib/db";
import Product from "@/models/ProductModel";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  await connectDB();

  const baseUrl = "https://thegarmentguy.in";

  // Fetch product IDs
  const products = await Product.find({}, { _id: 1 }).lean();

  const productUrls: MetadataRoute.Sitemap = products.map((p: any) => ({
    url: `${baseUrl}/products/${p._id}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  // Static routes
  const staticUrls: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: new Date().toISOString(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date().toISOString(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/orders`,
      lastModified: new Date().toISOString(),
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/checkout`,
      lastModified: new Date().toISOString(),
      changeFrequency: "never",
      priority: 0.5,
    },
  ];

  return [...staticUrls, ...productUrls];
}

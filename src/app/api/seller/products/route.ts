import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/models/ProductModel";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

type SellerProductPayload = {
  name?: unknown;
  description?: unknown;
  images?: unknown;
  price?: unknown;
  stock?: unknown;
  category?: unknown;
  meta?: unknown;
  moq?: unknown;
  fabric?: unknown;
  sizes?: unknown;
  colors?: unknown;
  pdfUrl?: unknown;
  sellerNotes?: unknown;
};
type ProductValidationResult =
  | { error: string }
  | {
      name: string;
      category: string;
      price: number;
      stock: number;
      description: string[];
      images: string[];
      meta?: SellerProductMeta;
    };

type SellerProductMeta = {
  moq?: number;
  fabric?: string;
  sizes?: string[];
  colors?: string[];
  pdfUrl?: string;
  sellerNotes?: string;
};

function jsonError(error: string, status: number) {
  return NextResponse.json({ error }, { status });
}

function normalizeDescription(value: unknown) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }
  if (typeof value === "string") {
    return value
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
  }
  return [];
}

function normalizeList(value: unknown) {
  const values = Array.isArray(value) ? value : [value];

  return values
    .flatMap((item) =>
      typeof item === "string" ? item.split(/[\n,]/) : []
    )
    .map((item) => item.trim().replace(/^["']|["']$/g, ""))
    .filter(Boolean);
}

function cleanString(value: unknown) {
  return String(value || "").trim();
}

function cleanNumber(value: unknown) {
  if (value === undefined || value === null || value === "") return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function readMetaSource(body: SellerProductPayload) {
  return body.meta && typeof body.meta === "object" && !Array.isArray(body.meta)
    ? (body.meta as Record<string, unknown>)
    : {};
}

function normalizeMeta(
  body: SellerProductPayload
): { error: string } | { meta?: SellerProductMeta } {
  const source = readMetaSource(body);
  const meta: SellerProductMeta = {};
  const moq = cleanNumber(source.moq ?? body.moq);
  const fabric = cleanString(source.fabric ?? body.fabric);
  const sizes = normalizeList(source.sizes ?? body.sizes);
  const colors = normalizeList(source.colors ?? body.colors);
  const pdfUrl = cleanString(source.pdfUrl ?? body.pdfUrl);
  const sellerNotes = cleanString(source.sellerNotes ?? body.sellerNotes);

  if (moq !== undefined && moq < 0) {
    return { error: "MOQ must be a valid number" };
  }

  if (moq !== undefined) meta.moq = moq;
  if (fabric) meta.fabric = fabric;
  if (sizes.length) meta.sizes = sizes;
  if (colors.length) meta.colors = colors;
  if (pdfUrl) meta.pdfUrl = pdfUrl;
  if (sellerNotes) meta.sellerNotes = sellerNotes;

  return Object.keys(meta).length ? { meta } : {};
}

function validateProductPayload(
  body: SellerProductPayload
): ProductValidationResult {
  const name = cleanString(body.name);
  const category = cleanString(body.category);
  const price = Number(body.price);
  const stock = Number(body.stock);
  const metaResult = normalizeMeta(body);

  if (!name) return { error: "Product name is required" };
  if (!category) return { error: "Category is required" };
  if (!Number.isFinite(price) || price < 0) {
    return { error: "Price must be a valid number" };
  }
  if (!Number.isFinite(stock) || stock < 0) {
    return { error: "Stock must be a valid number" };
  }
  if ("error" in metaResult) return { error: metaResult.error };

  return {
    name,
    category,
    price,
    stock,
    description: normalizeDescription(body.description),
    images: normalizeList(body.images),
    meta: metaResult.meta,
  };
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return jsonError("Unauthorized", 401);
    if (session.user?.role !== "seller") return jsonError("Forbidden", 403);
    if (!session.user.email) return jsonError("Unauthorized", 401);

    await connectDB();
    const mine = await Product.find({ sellerId: session.user.email }).sort({ createdAt: -1 }).lean();
    return NextResponse.json(mine, { status: 200 });
  } catch (error) {
    console.error("SELLER_PRODUCTS_GET_ERROR:", error);
    return jsonError("Failed to load products", 500);
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return jsonError("Unauthorized", 401);
    if (session.user?.role !== "seller") return jsonError("Forbidden", 403);
    if (!session.user.email) return jsonError("Unauthorized", 401);

    await connectDB();
    let body: SellerProductPayload;

    try {
      body = (await req.json()) as SellerProductPayload;
    } catch {
      return jsonError("Invalid JSON payload", 400);
    }

    const validated = validateProductPayload(body);
    if ("error" in validated) return jsonError(validated.error, 400);

    const doc = await Product.create({
      name: validated.name,
      description: validated.description,
      images: validated.images,
      price: validated.price,
      stock: validated.stock,
      category: validated.category,
      meta: validated.meta,
      approved: false, // requires admin approval
      sellerId: session.user.email,
    });

    return NextResponse.json(
      { message: "Product submitted successfully", product: doc },
      { status: 201 }
    );
  } catch (error) {
    console.error("SELLER_PRODUCTS_POST_ERROR:", error);
    return jsonError("Failed to create product", 500);
  }
}

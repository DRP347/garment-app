import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { requireAdminApi } from "@/lib/authz";
import ProductModel from "@/models/ProductModel";

type ProductPayload = Record<string, unknown>;

function cleanString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function cleanOptionalString(value: unknown) {
  const cleaned = cleanString(value);
  return cleaned ? cleaned : undefined;
}

function cleanNumber(value: unknown) {
  if (value === undefined || value === null || value === "") return undefined;
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : undefined;
}

function cleanBoolean(value: unknown) {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value !== 0;
  if (typeof value !== "string") return undefined;

  const normalized = value.trim().toLowerCase();
  if (["true", "1", "yes", "on"].includes(normalized)) return true;
  if (["false", "0", "no", "off"].includes(normalized)) return false;
  return undefined;
}

function cleanImages(value: unknown) {
  const values = Array.isArray(value) ? value : [value];

  return values
    .flatMap((item) =>
      typeof item === "string" ? item.split(/[\n,]/) : []
    )
    .map((item) => item.trim().replace(/^["']|["']$/g, ""))
    .filter(Boolean);
}

function cleanStringList(value: unknown) {
  const values = Array.isArray(value) ? value : [value];

  return values
    .flatMap((item) =>
      typeof item === "string" ? item.split(/[\n,]/) : []
    )
    .map((item) => item.trim().replace(/^["']|["']$/g, ""))
    .filter(Boolean);
}

function cleanDescription(value: unknown) {
  if (Array.isArray(value)) {
    return value
      .flatMap((item) =>
        typeof item === "string" ? item.split(/\r?\n/) : []
      )
      .map((item) => item.trim())
      .filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(/\r?\n/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

function cleanMeta(payload: ProductPayload) {
  const source =
    payload.meta &&
    typeof payload.meta === "object" &&
    !Array.isArray(payload.meta)
      ? (payload.meta as ProductPayload)
      : {};

  const meta: {
    sleeve?: "short" | "long";
    fabric?: string;
    moq?: number;
    sizes?: string[];
    colors?: string[];
    pdfUrl?: string;
    sellerNotes?: string;
  } = {};
  const sleeve = cleanOptionalString(source.sleeve);
  if (sleeve === "short" || sleeve === "long") meta.sleeve = sleeve;

  const fabric = cleanOptionalString(source.fabric);
  if (fabric) meta.fabric = fabric;

  const moq = cleanNumber(source.moq ?? payload.moq);
  if (moq !== undefined) meta.moq = moq;

  const sizes = cleanStringList(source.sizes ?? payload.sizes);
  if (sizes.length) meta.sizes = sizes;

  const colors = cleanStringList(source.colors ?? payload.colors);
  if (colors.length) meta.colors = colors;

  const pdfUrl = cleanOptionalString(source.pdfUrl ?? payload.pdfUrl);
  if (pdfUrl) meta.pdfUrl = pdfUrl;

  const sellerNotes = cleanOptionalString(source.sellerNotes ?? payload.sellerNotes);
  if (sellerNotes) meta.sellerNotes = sellerNotes;

  return Object.keys(meta).length ? meta : undefined;
}

function normalizeProductPayload(payload: ProductPayload, options: { create: boolean }) {
  const data: ProductPayload = {};

  if ("name" in payload || options.create) data.name = cleanString(payload.name);
  if ("sku" in payload) data.sku = cleanOptionalString(payload.sku);
  if ("description" in payload) data.description = cleanDescription(payload.description);
  if ("images" in payload) data.images = cleanImages(payload.images);
  if ("price" in payload) data.price = cleanNumber(payload.price) ?? 0;
  if ("stock" in payload) data.stock = cleanNumber(payload.stock) ?? 0;
  if ("category" in payload || options.create) data.category = cleanString(payload.category);
  if ("subCategory" in payload) data.subCategory = cleanOptionalString(payload.subCategory);
  if ("sellerId" in payload) data.sellerId = cleanOptionalString(payload.sellerId);

  const meta = cleanMeta(payload);
  if (meta) data.meta = meta;

  const approved = cleanBoolean(payload.approved);
  if (approved !== undefined) {
    data.approved = approved;
  } else if (options.create) {
    data.approved = true;
  }

  if (!data.name) return { error: "Name is required" };
  if (!data.category) return { error: "Category is required" };

  return { data };
}

export async function GET() {
  try {
    const admin = await requireAdminApi();
    if ("response" in admin) return admin.response;

    await connectDB();

    const products = await ProductModel.find({})
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    return NextResponse.json(products);
  } catch (error) {
    console.error("Admin products GET error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const admin = await requireAdminApi();
    if ("response" in admin) return admin.response;

    const payload = (await req.json()) as ProductPayload;
    const normalized = normalizeProductPayload(payload, { create: true });

    if (normalized.error) {
      return NextResponse.json({ error: normalized.error }, { status: 400 });
    }

    await connectDB();

    const product = await ProductModel.create(normalized.data);

    return NextResponse.json(product.toObject(), { status: 201 });
  } catch (error) {
    console.error("Admin products POST error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

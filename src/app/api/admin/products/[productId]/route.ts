import { NextResponse } from "next/server";
import { Types } from "mongoose";
import connectDB from "@/lib/db";
import { requireAdminApi } from "@/lib/authz";
import ProductModel from "@/models/ProductModel";

type ProductPayload = Record<string, unknown>;
type RouteContext = { params: Promise<{ productId: string }> };

async function getProductId(context: RouteContext) {
  const { productId } = await context.params;
  return productId;
}

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

function normalizeProductPayload(payload: ProductPayload) {
  const data: ProductPayload = {};

  if ("name" in payload) {
    data.name = cleanString(payload.name);
    if (!data.name) return { error: "Name is required" };
  }
  if ("sku" in payload) data.sku = cleanOptionalString(payload.sku);
  if ("description" in payload) data.description = cleanDescription(payload.description);
  if ("images" in payload) data.images = cleanImages(payload.images);
  if ("price" in payload) data.price = cleanNumber(payload.price) ?? 0;
  if ("stock" in payload) data.stock = cleanNumber(payload.stock) ?? 0;
  if ("category" in payload) {
    data.category = cleanString(payload.category);
    if (!data.category) return { error: "Category is required" };
  }
  if ("subCategory" in payload) data.subCategory = cleanOptionalString(payload.subCategory);
  if ("sellerId" in payload) data.sellerId = cleanOptionalString(payload.sellerId);

  const meta = cleanMeta(payload);
  if (meta) data.meta = meta;

  const approved = cleanBoolean(payload.approved);
  if (approved !== undefined) data.approved = approved;

  return { data };
}

export async function GET(_req: Request, context: RouteContext) {
  try {
    const admin = await requireAdminApi();
    if ("response" in admin) return admin.response;

    const productId = await getProductId(context);
    if (!Types.ObjectId.isValid(productId)) {
      return NextResponse.json({ error: "Invalid product id" }, { status: 400 });
    }

    await connectDB();

    const product = await ProductModel.findById(productId).lean().exec();
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("Admin product GET error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PUT(req: Request, context: RouteContext) {
  try {
    const admin = await requireAdminApi();
    if ("response" in admin) return admin.response;

    const productId = await getProductId(context);
    if (!Types.ObjectId.isValid(productId)) {
      return NextResponse.json({ error: "Invalid product id" }, { status: 400 });
    }

    const payload = (await req.json()) as ProductPayload;
    const normalized = normalizeProductPayload(payload);

    if (normalized.error) {
      return NextResponse.json({ error: normalized.error }, { status: 400 });
    }

    await connectDB();

    const product = await ProductModel.findByIdAndUpdate(
      productId,
      { $set: normalized.data },
      { new: true, runValidators: true }
    )
      .lean()
      .exec();

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("Admin product PUT error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PATCH(req: Request, context: RouteContext) {
  try {
    const admin = await requireAdminApi();
    if ("response" in admin) return admin.response;

    const productId = await getProductId(context);
    if (!Types.ObjectId.isValid(productId)) {
      return NextResponse.json({ error: "Invalid product id" }, { status: 400 });
    }

    let payload: ProductPayload;
    try {
      payload = (await req.json()) as ProductPayload;
    } catch {
      return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
    }

    const approved = cleanBoolean(payload.approved);
    if (approved === undefined) {
      return NextResponse.json({ error: "approved must be true or false" }, { status: 400 });
    }

    await connectDB();

    const product = await ProductModel.findByIdAndUpdate(
      productId,
      { $set: { approved } },
      { new: true, runValidators: true }
    )
      .lean()
      .exec();

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: approved ? "Product approved" : "Product hidden",
      product,
    });
  } catch (error) {
    console.error("Admin product PATCH error:", error);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, context: RouteContext) {
  try {
    const admin = await requireAdminApi();
    if ("response" in admin) return admin.response;

    const productId = await getProductId(context);
    if (!Types.ObjectId.isValid(productId)) {
      return NextResponse.json({ error: "Invalid product id" }, { status: 400 });
    }

    await connectDB();

    const product = await ProductModel.findByIdAndDelete(productId).lean().exec();
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin product DELETE error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

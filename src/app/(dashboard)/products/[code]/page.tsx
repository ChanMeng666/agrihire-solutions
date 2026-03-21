import { notFound } from "next/navigation";
import { getProductByCode } from "@/server/queries/products";
import { requireStaff } from "@/lib/auth-utils";
import { ProductEditForm } from "./edit-form";

export const metadata = { title: "Edit Product" };

export default async function ProductEditPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  await requireStaff();
  const { code } = await params;
  const product = await getProductByCode(code);
  if (!product) notFound();

  return (
    <div className="space-y-6 max-w-2xl">
      <ProductEditForm product={product} />
    </div>
  );
}

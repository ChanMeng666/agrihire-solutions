import { notFound } from "next/navigation";
import { requireStaff } from "@/lib/auth-utils";
import { getNewsById } from "@/server/queries/news";
import { NewsEditForm } from "./edit-form";

export const metadata = { title: "Edit Article" };

export default async function EditNewsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireStaff();
  const { id } = await params;
  const article = await getNewsById(Number(id));
  if (!article) notFound();

  return (
    <div className="space-y-6 max-w-2xl">
      <NewsEditForm article={article} />
    </div>
  );
}

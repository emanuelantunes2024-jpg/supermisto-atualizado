import { TemplateForm } from "@/components/admin/TemplateForm";
import { getCategories } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function NewTemplatePage() {
  const categories = await getCategories();

  return (
    <div className="space-y-6">
      <h2 className="text-xl">Nueva plantilla</h2>
      <TemplateForm categories={categories} />
    </div>
  );
}

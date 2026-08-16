import { notFound } from "next/navigation";

import { TemplateForm } from "@/components/admin/TemplateForm";
import { getCategories, getTemplateById } from "@/lib/queries";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditTemplatePage({ params }: PageProps) {
  const { id } = await params;
  const [template, categories] = await Promise.all([getTemplateById(id), getCategories()]);

  if (!template) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl">Editar plantilla</h2>
        <p className="mt-1 text-[13px] text-ink-muted">{template.title}</p>
      </div>
      <TemplateForm categories={categories} template={template} />
    </div>
  );
}

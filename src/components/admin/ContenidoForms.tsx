"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";

import {
  updateBenefits,
  updateFeaturedSelection,
  updateHeroSection,
  updateNewsletterSection,
  updateWhyUs,
  type ActionState,
} from "@/app/admin/actions";
import { UploadField } from "@/components/admin/UploadField";
import type { BenefitContent, Category, HomepageContent, TemplateWithCategory, WhyUsContent } from "@/lib/types";

function SaveButton({ label = "Guardar cambios" }: { label?: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn btn-gold">
      {pending ? "Guardando…" : label}
    </button>
  );
}

function FeedbackMessage({ state }: { state: ActionState }) {
  if (state.error) {
    return (
      <p className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-2.5 text-[13px] text-red-300">
        {state.error}
      </p>
    );
  }
  if (state.success) {
    return (
      <p className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-4 py-2.5 text-[13px] text-emerald-300">
        {state.success}
      </p>
    );
  }
  return null;
}

/* ------------------------------------------------------------------ */
/* Hero                                                                */
/* ------------------------------------------------------------------ */

export function HeroForm({ hero }: { hero: HomepageContent["hero"] }) {
  const [state, formAction] = useActionState<ActionState, FormData>(updateHeroSection, {});
  const [imageUrl, setImageUrl] = useState(hero.image_url ?? "");

  return (
    <form action={formAction} className="panel space-y-4">
      <h3 className="text-[15px] font-semibold">Hero (portada)</h3>

      <div>
        <label className="field-label">Texto pequeño (eyebrow)</label>
        <input name="eyebrow" defaultValue={hero.eyebrow} className="field-input" />
      </div>
      <div>
        <label className="field-label">Título</label>
        <textarea name="title" defaultValue={hero.title} rows={2} className="field-input resize-y" />
      </div>
      <div>
        <label className="field-label">Subtítulo</label>
        <textarea name="subtitle" defaultValue={hero.subtitle} rows={2} className="field-input resize-y" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="field-label">Texto del botón</label>
          <input name="button_text" defaultValue={hero.button_text} className="field-input" />
        </div>
        <div>
          <label className="field-label">Enlace del botón</label>
          <input name="button_href" defaultValue={hero.button_href} className="field-input" />
        </div>
      </div>
      <div>
        <label className="field-label">Placeholder del buscador</label>
        <input name="search_placeholder" defaultValue={hero.search_placeholder} className="field-input" />
      </div>
      <div>
        <label className="field-label">Ventajas rápidas (separadas por coma)</label>
        <input name="trust_badges" defaultValue={hero.trust_badges.join(", ")} className="field-input" />
      </div>
      <div>
        <label className="field-label">Imagen / mockup del hero</label>
        {imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageUrl} alt="" className="mb-2 h-32 w-full max-w-sm rounded-lg border border-line object-cover" />
        )}
        <input type="hidden" name="image_url" value={imageUrl} />
        <UploadField slug="hero" label={imageUrl ? "Subir nueva imagen" : "Subir imagen"} onUploaded={setImageUrl} />
      </div>

      <FeedbackMessage state={state} />
      <SaveButton />
    </form>
  );
}

/* ------------------------------------------------------------------ */
/* Beneficios (4 fijos)                                                */
/* ------------------------------------------------------------------ */

const ICONS = ["sparkles", "pencil", "devices", "refresh", "shield", "clock", "star", "gift"];

export function BenefitsForm({ benefits }: { benefits: BenefitContent[] }) {
  const [state, formAction] = useActionState<ActionState, FormData>(updateBenefits, {});
  const rows = [0, 1, 2, 3].map((i) => benefits[i] ?? { icon: "sparkles", title: "", text: "" });

  return (
    <form action={formAction} className="panel space-y-4">
      <h3 className="text-[15px] font-semibold">Beneficios (4)</h3>
      <div className="grid gap-4 sm:grid-cols-2">
        {rows.map((b, i) => (
          <div key={i} className="space-y-2 rounded-lg border border-line p-3.5">
            <div className="grid grid-cols-[100px_1fr] gap-2">
              <select name={`icon_${i + 1}`} defaultValue={b.icon} className="field-input">
                {ICONS.map((icon) => (
                  <option key={icon} value={icon}>
                    {icon}
                  </option>
                ))}
              </select>
              <input name={`title_${i + 1}`} defaultValue={b.title} placeholder="Título" className="field-input" />
            </div>
            <textarea
              name={`text_${i + 1}`}
              defaultValue={b.text}
              rows={2}
              placeholder="Texto"
              className="field-input resize-y"
            />
          </div>
        ))}
      </div>
      <FeedbackMessage state={state} />
      <SaveButton />
    </form>
  );
}

/* ------------------------------------------------------------------ */
/* Categorías y templates destacados en la portada                     */
/* ------------------------------------------------------------------ */

interface FeaturedSelectionProps {
  categories: Category[];
  templates: TemplateWithCategory[];
  selectedCategories: string[];
  selectedTemplates: string[];
}

export function FeaturedSelectionForm({
  categories,
  templates,
  selectedCategories,
  selectedTemplates,
}: FeaturedSelectionProps) {
  const [state, formAction] = useActionState<ActionState, FormData>(updateFeaturedSelection, {});

  return (
    <form action={formAction} className="panel space-y-5">
      <div>
        <h3 className="text-[15px] font-semibold">Categorías en la portada</h3>
        <p className="mt-1 text-[12.5px] text-ink-muted">
          Elige cuáles aparecen en &quot;Explora por Categorías&quot;. Si no marcas ninguna, se muestran las
          primeras del catálogo.
        </p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => (
            <label key={cat.slug} className="flex items-center gap-2 text-[13px]">
              <input
                type="checkbox"
                name="featured_categories"
                value={cat.slug}
                defaultChecked={selectedCategories.includes(cat.slug)}
                className="h-4 w-4 rounded border-line"
              />
              {cat.icon} {cat.name}
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-[15px] font-semibold">Templates Más Populares</h3>
        <p className="mt-1 text-[12.5px] text-ink-muted">
          Elige qué productos aparecen en esa sección. Si no marcas ninguno, se muestran los destacados
          automáticamente.
        </p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((t) => (
            <label key={t.slug} className="flex items-center gap-2 text-[13px]">
              <input
                type="checkbox"
                name="featured_templates"
                value={t.slug}
                defaultChecked={selectedTemplates.includes(t.slug)}
                className="h-4 w-4 rounded border-line"
              />
              {t.title}
            </label>
          ))}
        </div>
      </div>

      <FeedbackMessage state={state} />
      <SaveButton />
    </form>
  );
}

/* ------------------------------------------------------------------ */
/* Por qué elegirnos                                                   */
/* ------------------------------------------------------------------ */

export function WhyUsForm({ whyUs }: { whyUs: WhyUsContent }) {
  const [state, formAction] = useActionState<ActionState, FormData>(updateWhyUs, {});
  const stats = [0, 1, 2, 3].map((i) => whyUs.stats[i] ?? { value: "", label: "" });

  return (
    <form action={formAction} className="panel space-y-4">
      <h3 className="text-[15px] font-semibold">¿Por qué elegirnos?</h3>
      <div>
        <label className="field-label">Título</label>
        <input name="title" defaultValue={whyUs.title} className="field-input" />
      </div>
      <div>
        <label className="field-label">Texto</label>
        <textarea name="text" defaultValue={whyUs.text} rows={2} className="field-input resize-y" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="field-label">Texto del botón</label>
          <input name="button_text" defaultValue={whyUs.button_text} className="field-input" />
        </div>
        <div>
          <label className="field-label">Enlace del botón</label>
          <input name="button_href" defaultValue={whyUs.button_href} className="field-input" />
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-4">
        {stats.map((s, i) => (
          <div key={i} className="space-y-1.5">
            <input
              name={`stat_value_${i + 1}`}
              defaultValue={s.value}
              placeholder="10K+"
              className="field-input text-center"
            />
            <input
              name={`stat_label_${i + 1}`}
              defaultValue={s.label}
              placeholder="Clientes"
              className="field-input text-center text-[12px]"
            />
          </div>
        ))}
      </div>
      <FeedbackMessage state={state} />
      <SaveButton />
    </form>
  );
}

/* ------------------------------------------------------------------ */
/* Newsletter                                                          */
/* ------------------------------------------------------------------ */

export function NewsletterForm({ newsletter }: { newsletter: HomepageContent["newsletter"] }) {
  const [state, formAction] = useActionState<ActionState, FormData>(updateNewsletterSection, {});

  return (
    <form action={formAction} className="panel space-y-4">
      <h3 className="text-[15px] font-semibold">Newsletter</h3>
      <div>
        <label className="field-label">Título</label>
        <input name="title" defaultValue={newsletter.title} className="field-input" />
      </div>
      <div>
        <label className="field-label">Subtítulo</label>
        <input name="subtitle" defaultValue={newsletter.subtitle} className="field-input" />
      </div>
      <div>
        <label className="field-label">Texto del botón</label>
        <input name="button_text" defaultValue={newsletter.button_text} className="field-input" />
      </div>
      <FeedbackMessage state={state} />
      <SaveButton />
    </form>
  );
}

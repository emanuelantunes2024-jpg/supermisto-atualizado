import { TestimonialForm } from "@/components/admin/TestimonialForm";
import { TestimonialRow } from "@/components/admin/TestimonialRow";
import { getTestimonials } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function AdminTestimoniosPage() {
  const testimonials = await getTestimonials(false);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl">Testimonios ({testimonials.length})</h2>
        <p className="mt-1 text-[13px] text-ink-muted">
          Las opiniones publicadas aparecen en la portada, en el orden elegido aquí.
        </p>
      </div>

      <div className="panel space-y-4">
        <h3 className="text-[15px]">Añadir testimonio</h3>
        <TestimonialForm />
      </div>

      <div className="space-y-3">
        {testimonials.map((t) => (
          <TestimonialRow key={t.id} testimonial={t} />
        ))}
        {testimonials.length === 0 && (
          <p className="py-6 text-center text-[13.5px] text-ink-muted">Todavía no hay testimonios.</p>
        )}
      </div>
    </div>
  );
}

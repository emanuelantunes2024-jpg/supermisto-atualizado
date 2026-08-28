import { Icon } from './Icon';

/** Imagem da receita com placeholder discreto quando ainda não há foto cadastrada. */
export function RecipeImage({ src, alt, className }: { src?: string | null; alt: string; className?: string }) {
  if (src) {
    return <img src={src} alt={alt} className={className} loading="lazy" />;
  }
  return (
    <div className={`flex items-center justify-center bg-gradient-to-br from-brand-50 to-brand-100 text-brand-300 ${className}`}>
      <Icon name="book" className="h-1/4 w-1/4 min-h-8 min-w-8" />
    </div>
  );
}

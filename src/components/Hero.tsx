import Link from 'next/link';
import Image from 'next/image';

interface HeroProps {
  title: string;
  subtitle: string;
  overline?: string;
  imageSrc?: string;
  imageAlt?: string;
  primaryAction?: { label: string; href: string };
  secondaryAction?: { label: string; href: string };
}

export default function Hero({ 
  title, 
  subtitle, 
  overline, 
  imageSrc, 
  imageAlt = "Hero Image",
  primaryAction,
  secondaryAction
}: HeroProps) {
  return (
    <section className="relative bg-primary text-on-primary py-20 overflow-hidden">
      <div className="absolute inset-0 patriotic-pattern opacity-30"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/95 to-primary/80"></div>
      <div className="relative z-10 max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1 flex flex-col gap-6">
          {overline && (
            <div className="text-heritage-gold font-label-bold text-label-bold uppercase tracking-widest flex items-center gap-2">
              <span className="material-symbols-outlined text-lg icon-fill-1">star</span>
              {overline}
            </div>
          )}
          <h1 className="font-headline-display text-headline-lg-mobile md:text-headline-display text-on-primary">
            {title.split('\n').map((line, i) => (
              <span key={i} className="block">{line}</span>
            ))}
          </h1>
          <p className="font-body-lg text-body-lg text-inverse-on-surface opacity-90 max-w-xl">{subtitle}</p>
          {(primaryAction || secondaryAction) && (
            <div className="flex flex-wrap gap-4 mt-2">
              {primaryAction && (
                <Link href={primaryAction.href} className="bg-secondary hover:bg-on-secondary-fixed-variant text-on-secondary font-label-bold text-label-bold uppercase px-8 py-4 rounded shadow-md hover:shadow-lg transition-all duration-200">
                  {primaryAction.label}
                </Link>
              )}
              {secondaryAction && (
                <Link href={secondaryAction.href} className="border border-on-primary hover:border-heritage-gold text-on-primary hover:text-heritage-gold font-label-bold text-label-bold uppercase px-8 py-4 rounded transition-all duration-200">
                  {secondaryAction.label}
                </Link>
              )}
            </div>
          )}
        </div>
        {imageSrc && (
          <div className="flex-shrink-0 w-64 md:w-80">
            <Image src={imageSrc} alt={imageAlt} width={400} height={500} className="w-full h-auto object-cover rounded-xl shadow-2xl" priority />
          </div>
        )}
      </div>
    </section>
  );
}

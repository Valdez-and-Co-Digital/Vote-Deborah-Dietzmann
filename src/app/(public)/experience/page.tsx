import Image from 'next/image';

export default function Experience() {
  return (
    <>
      <section className="bg-primary text-on-primary py-section-gap relative overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-overlay hero-pattern"></div>
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="font-headline-display text-4xl md:text-5xl lg:text-6xl text-heritage-gold mb-6 font-bold tracking-tight">
              Unmatched Legal Experience
            </h1>
            <p className="font-body-lg text-lg md:text-xl lg:text-2xl text-inverse-on-surface opacity-90">
              A comprehensive background covering the most complex and critical areas of criminal law.
            </p>
          </div>
        </div>
      </section>

      <section className="py-section-gap px-margin-mobile md:px-margin-desktop bg-surface-container-low">
        <div className="max-w-container-max mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
            
            {/* Case Type: Violent Offenses */}
            <div className="bg-neutral-white border border-outline-variant p-8 shadow-sm hover:shadow-md transition-shadow group">
              <div className="flex justify-between items-start mb-4">
                <span className="material-symbols-outlined text-4xl text-secondary group-hover:scale-110 transition-transform">gavel</span>
                <span className="bg-surface-container-highest text-on-surface-variant font-caption text-xs px-2 py-1 rounded">Felony</span>
              </div>
              <h3 className="font-headline-md text-headline-md text-primary mb-3">Violent Offenses</h3>
              <p className="font-body-md text-body-md text-legal-gray">Extensive experience litigating serious violent crimes, including assaults and homicides, demanding strict adherence to evidentiary rules.</p>
            </div>
            
            {/* Case Type: Intoxication Manslaughter */}
            <div className="bg-neutral-white border border-outline-variant p-8 shadow-sm hover:shadow-md transition-shadow group">
              <div className="flex justify-between items-start mb-4">
                <span className="material-symbols-outlined text-4xl text-heritage-gold group-hover:scale-110 transition-transform">directions_car</span>
                <span className="bg-surface-container-highest text-on-surface-variant font-caption text-xs px-2 py-1 rounded">Felony</span>
              </div>
              <h3 className="font-headline-md text-headline-md text-primary mb-3">Intoxication Manslaughter</h3>
              <p className="font-body-md text-body-md text-legal-gray">Navigating complex vehicular and toxicology evidence in high-stakes, emotionally charged proceedings.</p>
            </div>

            {/* Case Type: White-Collar Crimes */}
            <div className="bg-neutral-white border border-outline-variant p-8 shadow-sm hover:shadow-md transition-shadow group">
              <div className="flex justify-between items-start mb-4">
                <span className="material-symbols-outlined text-4xl text-primary group-hover:scale-110 transition-transform">account_balance</span>
                <span className="bg-surface-container-highest text-on-surface-variant font-caption text-xs px-2 py-1 rounded">Felony/Misdemeanor</span>
              </div>
              <h3 className="font-headline-md text-headline-md text-primary mb-3">White-Collar Crimes</h3>
              <p className="font-body-md text-body-md text-legal-gray">Detailed analysis of financial records, fraud, and embezzlement allegations requiring meticulous judicial review.</p>
            </div>

            {/* Case Type: DWI */}
            <div className="bg-neutral-white border border-outline-variant p-8 shadow-sm hover:shadow-md transition-shadow group">
              <div className="flex justify-between items-start mb-4">
                <span className="material-symbols-outlined text-4xl text-secondary group-hover:scale-110 transition-transform">local_bar</span>
                <span className="bg-surface-container-highest text-on-surface-variant font-caption text-xs px-2 py-1 rounded">Misdemeanor</span>
              </div>
              <h3 className="font-headline-md text-headline-md text-primary mb-3">DWI</h3>
              <p className="font-body-md text-body-md text-legal-gray">Handling hundreds of Driving While Intoxicated cases, balancing public safety with precise procedural requirements.</p>
            </div>

            {/* Case Type: Drug Offenses */}
            <div className="bg-neutral-white border border-outline-variant p-8 shadow-sm hover:shadow-md transition-shadow group">
              <div className="flex justify-between items-start mb-4">
                <span className="material-symbols-outlined text-4xl text-heritage-gold group-hover:scale-110 transition-transform">medication</span>
                <span className="bg-surface-container-highest text-on-surface-variant font-caption text-xs px-2 py-1 rounded">Felony/Misdemeanor</span>
              </div>
              <h3 className="font-headline-md text-headline-md text-primary mb-3">Drug Offenses</h3>
              <p className="font-body-md text-body-md text-legal-gray">Adjudicating possession, distribution, and manufacturing cases, understanding the nuances of search and seizure laws.</p>
            </div>

            {/* Case Type: Immigration Matters */}
            <div className="bg-neutral-white border border-outline-variant p-8 shadow-sm hover:shadow-md transition-shadow group">
              <div className="flex justify-between items-start mb-4">
                <span className="material-symbols-outlined text-4xl text-primary group-hover:scale-110 transition-transform">public</span>
                <span className="bg-surface-container-highest text-on-surface-variant font-caption text-xs px-2 py-1 rounded">Complex</span>
              </div>
              <h3 className="font-headline-md text-headline-md text-primary mb-3">Immigration Contexts</h3>
              <p className="font-body-md text-body-md text-legal-gray">Understanding the collateral immigration consequences of criminal convictions to ensure fair administration of justice.</p>
            </div>

          </div>
        </div>
      </section>


    </>
  );
}

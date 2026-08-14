import Hero from "@/components/Hero";
import Image from "next/image";

export default function Endorsements() {
  return (
    <>
      <Hero 
        title="Endorsements" 
        subtitle="Trusted and supported by respected community leaders, organizations, and fellow conservatives across Bexar County."
        overline="Community Support"
      />

      {/* Key Endorsing Organizations */}
      <section className="py-section-gap px-margin-mobile md:px-margin-desktop bg-surface-container-lowest">
        <div className="max-w-container-max mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary mb-4">Endorsing Organizations</h2>
            <div className="w-24 h-1 bg-heritage-gold mx-auto mb-6"></div>
            <p className="font-body-lg text-body-lg text-legal-gray max-w-2xl mx-auto">
              Deborah has earned the trust and backing of organizations that share a commitment to family values, public safety, and the rule of law.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter mb-16">
            {/* GOP Card */}
            <div className="bg-neutral-white border-2 border-heritage-gold rounded-xl p-8 shadow-md flex flex-col gap-4 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-heritage-gold text-2xl icon-fill-1">star</span>
                </div>
                <div>
                  <h3 className="font-headline-md text-headline-md text-primary">Republican Party of Bexar County</h3>
                </div>
              </div>
              <p className="font-body-md text-body-md text-legal-gray italic border-l-4 border-heritage-gold pl-4">
                "JULY IS FOR JUDGES! Deborah Dietzmann is one of our incredibly experienced conservative constitutionalist candidates for Bexar County Court."
              </p>
              <div className="flex items-center gap-2 text-secondary font-label-bold text-xs uppercase">
                <span className="material-symbols-outlined text-sm icon-fill-1">verified</span>
                Official Party Endorsement — July 2026
              </div>
            </div>

            {/* SAFA Card */}
            <div className="bg-neutral-white border-2 border-heritage-gold rounded-xl p-8 shadow-md flex flex-col gap-4 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-heritage-gold text-2xl icon-fill-1">family_restroom</span>
                </div>
                <div>
                  <h3 className="font-headline-md text-headline-md text-primary">Friends of SAFA / Texas Family Action</h3>
                </div>
              </div>
              <p className="font-body-md text-body-md text-legal-gray italic border-l-4 border-heritage-gold pl-4">
                "I am honored to be endorsed by Friends of SAFA. This endorsement reflects our shared moral and ethical values and commitment to the family."
                <span className="not-italic font-bold text-primary block mt-2">— Deborah Dietzmann</span>
              </p>
              <div className="flex items-center gap-2 text-secondary font-label-bold text-xs uppercase">
                <span className="material-symbols-outlined text-sm icon-fill-1">verified</span>
                Endorsed on Family Values Voter Guide — February 2026
              </div>
            </div>
          </div>

          {/* Voter Guide Feature */}
          <div className="bg-primary rounded-2xl overflow-hidden shadow-xl flex flex-col md:flex-row items-center">
            <div className="w-full md:w-auto md:flex-shrink-0 p-6 flex justify-center">
              <div className="bg-neutral-white p-3 rounded-xl shadow-lg max-w-[260px] md:max-w-[320px] transition-transform hover:scale-105">
                <a href="/family-values-voter-guide.pdf" target="_blank" rel="noopener noreferrer" title="View Full Voter Guide PDF">
                  <Image 
                    src="/voter-guide-thumb.jpg" 
                    alt="Family Values Voter Guide featuring Deborah Dietzmann" 
                    width={320}
                    height={414}
                    className="w-full h-auto object-cover rounded border border-surface-container-high"
                  />
                </a>
              </div>
            </div>
            <div className="flex-1 p-8 md:p-12 text-on-primary">
              <div className="text-heritage-gold font-label-bold uppercase tracking-widest text-xs mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-sm icon-fill-1">menu_book</span>
                Texas 2026 Primary Election
              </div>
              <h3 className="font-headline-md text-headline-md text-on-primary mb-4">Featured on the Family Values Voter Guide</h3>
              <p className="font-body-md text-body-md text-inverse-on-surface opacity-90 mb-6">
                <strong className="text-heritage-gold">Deborah Dietzmann</strong> is listed under <strong className="text-heritage-gold">Bexar County Races — Judge, Count Ct. No. 12</strong> on the official Texas Family Action Pro-Life Family Values Voter Guide, which recommends candidates committed to protecting the family.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
                <a 
                  href="/family-values-voter-guide.pdf" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-heritage-gold text-primary font-label-bold uppercase tracking-wider px-4 py-2 rounded-lg hover:bg-neutral-white transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">picture_as_pdf</span>
                  View Voter Guide PDF
                </a>
                <a 
                  href="https://TexasFamilyAction.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-heritage-gold font-label-bold uppercase tracking-wider hover:underline"
                >
                  <span className="material-symbols-outlined text-sm">open_in_new</span>
                  TexasFamilyAction.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* GOP Endorsement Feature */}
      <section className="py-section-gap px-margin-mobile md:px-margin-desktop bg-surface-container">
        <div className="max-w-container-max mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1">
            <div className="text-heritage-gold font-label-bold uppercase tracking-widest text-xs mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-sm icon-fill-1">star</span>
              Bexar County Republican Party
            </div>
            <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary mb-6">
              "Vote Tuesday, November 3, 2026"
            </h2>
            <p className="font-body-lg text-body-lg text-legal-gray mb-6">
              The Republican Party of Bexar County proudly featured <strong>Deborah Dietzmann</strong> as one of their official judicial nominees — recognizing her as an experienced, conservative constitutionalist dedicated to upholding the law.
            </p>
            <div className="inline-flex items-center gap-3 bg-primary text-on-primary px-6 py-3 rounded-lg">
              <span className="material-symbols-outlined text-heritage-gold icon-fill-1">how_to_vote</span>
              <span className="font-label-bold text-label-bold uppercase">Judge — Bexar County Court 12</span>
            </div>
          </div>
          <div className="w-full md:w-auto md:flex-shrink-0">
            <div className="bg-neutral-white p-3 rounded-xl shadow-lg max-w-[300px] mx-auto">
              <Image 
                src="/fb-bexar-gop.jpg" 
                alt="Republican Party of Bexar County endorsement featuring Deborah Dietzmann" 
                width={340}
                height={500}
                className="w-full h-auto object-cover rounded"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

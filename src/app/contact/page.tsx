import Hero from "@/components/Hero";

export default function Contact() {
  return (
    <>
      <Hero 
        title="Contact Us" 
        subtitle="Have a question or want to connect with the campaign? We'd love to hear from you."
        overline="Get in Touch"
      />

      <section className="py-section-gap px-margin-mobile md:px-margin-desktop bg-surface-container-lowest">
        <div className="max-w-container-max mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          
          {/* Contact Info */}
          <div className="flex flex-col gap-8">
            <div>
              <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary mb-4">Campaign Contact</h2>
              <div className="w-16 h-1 bg-heritage-gold mb-6"></div>
            </div>

            <div className="flex flex-col gap-4">
              <a href="mailto:dietzmanncc12@gmail.com" className="flex items-center gap-4 bg-neutral-white border border-outline-variant p-5 rounded-xl hover:shadow-md transition-shadow group">
                <span className="material-symbols-outlined text-3xl text-secondary icon-fill-1 group-hover:scale-110 transition-transform">mail</span>
                <div>
                  <div className="font-label-bold text-label-bold text-primary uppercase tracking-wider">Email</div>
                  <div className="font-body-md text-body-md text-legal-gray">dietzmanncc12@gmail.com</div>
                </div>
              </a>

              <div className="flex items-center gap-4 bg-neutral-white border border-outline-variant p-5 rounded-xl">
                <span className="material-symbols-outlined text-3xl text-heritage-gold icon-fill-1">location_on</span>
                <div>
                  <div className="font-label-bold text-label-bold text-primary uppercase tracking-wider">Jurisdiction</div>
                  <div className="font-body-md text-body-md text-legal-gray">Bexar County, Texas — Court 12</div>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-neutral-white border border-outline-variant p-5 rounded-xl">
                <span className="material-symbols-outlined text-3xl text-primary icon-fill-1">how_to_vote</span>
                <div>
                  <div className="font-label-bold text-label-bold text-primary uppercase tracking-wider">Election Day</div>
                  <div className="font-body-md text-body-md text-legal-gray">November 3, 2026 — Register by October 5th</div>
                </div>
              </div>
            </div>

            <div className="bg-primary text-on-primary rounded-xl p-6">
              <div className="font-label-bold text-label-bold text-heritage-gold uppercase tracking-wider mb-2">Legal Disclosure</div>
              <p className="font-caption text-xs text-inverse-on-surface opacity-70">
                Pol. Adv. Paid for by the Deborah Dietzmann campaign. Erica Gregory, Treas.
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-surface-container border border-outline-variant rounded-2xl p-8 shadow-sm">
            <h2 className="font-headline-md text-headline-md text-primary mb-2">Send a Message</h2>
            <p className="font-body-md text-body-md text-legal-gray mb-6">
              We read every message and will get back to you as soon as possible.
            </p>
            <form
              action="mailto:dietzmanncc12@gmail.com"
              method="POST"
              encType="text/plain"
              className="flex flex-col gap-5"
            >
              <div>
                <label htmlFor="c-name" className="block font-label-bold text-label-bold text-primary uppercase mb-2 text-xs tracking-wider">Name</label>
                <input 
                  type="text" id="c-name" name="Name" required
                  className="w-full bg-neutral-white border border-outline-variant text-on-surface px-4 py-3 rounded-lg focus:outline-none focus:border-primary transition-colors"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label htmlFor="c-email" className="block font-label-bold text-label-bold text-primary uppercase mb-2 text-xs tracking-wider">Email</label>
                <input 
                  type="email" id="c-email" name="Email" required
                  className="w-full bg-neutral-white border border-outline-variant text-on-surface px-4 py-3 rounded-lg focus:outline-none focus:border-primary transition-colors"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label htmlFor="c-subject" className="block font-label-bold text-label-bold text-primary uppercase mb-2 text-xs tracking-wider">Subject</label>
                <input 
                  type="text" id="c-subject" name="Subject"
                  className="w-full bg-neutral-white border border-outline-variant text-on-surface px-4 py-3 rounded-lg focus:outline-none focus:border-primary transition-colors"
                  placeholder="What's this about?"
                />
              </div>
              <div>
                <label htmlFor="c-message" className="block font-label-bold text-label-bold text-primary uppercase mb-2 text-xs tracking-wider">Message</label>
                <textarea 
                  id="c-message" name="Message" rows={5} required
                  className="w-full bg-neutral-white border border-outline-variant text-on-surface px-4 py-3 rounded-lg focus:outline-none focus:border-primary transition-colors resize-none"
                  placeholder="Your message..."
                />
              </div>
              <button 
                type="submit"
                className="w-full bg-secondary hover:bg-on-secondary-fixed-variant text-on-secondary font-label-bold text-label-bold uppercase px-8 py-4 rounded shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined">send</span>
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}

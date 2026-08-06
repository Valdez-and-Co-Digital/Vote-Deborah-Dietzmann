import Hero from "@/components/Hero";
import Button from "@/components/Button";

export default function Volunteer() {
  return (
    <>
      <Hero 
        title="Get Involved" 
        subtitle="Join our grassroots movement to bring fair, experienced leadership to County Court 12. Every door knocked, every call made, every yard sign matters."
        overline="Make a Difference"
      />

      <section className="py-section-gap px-margin-mobile md:px-margin-desktop bg-surface-container-lowest">
        <div className="max-w-container-max mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-start">

          {/* Ways to Help */}
          <div>
            <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary mb-8">Ways to Help</h2>
            <div className="flex flex-col gap-4">
              {[
                { icon: 'door_front', label: 'Door Knocking / Canvassing', desc: 'Meet your neighbors and spread the word directly.' },
                { icon: 'phone_in_talk', label: 'Phone Banking', desc: 'Help us reach voters across Bexar County.' },
                { icon: 'yard', label: 'Request a Yard Sign', desc: 'Show your support in your neighborhood.' },
                { icon: 'celebration', label: 'Host a Meet & Greet', desc: 'Invite friends and family to meet Deborah.' },
                { icon: 'volunteer_activism', label: 'Donate to the Campaign', desc: 'Your financial support makes a direct impact.' },
              ].map(({ icon, label, desc }) => (
                <div key={label} className="flex items-start gap-4 bg-neutral-white border border-outline-variant p-5 rounded-xl hover:shadow-md transition-shadow">
                  <span className="material-symbols-outlined text-3xl text-secondary icon-fill-1 flex-shrink-0 mt-1">{icon}</span>
                  <div>
                    <div className="font-label-bold text-label-bold text-primary uppercase tracking-wider">{label}</div>
                    <div className="font-body-md text-body-md text-legal-gray">{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sign Up Form */}
          <div className="bg-primary text-on-primary rounded-2xl p-8 shadow-xl">
            <h2 className="font-headline-md text-headline-md text-heritage-gold mb-2">Sign Up to Volunteer</h2>
            <p className="font-body-md text-body-md text-inverse-on-surface opacity-90 mb-8">
              Fill out the form below and our campaign team will be in touch with next steps.
            </p>
            <form
              action="mailto:dietzmanncc12@gmail.com"
              method="POST"
              encType="text/plain"
              className="flex flex-col gap-5"
            >
              <div>
                <label htmlFor="v-name" className="block font-label-bold text-label-bold text-heritage-gold uppercase mb-2">Full Name</label>
                <input 
                  type="text" id="v-name" name="Name" required
                  className="w-full bg-on-primary/10 border border-on-primary/20 text-on-primary placeholder:text-on-primary/50 px-4 py-3 rounded-lg focus:outline-none focus:border-heritage-gold transition-colors" 
                  placeholder="Jane Smith"
                />
              </div>
              <div>
                <label htmlFor="v-email" className="block font-label-bold text-label-bold text-heritage-gold uppercase mb-2">Email Address</label>
                <input 
                  type="email" id="v-email" name="Email" required
                  className="w-full bg-on-primary/10 border border-on-primary/20 text-on-primary placeholder:text-on-primary/50 px-4 py-3 rounded-lg focus:outline-none focus:border-heritage-gold transition-colors" 
                  placeholder="jane@email.com"
                />
              </div>
              <div>
                <label htmlFor="v-phone" className="block font-label-bold text-label-bold text-heritage-gold uppercase mb-2">Phone (Optional)</label>
                <input 
                  type="tel" id="v-phone" name="Phone"
                  className="w-full bg-on-primary/10 border border-on-primary/20 text-on-primary placeholder:text-on-primary/50 px-4 py-3 rounded-lg focus:outline-none focus:border-heritage-gold transition-colors" 
                  placeholder="(210) 555-0100"
                />
              </div>
              <div>
                <label className="block font-label-bold text-label-bold text-heritage-gold uppercase mb-3">How would you like to help?</label>
                <div className="flex flex-col gap-2">
                  {['Door Knocking / Canvassing', 'Phone Banking', 'Request a Yard Sign', 'Host a Meet & Greet', 'Financial Donation'].map(option => (
                    <label key={option} className="flex items-center gap-3 text-inverse-on-surface opacity-90 cursor-pointer">
                      <input type="checkbox" name={option} className="w-4 h-4 accent-heritage-gold" />
                      <span className="font-body-md text-body-md">{option}</span>
                    </label>
                  ))}
                </div>
              </div>
              <Button type="submit" variant="primary" className="mt-2 w-full justify-center">
                Sign Up to Volunteer
              </Button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}

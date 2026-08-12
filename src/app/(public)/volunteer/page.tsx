import Hero from "@/components/Hero";
import Button from "@/components/Button";
import VolunteerClientForm from "./VolunteerClientForm";

export default function Volunteer() {
  return (
    <>
      <Hero 
        title="Get Involved" 
        subtitle="Join our grassroots movement to bring fair, experienced leadership to County Court 12. Every door knocked and every call made matters."
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
                { icon: 'celebration', label: 'Host a Meet & Greet', desc: 'Invite friends and family to meet Deborah.' },
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
          <VolunteerClientForm />
        </div>
      </section>
    </>
  );
}

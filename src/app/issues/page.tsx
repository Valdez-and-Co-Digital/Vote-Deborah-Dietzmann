import Link from "next/link";

export default function Issues() {
  return (
    <>
      {/* Hero */}
      <section className="relative bg-primary text-on-primary py-20 overflow-hidden">
        <div className="absolute inset-0 patriotic-pattern opacity-30"></div>
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, #00081e, rgba(0,8,30,0.9))' }}></div>
        <div className="relative z-10 max-w-[1200px] mx-auto px-5 md:px-16">
          <div className="text-heritage-gold font-bold text-xs uppercase tracking-widest flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-sm icon-fill-1">star</span>
            The Platform
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: '"Libre Caslon Text", serif' }}>
            Fairness. Safety. Efficiency.
          </h1>
          <p className="text-base text-inverse-on-surface opacity-90 max-w-2xl">
            The principles that will guide every decision from the bench of Bexar County Court at Law No. 12.
          </p>
          <div className="w-16 h-1 bg-heritage-gold mt-6"></div>
        </div>
      </section>

      {/* 3 Key Campaign Messages */}
      <section className="py-20 px-5 md:px-16 bg-white">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-2xl md:text-3xl font-bold text-primary mb-3" style={{ fontFamily: '"Libre Caslon Text", serif' }}>3 Key Campaign Commitments</h2>
            <div className="w-24 h-1 bg-heritage-gold mx-auto"></div>
          </div>

          <div className="flex flex-col gap-8">
            
            {/* Commitment 1 */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start bg-surface-container-low rounded-2xl p-8 border border-outline-variant">
              <div className="md:col-span-1 flex justify-start md:justify-center">
                <div className="w-12 h-12 rounded-full bg-primary text-heritage-gold flex items-center justify-center font-bold text-xl flex-shrink-0" style={{ fontFamily: '"Libre Caslon Text", serif' }}>1</div>
              </div>
              <div className="md:col-span-11 flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-2xl text-secondary icon-fill-1">shield</span>
                  <h3 className="font-bold text-primary text-xl" style={{ fontFamily: '"Libre Caslon Text", serif' }}>Safety &amp; Constitutional Rights</h3>
                </div>
                <p className="text-legal-gray leading-relaxed">
                  Deborah Dietzmann is dedicated to keeping Bexar County safe while preserving the constitutional rights of its citizens. She has devoted the majority of her legal career to public service — with experience on both sides of the courtroom as a prosecutor, private practitioner, and public defender. This balanced background shapes her commitment to fairness, accountability, and the rule of law.
                </p>
                <p className="text-legal-gray leading-relaxed">
                  Dietzmann believes the judiciary must serve the public with <strong className="text-primary">integrity</strong>, <strong className="text-primary">impartiality</strong>, and <strong className="text-primary">respect for individual rights</strong> while strengthening both community safety and public trust.
                </p>
              </div>
            </div>

            {/* Commitment 2 */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start bg-surface-container-low rounded-2xl p-8 border border-outline-variant">
              <div className="md:col-span-1 flex justify-start md:justify-center">
                <div className="w-12 h-12 rounded-full bg-heritage-gold text-white flex items-center justify-center font-bold text-xl flex-shrink-0" style={{ fontFamily: '"Libre Caslon Text", serif' }}>2</div>
              </div>
              <div className="md:col-span-11 flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-2xl text-heritage-gold icon-fill-1">done_all</span>
                  <h3 className="font-bold text-primary text-xl" style={{ fontFamily: '"Libre Caslon Text", serif' }}>Decisive, Efficient Courts</h3>
                </div>
                <p className="text-legal-gray leading-relaxed">
                  Deborah Dietzmann is a decisive, results-driven leader committed to running the courts efficiently and effectively, while ensuring that the voices of both the community and victims are heard and respected. She understands the rule of law, the responsibility of applying it, and the role of a judge in delivering justice fairly and consistently.
                </p>
                <p className="text-legal-gray leading-relaxed">
                  Dietzmann evaluates each case independently, makes timely and well-reasoned decisions, and will impose appropriate consequences when warranted. Her dedication ensures that justice in Bexar County is both <strong className="text-primary">swift and fair</strong>, with public safety as the utmost concern.
                </p>
              </div>
            </div>

            {/* Commitment 3 */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start bg-surface-container-low rounded-2xl p-8 border border-outline-variant">
              <div className="md:col-span-1 flex justify-start md:justify-center">
                <div className="w-12 h-12 rounded-full bg-secondary text-white flex items-center justify-center font-bold text-xl flex-shrink-0" style={{ fontFamily: '"Libre Caslon Text", serif' }}>3</div>
              </div>
              <div className="md:col-span-11 flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-2xl text-primary icon-fill-1">block</span>
                  <h3 className="font-bold text-primary text-xl" style={{ fontFamily: '"Libre Caslon Text", serif' }}>Stopping the Revolving Door</h3>
                </div>
                <p className="text-legal-gray leading-relaxed">
                  Deborah Dietzmann is determined to confront the revolving-door cycle of repeat offenders who are arrested and quickly released — a pattern that undermines public safety. She is committed to addressing habitual reoffending through <strong className="text-primary">firm, fair, and lawful decision-making</strong>.
                </p>
                <p className="text-legal-gray leading-relaxed">
                  Dietzmann is equally determined to run a professional courtroom grounded in respect, order, and professional decorum — and to create a responsive, accessible office so the public can engage with the court confidently and openly. Her resolve reflects a commitment to accountability, safety, and trust in the justice system.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Voter Registration Alert */}
      <section className="py-20 px-5 md:px-16 bg-primary text-on-primary">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-on-primary/5 border border-heritage-gold rounded-2xl p-10 flex flex-col items-center gap-6">
            <span className="material-symbols-outlined text-5xl text-heritage-gold icon-fill-1">how_to_vote</span>
            <h2 className="text-2xl md:text-3xl font-bold text-on-primary" style={{ fontFamily: '"Libre Caslon Text", serif' }}>
              Election Day: <span className="text-heritage-gold">November 3, 2026</span>
            </h2>
            <p className="text-base text-inverse-on-surface opacity-90 max-w-2xl">
              <strong className="text-heritage-gold">October 5th</strong> is the last day to register to vote for the November 3rd election. If you've changed your name or address, update your voter registration by October 5th.
            </p>
            <a
              href="https://www.bexar.org/elections"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-secondary hover:bg-on-secondary-fixed-variant text-on-secondary font-bold text-xs px-8 py-4 rounded shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2 uppercase tracking-wider"
            >
              <span className="material-symbols-outlined text-sm">open_in_new</span>
              Check / Register at Bexar.org/Elections
            </a>
            <p className="text-xs text-inverse-on-surface opacity-60">
              Questions? Call Bexar County Elections: 210-335-VOTE (8683)
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-5 md:px-16 bg-surface-container-low border-t border-outline-variant">
        <div className="max-w-3xl mx-auto text-center flex flex-col gap-6 items-center">
          <h2 className="text-2xl md:text-3xl font-bold text-primary" style={{ fontFamily: '"Libre Caslon Text", serif' }}>Ready to Make a Difference?</h2>
          <p className="text-legal-gray text-base max-w-xl">Join Deborah's campaign and help bring experienced, fair leadership to County Court 12.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/volunteer" className="bg-secondary hover:bg-on-secondary-fixed-variant text-on-secondary font-bold text-xs px-8 py-4 rounded shadow-md hover:shadow-lg transition-all duration-200 uppercase tracking-wider">
              Get Involved
            </Link>
            <Link href="/endorsements" className="border-2 border-primary text-primary hover:bg-primary hover:text-on-primary font-bold text-xs px-8 py-4 rounded transition-all duration-200 uppercase tracking-wider">
              See Endorsements
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

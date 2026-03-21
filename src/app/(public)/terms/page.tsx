export const metadata = { title: "Terms & Conditions" };

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="prose mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold tracking-tight mb-8">Terms &amp; Conditions</h1>
        <div className="space-y-6 text-muted-foreground">
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">1. Equipment Hire Agreement</h2>
            <p>
              By hiring equipment from AgriHire Solutions, you agree to these terms and conditions.
              All equipment remains the property of AgriHire Solutions throughout the hire period.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">2. Hire Period</h2>
            <p>
              Equipment must be returned by the agreed return date and time. Late returns may incur
              additional charges at the applicable hire rate.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">3. Care of Equipment</h2>
            <p>
              The hirer is responsible for the care and safe use of all hired equipment.
              Any damage beyond normal wear and tear will be charged to the hirer.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">4. Cancellation</h2>
            <p>
              Bookings may be cancelled up to 24 hours before the hire start date for a full refund.
              Cancellations within 24 hours may incur a cancellation fee.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";

const stats = [
  { num: 'Rp4–6K', label: 'PLN PRODUCTION COST / KWH' },
  { num: 'Rp1.4K', label: 'CITIZEN TARIFF / KWH' },
  { num: '70%+',   label: 'REMOTE ISLANDS ON DIESEL' },
  { num: '0',      label: 'WAYS CITIZENS CAN VERIFY THEIR BILL' },
];

const problems = [
  {
    num: '01', tag: 'Monopoly',
    title: 'PLN Controls Everything',
    body: 'PLN is the sole electricity distributor across Indonesia. Citizens have no choice — buy from PLN or have no electricity. No competition, no efficiency incentive, no accountability.',
    stat: '100%', statLabel: 'PLN MARKET SHARE IN ELECTRICITY DISTRIBUTION',
  },
  {
    num: '02', tag: 'No Transparency',
    title: 'Bills Cannot Be Verified',
    body: 'Meter data is controlled by PLN. Citizens have no way to prove whether their bill is accurate. Disputes are dismissed because no independent reference data exists.',
    stat: '0', statLabel: 'INDEPENDENT VERIFICATION MECHANISMS FOR CITIZENS',
  },
  {
    num: '03', tag: 'Remote Islands',
    title: 'Expensive, Dirty Diesel',
    body: 'Gili Ketapang — one of 17,000+ Indonesian islands — runs entirely on a 2×470 kW diesel plant. Diesel must be shipped in. Production cost: Rp4,000–6,000/kWh, far above what citizens pay.',
    stat: '~Rp42B', statLabel: 'ESTIMATED CAPEX FOR HYBRID MICROGRID ON GILI KETAPANG ALONE',
  },
  {
    num: '04', tag: 'Wasted Surplus',
    title: 'Solar Panels, No Market',
    body: 'Households with solar panels produce daily surplus energy — but cannot sell it to neighbors. They must sell back to PLN at heavily discounted buyback rates. Surplus is wasted, opportunity is lost.',
    stat: '~Rp800', statLabel: 'PLN BUYBACK PRICE / KWH VS Rp1,600 NORMAL TARIFF',
  },
];

const caseData = [
  { label: 'Electricity Customers',  value: '~1,800 households', type: 'neutral' },
  { label: 'Daytime Peak Load',      value: '317 kW',            type: 'neutral' },
  { label: 'Nighttime Peak Load',    value: '425 kW',            type: 'neutral' },
  { label: 'Annual Consumption',     value: '~1.5 GWh',          type: 'neutral' },
  { label: 'Current Energy Source',  value: '100% Diesel',       type: 'bad'     },
  { label: 'Solar Potential',        value: '5.0 kWh/m²/day',    type: 'good'    },
  { label: 'Wind Potential',         value: '4.5–6.0 m/s',       type: 'good'    },
  { label: 'PLN Financial Status',   value: 'Subsidy Deficit',   type: 'bad'     },
  { label: 'Billing Transparency',   value: 'None',              type: 'bad'     },
  { label: 'P2P Energy Trading',     value: 'Not Permitted',     type: 'bad'     },
];

const solutions = [
  {
    num: '01', title: 'P2P Energy Marketplace',
    body: 'Households with solar panels list their surplus energy at a price they set. Neighbors buy directly. MON is settled on-chain — not PLN\'s pocket, not a bank\'s account.',
  },
  {
    num: '02', title: 'Immutable Billing',
    body: 'Every energy transaction is recorded on-chain. Cannot be deleted. Cannot be manipulated. Citizens hold cryptographic proof of every kWh they bought and every payment they made.',
  },
  {
    num: '03', title: 'NFT Energy Receipt',
    body: 'Every completed trade automatically mints an NFT receipt to the buyer. Permanent proof of energy ownership — auditable by anyone, anytime, without trusting a central authority.',
  },
];

const steps = [
  { num: 'STEP 01', title: 'Register Producer', body: 'Solar panel owner sets price per kWh and available stock. Listing goes live on the marketplace instantly.', actor: '→ Seller Wallet' },
  { num: 'STEP 02', title: 'Buy Energy',        body: 'Buyer selects seller, purchases N kWh. MON is settled instantly on Monad — no bank, no PLN.', actor: '→ Buyer Wallet' },
  { num: 'STEP 03', title: 'MON Transferred',   body: 'Smart contract sends MON directly to seller. Automatic. No admin approval. No intermediary. No delay.', actor: '→ Smart Contract' },
  { num: 'STEP 04', title: 'NFT Minted',        body: 'EnergyReceipt NFT is minted to buyer — permanent on-chain proof of the energy transaction on Monad.', actor: '→ Buyer Wallet' },
];

const compareRows = [
  { feature: 'Block Time',         eth: '~12 seconds',  monad: '~1 second',    impact: 'Real-time meter data — actually feasible' },
  { feature: 'Gas per Transaction',eth: '$2–20',         monad: '~$0.001',      impact: 'Small trades (1 kWh) remain economically viable' },
  { feature: 'Throughput',         eth: '~15 TPS',       monad: '10,000 TPS',   impact: '1,800 households trading simultaneously — no queue' },
  { feature: 'Finality',           eth: '~64 blocks',    monad: 'Single slot',  impact: 'Instant payment to seller upon delivery' },
  { feature: 'EVM Compatibility',  eth: '✓ Native',      monad: '✓ Full EVM',   impact: 'Deploy Solidity as-is — zero rewrite needed', bothGood: true },
];

function SectionLabel({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.65rem', color: light ? 'rgba(0,0,0,0.4)' : '#C8F135', letterSpacing: '4px', textTransform: 'uppercase', marginBottom: 48 }}>
      {children}
      <span style={{ flex: 1, height: 1, background: light ? 'rgba(0,0,0,0.15)' : '#1a1a1a', maxWidth: 120 }} />
    </div>
  );
}

export default function WhyPage() {
  return (
    <div
      style={{
        background: '#050505',
        color: '#F0EDE6',
        fontFamily: "'IBM Plex Sans', sans-serif",
        cursor: 'crosshair',
        minHeight: '100vh',
        overflowX: 'hidden',
      }}
    >
      {/* fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=IBM+Plex+Mono:wght@400;500;700&family=IBM+Plex+Sans:wght@300;400;500&display=swap');
      `}</style>


      {/* HERO */}
      <section style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: '100vh', padding: '128px 48px 80px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-20%', right: '-10%', width: 600, height: 600, background: 'radial-gradient(circle, rgba(200,241,53,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.7rem', color: '#C8F135', letterSpacing: '4px', marginBottom: 32 }}>
          // Why we exist
        </p>

        <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(5rem, 12vw, 11rem)', lineHeight: 0.9, letterSpacing: '2px', marginBottom: 40 }}>
          ENERGY<br />
          FOR THE<br />
          <span style={{ position: 'relative', display: 'inline-block', color: '#FF3131' }}>
            MONOPOLY
            <span style={{ position: 'absolute', left: 0, right: 0, top: '50%', height: 4, background: '#FF3131', transform: 'rotate(-2deg)' }} />
          </span>
          <br />
          <span style={{ color: '#C8F135' }}>PEOPLE.</span>
        </h1>

        <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.85rem', color: '#666', maxWidth: 580, lineHeight: 1.9, marginBottom: 64 }}>
          17,000+ islands. 270 million people. One energy monopoly.<br />
          Citizens with solar panels cannot sell surplus to neighbors.<br />
          Billing is opaque. Data cannot be independently verified.<br />
          Diesel burns. Subsidies bleed. Nothing changes.<br /><br />
          ACEBlitz changes that — with blockchain, not bureaucracy.
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 48, paddingTop: 48, borderTop: '1px solid #1a1a1a' }}>
          {stats.map((s) => (
            <div key={s.label}>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2.8rem', color: '#C8F135', lineHeight: 1 }}>{s.num}</div>
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.6rem', color: '#444', letterSpacing: '1.5px', marginTop: 6, maxWidth: 160, lineHeight: 1.5 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* PROBLEM */}
      <section style={{ padding: '112px 48px', background: '#111', borderTop: '1px solid #1a1a1a', borderBottom: '1px solid #1a1a1a' }}>
        <SectionLabel>01 — The Problem</SectionLabel>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
          {problems.map((p) => (
            <div
              key={p.num}
              style={{ position: 'relative', overflow: 'hidden', padding: 48, background: '#050505', transition: 'background 0.2s', cursor: 'default' }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#0d0d0d')}
              onMouseLeave={(e) => (e.currentTarget.style.background = '#050505')}
            >
              <span style={{ position: 'absolute', top: -20, right: 24, fontFamily: "'Bebas Neue', sans-serif", fontSize: '8rem', color: '#111', lineHeight: 1, userSelect: 'none', pointerEvents: 'none' }}>
                {p.num}
              </span>
              <span style={{ display: 'inline-block', marginBottom: 20, fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.6rem', letterSpacing: '2px', color: '#FF3131', border: '1px solid rgba(255,49,49,0.3)', padding: '4px 10px', borderRadius: 2 }}>
                {p.tag}
              </span>
              <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2rem', letterSpacing: '1px', marginBottom: 16, lineHeight: 1.1 }}>{p.title}</h3>
              <p style={{ fontSize: '0.85rem', color: '#666', lineHeight: 1.8 }}>{p.body}</p>
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '1.8rem', color: '#FF3131', fontWeight: 700, marginTop: 24 }}>{p.stat}</div>
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.6rem', color: '#444', letterSpacing: '1px', marginTop: 4 }}>{p.statLabel}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CASE STUDY */}
      <section style={{ padding: '112px 48px', background: '#050505' }}>
        <SectionLabel>02 — Real-World Case Study</SectionLabel>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 80 }}>
          <div>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(3rem, 5vw, 5rem)', lineHeight: 0.95, letterSpacing: '1px', marginBottom: 24 }}>
              GILI<br /><span style={{ color: '#C8F135' }}>KETAPANG</span><br />ISLAND
            </h2>
            {[
              'A small island in East Java with ~1,800 electricity customers. Entirely dependent on diesel generation. PLN Nusantara Power has already started a hydrogen fuel cell pilot here — a clear signal that the old system is not sustainable.',
              'This is not unique to Gili Ketapang. It is the template for 17,000 Indonesian islands — and millions of communities worldwide that lack fair, transparent energy access.',
              'The physical infrastructure for renewable energy exists. What\'s missing is the settlement layer — a trustless system for trading, billing, and verifying energy transactions without intermediaries.',
            ].map((t, i) => (
              <p key={i} style={{ fontSize: '0.85rem', color: '#666', lineHeight: 1.9, marginBottom: 16 }}>{t}</p>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {caseData.map((row) => (
              <div
                key={row.label}
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', background: '#111', borderLeft: '3px solid transparent', fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.78rem', transition: 'border-color 0.2s' }}
                onMouseEnter={(e) => (e.currentTarget.style.borderLeftColor = '#C8F135')}
                onMouseLeave={(e) => (e.currentTarget.style.borderLeftColor = 'transparent')}
              >
                <span style={{ color: '#444' }}>{row.label}</span>
                <span style={{ fontWeight: 500, color: row.type === 'bad' ? '#FF3131' : row.type === 'good' ? '#C8F135' : '#F0EDE6' }}>
                  {row.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SOLUTION */}
      <section style={{ padding: '112px 48px', background: '#C8F135', color: '#050505' }}>
        <SectionLabel light>03 — The Solution</SectionLabel>
        <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(4rem, 8vw, 8rem)', lineHeight: 0.9, letterSpacing: '2px', color: '#050505', marginBottom: 64 }}>
          ACE<br />BLITZ.
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
          {solutions.map((s) => (
            <div
              key={s.num}
              style={{ padding: 40, background: 'rgba(0,0,0,0.08)', transition: 'background 0.2s' }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(0,0,0,0.12)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(0,0,0,0.08)')}
            >
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '4rem', color: 'rgba(0,0,0,0.15)', lineHeight: 1, marginBottom: 16 }}>{s.num}</div>
              <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.6rem', letterSpacing: '1px', color: '#050505', marginBottom: 12 }}>{s.title}</h3>
              <p style={{ fontSize: '0.82rem', color: 'rgba(0,0,0,0.6)', lineHeight: 1.8 }}>{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding: '112px 48px', background: '#111', borderTop: '1px solid #1a1a1a' }}>
        <SectionLabel>04 — How It Works</SectionLabel>
        <div style={{ display: 'flex', overflowX: 'auto', marginTop: 48 }}>
          {steps.map((s, i) => (
            <div
              key={s.num}
              style={{ flex: 1, padding: 40, position: 'relative', minWidth: 180, background: '#050505', borderRight: i < steps.length - 1 ? '1px solid #1a1a1a' : 'none' }}
            >
              {i < steps.length - 1 && (
                <span style={{ position: 'absolute', right: -14, top: '50%', transform: 'translateY(-50%)', color: '#C8F135', fontSize: '1.2rem', background: '#050505', padding: '4px', zIndex: 10 }}>→</span>
              )}
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.6rem', color: '#C8F135', letterSpacing: '2px', marginBottom: 16 }}>{s.num}</div>
              <h4 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.4rem', letterSpacing: '1px', marginBottom: 12 }}>{s.title}</h4>
              <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.68rem', color: '#555', lineHeight: 1.7 }}>{s.body}</p>
              <div style={{ marginTop: 20, fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.6rem', color: '#8aaa1f', letterSpacing: '1px', borderTop: '1px solid #1a1a1a', paddingTop: 12 }}>{s.actor}</div>
            </div>
          ))}
        </div>
      </section>

      {/* WHY MONAD */}
      <section style={{ padding: '112px 48px', background: '#050505' }}>
        <SectionLabel>05 — Why Monad</SectionLabel>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.78rem', marginTop: 48 }}>
          <thead>
            <tr>
              {['Feature', 'Ethereum L1', 'Monad ⚡', 'Impact on ACEBlitz'].map((h) => (
                <th key={h} style={{ textAlign: 'left', padding: '16px 24px', color: '#444', letterSpacing: '2px', fontSize: '0.62rem', textTransform: 'uppercase', borderBottom: '1px solid #1a1a1a' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {compareRows.map((row) => (
              <tr
                key={row.feature}
                style={{ transition: 'background 0.2s' }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#0a0a0a')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                <td style={{ padding: '20px 24px', borderBottom: '1px solid #111', color: '#F0EDE6' }}>{row.feature}</td>
                <td style={{ padding: '20px 24px', borderBottom: '1px solid #111', color: row.bothGood ? '#C8F135' : '#FF3131' }}>{row.eth}</td>
                <td style={{ padding: '20px 24px', borderBottom: '1px solid #111', color: '#C8F135', background: 'rgba(200,241,53,0.03)' }}>{row.monad}</td>
                <td style={{ padding: '20px 24px', borderBottom: '1px solid #111', color: '#666' }}>{row.impact}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ marginTop: 48, padding: 32, background: '#111', borderLeft: '3px solid #C8F135', fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.8rem', color: '#666', lineHeight: 1.8 }}>
          On Ethereum, 1,800 households sending meter data every minute = $2–20 × 1,800 × 60 × 24 =&nbsp;
          <span style={{ color: '#FF3131' }}>millions of dollars per day in gas alone.</span><br />
          On Monad, the same workload costs&nbsp;
          <span style={{ color: '#C8F135' }}>near-zero.</span>&nbsp;
          P2P energy trading at community scale is only possible because of Monad.
        </div>
      </section>

      {/* CTA */}
      <section style={{ textAlign: 'center', padding: '160px 48px', position: 'relative', overflow: 'hidden', background: '#050505', borderTop: '1px solid #1a1a1a' }}>
        <span style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontFamily: "'Bebas Neue', sans-serif", fontSize: '20vw', color: '#0a0a0a', whiteSpace: 'nowrap', letterSpacing: '4px', userSelect: 'none', pointerEvents: 'none' }}>
          ACEBLITZ
        </span>
        <h2 style={{ position: 'relative', fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(3rem, 6vw, 6rem)', letterSpacing: '2px', lineHeight: 1, marginBottom: 24 }}>
          ENERGY BY THE<br />PEOPLE, FOR<br />THE PEOPLE.
        </h2>
        <p style={{ position: 'relative', fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.8rem', color: '#555', maxWidth: 480, margin: '0 auto 48px', lineHeight: 1.8 }}>
          ACEBlitz is not just a marketplace. It is a transparent energy settlement infrastructure for Indonesia — starting from Gili Ketapang, scalable to 17,000 islands.
        </p>
        <Link
          href="/marketplace"
          style={{ position: 'relative', display: 'inline-block', background: '#C8F135', color: '#050505', fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.2rem', letterSpacing: '3px', padding: '18px 48px', textDecoration: 'none', transition: 'all 0.2s' }}
          onMouseEnter={(e) => { e.currentTarget.style.background = '#F0EDE6'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = '#C8F135'; e.currentTarget.style.transform = 'translateY(0)'; }}
        >
          SEE LIVE DEMO →
        </Link>
      </section>

      {/* FOOTER */}
      <footer style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '32px 48px', borderTop: '1px solid #1a1a1a', fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.65rem', color: '#444' }}>
        <span>© 2026 ACEBlitz — Anti-Corruption Energy Blitz</span>
        <span>Built on Monad · Monad Blitz Jogja 2026</span>
      </footer>
    </div>
  );
}

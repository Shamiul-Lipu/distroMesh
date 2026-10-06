import Link from 'next/link';
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Building2,
  ChartNoAxesCombined,
  CircleHelp,
  FileCheck2,
  FileText,
  GitBranch,
  Layers3,
  ReceiptText,
  Wallet,
} from 'lucide-react';

const portfolioCards = [
  { name: 'Unilever Distribution', place: 'Sherpur · Bogura', label: 'Review signal', tone: 'amber' },
  { name: 'Pureit Product Distribution', place: 'Bogura', label: 'Data available', tone: 'green' },
  { name: 'Sherpur Trade Distribution', place: 'Sherpur', label: 'Workspace ready', tone: 'slate' },
];

const valueCards = [
  {
    icon: Layers3,
    number: '01',
    title: 'One portfolio view',
    description: 'See businesses together, compare a focused set, and understand where information is available across the portfolio.',
  },
  {
    icon: Building2,
    number: '02',
    title: 'Separate business workspaces',
    description: 'Open one business at a time and keep its transactions, invoices, expenses, and operating context distinct.',
  },
  {
    icon: Activity,
    number: '03',
    title: 'A clearer place to investigate',
    description: 'Use sample movement, invoice flags, and operating indicators as prompts to look closer—not as automatic conclusions.',
  },
  {
    icon: GitBranch,
    number: '04',
    title: 'Connected businesses',
    description: 'Understand links between distributors, product lines, and retail partners without combining their records.',
  },
];

const coreFeatures = [
  {
    icon: ChartNoAxesCombined,
    title: 'Portfolio overview',
    description: 'Start with the businesses you oversee and scan the measures that have information available.',
    className: 'md:col-span-2',
  },
  {
    icon: Building2,
    title: 'Business workspaces',
    description: 'Move into a business-specific view without losing the bigger picture.',
    className: '',
  },
  {
    icon: GitBranch,
    title: 'Connected businesses',
    description: 'Keep partner relationships visible while every business retains its own activity.',
    className: '',
  },
  {
    icon: Activity,
    title: 'Sales & operations',
    description: 'Review illustrative sales movement and operating indicators that help frame the next question.',
    className: 'md:col-span-2',
  },
];

const supportingFeatures = [
  { icon: ReceiptText, label: 'Transactions' },
  { icon: FileText, label: 'Invoices' },
  { icon: Wallet, label: 'Expenses & cash flow' },
  { icon: FileCheck2, label: 'Alerts & tasks' },
  { icon: CircleHelp, label: 'Business questions' },
];

function BrandMark({ inverse = false }: { inverse?: boolean }) {
  return (
    <Link
      href="/"
      aria-label="distroMesh home"
      className={`inline-flex items-center gap-2.5 rounded-lg ${inverse ? 'text-white' : 'text-[#1d3029]'}`}
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#087e63] text-white">
        <Building2 size={18} strokeWidth={2} />
      </span>
      <span className="text-[17px] font-semibold tracking-[-0.04em]">distroMesh</span>
    </Link>
  );
}

function PortfolioPreview() {
  return (
    <div className="relative mx-auto w-full max-w-[650px]">
      <div className="absolute -inset-5 -z-10 rounded-[2rem] bg-[#dfece5]/70 blur-2xl" />
      <div className="overflow-hidden rounded-[1.4rem] border border-[#dce7e1] bg-white shadow-[0_28px_80px_-35px_rgba(26,67,49,0.35)]">
        <div className="flex h-11 items-center gap-2 border-b border-[#e8eeeb] bg-[#fbfcfb] px-4">
          <span className="h-2 w-2 rounded-full bg-[#d7e2dc]" />
          <span className="h-2 w-2 rounded-full bg-[#d7e2dc]" />
          <span className="h-2 w-2 rounded-full bg-[#d7e2dc]" />
          <div className="ml-auto flex items-center gap-1.5 rounded-full bg-[#fff5e7] px-2.5 py-1 text-[9px] font-semibold text-[#94651c]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#d49a37]" />
            Illustrative demo
          </div>
        </div>

        <div className="grid min-h-[390px] grid-cols-[112px_minmax(0,1fr)] sm:grid-cols-[142px_minmax(0,1fr)]">
          <aside className="bg-[#101c1b] px-3 py-4 text-white sm:px-4">
            <div className="mb-7 flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#087e63]">
                <Building2 size={14} />
              </span>
              <span className="hidden text-[10px] font-semibold sm:block">distroMesh</span>
            </div>
            <div className="mb-2 px-2 text-[8px] font-semibold uppercase tracking-[0.12em] text-[#82928b]">Workspace</div>
            <div className="flex items-center gap-2 rounded-lg bg-white/[0.09] px-2 py-2 text-[9px] font-medium text-[#c7e7d9]">
              <Layers3 size={12} /> <span className="truncate">All businesses</span>
            </div>
            <div className="mt-2 space-y-1 pl-2">
              {['Overview', 'Sales & operations', 'Connected businesses'].map((label) => (
                <div key={label} className="truncate rounded-md px-2 py-1.5 text-[8px] text-[#92a19a]">{label}</div>
              ))}
            </div>
            <div className="mb-2 mt-6 px-2 text-[8px] font-semibold uppercase tracking-[0.12em] text-[#82928b]">Daily work</div>
            {['Transactions', 'Invoices', 'Expenses'].map((label) => (
              <div key={label} className="truncate rounded-md px-2 py-1.5 text-[8px] text-[#92a19a]">{label}</div>
            ))}
          </aside>

          <div className="min-w-0 bg-[#f7f9f8] p-3 sm:p-5">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <div className="text-[8px] font-medium uppercase tracking-[0.1em] text-[#84918a]">Portfolio</div>
                <h2 className="mt-1 text-[17px] font-semibold tracking-[-0.04em] text-[#23332c] sm:text-[21px]">All businesses</h2>
                <p className="mt-0.5 text-[9px] text-[#7b8982]">A starting point for your next review</p>
              </div>
              <span className="rounded-full border border-[#e5ebe8] bg-white px-2 py-1 text-[8px] font-medium text-[#78857f]">5 workspaces</span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {[
                ['Sales', 'Available'],
                ['Cash', 'Partial'],
                ['Receivables', 'Partial'],
                ['Profit', 'Data needed'],
              ].map(([label, value]) => (
                <div key={label} className="rounded-xl border border-[#e6ece9] bg-white p-2.5">
                  <div className="text-[8px] text-[#87938d]">{label}</div>
                  <div className={`mt-1 text-[10px] font-semibold ${value === 'Data needed' ? 'text-[#89958f]' : 'text-[#35463e]'}`}>{value}</div>
                </div>
              ))}
            </div>

            <div className="mt-3 rounded-xl border border-[#e6ece9] bg-white p-3">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <div className="text-[10px] font-semibold text-[#33443b]">Business portfolio</div>
                  <div className="mt-0.5 text-[8px] text-[#8a9690]">Select a workspace to investigate</div>
                </div>
                <span className="rounded-full bg-[#f1f5f3] px-2 py-1 text-[8px] text-[#6e7b74]">Compare up to 4</span>
              </div>
              <div className="mt-2 space-y-1.5">
                {portfolioCards.map((business) => (
                  <div key={business.name} className="flex min-w-0 items-center gap-2 rounded-lg border border-[#edf1ef] px-2.5 py-2">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#edf5f0] text-[#27765b]">
                      <Building2 size={13} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[9px] font-semibold text-[#3b4a42]">{business.name}</span>
                      <span className="block truncate text-[8px] text-[#8b9791]">{business.place}</span>
                    </span>
                    <span className={`hidden shrink-0 rounded-full px-2 py-1 text-[7px] font-medium sm:inline-flex ${
                      business.tone === 'amber' ? 'bg-[#fff5e7] text-[#95691f]'
                        : business.tone === 'green' ? 'bg-[#eaf5ef] text-[#287353]'
                          : 'bg-[#f1f4f2] text-[#74817a]'
                    }`}>{business.label}</span>
                    <ArrowUpRight size={12} className="shrink-0 text-[#9aa59f]" />
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-3 flex items-center gap-2 rounded-xl border border-[#f0e7d5] bg-[#fffaf2] px-3 py-2.5">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#f8efd9] text-[#9b701f]">
                <BadgeCheck size={12} />
              </span>
              <span className="min-w-0">
                <span className="block text-[8px] font-semibold text-[#6e572c]">A review prompt, not a conclusion</span>
                <span className="block truncate text-[8px] text-[#9a8660]">Illustrative sales movement · open a business to investigate</span>
              </span>
              <ArrowRight size={12} className="ml-auto shrink-0 text-[#a1844c]" />
            </div>
          </div>
        </div>
      </div>
      <div className="absolute -bottom-4 right-4 hidden items-center gap-2 rounded-xl border border-[#e2ebe5] bg-white px-3 py-2 shadow-lg sm:flex">
        <GitBranch size={14} className="text-[#087e63]" />
        <span className="text-[9px] font-medium text-[#52635a]">Relationships stay connected, records stay separate</span>
      </div>
    </div>
  );
}

export function DistroMeshLanding() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#fbfcfb] text-[#1d3029]">
      <header className="relative z-10 border-b border-[#e8eeeb] bg-white/90">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 sm:px-8">
          <BrandMark />
          <nav aria-label="Main navigation" className="hidden items-center gap-7 md:flex">
            <Link href="#how-it-works" className="text-[13px] font-medium text-[#64736b] transition hover:text-[#087e63]">How it works</Link>
            <Link href="#capabilities" className="text-[13px] font-medium text-[#64736b] transition hover:text-[#087e63]">Capabilities</Link>
            <Link href="#data-transparency" className="text-[13px] font-medium text-[#64736b] transition hover:text-[#087e63]">Data &amp; demo</Link>
          </nav>
          <Link href="/businesses" className="accounting-focus inline-flex h-10 items-center gap-2 rounded-xl bg-[#087e63] px-4 text-[12px] font-semibold text-white shadow-sm transition hover:bg-[#086d56]">
            Open distroMesh <ArrowRight size={15} />
          </Link>
        </div>
      </header>

      <section className="relative border-b border-[#e9efec]">
        <div className="pointer-events-none absolute -right-32 -top-48 h-[470px] w-[470px] rounded-full bg-[#e8f2ec] blur-3xl" />
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[0.87fr_1.13fr] lg:gap-10 lg:py-24">
          <div className="relative z-[1] max-w-[540px]">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#dce9e1] bg-white/80 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.11em] text-[#28765b]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#15815f]" />
              Multi-business distribution management
            </div>
            <h1 className="text-[43px] font-semibold leading-[1.05] tracking-[-0.055em] text-[#1d3029] sm:text-[56px] lg:text-[61px]">
              See every business. <span className="text-[#087e63]">Know where to look next.</span>
            </h1>
            <p className="mt-6 max-w-[480px] text-[15px] leading-7 text-[#64736b] sm:text-[16px]">
              distroMesh brings your distribution businesses into one workspace so you can scan the portfolio, investigate what needs attention, and work inside each business without mixing their activity.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/businesses" className="accounting-focus inline-flex h-12 items-center gap-2 rounded-xl bg-[#087e63] px-5 text-[13px] font-semibold text-white shadow-[0_8px_22px_-10px_rgba(8,126,99,0.65)] transition hover:-translate-y-0.5 hover:bg-[#086d56]">
                Open distroMesh <ArrowRight size={16} />
              </Link>
              <Link href="#how-it-works" className="accounting-focus inline-flex h-12 items-center gap-2 rounded-xl border border-[#dce6e1] bg-white px-5 text-[13px] font-semibold text-[#43554b] transition hover:border-[#b8d1c3] hover:bg-[#f6faf7]">
                Explore how it works
              </Link>
            </div>
            <p className="mt-5 text-[10px] leading-5 text-[#84918a]">A working prototype with illustrative examples—not verified financial or operational records.</p>
          </div>
          <PortfolioPreview />
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-5 px-5 py-16 sm:px-8 sm:py-20 md:grid-cols-[0.8fr_1.2fr] md:items-end">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[#358367]">The day-to-day challenge</p>
          <h2 className="mt-3 max-w-[440px] text-[30px] font-semibold leading-tight tracking-[-0.045em] text-[#24362e] sm:text-[38px]">
            Managing multiple businesses shouldn’t mean chasing disconnected information.
          </h2>
        </div>
        <div className="max-w-[620px] md:justify-self-end">
          <p className="text-[14px] leading-7 text-[#69776f]">
            Owners and operators move between sales, invoices, expenses, cash flow, operations, partners, and follow-ups. The hard part is knowing which business to open, what changed, and what is worth investigating next.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {['Businesses', 'Sales', 'Invoices', 'Expenses', 'Cash flow', 'Operations', 'Partners', 'Follow-ups'].map((item) => (
              <span key={item} className="rounded-full border border-[#e2eae5] bg-white px-3 py-1.5 text-[10px] font-medium text-[#65746b]">{item}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-[#e8eeeb] bg-[#f4f8f5]">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20">
          <div className="max-w-[620px]">
            <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[#358367]">One connected workflow</p>
            <h2 className="mt-3 text-[30px] font-semibold tracking-[-0.045em] text-[#24362e] sm:text-[38px]">A better starting point for the next decision.</h2>
            <p className="mt-3 text-[14px] leading-7 text-[#69776f]">Bring the overview and the everyday work together, while preserving each business’s own context.</p>
          </div>
          <div className="mt-9 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {valueCards.map(({ icon: Icon, number, title, description }) => (
              <article key={title} className="rounded-2xl border border-[#e3ebe6] bg-white p-5 shadow-[0_8px_24px_-22px_rgba(29,48,41,0.3)]">
                <div className="flex items-center justify-between">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#edf5f0] text-[#267859]"><Icon size={18} /></span>
                  <span className="font-mono text-[10px] text-[#a0aca5]">{number}</span>
                </div>
                <h3 className="mt-5 text-[14px] font-semibold text-[#293a32]">{title}</h3>
                <p className="mt-2 text-[12px] leading-6 text-[#718078]">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="scroll-mt-8 mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20">
        <div className="max-w-[600px]">
          <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[#358367]">How it works</p>
          <h2 className="mt-3 text-[30px] font-semibold tracking-[-0.045em] text-[#24362e] sm:text-[38px]">From portfolio scan to focused follow-through.</h2>
        </div>
        <div className="relative mt-10 grid gap-7 md:grid-cols-3 md:gap-8">
          <div className="absolute left-[16%] right-[16%] top-6 hidden border-t border-dashed border-[#b9d2c3] md:block" />
          {[
            ['01', 'Scan the portfolio', 'Start with All businesses and see which information is available across the portfolio.'],
            ['02', 'Open the business', 'Choose the business that needs a closer look and enter its dedicated workspace.'],
            ['03', 'Follow the work', 'Move into sales & operations, transactions, invoices, expenses, cash flow, alerts, or connections.'],
          ].map(([number, title, description]) => (
            <article key={number} className="relative rounded-2xl border border-[#e5ece8] bg-white p-5 sm:p-6">
              <span className="relative z-[1] flex h-12 w-12 items-center justify-center rounded-2xl border border-[#d5e7dc] bg-[#f1f7f3] text-[12px] font-semibold text-[#28765b]">{number}</span>
              <h3 className="mt-5 text-[15px] font-semibold text-[#293a32]">{title}</h3>
              <p className="mt-2 text-[12px] leading-6 text-[#718078]">{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="capabilities" className="scroll-mt-8 border-y border-[#e8eeeb] bg-white">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div className="max-w-[600px]">
              <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[#358367]">Inside distroMesh</p>
              <h2 className="mt-3 text-[30px] font-semibold tracking-[-0.045em] text-[#24362e] sm:text-[38px]">The important work, in its proper context.</h2>
            </div>
            <p className="max-w-[370px] text-[12px] leading-6 text-[#718078]">Portfolio, investigation, and business context come first. Everyday tools support the work around them.</p>
          </div>
          <div className="mt-9 grid gap-3 md:grid-cols-3">
            {coreFeatures.map(({ icon: Icon, title, description, className }) => (
              <article key={title} className={`rounded-2xl border border-[#e4ebe7] bg-[#fbfcfb] p-5 sm:p-6 ${className}`}>
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#edf5f0] text-[#267859]"><Icon size={18} /></span>
                <h3 className="mt-5 text-[14px] font-semibold text-[#293a32]">{title}</h3>
                <p className="mt-2 max-w-[430px] text-[12px] leading-6 text-[#718078]">{description}</p>
              </article>
            ))}
          </div>
          <div className="mt-8">
            <h3 className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#829088]">Supporting tools</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {supportingFeatures.map(({ icon: Icon, label }) => (
                <span key={label} className="inline-flex items-center gap-2 rounded-xl border border-[#e5ece8] bg-white px-3.5 py-2.5 text-[11px] font-medium text-[#59685f]">
                  <Icon size={14} className="text-[#4c8a6d]" /> {label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="data-transparency" className="scroll-mt-8 mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20">
        <div className="grid gap-8 rounded-[1.6rem] border border-[#dfe9e3] bg-[#f1f7f3] p-6 sm:p-9 md:grid-cols-[0.8fr_1.2fr] md:items-center">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[#358367]">Clear about the data</p>
            <h2 className="mt-3 max-w-[360px] text-[28px] font-semibold leading-tight tracking-[-0.045em] text-[#24362e] sm:text-[34px]">Know what the numbers mean.</h2>
          </div>
          <div>
            <p className="text-[13px] leading-7 text-[#62736a]">
              This is a prototype, so some figures are illustrative examples. “Not available” means information is missing—not zero. Portfolio totals may have incomplete coverage, and review signals are prompts to investigate, not proof of a problem.
            </p>
            <p className="mt-3 text-[11px] leading-6 text-[#77877e]">
              The current demo is not connected to banks, accounting systems, inventory, order, or delivery systems. Business changes are local to the current browser session.
            </p>
          </div>
        </div>
      </section>

      <section className="px-5 pb-16 sm:px-8 sm:pb-20">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 rounded-[1.6rem] bg-[#10221d] px-6 py-9 text-white sm:px-10 sm:py-11 md:flex-row md:items-center">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[#91c9aa]">Start with the portfolio</p>
            <h2 className="mt-3 max-w-[620px] text-[28px] font-semibold leading-tight tracking-[-0.045em] sm:text-[36px]">Find the business that needs your attention.</h2>
            <p className="mt-3 max-w-[560px] text-[12px] leading-6 text-[#b5c6bd]">Get a clearer starting point for managing multiple distribution businesses—without mixing their records together.</p>
          </div>
          <Link href="/businesses" className="accounting-focus inline-flex h-12 shrink-0 items-center gap-2 rounded-xl bg-[#58b58a] px-5 text-[12px] font-semibold text-[#10221d] transition hover:bg-[#77c59f]">
            Open distroMesh <ArrowRight size={15} />
          </Link>
        </div>
      </section>

      <footer className="border-t border-[#e8eeeb] bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-7 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <div>
            <BrandMark />
            <p className="mt-2 max-w-[360px] text-[10px] leading-5 text-[#839088]">A workspace for reviewing and investigating multiple distribution businesses. Demo information is illustrative.</p>
          </div>
          <Link href="/businesses" className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#28765b] hover:text-[#086d56]">
            Open the dashboard <ArrowRight size={13} />
          </Link>
        </div>
      </footer>
    </main>
  );
}

import Link from 'next/link';
import { ArrowLeft, Building2 } from 'lucide-react';

export default function BusinessSectionNotFound() {
  return (
    <main className="accounting-app flex min-h-screen items-center justify-center px-5 py-16">
      <section className="glass-card w-full max-w-lg rounded-3xl p-8 text-center sm:p-10">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e9f5f0] text-[#087e63]">
          <Building2 size={22} />
        </span>
        <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#358367]">Page not found</p>
        <h1 className="mt-2 text-[26px] font-semibold tracking-[-0.04em] text-[#23332c]">This workspace page does not exist.</h1>
        <p className="mx-auto mt-3 max-w-sm text-[13px] leading-6 text-[#718078]">
          Check the address or return to the portfolio to choose a business and workspace section.
        </p>
        <Link href="/businesses" className="accounting-focus mt-6 inline-flex h-11 items-center gap-2 rounded-xl bg-[#087e63] px-4 text-[12px] font-semibold text-white hover:bg-[#086d56]">
          <ArrowLeft size={15} /> Return to all businesses
        </Link>
      </section>
    </main>
  );
}

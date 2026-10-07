'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import {
  ArrowRight,
  ShieldCheck,
  Building2,
  Wallet,
  Navigation,
  Truck,
  Lock,
  Monitor,
  CheckCircle2,
  Clock,
  Layers,
  SlidersHorizontal,
  ChevronRight,
  Sun,
  Moon,
  Sparkles,
  Gauge,
  Receipt,
  Store,
  Zap,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import {
  LiquidityRunwayPreview,
  TrappedCapitalPreview,
  DispatchRunwayPreview,
  RouteSettlementPreview,
  DecisionDockPreview,
  HeroCockpitPreview,
} from './previews';

const FEATURE_TAB_IDS = ['liquidity', 'capital', 'dispatch', 'settlement', 'decision'] as const;
type FeatureTabId = (typeof FEATURE_TAB_IDS)[number];

const CINEMATIC_EASE = [0.4, 0, 0.2, 1] as const;

export function DistroMeshLanding() {
  const { theme, toggleTheme } = useTheme();
  const [banglaMode, setBanglaMode] = useState(true);
  const [activeFeatureTab, setActiveFeatureTab] = useState<FeatureTabId>('liquidity');
  const [isFeaturePaused, setIsFeaturePaused] = useState(false);

  const featuresRef = useRef<HTMLElement>(null);
  const isFeaturesInView = useInView(featuresRef, { amount: 0.1 });
  const featurePauseTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Balanced 5.0s cadence: gives 1.5s initial scan + 3.5s for absorption of resolved metrics
  const ZONE_DURATION_MS = 5000;

  // Viewport-triggered self-running auto-cycling through the 5 operational zones
  useEffect(() => {
    if (!isFeaturesInView || isFeaturePaused) return;

    const timer = setInterval(() => {
      setActiveFeatureTab((prev) => {
        const nextIdx = (FEATURE_TAB_IDS.indexOf(prev) + 1) % FEATURE_TAB_IDS.length;
        return FEATURE_TAB_IDS[nextIdx];
      });
    }, ZONE_DURATION_MS);

    return () => clearInterval(timer);
  }, [isFeaturesInView, isFeaturePaused]);

  const handleFeatureTabClick = (tabId: FeatureTabId) => {
    setActiveFeatureTab(tabId);
    setIsFeaturePaused(true);
    if (featurePauseTimeoutRef.current) clearTimeout(featurePauseTimeoutRef.current);
    // Resumes auto-cycle after 8s of user inactivity
    featurePauseTimeoutRef.current = setTimeout(() => setIsFeaturePaused(false), 8000);
  };

  const featureTabs = [
    {
      id: 'liquidity' as const,
      title: banglaMode ? 'লিকুইডিটি রানওয়ে' : 'Liquidity Runway',
      subtitle: banglaMode ? 'ব্যাংক বনাম ভল্ট ক্যাশ' : 'Bank vs Vault Cash',
      icon: Wallet,
      tag: 'ZONE 01',
      headline: banglaMode
        ? 'কোম্পানির ৪৮ ঘণ্টার ব্যাংক অটো-ডেবিটের প্রস্তুতি'
        : 'Keep Your Bank Ready for the Company\'s 48-Hour Auto-Debit',
      description: banglaMode
        ? 'ইউনিলিভার প্রতি ৪৮ ঘণ্টায় নতুন মালের জন্য ব্যাংক থেকে টাকা কেটে নেয়। ব্যাংকে কত ব্যালেন্স আছে আর ডিপোর ভল্ট সিন্দুকে কত ক্যাশ পড়ে আছে তা আলাদা জানুন, যাতে চেক বাউন্স বা সাপ্লাই বন্ধ না হয়।'
        : 'The principal auto-debits your bank account every 48 hours for stock shipments. Know exactly how much clearing cash is in your bank versus cash sitting in your depot safe, preventing bounced supplier debits.',
      bullets: [
        banglaMode ? 'ভল্ট সিন্দুকের ক্যাশ ও ব্যাংক ব্যালেন্স আলাদা ট্র্যাকিং' : 'Separates physical depot safe cash from clearing bank balance',
        banglaMode ? '৪৮ ঘণ্টার মধ্যে ৳৫৪.০ লাখ ব্যাংক ডেবিটের হিসাব' : 'Tracks upcoming ৳54.0L company auto-debit before bank cutoffs',
        banglaMode ? '২.১৭ গুণ ক্যাশ কাভার রেশিওতে সাপ্লাইয়ের নিরাপত্তা' : 'Real-time 2.17× liquidity coverage ratio against supply halts',
      ],
      image: '/screenshots/war_room_overview.png',
      badgeText: '৳16,95,200 Liquid Cash · 2.17× Cover',
    },
    {
      id: 'capital' as const,
      title: banglaMode ? 'আটকে থাকা মূলধন' : 'Trapped Capital',
      subtitle: banglaMode ? 'বাজারের বাকি ও গুদাম স্টক' : 'Market Credit & Stock',
      icon: Layers,
      tag: 'ZONE 02',
      headline: banglaMode
        ? 'বাজারে আটকে থাকা বাকি টাকা ও গুদাম স্টকের স্পষ্ট হিসাব'
        : 'Visibility Over ৳1.97 Cr in Market Credit & ৳1.54 Cr in Warehouse Stock',
      description: banglaMode
        ? 'আপনার নিজস্ব কোটি টাকার মূলধন ৭০০ খুচরা মুদি দোকানে ছড়িয়ে আছে। ৩০ দিনের বেশি পুরনো বকেয়া চিহ্নিত করুন এবং টাকা আটকে যাওয়ার আগেই এক ক্লিকে সেই দোকানে নতুন মাল বাকিতে দেওয়া বন্ধ করুন।'
        : 'Your own business capital is exposed across 700 retail grocery shops. Automatically isolate credit aging past 30 days and execute One-Tap credit freezes before unauthorized credit causes cash defaults.',
      bullets: [
        banglaMode ? '১৮% অতি-বকেয়া বাকী শনাক্তকরণ (>৩০ দিন)' : 'Flags 18.0% overdue retailer credit stuck past 30 days',
        banglaMode ? 'এক ক্লিকে বাকি খাতা লক করার সুবিধা' : 'One-Tap credit lock prevents drivers from extending fresh credit',
        banglaMode ? 'কোম্পানির কাছে পাওনা ৳২.০৫ লাখ স্কিম ক্লেইম অডিট' : 'Audits ৳2.05L in pending trade scheme claims owed by the principal',
      ],
      image: '/screenshots/trapped_capital_runway.png',
      badgeText: '৳1.97 Cr Receivables · 18% Overdue >30D',
    },
    {
      id: 'dispatch' as const,
      title: banglaMode ? 'ডেসপ্যাচ রানওয়ে' : 'Dispatch Runway',
      subtitle: banglaMode ? 'সকালের ভ্যান ছাড়ার অডিট' : 'Morning Van Departures',
      icon: Truck,
      tag: 'ZONE 03',
      headline: banglaMode
        ? 'ডেলিভারি ভ্যান সকাল ৯টায় সময়মতো ছাড়ার তদারকি'
        : 'Ensure Loaded Delivery Fleet Leaves Depot by 09:00 AM',
      description: banglaMode
        ? 'চালান প্রিন্টিং বা লোডিংয়ে দেরি হলে ড্রাইভার ও ডেলিভারিম্যানরা ইয়ার্ডে বসে থাকে। ভ্যান ছাড়তে আড়াই ঘণ্টা (+১৬৫ মিনিট) দেরি হলে লেবারের যে টাকা জলে যায় তা তাৎক্ষণিক সামনে আসে।'
        : 'When memo printing or loading stalls, delivery crews sit idle in your depot yard. Pinpoint yard departure stalls in real time and calculate the exact idle labor crew cost.',
      bullets: [
        banglaMode ? 'সকল ডেলিভারি রুটের সকালের ভ্যান ছাড়ার সময়সূচি' : 'Depot departure timeline across all delivery beats',
        banglaMode ? 'ডেসপ্যাচ স্টল (+১৬৫ মিনিট বিলম্ব) সাথে সাথে শনাক্ত' : 'Catches departure stalls (+165 min delay) before route hours are lost',
        banglaMode ? 'ইয়ার্ড জ্যামের কারণে অলস লেবার খরচ (৳৪,৯৫০) পরিমাপ' : 'Calculates idle labor crew cost (৳4,950) from yard bottlenecks',
      ],
      image: '/screenshots/war_room_at_top_1791354223522.png',
      badgeText: 'Active Fleet Radar · 09:00 AM Target',
    },
    {
      id: 'settlement' as const,
      title: banglaMode ? 'রুট সেটেলমেন্ট' : 'Route Settlement',
      subtitle: banglaMode ? 'সন্ধ্যায় ড্রাইভার ক্যাশ মেলানো' : 'Driver Till Reconciliation',
      icon: Navigation,
      tag: 'ZONE 04',
      headline: banglaMode
        ? 'ভ্যান ফেরার পর ড্রাইভারের ক্যাশ শর্টেজ ১৫ সেকেন্ডে শনাক্ত'
        : 'Catch Driver Cash Shortages in 15 Seconds at the Cashier Window',
      description: banglaMode
        ? 'সন্ধ্যায় ভ্যান ফিরলে ক্যাশিয়ারের কাছে জমা দেওয়া টাকার সাথে বিক্রি ও পুরোনো বাকি আদায় মেলানো হয়। ড্রাইভারের ক্যাশে কোনো ঘাটতি (যেমন −৳৪০০) থাকলে স্টাফ বাড়ি যাওয়ার আগেই তা ধরা পড়ে।'
        : 'When vans return at dusk, physical cash handed in must match delivered sales and collected dues. Any till shortage (like −৳400) is flagged instantly on the spot before staff depart.',
      bullets: [
        banglaMode ? '৭০০ খুচরা দোকানের ড্রপ-বাই-ড্রপ বিক্রির হিসাব' : 'Drop-level sales audit across 700 retail grocery shops',
        banglaMode ? 'ড্রাইভারের ক্যাশ ঘাটতি (−৳৪০০) তাৎক্ষণিক নোটিশ' : 'Instant detection of driver cash shortage (−৳400 till variance)',
        banglaMode ? 'এক ক্লিকে ড্রাইভারের বেতন থেকে শর্টেজ সমন্বয়' : 'One-click wage deduction protocol stops distributor cash leakages',
      ],
      image: '/screenshots/route_settlement.png',
      badgeText: 'All Routes Audited · 1 Shortage (−৳400)',
    },
    {
      id: 'decision' as const,
      title: banglaMode ? 'মালিকের অ্যাকশন ডক' : 'Owner Action Dock',
      subtitle: banglaMode ? 'তাৎক্ষণিক সিদ্ধান্ত ও কন্ট্রোল' : 'State-Mutating Controls',
      icon: SlidersHorizontal,
      tag: 'ZONE 05',
      headline: banglaMode
        ? 'মালিকের সরাসরি নিয়ন্ত্রণ: ক্রেডিট লক, ব্যাংক জমা ও ঝুঁকি টেস্ট'
        : 'High-Confidence Owner Controls: Credit Locks & Bank Staging',
      description: banglaMode
        ? 'মালিক হিসেবে নিজের ব্যবসার গুরুত্বপূর্ণ সিদ্ধান্ত এক ক্লিকে নিন: ঋণখেলাপি দোকানে বাকি দেওয়া বন্ধ করুন, ভল্ট ক্যাশ ব্যাংকে পাঠান, শর্টেজ কর্তন করুন এবং কালেকশন কম হলে কী হবে তা টেস্ট করুন।'
        : 'Execute critical ownership decisions with instant verification: freeze credit on defaulting shops, stage vault cash to the bank, deduct driver shortages, and stress-test your runway.',
      bullets: [
        banglaMode ? 'সকল রুটে এক ক্লিকে বাকি খাতা লক করার ক্ষমতা' : 'One-Tap credit lock across all van delivery routes',
        banglaMode ? 'ভল্ট ক্যাশ ব্যাংকে স্থানান্তর ও দিন-শেষ হিসাব ক্লোজ' : 'Stage vault cash to bank and approve zero-variance day closeout',
        banglaMode ? 'কালেকশন কমে গেলে ক্যাশ কেমন থাকবে তার লাইভ সিমুলেশন' : 'Stress-test your cash runway against lower collection days',
      ],
      image: '/screenshots/scenario_simulator.png',
      badgeText: 'State-Mutating Controls & Sandbox',
    },
  ];

  const currentTab = featureTabs.find((t) => t.id === activeFeatureTab) || featureTabs[0];

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] selection:bg-[var(--accent-soft)] selection:text-[var(--foreground)] font-sans antialiased">
      {/* ---------------------------------------------------- */}
      {/* 1. CLEAN, MINIMALIST HEADER                          */}
      {/* ---------------------------------------------------- */}
      <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--surface)]/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--accent)] text-white font-mono font-bold text-xs tracking-wider shadow-xs group-hover:opacity-90 transition">
              dM
            </span>
            <div className="flex flex-col">
              <span className="text-sm font-bold tracking-tight text-[var(--foreground)] uppercase font-mono leading-none">
                distroMesh
              </span>
              <span className="text-[10px] text-[var(--foreground-muted)] font-mono tracking-wider mt-0.5">
                DISTRIBUTOR CONTROL BOARD
              </span>
            </div>
          </Link>

          {/* Minimal 2-Link Navigation */}
          <nav className="hidden md:flex items-center gap-6 font-mono text-xs font-semibold text-[var(--foreground-muted)]">
            <a href="#features" className="hover:text-[var(--foreground)] transition">
              {banglaMode ? 'ফিচারসমূহ' : 'Features'}
            </a>
            <Link href="/businesses" className="hover:text-[var(--foreground)] transition">
              {banglaMode ? 'পোর্টফোলিও' : 'Business Portfolio'}
            </Link>
          </nav>

          {/* Clean Action Buttons */}
          <div className="flex items-center gap-2.5">
            {/* Theme Toggle (Dark / Light) */}
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-hover)] text-[var(--foreground)] transition shadow-2xs active:scale-95"
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? <Sun size={15} className="text-amber-400" /> : <Moon size={15} className="text-slate-600" />}
            </button>

            {/* Language Switcher */}
            <button
              onClick={() => setBanglaMode(!banglaMode)}
              className="px-2.5 py-1 text-xs font-mono font-bold rounded-lg border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-hover)] text-[var(--foreground)] shadow-2xs transition active:scale-95"
              title="Toggle English / Bangla"
            >
              {banglaMode ? 'বাংলা' : 'EN'}
            </button>

            {/* Launch CTA */}
            <Link
              href="/businesses/unilever-distribution/war-room"
              className="inline-flex h-9 items-center gap-2 rounded-lg bg-[var(--accent)] hover:opacity-90 px-3.5 sm:px-4 text-xs font-bold text-white shadow-xs transition active:scale-95 font-mono"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 animate-ping" />
              <span>{banglaMode ? 'ওয়ার রুম' : 'Open War Room'}</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </header>

      {/* ---------------------------------------------------- */}
      {/* 2. VISUAL-FIRST HERO SECTION                         */}
      {/* ---------------------------------------------------- */}
      <section className="relative overflow-hidden border-b border-[var(--border)] bg-gradient-to-b from-[var(--background-deep)] via-[var(--surface-inset)]/20 to-[var(--background)] pt-10 pb-14 sm:pt-14 sm:pb-20">
        {/* Subtle Engineering Grid Texture */}
        <div className="absolute inset-0 bg-[radial-gradient(rgba(100,116,139,0.12)_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-60 dark:opacity-30 [mask-image:radial-gradient(ellipse_70%_70%_at_50%_20%,#000_60%,transparent_100%)]" />

        {/* Ambient Glow Orbs */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-[var(--accent)]/15 via-emerald-500/10 to-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Main Hero Header */}
          <div className="mx-auto max-w-3xl text-center">
            {/* Context Pill */}
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--accent)]/30 bg-[var(--accent-soft)] px-3.5 py-1 text-xs font-mono font-bold text-[var(--accent)] shadow-2xs mb-4">
              <span className="h-2 w-2 rounded-full bg-[var(--accent)] animate-pulse" />
              <span>
                {banglaMode
                  ? 'ডিস্ট্রিবিউশন হাউজ মালিকদের জন্য তৈরি · শেরপুর ও বগুড়া হাব'
                  : 'Built for Distribution Business Owners · Sherpur & Bogura Hub'}
              </span>
            </div>

            {/* Grounded Headline for the Business Owner */}
            <h1 className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[var(--foreground)] font-mono leading-tight sm:leading-[1.18] break-words">
              {banglaMode
                ? 'ডিস্ট্রিবিউশন ব্যবসা মালিকের প্রতিদিনের কন্ট্রোল বোর্ড'
                : 'The Daily Control Board for Distribution Business Owners'}
            </h1>

            {/* Subtitle Grounded in Real Operations */}
            <p className="mt-3.5 text-sm sm:text-lg text-[var(--foreground-muted)] leading-relaxed font-sans max-w-2xl mx-auto">
              {banglaMode
                ? 'কোম্পানির ৪৮ ঘণ্টার ব্যাংক ডেবিট, বাজারের বাকি টাকা এবং ডেলিভারি ফ্লিটের ক্যাশ শর্টেজ নিয়ন্ত্রণে মালিকের নির্ভরযোগ্য সমাধান।'
                : 'Protect your bank before 48-hour principal auto-debits, track overdue credit across 700 retail shops, and settle delivery driver cash without shortage.'}
            </p>

            {/* Action Buttons */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3 font-mono">
              <Link
                href="/businesses/unilever-distribution/war-room"
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-[var(--accent)] hover:opacity-90 px-4 sm:px-5 text-xs sm:text-sm font-bold text-white shadow-md transition transform hover:-translate-y-0.5 active:scale-95"
              >
                <Monitor size={15} />
                <span>{banglaMode ? 'লাইভ ওয়ার রুম দেখুন' : 'Launch War Room'}</span>
                <ArrowRight size={14} />
              </Link>
              <Link
                href="/businesses"
                className="inline-flex h-11 items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] hover:bg-[var(--surface-hover)] px-4 text-xs sm:text-sm font-bold text-[var(--foreground)] shadow-2xs transition active:scale-95"
              >
                <Building2 size={15} className="text-[var(--foreground-muted)]" />
                <span>{banglaMode ? 'মাল্টি-বিজনেস পোর্টফোলিও' : 'Business Portfolio'}</span>
              </Link>
            </div>
          </div>

          {/* -------------------------------------------------- */}
          {/* POLISHED DESKTOP FRAME WITH LIVE INTERACTIVE COCKPIT */}
          {/* -------------------------------------------------- */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="mt-10 mx-auto max-w-5xl"
          >
            <div className="relative rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] shadow-2xl overflow-hidden ring-1 ring-white/5">
              {/* Browser Window Chrome */}
              <div className="flex items-center justify-between border-b border-[var(--border)] bg-[var(--surface-inset)] px-3 sm:px-4 py-2 sm:py-2.5 text-xs font-mono text-[var(--foreground-muted)]">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="h-2.5 w-2.5 rounded-full bg-rose-400/90 border border-rose-500/40 inline-block" />
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-400/90 border border-amber-500/40 inline-block" />
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/90 border border-emerald-500/40 inline-block" />
                  </div>
                  <div className="h-3.5 w-px bg-[var(--border)] mx-1 hidden sm:block shrink-0" />
                  <span className="font-semibold text-[var(--foreground)] text-[11px] truncate hidden sm:flex items-center gap-1.5">
                    <span className="text-gray-500">https://</span>
                    <span>distromesh.local/businesses/unilever-distribution/war-room</span>
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="inline-flex items-center gap-1.5 text-[9px] sm:text-[10px] font-bold bg-[var(--success-soft)] text-[var(--success)] px-2 py-0.5 rounded border border-[var(--success)]/20">
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--success)] animate-pulse" />
                    <span>INTERACTIVE COCKPIT</span>
                  </span>
                </div>
              </div>

              {/* Real Interactive Web-App Cockpit */}
              <div className="relative w-full overflow-hidden">
                <HeroCockpitPreview />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* 3. INTERACTIVE FEATURE SHOWCASE: STRICT 5 ZONES      */}
      {/* ---------------------------------------------------- */}
      <section
        id="features"
        ref={featuresRef}
        className="relative py-14 sm:py-20 border-b border-[var(--border)] bg-[var(--background)] overflow-hidden"
      >
        {/* Subtle background engineering grid texture */}
        <div className="absolute inset-0 bg-[radial-gradient(rgba(100,116,139,0.1)_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-50 dark:opacity-25" />
        <div className="absolute top-1/2 -right-40 w-96 h-96 bg-[var(--accent)]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-8">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--accent)] bg-[var(--accent-soft)] px-2.5 py-0.5 rounded border border-[var(--accent)]/30 block w-fit">
                {banglaMode ? 'অপারেশনাল জোনসমূহ' : 'DISTRIBUTOR OPERATIONS ARCHITECTURE'}
              </span>
              {isFeaturesInView && (
                <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold bg-[var(--success-soft)] text-[var(--success)] px-2.5 py-0.5 rounded border border-[var(--success)]/30 animate-pulse">
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--success)]" />
                  <span>
                    {banglaMode
                      ? `স্বয়ংক্রিয় লাইভ ডেমো · জোন ${FEATURE_TAB_IDS.indexOf(activeFeatureTab) + 1}/৫`
                      : `SELF-RUNNING DEMO · ZONE ${FEATURE_TAB_IDS.indexOf(activeFeatureTab) + 1}/5`}
                  </span>
                </span>
              )}
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-mono text-[var(--foreground)]">
              {banglaMode ? '৫টি অপারেশনাল জোন ও কন্ট্রোল মেকানিক্স' : 'Explore the 5 Operational Zones'}
            </h2>
            <p className="mt-1.5 text-sm text-[var(--foreground-muted)] font-sans">
              Continuous self-running showcase cycling through all 5 zones with real-time operations telemetry.
            </p>
          </div>

          {/* Interactive Feature Tabs: Exactly 5 Zones in Sequence */}
          <div
            className="grid grid-cols-2 sm:grid-cols-5 gap-2 font-mono text-xs mb-6"
            onMouseEnter={() => setIsFeaturePaused(true)}
            onMouseLeave={() => setIsFeaturePaused(false)}
          >
            {featureTabs.map((tab, idx) => {
              const Icon = tab.icon;
              const isActive = activeFeatureTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleFeatureTabClick(tab.id)}
                  className={`relative p-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-left group overflow-hidden transition-colors ${
                    idx === 4 ? 'col-span-2 sm:col-span-1' : ''
                  } ${
                    isActive
                      ? 'text-[var(--foreground)] font-bold'
                      : 'hover:bg-[var(--surface-hover)] text-[var(--foreground-muted)]'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeFeatureTabIndicator"
                      className="absolute inset-0 rounded-xl border-2 border-[var(--accent)] bg-[var(--accent-soft)] shadow-xs pointer-events-none z-0"
                      transition={{ type: 'spring', bounce: 0.15, duration: 0.35 }}
                    />
                  )}

                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-[10px] font-bold ${isActive ? 'text-[var(--accent)]' : 'text-[var(--foreground-subtle)]'}`}>
                        {tab.tag}
                      </span>
                      <Icon size={15} className={isActive ? 'text-[var(--accent)]' : 'text-[var(--foreground-muted)] group-hover:text-[var(--foreground)] transition-colors'} />
                    </div>
                    <div className="font-bold text-xs sm:text-sm text-[var(--foreground)] truncate">{tab.title}</div>
                    <div className="text-[10px] text-[var(--foreground-muted)] font-sans truncate">{tab.subtitle}</div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Tab Visual Card with AnimatePresence */}
          <div
            onMouseEnter={() => setIsFeaturePaused(true)}
            onMouseLeave={() => setIsFeaturePaused(false)}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTab.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.22, ease: CINEMATIC_EASE }}
                className="rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] p-4 sm:p-6 lg:p-7 shadow-xl relative overflow-hidden"
              >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                {/* Left Column: Concise Explanation */}
                <div className="lg:col-span-5 space-y-3.5">
                  <div className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold text-[var(--success)] bg-[var(--success-soft)] px-2.5 py-0.5 rounded border border-[var(--success)]/30">
                    <CheckCircle2 size={13} className="text-[var(--success)]" />
                    <span>{currentTab.badgeText}</span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold font-mono text-[var(--foreground)] leading-snug">
                    {currentTab.headline}
                  </h3>

                  <p className="text-sm text-[var(--foreground-muted)] font-sans leading-relaxed">
                    {currentTab.description}
                  </p>

                  {/* Bullet Points */}
                  <div className="space-y-1.5 pt-1 text-xs font-mono text-[var(--foreground)]">
                    {currentTab.bullets.map((bullet, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[var(--success-soft)] text-[var(--success)] mt-0.5">
                          ✓
                        </span>
                        <span>{bullet}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2">
                    <Link
                      href="/businesses/unilever-distribution/war-room"
                      className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[var(--accent)] hover:opacity-90 hover:underline"
                    >
                      <span>Open live board for {currentTab.title}</span>
                      <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>

                {/* Right Column: Modern Interactive Self-Running Web-App Card Component */}
                <div className="lg:col-span-7">
                  <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-inset)]/50 p-1.5 sm:p-2 shadow-xl ring-1 ring-white/5">
                    <div className="rounded-xl overflow-hidden">
                      {currentTab.id === 'liquidity' && <LiquidityRunwayPreview autoDemo={true} />}
                      {currentTab.id === 'capital' && <TrappedCapitalPreview autoDemo={true} />}
                      {currentTab.id === 'dispatch' && <DispatchRunwayPreview autoDemo={true} />}
                      {currentTab.id === 'settlement' && <RouteSettlementPreview autoDemo={true} />}
                      {currentTab.id === 'decision' && <DecisionDockPreview autoDemo={true} />}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* 4. DAILY OPERATIONS RHYTHM IN 3 SIMPLE STEPS         */}
      {/* ---------------------------------------------------- */}
      <section className="relative py-14 sm:py-20 border-b border-[var(--border)] bg-[var(--background-deep)] overflow-hidden">
        {/* Subtle engineering grid texture */}
        <div className="absolute inset-0 bg-[radial-gradient(rgba(100,116,139,0.08)_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-40 dark:opacity-20" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-10">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--accent)] bg-[var(--accent-soft)] px-2.5 py-0.5 rounded border border-[var(--accent)]/30 block w-fit mb-2">
              {banglaMode ? 'দৈনিক কার্যপদ্ধতি' : 'DAILY OPERATIONS LIFECYCLE'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-mono text-[var(--foreground)]">
              {banglaMode ? '৩টি ধাপে সম্পূর্ণ ডিস্ট্রিবিউশন নিয়ন্ত্রণ' : 'How distroMesh Protects Your Working Day'}
            </h2>
            <p className="mt-1.5 text-sm text-[var(--foreground-muted)] font-sans">
              From morning van dispatch to evening cashier vault reconciliation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 font-mono text-xs">
            {/* Step 1 */}
            <motion.div
              whileHover={{ y: -3 }}
              transition={{ duration: 0.2 }}
              className="rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] p-5 shadow-sm hover:border-[var(--accent)]/40 hover:shadow-md transition-all space-y-2.5 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[var(--success)] font-bold text-base">01 · 09:00 AM</span>
                <div className="p-2 rounded-lg bg-[var(--surface)] text-[var(--foreground-muted)] group-hover:text-[var(--accent)] transition-colors">
                  <Truck size={17} />
                </div>
              </div>
              <h3 className="text-sm font-bold text-[var(--foreground)] uppercase">Morning Dispatch</h3>
              <p className="text-[var(--foreground-muted)] font-sans text-xs leading-relaxed">
                Loading audit across 12 delivery beats. Departure stalls are caught immediately to avoid idle labor wage losses.
              </p>
              <div className="pt-2 border-t border-[var(--border)] text-[11px] text-[var(--success)] font-bold flex items-center gap-1.5">
                <CheckCircle2 size={13} className="text-[var(--success)]" />
                <span>Stalls cleared &amp; vans departed</span>
              </div>
            </motion.div>

            {/* Step 2 */}
            <motion.div
              whileHover={{ y: -3 }}
              transition={{ duration: 0.2 }}
              className="rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] p-5 shadow-sm hover:border-[var(--accent)]/40 hover:shadow-md transition-all space-y-2.5 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[var(--success)] font-bold text-base">02 · 02:00 PM</span>
                <div className="p-2 rounded-lg bg-[var(--surface)] text-[var(--foreground-muted)] group-hover:text-[var(--accent)] transition-colors">
                  <Lock size={17} />
                </div>
              </div>
              <h3 className="text-sm font-bold text-[var(--foreground)] uppercase">Field Credit Guard</h3>
              <p className="text-[var(--foreground-muted)] font-sans text-xs leading-relaxed">
                700 retail shop drops underway. Unauthorized fresh credit extensions to overdue shops are hard-locked across all beats.
              </p>
              <div className="pt-2 border-t border-[var(--border)] text-[11px] text-[var(--success)] font-bold flex items-center gap-1.5">
                <CheckCircle2 size={13} className="text-[var(--success)]" />
                <span>Overdue credit leakage prevented</span>
              </div>
            </motion.div>

            {/* Step 3 */}
            <motion.div
              whileHover={{ y: -3 }}
              transition={{ duration: 0.2 }}
              className="rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] p-5 shadow-sm hover:border-[var(--accent)]/40 hover:shadow-md transition-all space-y-2.5 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[var(--success)] font-bold text-base">03 · 07:30 PM</span>
                <div className="p-2 rounded-lg bg-[var(--surface)] text-[var(--foreground-muted)] group-hover:text-[var(--accent)] transition-colors">
                  <Wallet size={17} />
                </div>
              </div>
              <h3 className="text-sm font-bold text-[var(--foreground)] uppercase">Till Settlement</h3>
              <p className="text-[var(--foreground-muted)] font-sans text-xs leading-relaxed">
                Physical vault cash counted at the depot window. Route shortages (−৳400) are identified in 15 seconds and deducted.
              </p>
              <div className="pt-2 border-t border-[var(--border)] text-[11px] text-[var(--success)] font-bold flex items-center gap-1.5">
                <CheckCircle2 size={13} className="text-[var(--success)]" />
                <span>100% zero-variance day-end closeout</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* 5. CALL TO ACTION                                    */}
      {/* ---------------------------------------------------- */}
      <section className="relative py-14 sm:py-16 bg-[var(--background)] border-b border-[var(--border)] overflow-hidden">
        {/* Subtle engineering grid texture & Ambient Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(rgba(100,116,139,0.08)_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-40 dark:opacity-20" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[250px] bg-gradient-to-t from-[var(--accent)]/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="rounded-3xl border border-[var(--border)] bg-gradient-to-br from-[var(--surface-elevated)] via-[var(--surface)] to-[var(--surface-elevated)] p-6 sm:p-10 shadow-lg relative">
            <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[var(--accent)] bg-[var(--surface-elevated)] border border-[var(--border)] px-3 py-1 rounded-full mb-3 shadow-2xs">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
              <span>{banglaMode ? 'সম্পূর্ণ সক্রিয় লাইভ পরিবেশ' : 'Zero-Setup Interactive Demo'}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold font-mono text-[var(--foreground)]">
              {banglaMode
                ? 'আপনার ডিস্ট্রিবিউশন কন্ট্রোল বোর্ড এখনই পরীক্ষা করুন'
                : 'Experience the Live Operations Board'}
            </h2>

            <p className="mt-2 text-sm text-[var(--foreground-muted)] font-sans max-w-xl mx-auto">
              {banglaMode
                ? 'রিয়েল-টাইম এফএমসিজি ডেটা, ১২টি ভ্যান রুট এবং এক্সিকিউটিভ অ্যাকশন ডক নিয়ে লাইভ ওয়ার রুমে প্রবেশ করুন।'
                : 'Step into the live operations board with active route settlement, cash runway, and state-mutating decision controls.'}
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3 font-mono">
              <Link
                href="/businesses/unilever-distribution/war-room"
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-[var(--accent)] hover:opacity-90 px-5 text-xs sm:text-sm font-bold text-white shadow-md transition transform hover:-translate-y-0.5 active:scale-95"
              >
                <Monitor size={15} />
                <span>{banglaMode ? 'ওয়ার রুম চালু করুন' : 'Launch Executive War Room'}</span>
                <ArrowRight size={13} />
              </Link>
              <Link
                href="/businesses"
                className="inline-flex h-11 items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] hover:bg-[var(--surface-hover)] px-4 text-xs sm:text-sm font-bold text-[var(--foreground)] shadow-2xs transition transform hover:-translate-y-0.5 active:scale-95"
              >
                <span>{banglaMode ? 'পোর্টফোলিও ভিউ' : 'Explore Portfolio'}</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* 6. MINIMAL, HUMBLE FOOTER                            */}
      {/* ---------------------------------------------------- */}
      <footer className="bg-[var(--background-deep)] py-8 text-xs font-mono text-[var(--foreground-muted)] border-t border-[var(--border)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded bg-[var(--accent)] text-white font-bold text-[10px]">
                dM
              </span>
              <span className="font-bold text-[var(--foreground)]">distroMesh</span>
              <span className="text-[var(--foreground-muted)]">·</span>
              <span className="text-[var(--foreground-muted)]">Sherpur &amp; Bogura FMCG Hub</span>
            </div>

            <div className="flex items-center gap-4 text-[var(--foreground-muted)]">
              <Link href="/businesses/unilever-distribution/war-room" className="hover:text-[var(--foreground)]">
                War Room
              </Link>
              <Link href="/businesses" className="hover:text-[var(--foreground)]">
                Portfolio
              </Link>
              <span className="text-[var(--border)]">|</span>
              <span className="text-[11px] text-[var(--foreground-muted)]">10 Balance Identities Verified</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
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
  FileCheck2,
  AlertCircle,
} from 'lucide-react';

export function DistroMeshLanding() {
  const [banglaMode, setBanglaMode] = useState(false);
  const [activeFeatureTab, setActiveFeatureTab] = useState<
    'liquidity' | 'capital' | 'dispatch' | 'settlement' | 'decision'
  >('liquidity');

  const featureTabs = [
    {
      id: 'liquidity' as const,
      title: banglaMode ? 'লিকুইডিটি রানওয়ে' : 'Liquidity Runway',
      subtitle: banglaMode ? 'ব্যাংক বনাম ভল্ট ক্যাশ' : 'Bank vs Vault Cash',
      icon: Wallet,
      tag: 'ZONE 01',
      headline: banglaMode
        ? 'ব্যাংক এবং ডিপো ভল্ট ক্যাশের স্পষ্ট বিভাজন'
        : 'Separate Physical Vault Cash from Clearing Bank Balances',
      description: banglaMode
        ? 'ডিপোতে থাকা নগদ টাকা এবং ব্যাংকের ব্যালেন্স আলাদা ট্র্যাক করুন। আগামী ৪৮ ঘণ্টার প্রিন্সিপাল অটো-ডেবিট সুইপের (৳৫৪.০ লাখ) আগে কোনো ঘাটতি থাকলে তাৎক্ষণিক সতর্কতা পান।'
        : 'Ensure 48-hour principal auto-debits (৳54.0L) are staged safely before bank cutoff times. Avoid bounced supplier debits and supply stoppages.',
      bullets: [
        banglaMode ? '২.১৭ গুণ ক্যাশ কাভার রেশিও' : 'Real-time 2.17× liquidity runway coverage ratio',
        banglaMode ? '৪৮ ঘণ্টার অটো-ডেবিট সুইপ প্রোটেকশন' : 'Predictive 48-hour principal supply sweep buffer',
        banglaMode ? 'ব্যাংক ও ভল্ট ক্যাশের স্পষ্ট বিভাজন' : 'Strict accounting separation between vault safe and bank',
      ],
      image: '/screenshots/war_room_overview.png',
      badgeText: '৳16,95,200 Liquid Cash · 2.17× Cover',
    },
    {
      id: 'capital' as const,
      title: banglaMode ? 'আটকে থাকা মূলধন' : 'Trapped Capital',
      subtitle: banglaMode ? 'বাকী খাতা ও স্টক ম্যাট্রিক্স' : 'Credit & Stock Matrix',
      icon: Layers,
      tag: 'ZONE 02',
      headline: banglaMode
        ? 'বাকি খাতা এবং গুদামের পণ্যে আটকে থাকা মূলধনের দৃশ্যমানতা'
        : 'Proportional Visibility Over ৳1.97Cr Retailer Credit & ৳1.54Cr Stock',
      description: banglaMode
        ? 'বাজারে আটকে থাকা বাকি টাকা, গুদামের ইনভেন্টরি এবং কোম্পানির বকেয়া স্কিম ক্লেইমের সার্বিক চিত্র। ৩০ দিনের বেশি পুরনো বকেয়া পেলে এক ক্লিকেই ক্রেডিট লক করুন।'
        : 'Isolate high-risk retailer credit aging over 30 days across 700 outlets. Execute instant One-Tap credit freezes to prevent unauthorized credit extension.',
      bullets: [
        banglaMode ? '১৮% অতি-বকেয়া ক্রেডিট শনাক্তকরণ (>৩০ দিন)' : 'Flags 18.0% overdue retailer credit (>30 days)',
        banglaMode ? 'ওয়ান-ট্যাপ ক্রেডিট ফ্রিজ ব্যবস্থা' : 'One-Tap credit lock across all 12 delivery beats',
        banglaMode ? 'কোম্পানি স্কিম ক্লেইম ট্র্যাকিং (৳২.০৫ লাখ)' : 'Pending principal scheme claims (৳2.05L) with audit trails',
      ],
      image: '/screenshots/trapped_capital_runway.png',
      badgeText: '৳1.97 Cr Receivables · 18% Overdue >30D',
    },
    {
      id: 'dispatch' as const,
      title: banglaMode ? 'ডেসপ্যাচ রানওয়ে' : 'Dispatch Runway',
      subtitle: banglaMode ? 'ভ্যান ছাড়া ও বিলম্ব অডিট' : 'Departure Timeline',
      icon: Truck,
      tag: 'ZONE 03',
      headline: banglaMode
        ? '১২টি ভ্যানের সকালের ডেসপ্যাচ সময় ও বিলম্বের ক্ষতি তদারকি'
        : 'Fleet Departure Timeline & Departure Stall Monitoring',
      description: banglaMode
        ? 'সকাল ৯টায় ভ্যান ছাড়ার লক্ষ্যমাত্রা বনাম প্রকৃত ডেসপ্যাচ ট্র্যাকিং। কোনো রুটে ডেসপ্যাচ স্টল বা বিলম্ব (+১৬৫ মিনিট) হলে অলস কর্মীদের আর্থিক ক্ষতি তাৎক্ষণিক হিসাব করুন।'
        : 'Tracks target 09:00 AM vs actual departure across 12 delivery beats. Pinpoints loading bottlenecks and calculates idle crew labor cost in real time.',
      bullets: [
        banglaMode ? '১২টি ডেলিভারি বিটের সকালের ডেসপ্যাচ অডিট' : 'Morning dispatch audit across 12 delivery beats',
        banglaMode ? 'ডেসপ্যাচ স্টল (+১৬৫ মিনিট) শনাক্তকরণ' : 'Identifies departure stalls (+165 min fleet delay)',
        banglaMode ? 'অলস লেবার ওয়েজ ক্ষতি পরিমাপ (৳৪,৯৫০)' : 'Quantifies idle crew wage losses in real time',
      ],
      image: '/screenshots/war_room_at_top_1791354223522.png',
      badgeText: '12 Delivery Beats · 09:00 AM Target',
    },
    {
      id: 'settlement' as const,
      title: banglaMode ? '১২-রুট সেটেলমেন্ট' : 'Route Settlement',
      subtitle: banglaMode ? 'ড্রাইভার ক্যাশ শর্টেজ' : 'Till Variance Matching',
      icon: Navigation,
      tag: 'ZONE 04',
      headline: banglaMode
        ? '১২টি ভ্যানের দৈনিক হিসাব ও শর্টেজ ১৫ সেকেন্ডে নিষ্পত্তি'
        : '12-Beat Drop-by-Drop Reconciliation Under 15 Seconds',
      description: banglaMode
        ? 'সন্ধ্যা সাড়ে ৭টায় ভ্যান ফেরার সাথে সাথে ক্যাশ ও বাকির স্বয়ংক্রিয় হিসাব। ড্রাইভারের ক্যাশ শর্টেজ থাকলে সাথে সাথে নোটিশ এবং পারিশ্রমিক থেকে কর্তনের ব্যবস্থা।'
        : 'When delivery vans return at dusk, drop-level sales instantly reconcile against cash handed in. Till shortages (e.g. −৳400) are flagged immediately for wage deduction.',
      bullets: [
        banglaMode ? '৭০০ খুচরা দোকানের ড্রপ অডিট' : 'Drop-level accountability across 700 retail points',
        banglaMode ? 'স্বয়ংক্রিয় ঘাটতি শনাক্তকরণ (−৳৪০০)' : 'Automated till variance identification (−৳400 shortage flag)',
        banglaMode ? 'এক ক্লিকে শর্টেজ অ্যাডজাস্টমেন্ট' : 'One-click automated driver wage deduction protocol',
      ],
      image: '/screenshots/route_settlement.png',
      badgeText: '11 Routes Cleared · 1 Shortage (−৳400)',
    },
    {
      id: 'decision' as const,
      title: banglaMode ? 'অ্যাকশন ডক ও সিমুলেটর' : 'Decision Dock & Sandbox',
      subtitle: banglaMode ? 'এক্সিকিউটিভ কন্ট্রোল' : 'Action Dock & Simulator',
      icon: SlidersHorizontal,
      tag: 'ZONE 05',
      headline: banglaMode
        ? 'উচ্চ-আস্থার সিদ্ধান্ত গ্রহণ এবং ব্যবসায়িক সিমুলেশন'
        : 'High-Confidence Operational Controls & Real-Time Sandboxing',
      description: banglaMode
        ? 'এক ক্লিকে বাকি খাতা লক, ব্যাংকে ক্যাশ ট্রান্সফার, ড্রাইভার শর্টেজ কর্তন এবং দিন শেষে ডে-ক্লোজ সম্পন্ন করুন। স্লাইডার টেনে যেকোনো ব্যবসায়িক পরিস্থিতির প্রভাব আগে যাচাই করুন।'
        : 'Execute state-mutating actions with instant safety checks: One-Tap Credit Lock, Bank Deposit Staging, Shortage Deductions, and parameter stress-testing.',
      bullets: [
        banglaMode ? 'ওয়ান-ট্যাপ ক্রেডিট লক ও ব্যাংক ডিপোজিট' : 'One-Tap credit lock and staged bank cash transfers',
        banglaMode ? 'স্বয়ংক্রিয় দিন-শেষ ক্লোজআউট প্রটোকল' : 'End-of-day closeout with zero variance verification',
        banglaMode ? 'লাইভ প্যারামিটার স্ট্রেস-টেস্টিং স্যান্ডবক্স' : 'Interactive parameter sandboxing with one-click reset',
      ],
      image: '/screenshots/scenario_simulator.png',
      badgeText: 'State-Mutating Controls & Sandbox',
    },
  ];

  const currentTab = featureTabs.find((t) => t.id === activeFeatureTab) || featureTabs[0];

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 selection:bg-emerald-500/15 selection:text-emerald-900 font-sans antialiased">
      {/* ---------------------------------------------------- */}
      {/* 1. CLEAN, MINIMALIST HEADER                          */}
      {/* ---------------------------------------------------- */}
      <header className="sticky top-0 z-50 border-b border-slate-200/90 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-700 text-white font-mono font-bold text-xs tracking-wider shadow-xs group-hover:bg-emerald-800 transition">
              dM
            </span>
            <div className="flex flex-col">
              <span className="text-sm font-bold tracking-tight text-slate-900 uppercase font-mono leading-none">
                distroMesh
              </span>
              <span className="text-[10px] text-slate-500 font-mono tracking-wider mt-0.5">
                FMCG CONTROL BOARD
              </span>
            </div>
          </Link>

          {/* Minimal 2-Link Navigation */}
          <nav className="hidden md:flex items-center gap-6 font-mono text-xs font-semibold text-slate-600">
            <a href="#features" className="hover:text-emerald-700 transition">
              {banglaMode ? 'ফিচারসমূহ' : 'Features'}
            </a>
            <Link href="/businesses" className="hover:text-emerald-700 transition">
              {banglaMode ? 'পোর্টফোলিও' : 'Portfolio Cockpit'}
            </Link>
          </nav>

          {/* Clean Action Buttons */}
          <div className="flex items-center gap-2.5">
            {/* Language Switcher */}
            <button
              onClick={() => setBanglaMode(!banglaMode)}
              className="px-2.5 py-1 text-xs font-mono font-bold rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 shadow-2xs transition active:scale-95"
              title="Toggle English / Bangla"
            >
              {banglaMode ? 'বাংলা' : 'EN'}
            </button>

            {/* Launch CTA */}
            <Link
              href="/businesses/unilever-distribution/war-room"
              className="inline-flex h-9 items-center gap-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 px-3.5 sm:px-4 text-xs font-bold text-white shadow-xs transition active:scale-95 font-mono"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 animate-ping" />
              <span>{banglaMode ? 'ওয়ার রুম' : 'Open War Room'}</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </header>

      {/* ---------------------------------------------------- */}
      {/* 2. VISUAL-FIRST HERO SECTION WITH PRODUCT SCREENSHOT */}
      {/* ---------------------------------------------------- */}
      <section className="relative overflow-hidden border-b border-slate-200/80 bg-gradient-to-b from-white via-slate-50/70 to-slate-100/50 pt-10 pb-14 sm:pt-14 sm:pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Main Hero Header */}
          <div className="mx-auto max-w-3xl text-center">
            {/* Context Pill */}
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300 bg-emerald-50 px-3.5 py-1 text-xs font-mono font-bold text-emerald-900 shadow-2xs mb-4">
              <span className="h-2 w-2 rounded-full bg-emerald-600 animate-pulse" />
              <span>
                {banglaMode
                  ? 'এফএমসিজি ডিস্ট্রিবিউশন হাব · শেরপুর ও বগুড়া'
                  : 'FMCG Distribution Operations · Sherpur & Bogura Hub'}
              </span>
            </div>

            {/* Professional Operational Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 font-mono leading-[1.18]">
              {banglaMode
                ? 'এফএমসিজি ডিস্ট্রিবিউশনের লাইভ অপারেশনাল কন্ট্রোল বোর্ড'
                : 'Operational Command Center for FMCG Distribution'}
            </h1>

            {/* Concise Supporting Subtitle */}
            <p className="mt-3.5 text-base sm:text-lg text-slate-600 leading-relaxed font-sans max-w-2xl mx-auto">
              {banglaMode
                ? 'লিকুইডিটি রানওয়ে, ভ্যান ডেসপ্যাচ অডিট, ১২টি রুটের দৈনিক সেটেলমেন্ট ও বাকী নিয়ন্ত্রণের সমন্বিত ব্যবস্থা।'
                : 'Real-time liquidity runway, departure dispatch audits, 12-route van settlement reconciliation, and instant retailer credit controls.'}
            </p>

            {/* Action Buttons */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3 font-mono">
              <Link
                href="/businesses/unilever-distribution/war-room"
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 px-5 text-xs sm:text-sm font-bold text-white shadow-md shadow-emerald-950/10 transition transform hover:-translate-y-0.5"
              >
                <Monitor size={15} />
                <span>{banglaMode ? 'লাইভ ওয়ার রুম দেখুন' : 'Launch War Room'}</span>
                <ArrowRight size={14} />
              </Link>
              <Link
                href="/businesses"
                className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 px-4 text-xs sm:text-sm font-bold text-slate-700 shadow-2xs transition"
              >
                <Building2 size={15} className="text-slate-500" />
                <span>{banglaMode ? 'মাল্টি-বিজনেস পোর্টফোলিও' : 'Portfolio Cockpit'}</span>
              </Link>
            </div>
          </div>

          {/* -------------------------------------------------- */}
          {/* LARGE HERO SCREENSHOT IN POLISHED DESKTOP FRAME    */}
          {/* -------------------------------------------------- */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="mt-10 mx-auto max-w-5xl"
          >
            <div className="relative rounded-2xl border border-slate-300/90 bg-white shadow-2xl shadow-slate-300/50 overflow-hidden">
              {/* Browser Window Chrome */}
              <div className="flex items-center justify-between border-b border-slate-200 bg-slate-100/90 px-4 py-2.5 text-xs font-mono text-slate-600">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-rose-400 border border-rose-500 inline-block" />
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-400 border border-amber-500 inline-block" />
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 border border-emerald-500 inline-block" />
                  </div>
                  <div className="h-3.5 w-px bg-slate-300 mx-1 hidden sm:block" />
                  <span className="font-semibold text-slate-700 text-[11px] truncate">
                    distromesh.local/businesses/unilever-distribution/war-room
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded border border-emerald-300">
                    ● LIVE OPS (10:00–16:00)
                  </span>
                </div>
              </div>

              {/* Real Product Screenshot */}
              <div className="relative bg-slate-100 aspect-[16/9] w-full">
                <Image
                  src="/screenshots/war_room_overview.png"
                  alt="distroMesh FMCG War Room Executive Dashboard"
                  fill
                  priority
                  className="object-cover object-top"
                />

                {/* Floating Telemetry Pills */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                  className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 flex flex-wrap items-center gap-2 font-mono text-[10px] sm:text-xs"
                >
                  <div className="rounded-lg bg-white/95 backdrop-blur-md border border-slate-300 px-3 py-1.5 shadow-md flex items-center gap-2 text-slate-800">
                    <span className="h-2 w-2 rounded-full bg-emerald-600 animate-ping" />
                    <span className="font-bold">Liquid Cash: ৳16,95,200</span>
                    <span className="text-emerald-700 font-bold hidden sm:inline">(2.17× Cover)</span>
                  </div>

                  <div className="rounded-lg bg-white/95 backdrop-blur-md border border-amber-300 px-3 py-1.5 shadow-md flex items-center gap-1.5 text-amber-900">
                    <Clock size={12} className="text-amber-700" />
                    <span className="font-bold">48h Sweep: Safe</span>
                  </div>
                </motion.div>

                {/* Inspect Link */}
                <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4">
                  <Link
                    href="/businesses/unilever-distribution/war-room"
                    className="rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white px-3 py-1.5 shadow-md flex items-center gap-1 text-xs font-mono font-bold transition active:scale-95"
                  >
                    <span>Inspect Board</span>
                    <ChevronRight size={13} />
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* 3. INTERACTIVE FEATURE SHOWCASE: STRICT 5 ZONES      */}
      {/* ---------------------------------------------------- */}
      <section id="features" className="py-14 sm:py-20 border-b border-slate-200/80 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-8">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200 block w-fit mb-2">
              {banglaMode ? 'অপারেশনাল জোনসমূহ' : 'CONTROL BOARD ARCHITECTURE'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-mono text-slate-900">
              {banglaMode ? '৫টি অপারেশনাল জোন ও কন্ট্রোল মেকানিক্স' : 'Explore the 5 Operational Zones'}
            </h2>
            <p className="mt-1.5 text-sm text-slate-600 font-sans">
              Switch through the 5 zones of the executive control board to inspect live screens and mechanics.
            </p>
          </div>

          {/* Interactive Feature Tabs: Exactly 5 Zones in Sequence */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 font-mono text-xs mb-6">
            {featureTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeFeatureTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveFeatureTab(tab.id)}
                  className={`relative p-3 rounded-xl border text-left transition-all ${
                    isActive
                      ? 'border-emerald-600 bg-emerald-50/70 shadow-sm text-emerald-950 font-bold'
                      : 'border-slate-200 bg-slate-50/60 hover:bg-slate-100/80 text-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-[10px] font-bold ${isActive ? 'text-emerald-800' : 'text-slate-400'}`}>
                      {tab.tag}
                    </span>
                    <Icon size={15} className={isActive ? 'text-emerald-700' : 'text-slate-400'} />
                  </div>
                  <div className="font-bold text-xs sm:text-sm text-slate-900 truncate">{tab.title}</div>
                  <div className="text-[10px] text-slate-500 font-sans truncate">{tab.subtitle}</div>
                </button>
              );
            })}
          </div>

          {/* Active Tab Visual Card with AnimatePresence */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTab.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="rounded-2xl border border-slate-300 bg-slate-50/40 p-5 sm:p-7 shadow-sm"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                {/* Left Column: Concise Explanation */}
                <div className="lg:col-span-5 space-y-3.5">
                  <div className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                    <CheckCircle2 size={13} className="text-emerald-700" />
                    <span>{currentTab.badgeText}</span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold font-mono text-slate-900 leading-snug">
                    {currentTab.headline}
                  </h3>

                  <p className="text-sm text-slate-600 font-sans leading-relaxed">
                    {currentTab.description}
                  </p>

                  {/* Bullet Points */}
                  <div className="space-y-1.5 pt-1 text-xs font-mono text-slate-700">
                    {currentTab.bullets.map((bullet, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 mt-0.5">
                          ✓
                        </span>
                        <span>{bullet}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2">
                    <Link
                      href="/businesses/unilever-distribution/war-room"
                      className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-700 hover:text-emerald-800 hover:underline"
                    >
                      <span>Open live board for {currentTab.title}</span>
                      <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>

                {/* Right Column: High-Res Screenshot Preview */}
                <div className="lg:col-span-7">
                  <div className="rounded-xl border border-slate-300 bg-white p-2 shadow-md overflow-hidden group">
                    <div className="relative aspect-[16/10] w-full rounded-lg overflow-hidden bg-slate-100">
                      <Image
                        src={currentTab.image}
                        alt={currentTab.title}
                        fill
                        className="object-cover object-top transition duration-300 group-hover:scale-[1.01]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* 4. DAILY OPERATIONS RHYTHM IN 3 SIMPLE STEPS         */}
      {/* ---------------------------------------------------- */}
      <section className="py-14 sm:py-20 border-b border-slate-200/80 bg-[#f8fafc]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-10">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200 block w-fit mb-2">
              {banglaMode ? 'দৈনিক কার্যপদ্ধতি' : 'DAILY OPERATIONS LIFECYCLE'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-mono text-slate-900">
              {banglaMode ? '৩টি ধাপে সম্পূর্ণ ডিস্ট্রিবিউশন নিয়ন্ত্রণ' : 'How distroMesh Protects Your Working Day'}
            </h2>
            <p className="mt-1.5 text-sm text-slate-600 font-sans">
              From morning van dispatch to evening vault reconciliation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 font-mono text-xs">
            {/* Step 1 */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-emerald-700 font-bold text-base">01 · 09:00 AM</span>
                <Truck size={17} className="text-slate-400" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 uppercase">Morning Dispatch</h3>
              <p className="text-slate-600 font-sans text-xs leading-relaxed">
                Loading audit across 12 delivery beats. Departure stalls are caught immediately to avoid idle labor wage losses.
              </p>
              <div className="pt-2 border-t border-slate-100 text-[11px] text-emerald-800 font-bold">
                ✓ Stalls cleared &amp; vans departed
              </div>
            </div>

            {/* Step 2 */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-emerald-700 font-bold text-base">02 · 02:00 PM</span>
                <Lock size={17} className="text-slate-400" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 uppercase">Field Credit Guard</h3>
              <p className="text-slate-600 font-sans text-xs leading-relaxed">
                700 retail shop drops underway. Unauthorized fresh credit extensions to overdue shops are hard-locked across all beats.
              </p>
              <div className="pt-2 border-t border-slate-100 text-[11px] text-emerald-800 font-bold">
                ✓ Overdue credit leakage prevented
              </div>
            </div>

            {/* Step 3 */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-emerald-700 font-bold text-base">03 · 07:30 PM</span>
                <Wallet size={17} className="text-slate-400" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 uppercase">Till Settlement</h3>
              <p className="text-slate-600 font-sans text-xs leading-relaxed">
                Physical vault cash counted at the depot window. Route shortages (−৳400) are identified in 15 seconds and deducted.
              </p>
              <div className="pt-2 border-t border-slate-100 text-[11px] text-emerald-800 font-bold">
                ✓ 100% zero-variance day-end closeout
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* 5. CALL TO ACTION                                    */}
      {/* ---------------------------------------------------- */}
      <section className="py-14 sm:py-16 bg-white border-b border-slate-200/80">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="rounded-3xl border border-emerald-300 bg-gradient-to-br from-emerald-50/70 via-white to-slate-50 p-6 sm:p-10 shadow-sm">
            <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-800 bg-white border border-emerald-300 px-3 py-1 rounded-full mb-3">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" />
              <span>{banglaMode ? 'সম্পূর্ণ সক্রিয় লাইভ পরিবেশ' : 'Zero-Setup Interactive Demo'}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold font-mono text-slate-900">
              {banglaMode
                ? 'আপনার ডিস্ট্রিবিউশন কন্ট্রোল বোর্ড এখনই পরীক্ষা করুন'
                : 'Experience the Live Operations Cockpit'}
            </h2>

            <p className="mt-2 text-sm text-slate-600 font-sans max-w-xl mx-auto">
              {banglaMode
                ? 'রিয়েল-টাইম এফএমসিজি ডেটা, ১২টি ভ্যান রুট এবং এক্সিকিউটিভ অ্যাকশন ডক নিয়ে লাইভ ওয়ার রুমে প্রবেশ করুন।'
                : 'Test the live FMCG war room with active route settlement, cash runway, and state-mutating decision controls.'}
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3 font-mono">
              <Link
                href="/businesses/unilever-distribution/war-room"
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 px-5 text-xs sm:text-sm font-bold text-white shadow-xs transition"
              >
                <Monitor size={15} />
                <span>{banglaMode ? 'ওয়ার রুম চালু করুন' : 'Launch Executive War Room'}</span>
                <ArrowRight size={13} />
              </Link>
              <Link
                href="/businesses"
                className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 px-4 text-xs sm:text-sm font-bold text-slate-700 shadow-2xs transition"
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
      <footer className="bg-slate-50 py-8 text-xs font-mono text-slate-600 border-t border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded bg-emerald-700 text-white font-bold text-[10px]">
                dM
              </span>
              <span className="font-bold text-slate-900">distroMesh</span>
              <span className="text-slate-400">·</span>
              <span className="text-slate-500">Sherpur &amp; Bogura FMCG Hub</span>
            </div>

            <div className="flex items-center gap-4 text-slate-500">
              <Link href="/businesses/unilever-distribution/war-room" className="hover:text-emerald-700">
                War Room
              </Link>
              <Link href="/businesses" className="hover:text-emerald-700">
                Portfolio
              </Link>
              <span className="text-slate-300">|</span>
              <span className="text-[11px] text-slate-400">10 Balance Identities Verified</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

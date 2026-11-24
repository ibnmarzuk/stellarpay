"use client";

import { useState } from "react";
import {
  ArrowDownLeft,
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  CircleHelp,
  Clock3,
  Command,
  CreditCard,
  ExternalLink,
  Globe2,
  LayoutDashboard,
  LifeBuoy,
  LockKeyhole,
  Plus,
  Send,
  Settings2,
  ShieldCheck,
  Sparkles,
  Wallet,
  Zap,
} from "lucide-react";
import { WalletConnect, type PaymentActivity } from "@/components/wallet-connect";

const navigation = [
  { label: "Overview", href: "#overview", icon: LayoutDashboard, active: true },
  { label: "Send money", href: "#send", icon: Send, active: false },
  { label: "Request money", href: "#request", icon: ArrowDownLeft, active: false },
  { label: "Activity", href: "#activity", icon: Clock3, active: false },
];

export default function Home() {
  const [balance, setBalance] = useState<string | null>(null);
  const [activity, setActivity] = useState<PaymentActivity[]>([]);
  const [accountAddress, setAccountAddress] = useState<string | null>(null);
  const totalReceived = activity.filter((item) => item.to === accountAddress)
    .reduce((sum, item) => sum + Number(item.amount), 0);
  const totalSent = activity.filter((item) => item.from === accountAddress)
    .reduce((sum, item) => sum + Number(item.amount), 0);
  const metrics = [
    { label: "Recent received", value: activity.length ? totalReceived.toFixed(2) : "—", detail: "Recent verified XLM payments", icon: ArrowDownLeft },
    { label: "Recent sent", value: activity.length ? totalSent.toFixed(2) : "—", detail: "Recent verified XLM payments", icon: ArrowUpRight },
    { label: "Transactions", value: activity.length ? String(activity.length) : "—", detail: "Recent verified XLM payments", icon: CreditCard },
  ];

  return (
    <main className="min-h-screen bg-[#080b11] text-[#f6f8fc]">
      <div className="mx-auto flex min-h-screen max-w-[1680px]">
        <aside className="sidebar-shell hidden w-[248px] shrink-0 flex-col border-r border-white/[0.07] px-5 py-7 lg:flex">
          <a href="#overview" className="flex items-center gap-3 px-2">
            <span className="grid size-10 place-items-center rounded-[13px] bg-[#635bff] text-white shadow-[0_8px_24px_rgba(99,91,255,0.28)]">
              <Command size={20} strokeWidth={2.4} />
            </span>
            <span>
              <span className="block text-[16px] font-semibold tracking-[-0.04em]">StellarPay</span>
              <span className="mt-0.5 block text-[9px] font-semibold tracking-[0.17em] text-slate-500 uppercase">Global payments</span>
            </span>
          </a>

          <div className="mt-12">
            <p className="mb-3 px-3 text-[10px] font-semibold tracking-[0.16em] text-slate-600 uppercase">Workspace</p>
            <nav className="space-y-1">
              {navigation.map(({ label, href, icon: Icon, active }) => (
                <a key={label} href={href} className={`nav-link ${active ? "nav-link-active" : ""}`}>
                  <Icon size={17} strokeWidth={1.8} />
                  <span>{label}</span>
                  {active && <span className="ml-auto size-1.5 rounded-full bg-[#8b85ff]" />}
                </a>
              ))}
            </nav>
          </div>

          <div className="mt-10">
            <p className="mb-3 px-3 text-[10px] font-semibold tracking-[0.16em] text-slate-600 uppercase">Preferences</p>
            <a href="#network" className="nav-link"><Settings2 size={17} strokeWidth={1.8} /> Settings</a>
            <a href="https://developers.stellar.org/" target="_blank" rel="noreferrer" className="nav-link"><LifeBuoy size={17} strokeWidth={1.8} /> Help centre <ExternalLink className="ml-auto" size={12} /></a>
          </div>

          <div className="mt-auto rounded-2xl border border-white/[0.08] bg-[#111722] p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="grid size-8 place-items-center rounded-xl bg-[#635bff]/15 text-[#a7a2ff]"><ShieldCheck size={16} /></span>
              <span className="rounded-full border border-emerald-400/15 bg-emerald-400/[0.07] px-2 py-1 text-[9px] font-semibold tracking-wide text-emerald-300">TESTNET</span>
            </div>
            <p className="text-xs font-semibold">Your funds stay yours.</p>
            <p className="mt-1.5 text-[10px] leading-[1.7] text-slate-500">StellarPay never asks for your secret key. Transactions are approved in your wallet.</p>
            <a href="https://developers.stellar.org/" target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1.5 text-[10px] font-medium text-[#a7a2ff] hover:text-white">Learn about Stellar <ArrowRight size={12} /></a>
          </div>
        </aside>

        <section className="min-w-0 flex-1">
          <header className="topbar sticky top-0 z-20 flex h-[76px] items-center justify-between border-b border-white/[0.07] px-5 backdrop-blur-xl sm:px-8 lg:px-10">
            <div className="flex items-center gap-3">
              <span className="grid size-9 place-items-center rounded-xl bg-[#635bff] text-white lg:hidden"><Command size={18} /></span>
              <div>
                <p className="text-[10px] font-medium text-slate-500">Workspace <span className="px-1 text-slate-700">/</span> Overview</p>
                <h1 className="mt-0.5 text-sm font-semibold tracking-tight">Dashboard</h1>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="hidden items-center gap-2 rounded-full border border-emerald-400/15 bg-emerald-400/[0.06] px-3 py-2 text-[10px] font-medium text-emerald-300 sm:inline-flex"><span className="size-1.5 rounded-full bg-emerald-400" /> Stellar Testnet</span>
              <a href="https://stellar.expert/explorer/testnet" target="_blank" rel="noreferrer" className="hidden rounded-lg border border-white/10 px-3 py-2 text-[10px] font-medium text-slate-300 transition hover:border-white/20 hover:text-white sm:inline-flex">Explorer <ExternalLink size={12} className="ml-2" /></a>
              <span className="grid size-9 place-items-center rounded-full border border-white/10 bg-[#171d29] text-[11px] font-semibold text-slate-300">SP</span>
            </div>
          </header>
          <nav className="flex gap-2 overflow-x-auto border-b border-white/[0.06] px-5 py-3 lg:hidden sm:px-8">
            {navigation.map(({ label, href, icon: Icon }) => (
              <a key={label} href={href} className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-white/[0.07] bg-[#111722] px-3 py-2 text-[10px] font-medium text-slate-400 transition hover:border-[#635bff]/40 hover:text-white"><Icon size={13} />{label}</a>
            ))}
          </nav>

          <div id="overview" className="mx-auto max-w-[1320px] space-y-7 px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <div className="mb-3 inline-flex items-center gap-2 text-[10px] font-medium text-[#a7a2ff]"><Sparkles size={13} /> YOUR MONEY, IN MOTION</div>
                <h2 className="text-[30px] font-semibold tracking-[-0.055em] sm:text-[38px]">Good things move <span className="text-[#8b85ff]">globally.</span></h2>
                <p className="mt-2 max-w-xl text-[12px] leading-6 text-slate-400">Send and request payments with a simpler experience, powered by the Stellar network.</p>
              </div>
              <div className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-[#111722] px-3 py-2.5">
                <Globe2 size={14} className="text-[#a7a2ff]" />
                <span className="text-[10px] font-medium text-slate-300">Network status</span>
                <span className="ml-1 size-1.5 rounded-full bg-emerald-400" />
                <span className="text-[10px] text-emerald-300">Testnet</span>
              </div>
            </div>

            <div className="grid gap-4 xl:grid-cols-[1.55fr_0.85fr]">
              <section className="balance-panel relative min-h-[260px] overflow-hidden rounded-[22px] border border-[#7770ff]/25 p-6 sm:p-8">
                <div className="balance-orb balance-orb-one" />
                <div className="balance-orb balance-orb-two" />
                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[11px] font-medium text-indigo-100/75"><Wallet size={14} /> Available balance</div>
                  <span className="rounded-full border border-white/15 bg-white/[0.07] px-2.5 py-1 text-[9px] font-semibold tracking-wide text-indigo-100/80">XLM ACCOUNT</span>
                </div>
                <div className="relative z-10 mt-9">
                  <p className="text-[42px] font-semibold tracking-[-0.06em] sm:text-[50px]">{balance ?? "—"} <span className="text-lg font-medium tracking-normal text-indigo-100/65">XLM</span></p>
                  <p className="mt-2 text-[11px] text-indigo-100/60">{balance === null ? "Connect your wallet to see your live balance." : "Live balance retrieved from Stellar Testnet."}</p>
                </div>
                <div className="relative z-10 mt-7 flex flex-wrap gap-2">
                  <a href="#send" className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-[11px] font-semibold text-[#29245e] shadow-lg shadow-black/10 transition hover:bg-indigo-50"><Send size={13} /> Send payment</a>
                  <a href="#request" className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/[0.06] px-4 py-2.5 text-[11px] font-medium text-white transition hover:bg-white/[0.12]"><Plus size={13} /> Request payment</a>
                </div>
              </section>

              <section id="network" className="flex flex-col justify-between rounded-[22px] border border-white/[0.08] bg-[#111722] p-6">
                <div className="flex items-center justify-between">
                  <span className="grid size-10 place-items-center rounded-xl border border-[#635bff]/20 bg-[#635bff]/10 text-[#aaa5ff]"><Zap size={18} /></span>
                  <span className="text-[9px] font-semibold tracking-[0.15em] text-slate-600">NETWORK</span>
                </div>
                <div className="mt-7">
                  <div className="flex items-center gap-2"><span className="size-2 rounded-full bg-emerald-400" /><h3 className="text-[15px] font-semibold">Stellar Testnet</h3></div>
                  <p className="mt-2 text-[11px] leading-5 text-slate-400">A safe environment to test real wallet interactions and transactions. Test assets have no monetary value.</p>
                </div>
                <div className="mt-6 flex items-center gap-2 border-t border-white/[0.07] pt-4 text-[10px] text-slate-500"><LockKeyhole size={13} className="text-emerald-300" /> Wallet-controlled signing</div>
              </section>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {metrics.map(({ label, value, detail, icon: Icon }) => (
                <section key={label} className="rounded-2xl border border-white/[0.08] bg-[#111722] p-5 transition hover:border-white/[0.14]">
                  <div className="flex items-center justify-between"><p className="text-[11px] font-medium text-slate-400">{label}</p><span className="grid size-8 place-items-center rounded-lg bg-[#635bff]/10 text-[#a7a2ff]"><Icon size={15} /></span></div>
                  <p className="mt-5 text-[25px] font-semibold tracking-tight">{value}</p>
                  <p className="mt-1.5 text-[10px] text-slate-500">{detail}</p>
                </section>
              ))}
            </div>

            <section className="grid items-start gap-4 xl:grid-cols-[1.05fr_0.95fr]">
              <div className="rounded-[22px] border border-white/[0.08] bg-[#111722] p-5 sm:p-6">
                <div className="mb-5 flex items-center justify-between">
                  <div><h3 className="text-[13px] font-semibold">Wallet connection</h3><p className="mt-1 text-[10px] text-slate-500">Connect securely to access your account.</p></div>
                  <span className="grid size-9 place-items-center rounded-xl bg-[#635bff]/10 text-[#a7a2ff]"><Wallet size={16} /></span>
                </div>
                <WalletConnect onBalanceChange={setBalance} onActivityChange={setActivity} onAccountChange={setAccountAddress} />
              </div>
              <div className="rounded-[22px] border border-white/[0.08] bg-[#111722] p-5 sm:p-6">
                <div className="flex items-center justify-between">
                  <div><h3 className="text-[13px] font-semibold">Built for moving money</h3><p className="mt-1 text-[10px] text-slate-500">A more considered way to pay.</p></div>
                  <BadgeCheck size={18} className="text-[#a7a2ff]" />
                </div>
                <div className="mt-5 space-y-4">
                  <div className="flex gap-3"><span className="grid size-8 shrink-0 place-items-center rounded-lg bg-emerald-400/[0.08] text-emerald-300"><ShieldCheck size={15} /></span><div><p className="text-[11px] font-medium">You stay in control</p><p className="mt-1 text-[10px] leading-5 text-slate-500">Your wallet approves every transaction. StellarPay never sees your secret key.</p></div></div>
                  <div className="flex gap-3"><span className="grid size-8 shrink-0 place-items-center rounded-lg bg-[#635bff]/10 text-[#aaa5ff]"><Globe2 size={15} /></span><div><p className="text-[11px] font-medium">Built on an open network</p><p className="mt-1 text-[10px] leading-5 text-slate-500">Payments are recorded on Stellar and can be checked in the public explorer.</p></div></div>
                </div>
              </div>
            </section>

            <section id="activity" className="overflow-hidden rounded-[22px] border border-white/[0.08] bg-[#111722]">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.07] px-5 py-5 sm:px-6">
                <div><h3 className="text-[13px] font-semibold">Recent activity</h3><p className="mt-1 text-[10px] text-slate-500">Your verified Stellar transactions will appear here.</p></div>
                <a href="https://stellar.expert/explorer/testnet" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-[10px] font-medium text-[#aaa5ff] hover:text-white">Open explorer <ExternalLink size={12} /></a>
              </div>
              {activity.length ? (
                <div className="divide-y divide-white/[0.06]">
                  {activity.map((item) => {
                    const outgoing = item.from === accountAddress;
                    return (
                      <div key={item.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 sm:px-6">
                        <div className="flex min-w-0 items-center gap-3">
                          <span className={`grid size-9 shrink-0 place-items-center rounded-xl ${outgoing ? "bg-amber-400/[0.08] text-amber-300" : "bg-emerald-400/[0.08] text-emerald-300"}`}>
                            {outgoing ? <ArrowUpRight size={16} /> : <ArrowDownLeft size={16} />}
                          </span>
                          <div className="min-w-0">
                            <p className="text-[11px] font-medium text-slate-200">{outgoing ? "Sent XLM" : "Received XLM"}</p>
                            <p className="mt-1 truncate font-mono text-[9px] text-slate-500">{outgoing ? item.to : item.from}</p>
                            <p className="mt-1 text-[9px] text-slate-600">{new Date(item.created_at).toLocaleString()}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`text-[12px] font-semibold tabular-nums ${outgoing ? "text-slate-200" : "text-emerald-300"}`}>{outgoing ? "−" : "+"}{Number(item.amount).toFixed(4)} XLM</p>
                          <a href={`https://stellar.expert/explorer/testnet/tx/${item.transaction_hash}`} target="_blank" rel="noreferrer" className="mt-1 inline-flex items-center gap-1 text-[9px] text-[#aaa5ff] hover:text-white">Verified on Stellar <ExternalLink size={10} /></a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center px-5 py-12 text-center">
                  <span className="grid size-12 place-items-center rounded-2xl border border-white/[0.08] bg-white/[0.025] text-slate-500"><Clock3 size={19} /></span>
                  <p className="mt-4 text-[12px] font-medium text-slate-300">No verified payments yet</p>
                  <p className="mt-1 max-w-sm text-[10px] leading-5 text-slate-500">Connect your wallet to load recent native XLM payment activity from Stellar Testnet.</p>
                </div>
              )}
            </section>

            <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.07] pt-5 text-[10px] text-slate-600">
              <span>© 2026 StellarPay. Built on Stellar.</span>
              <span className="inline-flex items-center gap-1.5"><CircleHelp size={12} /> Testnet prototype · No real funds</span>
            </footer>
          </div>
        </section>
      </div>
    </main>
  );
}

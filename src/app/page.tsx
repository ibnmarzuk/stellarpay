import {
  ArrowDownLeft,
  ArrowRight,
  ArrowUpRight,
  CircleHelp,
  Clock3,
  Command,
  CreditCard,
  Download,
  Globe2,
  LayoutDashboard,
  Plus,
  Send,
  ShieldCheck,
  Wallet,
  Zap,
} from "lucide-react";

const navItems = [
  { label: "Overview", icon: LayoutDashboard, active: true },
  { label: "Send", icon: Send, active: false },
  { label: "Request", icon: Download, active: false },
  { label: "Transactions", icon: Clock3, active: false },
];

const quickActions = [
  { title: "Send payment", detail: "Transfer XLM to a Stellar account", icon: ArrowUpRight },
  { title: "Request payment", detail: "Create a shareable payment request", icon: ArrowDownLeft },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#080b12] text-[#f4f6fb]">
      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        <aside className="hidden w-[250px] shrink-0 flex-col border-r border-white/[0.08] bg-[#0b1019] px-5 py-7 lg:flex">
          <a href="/" className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-[#8aa5ff] text-[#09101f]">
              <Command size={21} strokeWidth={2.5} />
            </span>
            <span>
              <span className="block text-[17px] font-semibold tracking-tight">StellarPay</span>
              <span className="block text-[10px] tracking-[0.16em] text-slate-500 uppercase">Payments, simplified</span>
            </span>
          </a>

          <p className="mb-3 mt-12 px-3 text-[10px] font-semibold tracking-[0.18em] text-slate-600 uppercase">Workspace</p>
          <nav className="space-y-1">
            {navItems.map(({ label, icon: Icon, active }) => (
              <a key={label} href={label === "Overview" ? "#overview" : `#${label.toLowerCase()}`} className={`flex items-center gap-3 rounded-xl px-3 py-3 text-[13px] transition ${active ? "bg-[#182541] text-[#b4c5ff]" : "text-slate-400 hover:bg-white/[0.04] hover:text-white"}`}>
                <Icon size={17} /> {label}
              </a>
            ))}
          </nav>

          <div className="mt-auto rounded-2xl border border-[#293957] bg-gradient-to-br from-[#17243d] to-[#101827] p-4">
            <div className="mb-3 flex items-center justify-between">
              <ShieldCheck size={18} className="text-[#9db5ff]" />
              <span className="rounded-full bg-emerald-400/10 px-2 py-1 text-[9px] font-medium text-emerald-300">TESTNET</span>
            </div>
            <p className="text-[13px] font-medium">Built on Stellar</p>
            <p className="mt-1 text-[11px] leading-5 text-slate-400">This prototype uses the Stellar test network. Test assets have no real-world value.</p>
            <a href="https://developers.stellar.org/" target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1 text-[11px] text-[#a9bcff]">Explore Stellar <ArrowRight size={12} /></a>
          </div>
        </aside>

        <section className="min-w-0 flex-1">
          <header className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.08] px-5 py-5 sm:px-8 lg:px-10">
            <div>
              <p className="text-[11px] text-slate-500">Workspace <span className="px-1 text-slate-700">/</span> Overview</p>
              <h1 className="mt-1 text-lg font-semibold tracking-tight">Dashboard</h1>
            </div>
            <WalletConnect />
          </header>

          <div id="overview" className="mx-auto max-w-[1250px] space-y-8 px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs text-[#9aabcf]">A clearer way to move money</p>
                <h2 className="mt-2 max-w-2xl text-3xl font-semibold tracking-[-0.04em] sm:text-[38px]">Your money, <span className="text-[#91aaff]">without borders.</span></h2>
                <p className="mt-3 max-w-xl text-[13px] leading-6 text-slate-400">A simple payment workspace for sending, requesting and tracking payments on Stellar.</p>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/15 bg-emerald-400/[0.06] px-3 py-2 text-[10px] text-emerald-300">
                <span className="size-1.5 rounded-full bg-emerald-400" /> Stellar Testnet environment
              </div>
            </div>

            <div className="grid gap-4 xl:grid-cols-[1.55fr_1fr]">
              <section className="relative overflow-hidden rounded-[24px] border border-[#334b79] bg-[radial-gradient(ellipse_at_top_right,_rgba(111,145,231,0.27),_transparent_48%),linear-gradient(135deg,#1a2b4b,#111b2d_72%)] p-6 sm:p-8">
                <div className="absolute -right-16 -top-24 size-72 rounded-full border border-white/[0.06]" />
                <div className="absolute -right-4 -top-12 size-48 rounded-full border border-white/[0.06]" />
                <div className="relative flex items-center justify-between">
                  <p className="text-xs text-blue-100/75">Available balance</p>
                  <Globe2 size={18} className="text-blue-100/70" />
                </div>
                <div className="relative mt-9">
                  <p className="text-4xl font-semibold tracking-tight sm:text-5xl">— <span className="text-xl font-medium text-blue-100/70">XLM</span></p>
                  <p className="mt-3 text-xs text-blue-100/65">Connect a wallet to load your live Stellar balance.</p>
                </div>
                <div className="relative mt-8 flex flex-wrap gap-2">
                  <a href="#send" className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-xs font-semibold text-[#172747] hover:bg-blue-50"> <Send size={14} /> Send payment</a>
                  <a href="#request" className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/[0.04] px-4 py-3 text-xs font-medium text-white hover:bg-white/10"><Plus size={14} /> Request payment</a>
                </div>
              </section>

              <section className="flex flex-col justify-between rounded-[24px] border border-white/[0.09] bg-[#101621] p-6 sm:p-7">
                <div className="flex items-center justify-between">
                  <span className="grid size-10 place-items-center rounded-xl bg-[#8aa5ff]/10 text-[#a9bcff]"><Zap size={19} /></span>
                  <span className="text-[10px] text-slate-500">NETWORK</span>
                </div>
                <div className="mt-8">
                  <p className="text-lg font-semibold">Stellar Testnet</p>
                  <p className="mt-2 text-xs leading-5 text-slate-400">A safe environment for testing wallet connections and blockchain transactions before mainnet.</p>
                </div>
                <a href="https://stellar.expert/explorer/testnet" target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center gap-2 text-xs text-[#a9bcff] hover:text-white">Open Testnet Explorer <ArrowRight size={13} /></a>
              </section>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { label: "Total received", value: "—", icon: ArrowDownLeft, note: "Available after wallet connection" },
                { label: "Total sent", value: "—", icon: ArrowUpRight, note: "Available after wallet connection" },
                { label: "Transactions", value: "—", icon: CreditCard, note: "Live network activity coming next" },
              ].map(({ label, value, icon: Icon, note }) => (
                <div key={label} className="rounded-2xl border border-white/[0.08] bg-[#101621] p-5">
                  <div className="flex items-center justify-between"><p className="text-xs text-slate-400">{label}</p><Icon size={17} className="text-[#9bb2ff]" /></div>
                  <p className="mt-5 text-2xl font-semibold">{value}</p>
                  <p className="mt-2 text-[10px] text-slate-500">{note}</p>
                </div>
              ))}
            </div>

            <section>
              <div className="mb-4 flex items-end justify-between">
                <div><h3 className="text-sm font-semibold">Quick actions</h3><p className="mt-1 text-[11px] text-slate-500">Choose what you want to do next.</p></div>
                <span className="text-[10px] text-slate-600">Wallet features in progress</span>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                {quickActions.map(({ title, detail, icon: Icon }) => (
                  <a key={title} href={title.startsWith("Send") ? "#send" : "#request"} className="group flex items-center justify-between rounded-2xl border border-white/[0.08] bg-[#101621] p-5 transition hover:border-[#718fd7]/40 hover:bg-[#141e2d]">
                    <div className="flex items-center gap-4"><span className="grid size-11 place-items-center rounded-xl bg-[#8aa5ff]/10 text-[#a9bcff]"><Icon size={19} /></span><span><span className="block text-[13px] font-medium">{title}</span><span className="mt-1 block text-[11px] text-slate-500">{detail}</span></span></div>
                    <ArrowRight size={16} className="text-slate-600 transition group-hover:translate-x-1 group-hover:text-white" />
                  </a>
                ))}
              </div>
            </section>

            <section id="transactions" className="rounded-2xl border border-white/[0.08] bg-[#101621] p-5 sm:p-6">
              <div className="flex items-center justify-between gap-3"><div><h3 className="text-sm font-semibold">Recent activity</h3><p className="mt-1 text-[11px] text-slate-500">Your verified Stellar transactions will appear here.</p></div><Clock3 size={17} className="text-slate-500" /></div>
              <div className="mt-8 flex flex-col items-center justify-center py-8 text-center">
                <span className="grid size-12 place-items-center rounded-2xl border border-white/[0.08] bg-white/[0.03] text-slate-500"><CreditCard size={20} /></span>
                <p className="mt-4 text-xs font-medium text-slate-300">No transactions to display</p>
                <p className="mt-1 max-w-xs text-[11px] leading-5 text-slate-500">Connect your Stellar wallet in the next milestone to load verified network activity.</p>
              </div>
            </section>

            <div id="send" className="sr-only">Send payment feature coming soon</div>
            <div id="request" className="sr-only">Payment request feature coming soon</div>
            <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.08] pt-5 text-[10px] text-slate-600">
              <span>StellarPay · Built on Stellar</span>
              <span className="inline-flex items-center gap-1"><CircleHelp size={12} /> Testnet prototype. No real funds.</span>
            </footer>
          </div>
        </section>
      </div>
    </main>
  );
}

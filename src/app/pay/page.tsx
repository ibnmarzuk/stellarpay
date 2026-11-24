"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { StrKey } from "@stellar/stellar-sdk";
import { ArrowLeft, Command, ExternalLink, ShieldCheck } from "lucide-react";
import { WalletConnect } from "@/components/wallet-connect";

function CheckoutContent() {
  const params = useSearchParams();
  const recipient = params.get("payTo") ?? "";
  const asset = params.get("asset") ?? "XLM";
  const network = params.get("network") ?? "testnet";
  const amount = params.get("amount") ?? "";
  const validRecipient = StrKey.isValidEd25519PublicKey(recipient);
  const validAmount = !amount || (/^\d+(\.\d{1,7})?$/.test(amount) && Number(amount) > 0);
  const validRequest = validRecipient && asset === "XLM" && network === "testnet" && validAmount;

  return (
    <main className="min-h-screen bg-[#080b11] px-5 py-8 text-[#f6f8fc] sm:px-8 sm:py-12">
      <div className="mx-auto max-w-[520px]">
        <a href="/" className="inline-flex items-center gap-2 text-[11px] text-slate-400 transition hover:text-white"><ArrowLeft size={14} /> Back to StellarPay</a>
        <div className="mt-8 flex items-center gap-3"><span className="grid size-10 place-items-center rounded-[13px] bg-[#635bff] text-white"><Command size={19} /></span><div><p className="text-[16px] font-semibold tracking-[-0.04em]">StellarPay</p><p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-slate-500">Secure payment checkout</p></div></div>
        <section className="mt-8 rounded-[22px] border border-white/[0.08] bg-[#111722] p-5 sm:p-7">
          <div className="flex items-center justify-between"><span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#aaa5ff]">Payment request</span><span className="rounded-full border border-emerald-400/15 bg-emerald-400/[0.06] px-2.5 py-1 text-[9px] font-semibold text-emerald-300">STELLAR TESTNET</span></div>
          {validRequest ? <>
            <h1 className="mt-5 text-[26px] font-semibold tracking-[-0.05em]">You’re about to pay</h1>
            <p className="mt-2 text-[11px] leading-5 text-slate-400">Review the request details, connect your Stellar wallet, and approve the transfer in your wallet.</p>
            <div className="mt-6 rounded-xl border border-white/[0.07] bg-[#0b1019] p-4"><p className="text-[9px] font-medium uppercase tracking-[0.12em] text-slate-500">Requested amount</p><p className="mt-2 text-[34px] font-semibold tracking-[-0.05em]">{amount || "Enter amount"} <span className="text-base font-medium text-slate-400">XLM</span></p><div className="mt-4 border-t border-white/[0.07] pt-4"><p className="text-[9px] font-medium uppercase tracking-[0.12em] text-slate-500">Recipient</p><p className="mt-2 break-all font-mono text-[10px] leading-5 text-slate-300">{recipient}</p></div></div>
            <div className="mt-5"><WalletConnect initialRecipient={recipient} initialAmount={amount} showRequestForm={false} /></div>
          </> : <>
            <h1 className="mt-5 text-[24px] font-semibold tracking-[-0.05em]">This payment link is invalid</h1>
            <p className="mt-2 text-[11px] leading-6 text-slate-400">The recipient address, asset, network, or requested amount is missing or invalid. Ask the sender to create a new StellarPay request.</p>
            <a href="/" className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#635bff] px-4 py-2.5 text-[10px] font-semibold text-white">Return to StellarPay <ArrowLeft size={13} /></a>
          </>}
        </section>
        <div className="mt-5 flex items-start gap-3 rounded-xl border border-white/[0.07] bg-[#111722]/60 p-4"><ShieldCheck size={16} className="mt-0.5 shrink-0 text-emerald-300" /><p className="text-[10px] leading-5 text-slate-500">StellarPay never asks for your secret key. Your wallet signs the transaction. This checkout uses Testnet assets with no real-world monetary value.</p></div>
        <p className="mt-6 text-center text-[9px] text-slate-600">Powered by Stellar <span className="px-1">·</span> <a href="https://stellar.expert/explorer/testnet" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:text-slate-400">Testnet explorer <ExternalLink size={10} /></a></p>
      </div>
    </main>
  );
}

export default function PayPage() {
  return <Suspense fallback={<main className="grid min-h-screen place-items-center bg-[#080b11] text-sm text-slate-400">Loading payment request…</main>}><CheckoutContent /></Suspense>;
}

"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, Check, CheckCircle2, Copy, ExternalLink, ShieldCheck, XCircle } from "lucide-react";

type TransactionRecord = {
  hash: string;
  successful: boolean;
  created_at: string;
  source_account: string;
  fee_charged: string;
  ledger: number;
  memo?: string;
  memo_type?: string;
  operation_count?: number;
};

type OperationRecord = {
  type: string;
  amount?: string;
  asset_type?: string;
  from?: string;
  to?: string;
  source_account?: string;
};

const HORIZON = "https://horizon-testnet.stellar.org";
const EXPLORER = "https://stellar.expert/explorer/testnet";

function shorten(value?: string) {
  return value ? `${value.slice(0, 10)}…${value.slice(-8)}` : "Not available";
}

export default function ReceiptPage() {
  const params = useParams<{ hash: string }>();
  const hash = params.hash;
  const [transaction, setTransaction] = useState<TransactionRecord | null>(null);
  const [operations, setOperations] = useState<OperationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!/^[a-fA-F0-9]{64}$/.test(hash)) {
      setError("This transaction hash is not valid.");
      setLoading(false);
      return;
    }

    let active = true;
    async function loadReceipt() {
      try {
        const [txResponse, opsResponse] = await Promise.all([
          fetch(`${HORIZON}/transactions/${hash}`, { cache: "no-store" }),
          fetch(`${HORIZON}/transactions/${hash}/operations?limit=20`, { cache: "no-store" }),
        ]);
        if (!txResponse.ok) throw new Error(txResponse.status === 404 ? "Transaction not found on Stellar Testnet." : "Could not verify this transaction with Stellar Horizon.");
        const tx = await txResponse.json();
        const ops = opsResponse.ok ? await opsResponse.json() : { _embedded: { records: [] } };
        if (!active) return;
        setTransaction(tx);
        setOperations(ops._embedded?.records ?? []);
      } catch (cause) {
        if (active) setError(cause instanceof Error ? cause.message : "Unable to load this receipt.");
      } finally {
        if (active) setLoading(false);
      }
    }
    void loadReceipt();
    return () => { active = false; };
  }, [hash]);

  const copyHash = async () => {
    try {
      await navigator.clipboard.writeText(hash);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#080b11] px-5 py-8 text-[#f6f8fc] sm:px-8 sm:py-12">
      <div className="mx-auto max-w-[640px]">
        <a href="/" className="inline-flex items-center gap-2 text-[11px] text-slate-400 transition hover:text-white"><ArrowLeft size={14} /> Back to StellarPay</a>
        <div className="mt-8 flex items-center gap-3"><span className="grid size-10 place-items-center rounded-[13px] bg-[#635bff] text-white"><ShieldCheck size={19} /></span><div><p className="text-[16px] font-semibold tracking-[-0.04em]">StellarPay</p><p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-slate-500">Payment receipt</p></div></div>

        <section className="mt-8 overflow-hidden rounded-[22px] border border-white/[0.08] bg-[#111722]">
          {loading ? <div className="px-6 py-16 text-center text-xs text-slate-400">Verifying transaction on Stellar…</div> : error ? <div className="px-6 py-14 text-center"><XCircle size={32} className="mx-auto text-rose-300" /><h1 className="mt-4 text-lg font-semibold">Receipt unavailable</h1><p className="mt-2 text-xs leading-6 text-slate-400">{error}</p></div> : transaction && <>
            <div className="border-b border-white/[0.07] px-6 py-7 text-center">
              {transaction.successful ? <CheckCircle2 size={38} className="mx-auto text-emerald-300" /> : <XCircle size={38} className="mx-auto text-rose-300" />}
              <p className={`mt-4 text-[10px] font-semibold uppercase tracking-[0.16em] ${transaction.successful ? "text-emerald-300" : "text-rose-300"}`}>{transaction.successful ? "Confirmed on Stellar" : "Transaction failed"}</p>
              <h1 className="mt-2 text-[26px] font-semibold tracking-[-0.05em]">Payment receipt</h1>
              <p className="mt-2 text-[10px] text-slate-500">This receipt reflects the transaction record returned by Stellar Horizon.</p>
            </div>
            <div className="space-y-5 p-6">
              <div><p className="text-[9px] font-medium uppercase tracking-[0.13em] text-slate-500">Transaction hash</p><div className="mt-2 flex items-center gap-2 rounded-lg border border-white/[0.08] bg-[#0b1019] p-3"><code className="min-w-0 flex-1 break-all text-[10px] leading-5 text-slate-300">{hash}</code><button onClick={copyHash} aria-label="Copy transaction hash" className="shrink-0 rounded-md border border-white/10 p-2 text-slate-300 hover:bg-white/[0.06]">{copied ? <Check size={13} /> : <Copy size={13} />}</button></div></div>
              <div className="grid grid-cols-2 gap-4">
                <div><p className="text-[9px] uppercase tracking-[0.12em] text-slate-500">Date and time</p><p className="mt-2 text-[11px] text-slate-200">{new Date(transaction.created_at).toLocaleString()}</p></div>
                <div><p className="text-[9px] uppercase tracking-[0.12em] text-slate-500">Ledger</p><p className="mt-2 text-[11px] tabular-nums text-slate-200">{transaction.ledger.toLocaleString()}</p></div>
                <div><p className="text-[9px] uppercase tracking-[0.12em] text-slate-500">Network fee</p><p className="mt-2 text-[11px] text-slate-200">{(Number(transaction.fee_charged) / 10_000_000).toFixed(7)} XLM</p></div>
                <div><p className="text-[9px] uppercase tracking-[0.12em] text-slate-500">Operations</p><p className="mt-2 text-[11px] text-slate-200">{transaction.operation_count ?? operations.length}</p></div>
              </div>
              <div className="border-t border-white/[0.07] pt-5"><p className="text-[9px] uppercase tracking-[0.12em] text-slate-500">Source account</p><p className="mt-2 break-all font-mono text-[10px] leading-5 text-slate-300">{shorten(transaction.source_account)}</p></div>
              {operations.length > 0 && <div className="border-t border-white/[0.07] pt-5"><p className="text-[9px] font-medium uppercase tracking-[0.12em] text-slate-500">Transaction operations</p><div className="mt-3 space-y-3">{operations.map((operation, index) => <div key={index} className="rounded-lg border border-white/[0.07] bg-[#0b1019] p-3"><div className="flex items-center justify-between gap-3"><p className="text-[10px] font-medium capitalize text-slate-200">{operation.type.replaceAll("_", " ")}</p>{operation.asset_type === "native" && operation.amount && <p className="text-[10px] font-semibold text-slate-100">{operation.amount} XLM</p>}</div>{operation.from && <p className="mt-2 break-all text-[9px] text-slate-500">From: {shorten(operation.from)}</p>}{operation.to && <p className="mt-1 break-all text-[9px] text-slate-500">To: {shorten(operation.to)}</p>}</div>)}</div></div>}
              {transaction.memo && <div className="border-t border-white/[0.07] pt-5"><p className="text-[9px] uppercase tracking-[0.12em] text-slate-500">Memo ({transaction.memo_type ?? "text"})</p><p className="mt-2 break-all text-[11px] text-slate-200">{transaction.memo}</p></div>}
            </div>
            <div className="flex flex-wrap gap-2 border-t border-white/[0.07] p-5"><a href={`${EXPLORER}/tx/${hash}`} target="_blank" rel="noreferrer" className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#635bff] px-4 py-3 text-[10px] font-semibold text-white transition hover:bg-[#7770ff]">View on Stellar Expert <ExternalLink size={12} /></a><a href="/" className="inline-flex items-center justify-center rounded-lg border border-white/10 px-4 py-3 text-[10px] font-medium text-slate-300 hover:bg-white/[0.05]">Dashboard</a></div>
          </>}
        </section>
        <p className="mt-5 text-center text-[9px] text-slate-600">Stellar Testnet · Test assets have no real-world monetary value</p>
      </div>
    </main>
  );
}

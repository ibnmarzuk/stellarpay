"use client";

import { useCallback, useState } from "react";
import type { FormEvent } from "react";
import {
  Asset,
  BASE_FEE,
  Networks,
  Operation,
  Server,
  StrKey,
  TransactionBuilder,
} from "@stellar/stellar-sdk";
import {
  disconnect,
  getNetwork,
  isConnected,
  requestAccess,
  signTransaction,
} from "@stellar/varial-sdk";
import { Check, Copy, QrCode, RefreshCw, Send, Wallet } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { STELLAR_CONFIG } from "@/lib/stellar/config";

export type PaymentActivity = {
  id: string;
  amount: string;
  asset_type: string;
  from: string;
  to: string;
  transaction_hash: string;
  created_at: string;
  type: string;
};

type WalletConnectProps = {
  onBalanceChange?: (balance: string | null) => void;
  onActivityChange?: (activity: PaymentActivity[]) => void;
};

type WalletState = {
  address: string;
  balance: string | null;
  network: string;
};

const server = new Server(STELLAR_CONFIG.horizonUrl);

export function WalletConnect({ onBalanceChange, onActivityChange }: WalletConnectProps) {
  const [wallet, setWallet] = useState<WalletState | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [txHash, setTxHash] = useState<string | null>(null);
  const [requestAmount, setRequestAmount] = useState("");
  const [requestUrl, setRequestUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const loadActivity = useCallback(async (address: string) => {
    try {
      const response = await server.payments()
        .forAccount(address)
        .order("desc")
        .limit(8)
        .call();
      const records = response.records
        .filter((record) => record.type === "payment" && record.asset_type === "native")
        .map((record) => ({
          id: record.id,
          amount: record.amount,
          asset_type: record.asset_type,
          from: record.from,
          to: record.to,
          transaction_hash: record.transaction_hash,
          created_at: record.created_at,
          type: record.type,
        }));
      onActivityChange?.(records);
    } catch {
      onActivityChange?.([]);
    }
  }, [onActivityChange]);

  const loadBalance = useCallback(async (address: string) => {
    try {
      const account = await server.loadAccount(address);
      const native = account.balances.find((item) => item.asset_type === "native");
      const balance = native?.balance ?? "0.00";
      setWallet((current) =>
        current?.address === address ? { ...current, balance } : current,
      );
      onBalanceChange?.(balance);
      await loadActivity(address);
      setMessage(null);
    } catch (error) {
      const status = (error as { response?: { status?: number } })?.response?.status;
      if (status === 404) {
        setWallet((current) =>
          current?.address === address ? { ...current, balance: "0.00" } : current,
        );
        onBalanceChange?.("0.00");
        setMessage("This Testnet account is not funded yet. Fund it with Stellar Friendbot before sending.");
      } else {
        setMessage("Balance lookup failed. Check your connection and try again.");
      }
    }
  }, [loadActivity, onBalanceChange]);

  const connect = async () => {
    setBusy(true);
    setMessage(null);
    try {
      const installed = await isConnected();
      if (!installed.isConnected) {
        setMessage("Varial wallet was not detected. Install the Stellar wallet extension, then refresh this page.");
        return;
      }

      const access = await requestAccess();
      if (access.error || !access.address) {
        setMessage(access.error?.message ?? "Wallet access was not granted.");
        return;
      }

      const network = await getNetwork();
      if (network.error) {
        setMessage(network.error.message);
        return;
      }
      if (network.network !== "TESTNET") {
        setMessage(`Switch your wallet to Stellar Testnet. Current network: ${network.network}.`);
        return;
      }

      setWallet({ address: access.address, balance: null, network: network.network });
      onBalanceChange?.(null);
      await loadBalance(access.address);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Wallet connection failed.");
    } finally {
      setBusy(false);
    }
  };

  const disconnectWallet = async () => {
    setBusy(true);
    try {
      const result = await disconnect();
      if (result.error) {
        setMessage(result.error.message);
        return;
      }
      setWallet(null);
      setTxHash(null);
      setRequestUrl(null);
      onBalanceChange?.(null);
      onActivityChange?.([]);
      setMessage("Wallet disconnected from StellarPay.");
    } catch {
      setMessage("Could not disconnect the wallet. Try again.");
    } finally {
      setBusy(false);
    }
  };

  const sendPayment = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!wallet) return;

    const cleanAmount = amount.trim();
    const destination = recipient.trim();
    if (!StrKey.isValidEd25519PublicKey(destination)) {
      setMessage("Enter a valid Stellar public address beginning with G.");
      return;
    }
    if (!/^\d+(\.\d{1,7})?$/.test(cleanAmount) || Number(cleanAmount) <= 0) {
      setMessage("Enter an amount greater than zero with up to 7 decimal places.");
      return;
    }
    if (destination === wallet.address) {
      setMessage("You cannot send a payment to the connected account itself.");
      return;
    }

    setBusy(true);
    setMessage("Preparing your Testnet payment…");
    setTxHash(null);
    try {
      const account = await server.loadAccount(wallet.address);
      const transaction = new TransactionBuilder(account, {
        fee: BASE_FEE,
        networkPassphrase: Networks.TESTNET,
      })
        .addOperation(
          Operation.payment({
            destination,
            asset: Asset.native(),
            amount: cleanAmount,
          }),
        )
        .setTimeout(180)
        .build();

      const signed = await signTransaction(transaction.toXDR(), {
        network: "TESTNET",
        address: wallet.address,
      });
      if (signed.error || !signed.signedTxXdr) {
        throw new Error(signed.error?.message ?? "Wallet signing was not completed.");
      }
      if (signed.signerAddress !== wallet.address) {
        throw new Error("The wallet signed with a different account. Reconnect and try again.");
      }

      const signedTransaction = TransactionBuilder.fromXDR(
        signed.signedTxXdr,
        STELLAR_CONFIG.networkPassphrase,
      );
      const result = await server.submitTransaction(signedTransaction);
      setTxHash(result.hash);
      setMessage("Payment submitted and accepted by Stellar Testnet.");
      setAmount("");
      await loadBalance(wallet.address);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Transaction submission failed.");
    } finally {
      setBusy(false);
    }
  };

  const createRequest = () => {
    const cleanAmount = requestAmount.trim();
    if (cleanAmount && (!/^\d+(\.\d{1,7})?$/.test(cleanAmount) || Number(cleanAmount) <= 0)) {
      setMessage("Enter a valid requested amount with up to 7 decimal places.");
      return;
    }
    const url = new URL(window.location.href);
    url.searchParams.set("payTo", wallet!.address);
    url.searchParams.set("asset", "XLM");
    url.searchParams.set("network", "testnet");
    if (cleanAmount) url.searchParams.set("amount", cleanAmount);
    else url.searchParams.delete("amount");
    setRequestUrl(url.toString());
    setCopied(false);
    setMessage("Payment request created. Share the link or QR code with the payer.");
  };

  const copyRequest = async () => {
    if (!requestUrl) return;
    try {
      await navigator.clipboard.writeText(requestUrl);
      setCopied(true);
    } catch {
      setMessage("Clipboard access was blocked. Copy the request link manually.");
    }
  };

  return (
    <div className="flex w-full flex-col gap-3">
      {wallet ? (
        <>
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-emerald-400/15 bg-emerald-400/[0.045] p-3">
            <div className="min-w-0">
              <p className="text-[9px] font-semibold tracking-wide text-emerald-300">CONNECTED · {wallet.network}</p>
              <p className="mt-1 truncate font-mono text-[10px] text-slate-300">{wallet.address.slice(0, 8)}…{wallet.address.slice(-7)}</p>
              <p className="mt-1 text-xs font-semibold text-white">{wallet.balance ?? "Loading…"} XLM</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => loadBalance(wallet.address)} disabled={busy} aria-label="Refresh balance" className="rounded-lg border border-white/10 p-2.5 text-slate-300 transition hover:bg-white/[0.06] disabled:opacity-50"><RefreshCw size={14} /></button>
              <button onClick={disconnectWallet} disabled={busy} className="rounded-lg border border-white/10 px-3 py-2 text-[10px] font-medium text-slate-300 transition hover:bg-white/[0.06] disabled:opacity-50">Disconnect</button>
            </div>
          </div>

          <form id="send" onSubmit={sendPayment} className="w-full rounded-xl border border-white/[0.08] bg-[#0c121c] p-4 text-left">
            <div className="mb-4 flex items-center gap-2.5">
              <span className="grid size-8 place-items-center rounded-lg bg-[#635bff]/15 text-[#aaa5ff]"><Send size={15} /></span>
              <div><h3 className="text-xs font-semibold text-white">Send XLM</h3><p className="mt-0.5 text-[10px] text-slate-500">Wallet-signed Testnet transfer</p></div>
            </div>
            <label htmlFor="stellar-recipient" className="mb-1.5 block text-[10px] font-medium text-slate-300">Recipient Stellar address</label>
            <input id="stellar-recipient" value={recipient} onChange={(event) => setRecipient(event.target.value)} placeholder="G…" autoComplete="off" spellCheck={false} className="mb-3 w-full rounded-lg border border-white/10 bg-[#080b12] px-3 py-2.5 font-mono text-[11px] text-white outline-none placeholder:text-slate-600 focus:border-[#8b85ff]/70" />
            <label htmlFor="stellar-amount" className="mb-1.5 block text-[10px] font-medium text-slate-300">Amount in XLM</label>
            <input id="stellar-amount" inputMode="decimal" value={amount} onChange={(event) => setAmount(event.target.value)} placeholder="0.00" className="w-full rounded-lg border border-white/10 bg-[#080b12] px-3 py-2.5 text-xs text-white outline-none placeholder:text-slate-600 focus:border-[#8b85ff]/70" />
            <p className="mt-2 text-[9px] leading-5 text-slate-500">Review the recipient and amount in your wallet before approving. Network fees apply.</p>
            <button type="submit" disabled={busy || !recipient.trim() || !amount.trim()} className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#635bff] px-4 py-2.5 text-[10px] font-semibold text-white transition hover:bg-[#7770ff] disabled:cursor-not-allowed disabled:opacity-50"><Send size={13} /> {busy ? "Processing…" : "Review and send"}</button>
            {txHash && <a className="mt-3 block break-all text-[10px] leading-5 text-emerald-300 underline underline-offset-4" href={`${STELLAR_CONFIG.explorerUrl}/tx/${txHash}`} target="_blank" rel="noreferrer">View transaction: {txHash}</a>}
          </form>

          <section id="request" className="w-full rounded-xl border border-white/[0.08] bg-[#0c121c] p-4 text-left">
            <div className="mb-4 flex items-center gap-2.5">
              <span className="grid size-8 place-items-center rounded-lg bg-[#635bff]/15 text-[#aaa5ff]"><QrCode size={15} /></span>
              <div><h3 className="text-xs font-semibold text-white">Request a payment</h3><p className="mt-0.5 text-[10px] text-slate-500">Create a shareable XLM request</p></div>
            </div>
            <label htmlFor="request-amount" className="mb-1.5 block text-[10px] font-medium text-slate-300">Requested amount <span className="text-slate-600">(optional)</span></label>
            <input id="request-amount" inputMode="decimal" value={requestAmount} onChange={(event) => { setRequestAmount(event.target.value); setRequestUrl(null); }} placeholder="Amount in XLM" className="w-full rounded-lg border border-white/10 bg-[#080b12] px-3 py-2.5 text-xs text-white outline-none placeholder:text-slate-600 focus:border-[#8b85ff]/70" />
            <button type="button" onClick={createRequest} className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.045] px-4 py-2.5 text-[10px] font-semibold text-slate-100 transition hover:bg-white/[0.08]"><QrCode size={13} /> Create payment request</button>
            {requestUrl && (
              <div className="mt-4 grid gap-3 rounded-lg border border-white/[0.08] bg-[#080b12] p-3 sm:grid-cols-[100px_1fr] sm:items-center">
                <div className="mx-auto rounded-md bg-white p-2"><QRCodeSVG value={requestUrl} size={84} level="M" /></div>
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold text-white">Request ready to share</p>
                  <p className="mt-1 break-all text-[9px] leading-4 text-slate-500">{requestUrl}</p>
                  <button type="button" onClick={copyRequest} className="mt-2 inline-flex items-center gap-1.5 rounded-md bg-[#635bff] px-2.5 py-2 text-[9px] font-semibold text-white hover:bg-[#7770ff]">{copied ? <Check size={12} /> : <Copy size={12} />}{copied ? "Copied" : "Copy link"}</button>
                </div>
              </div>
            )}
            <p className="mt-3 text-[9px] leading-5 text-slate-500">The link shares payment details only. It does not move funds or guarantee payment.</p>
          </section>
        </>
      ) : (
        <div className="rounded-xl border border-white/[0.08] bg-[#0c121c] p-4">
          <div className="mb-4 flex items-start gap-3">
            <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-[#635bff]/15 text-[#aaa5ff]"><Wallet size={16} /></span>
            <div><p className="text-xs font-semibold text-white">Connect your Stellar wallet</p><p className="mt-1 text-[10px] leading-5 text-slate-500">Connect to view your balance, send XLM and create payment requests.</p></div>
          </div>
          <button onClick={connect} disabled={busy} className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#635bff] px-4 py-3 text-[10px] font-semibold text-white transition hover:bg-[#7770ff] disabled:cursor-wait disabled:opacity-60"><Wallet size={14} /> {busy ? "Connecting…" : "Connect wallet"}</button>
        </div>
      )}
      {message && <p role="status" className="text-left text-[10px] leading-5 text-amber-300">{message}</p>}
    </div>
  );
}

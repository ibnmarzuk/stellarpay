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

type WalletState = {
  address: string;
  balance: string | null;
  network: string;
};

const server = new Server(STELLAR_CONFIG.horizonUrl);

export function WalletConnect() {
  const [wallet, setWallet] = useState<WalletState | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [txHash, setTxHash] = useState<string | null>(null);\n  const [requestAmount, setRequestAmount] = useState("");\n  const [requestUrl, setRequestUrl] = useState<string | null>(null);\n  const [copied, setCopied] = useState(false);

  const loadBalance = useCallback(async (address: string) => {
    try {
      const account = await server.loadAccount(address);
      const native = account.balances.find((item) => item.asset_type === "native");
      setWallet((current) =>
        current?.address === address
          ? { ...current, balance: native?.balance ?? "0.00" }
          : current,
      );
      setMessage(null);
    } catch (error) {
      const status = (error as { response?: { status?: number } })?.response?.status;
      if (status === 404) {
        setWallet((current) =>
          current?.address === address ? { ...current, balance: "0.00" } : current,
        );
        setMessage("This Testnet account is not funded yet. Fund it with the Stellar Friendbot before sending.");
      } else {
        setMessage("Balance lookup failed. Check your connection and try again.");
      }
    }
  }, []);

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
    if (!StrKey.isValidEd25519PublicKey(recipient.trim())) {
      setMessage("Enter a valid Stellar public address beginning with G.");
      return;
    }
    if (!/^\d+(\.\d{1,7})?$/.test(cleanAmount) || Number(cleanAmount) <= 0) {
      setMessage("Enter an amount greater than zero with up to 7 decimal places.");
      return;
    }
    if (recipient.trim() === wallet.address) {
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
            destination: recipient.trim(),
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
      const detail = error instanceof Error ? error.message : "Transaction submission failed.";
      setMessage(detail);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex w-full flex-col items-stretch gap-3">
      {wallet ? (
        <>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="min-w-0 flex-1 rounded-xl border border-emerald-400/20 bg-emerald-400/[0.06] px-3 py-2 text-left">
              <p className="text-[10px] text-emerald-300">CONNECTED · {wallet.network}</p>
              <p className="mt-0.5 font-mono text-[11px] text-slate-200">{wallet.address.slice(0, 6)}…{wallet.address.slice(-6)}</p>
              <p className="mt-1 text-xs font-semibold text-white">{wallet.balance ?? "Loading…"} XLM</p>
            </div>
            <button onClick={() => loadBalance(wallet.address)} disabled={busy} aria-label="Refresh balance" className="rounded-xl border border-white/10 p-3 text-slate-300 hover:bg-white/[0.06] disabled:opacity-50">
              <RefreshCw size={15} />
            </button>
            <button onClick={disconnectWallet} disabled={busy} className="rounded-xl border border-white/10 px-3 py-3 text-xs text-slate-300 hover:bg-white/[0.06] disabled:opacity-50">
              Disconnect
            </button>
          </div>

          <form id="send" onSubmit={sendPayment} className="mt-4 w-full max-w-xl rounded-2xl border border-white/[0.09] bg-[#101621] p-5 text-left sm:p-6">
            <div className="mb-5 flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-xl bg-[#8aa5ff]/10 text-[#a9bcff]"><Send size={18} /></span>
              <div>
                <h3 className="text-sm font-semibold text-white">Send XLM</h3>
                <p className="mt-1 text-[11px] text-slate-400">A real wallet-signed Stellar Testnet payment</p>
              </div>
            </div>
            <label htmlFor="stellar-recipient" className="mb-2 block text-xs text-slate-300">Recipient Stellar address</label>
            <input id="stellar-recipient" value={recipient} onChange={(event) => setRecipient(event.target.value)} placeholder="G…" autoComplete="off" spellCheck={false} className="mb-4 w-full rounded-xl border border-white/10 bg-[#080b12] px-4 py-3 font-mono text-xs text-white outline-none placeholder:text-slate-600 focus:border-[#8aa5ff]/60" />
            <label htmlFor="stellar-amount" className="mb-2 block text-xs text-slate-300">Amount in XLM</label>
            <input id="stellar-amount" inputMode="decimal" value={amount} onChange={(event) => setAmount(event.target.value)} placeholder="0.00" className="w-full rounded-xl border border-white/10 bg-[#080b12] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-[#8aa5ff]/60" />
            <p className="mt-2 text-[10px] leading-5 text-slate-500">Review the recipient and amount carefully in your wallet before approving. Network fees apply.</p>
            <button type="submit" disabled={busy || !recipient.trim() || !amount.trim()} className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#8aa5ff] px-4 py-3 text-xs font-semibold text-[#09101f] transition hover:bg-[#a5b9ff] disabled:cursor-not-allowed disabled:opacity-50">
              <Send size={14} /> {busy ? "Processing…" : "Review and send"}
            </button>
            {txHash && (
              <a className="mt-4 block break-all text-xs text-emerald-300 underline underline-offset-4" href={`${STELLAR_CONFIG.explorerUrl}/tx/${txHash}`} target="_blank" rel="noreferrer">
                View confirmed transaction: {txHash}
              </a>
            )}
          </form>
        </>
      ) : (
        <button onClick={connect} disabled={busy} className="inline-flex items-center gap-2 rounded-xl border border-[#8aa5ff]/30 bg-[#8aa5ff] px-4 py-3 text-xs font-semibold text-[#09101f] transition hover:bg-[#a5b9ff] disabled:cursor-wait disabled:opacity-60">
          <Wallet size={15} /> {busy ? "Connecting…" : "Connect wallet"}
        </button>
      )}
      {message && <p role="status" className="max-w-xl text-left text-[10px] leading-5 text-amber-300">{message}</p>}
    </div>
  );
}

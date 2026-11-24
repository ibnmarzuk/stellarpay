"use client";

import { useCallback, useEffect, useState } from "react";
import { disconnect, getNetwork, isConnected, requestAccess } from "@stellar/varial-sdk";
import { RefreshCw, Wallet } from "lucide-react";
import { STELLAR_CONFIG } from "@/lib/stellar/config";

type WalletState = {
  address: string;
  balance: string | null;
  network: string;
};

export function WalletConnect() {
  const [wallet, setWallet] = useState<WalletState | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const loadBalance = useCallback(async (address: string) => {
    try {
      const response = await fetch(`${STELLAR_CONFIG.horizonUrl}/accounts/${address}`);
      if (response.status === 404) {
        setWallet((current) => current?.address === address ? { ...current, balance: "0.00" } : current);
        setMessage("This Testnet account is not funded yet. Get test XLM from the Stellar Friendbot.");
        return;
      }
      if (!response.ok) throw new Error("Could not load the account balance.");
      const account = await response.json();
      const native = account.balances?.find((item: { asset_type: string }) => item.asset_type === "native");
      setWallet((current) => current?.address === address ? { ...current, balance: native?.balance ?? "0.00" } : current);
      setMessage(null);
    } catch {
      setMessage("Balance lookup failed. Check your connection and try again.");
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
      setMessage("Wallet disconnected from StellarPay.");
    } catch {
      setMessage("Could not disconnect the wallet. Try again.");
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    // Deliberately do not auto-connect or request wallet access on page load.
  }, []);

  return (
    <div className="flex flex-col items-end gap-2">
      {wallet ? (
        <div className="flex flex-wrap items-center justify-end gap-2">
          <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/[0.06] px-3 py-2 text-right">
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
      ) : (
        <button onClick={connect} disabled={busy} className="inline-flex items-center gap-2 rounded-xl border border-[#8aa5ff]/30 bg-[#8aa5ff] px-4 py-3 text-xs font-semibold text-[#09101f] transition hover:bg-[#a5b9ff] disabled:cursor-wait disabled:opacity-60">
          <Wallet size={15} /> {busy ? "Connecting…" : "Connect wallet"}
        </button>
      )}
      {message && <p role="status" className="max-w-sm text-right text-[10px] leading-4 text-amber-300">{message}</p>}
    </div>
  );
}

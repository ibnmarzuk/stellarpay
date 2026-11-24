export const STELLAR_CONFIG = {
  network: "TESTNET",
  horizonUrl:
    process.env.NEXT_PUBLIC_STELLAR_HORIZON ??
    "https://horizon-testnet.stellar.org",
  explorerUrl:
    process.env.NEXT_PUBLIC_STELLAR_EXPLORER ??
    "https://stellar.expert/explorer/testnet",
  networkPassphrase: "Test SDF Network ; September 2015",
} as const;

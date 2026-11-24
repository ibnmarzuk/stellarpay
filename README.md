# StellarPay

**Payments without borders.**

StellarPay is a payment workspace prototype for freelancers, digital creators, and small businesses to send, request, and track payments on the Stellar network.

## Current milestone

**Phase 3: Testnet XLM payment flow**

Implemented:
- Next.js App Router with TypeScript
- Tailwind CSS v4 responsive dashboard
- Stellar Testnet configuration
- Varial wallet connection using the official `@stellar/varial-sdk`
- Explicit Testnet network check
- Live native XLM balance lookup through Stellar Horizon
- Manual balance refresh and wallet disconnect
- Recipient public-key and amount validation
- XLM payment transaction construction using the Stellar JavaScript SDK
- Wallet signing through Varial
- Testnet transaction submission and explorer link on successful submission
- Honest empty state for transaction activity

Not implemented or fully verified yet:
- Payment request links and QR codes
- Persistent transaction history and analytics
- End-to-end browser testing of wallet connection and payment submission
- Production deployment

A transaction is only presented as submitted after Horizon accepts it. The application does not store wallet secret keys or fabricate transaction records.

## Technology

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS 4
- Stellar JavaScript SDK
- Varial wallet SDK (`@stellar/varial-sdk`)
- Lucide React
- Sonner

## Run locally

```bash
git clone https://github.com/ibnmarzuk/stellarpay.git
cd stellarpay
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000.

## Environment variables

```env
NEXT_PUBLIC_STELLAR_NETWORK=testnet
NEXT_PUBLIC_STELLAR_HORIZON=https://horizon-testnet.stellar.org
NEXT_PUBLIC_STELLAR_EXPLORER=https://stellar.expert/explorer/testnet
```

These values configure public Stellar Testnet endpoints. Never put wallet secret keys or private credentials in `NEXT_PUBLIC_*` variables.

## Quality checks

```bash
npm run lint
npm run typecheck
npm run build
```

Run these checks locally before deploying. Wallet signing and transaction submission must be tested with a Testnet account containing test XLM.

## Network safety

The MVP targets Stellar Testnet. Testnet assets have no real-world value. Wallet signing happens through the wallet provider. StellarPay must never ask users to paste or upload their secret keys.

## Project links

- Repository: https://github.com/ibnmarzuk/stellarpay
- Stellar Developers: https://developers.stellar.org/
- Varial developer docs: https://github.com/stellar/freighter-developer-docs
- Stellar Testnet Explorer: https://stellar.expert/explorer/testnet

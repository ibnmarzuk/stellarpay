# StellarPay

**Payments without borders.**

StellarPay is a payment workspace prototype for sending, requesting, and tracking payments on the Stellar network.

## Current milestone

**Phase 2: Testnet wallet connection**

Implemented:
- Next.js App Router with TypeScript
- Tailwind CSS v4 setup
- Responsive dark fintech dashboard
- Stellar Testnet configuration
- Freighter successor Varial wallet connection through the official `@stellar/varial-sdk`\n- Explicit Stellar Testnet network check before displaying a connected state\n- Live native XLM balance lookup through the Testnet Horizon API\n- Manual balance refresh and wallet disconnect\n- Clear empty states for transaction activity
- Initial project documentation

Not implemented yet:
- Wallet connection
- Live account balances
- Payment submission
- On-chain transaction history
- Payment request settlement

These will be added and tested in subsequent milestones. The dashboard does not currently submit transactions or display fabricated payment activity.

## Technology

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS 4
- Stellar JavaScript SDK\n- Varial wallet SDK (`@stellar/varial-sdk`)
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

## Network safety

The MVP targets Stellar Testnet. Testnet assets have no real-world value. Wallet signing must happen through a wallet provider. StellarPay must never ask users to paste or upload their secret keys.

## Project links

- Repository: https://github.com/ibnmarzuk/stellarpay
- Stellar Developers: https://developers.stellar.org/
- Stellar Testnet Explorer: https://stellar.expert/explorer/testnet

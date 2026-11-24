# StellarPay

**Payments without borders.**

StellarPay is a dark, Stripe-inspired payment workspace prototype for freelancers, digital creators, and small businesses to send and request XLM on Stellar.

## Current milestone

**Phase 4: Product experience and payment requests**

Implemented:
- Responsive Next.js App Router dashboard with TypeScript and Tailwind CSS v4
- Dark fintech visual system with responsive desktop sidebar and mobile navigation
- Stellar Testnet configuration and clear test environment messaging
- Varial wallet connection using `@stellar/varial-sdk`
- Explicit Stellar Testnet network check before wallet use
- Live native XLM balance lookup through Stellar Horizon, reflected in the dashboard
- Manual balance refresh and wallet disconnect
- Recipient Stellar public-key validation and XLM amount validation
- XLM payment transaction construction using the Stellar JavaScript SDK
- Wallet signing through Varial and Testnet transaction submission
- Explorer link after successful transaction submission
- Payment request link creation with optional XLM amount
- QR code for sharing payment request details
- Copy payment request link action

Not implemented or not yet verified:
- Automatic parsing and checkout of incoming payment request links
- Persistent transaction history and analytics
- Full end-to-end browser testing of wallet connection, signing, and payment submission
- Production deployment

Payment request links share the recipient, asset, network, and optional amount. They do not move funds or guarantee that a payment has been made. The app does not store wallet secret keys or fabricate transaction records.

## Design direction

The interface uses a dark, restrained fintech direction inspired by Stripe's clarity: clear hierarchy, subtle borders, a focused violet accent, concise labels, and task-oriented payment flows. It is an independent StellarPay design, not a reproduction of Stripe's product or branding.

## Technology

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS 4
- Stellar JavaScript SDK
- Varial wallet SDK (`@stellar/varial-sdk`)
- Lucide React
- qrcode.react
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

Run these checks locally before deploying. Wallet connection, signing, and transaction submission must be tested with a Testnet account containing test XLM.

## Network safety

The MVP targets Stellar Testnet. Testnet assets have no real-world value. Wallet signing happens through the wallet provider. StellarPay must never ask users to paste or upload their secret keys.

## Project links

- Repository: https://github.com/ibnmarzuk/stellarpay
- Stellar Developers: https://developers.stellar.org/
- Varial developer docs: https://github.com/stellar/freighter-developer-docs
- Stellar Testnet Explorer: https://stellar.expert/explorer/testnet

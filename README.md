# StellarPay

**Payments without borders.**

StellarPay is a Testnet payment workspace prototype for freelancers, digital creators, and small businesses. It is designed to make sending, requesting, and verifying XLM payments on Stellar easier to understand.

## Current product scope

Implemented in the repository:
- Responsive dark fintech dashboard with a Stripe-inspired visual direction
- Stellar Testnet configuration and network guard
- Varial wallet connection and disconnection flow
- Live native XLM balance lookup through Stellar Horizon
- XLM payment construction, wallet signing, and Horizon submission
- Shareable payment request links with QR codes
- Dedicated payment checkout route at `/pay` that reads and validates request parameters
- Recent native XLM payment activity loaded from Stellar Horizon
- Dedicated transaction receipt pages that re-fetch transaction details and operations from Stellar Horizon
- Explorer links for submitted and retrieved transactions
- Explicit Testnet messaging and no-secret-key handling

The activity feed currently shows a recent window of native XLM payment operations. Dashboard received and sent figures are calculated from the records currently loaded, not lifetime account totals.

## Important limitations

- The implementation has not yet been verified with a local production build or a full end-to-end wallet test.
- Wallet provider API compatibility must be checked against the installed Varial SDK version.
- Payment requests are shareable links, not invoices or guarantees of settlement.
- The checkout is Testnet-only. Testnet assets have no real-world monetary value.
- Recent activity is not yet persisted in an application database and does not include every Stellar operation or asset type.
- Receipt pages currently target Testnet transaction hashes and depend on Horizon availability.
- Mainnet support, production monitoring, and a full security review are not part of this prototype.

## Technology

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- Stellar JavaScript SDK
- Varial wallet SDK
- Horizon API
- QRCode React
- Lucide React

## Run locally

```bash
git clone https://github.com/ibnmarzuk/stellarpay.git
cd stellarpay
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000.

## Quality checks

Run these before treating the current milestone as verified:

```bash
npm run lint
npm run typecheck
npm run build
```

Then test the following on Stellar Testnet:
1. Connect a Testnet wallet and confirm the displayed address and network.
2. Confirm the balance matches the account on Stellar Expert.
3. Send a small XLM test payment to another funded Testnet account.
4. Confirm the transaction hash opens the matching explorer record.
5. Refresh the dashboard and confirm the payment appears in recent activity.
6. Create a payment request, open its link in another browser session, and complete the wallet-signed checkout.

## Network safety

StellarPay targets Stellar Testnet. Testnet assets have no real-world value. Wallet signing must happen through a wallet provider. Never paste, upload, or store wallet secret keys in StellarPay. Review the destination and amount in the wallet before approving a payment.

## Project links

- Repository: https://github.com/ibnmarzuk/stellarpay
- Stellar Developers: https://developers.stellar.org/
- Stellar Testnet Explorer: https://stellar.expert/explorer/testnet

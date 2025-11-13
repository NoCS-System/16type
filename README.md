This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Deploy to Vercel (Quick)

1. Push to GitHub:
   ```bash
   git add -A
   git commit -m "chore: prepare for vercel deploy (ads.txt/robots/sitemap)"
   git branch -M main
   git remote add origin https://github.com/<yourname>/16type.git
   git push -u origin main
   ```
2. Go to Vercel → New Project → Import your repo
3. Set Environment Variables (if used):
   - `NEXT_PUBLIC_ADSENSE_SLOT_RESULT_INTENT`
   - (optional) `NEXT_PUBLIC_ADSENSE_SLOT_RESULT_BOTTOM`, `NEXT_PUBLIC_ADSENSE_SLOT_RESULT_ASIDE`
4. Deploy
5. If using AdSense, add `public/ads.txt` with your Publisher ID:
   ```
   google.com, pub-xxxxxxxxxxxxxxxx, DIRECT, f08c47fec0942fa0
   ```
6. (Optional) Add a custom domain in Vercel → Settings → Domains

## Quiz, Scoring, Confidence

- 20 questions (4 axes × 5 questions) at `/quiz`, Japanese prompts in `src/data/questions.ts`.
- Scoring logic in `src/lib/scoring.ts`:
  - Each answer maps Yes→axis yesSide (+1) / No→opposite (+1).
  - Tie defaults: C, S, U, A.
  - TypeKey: `${P|C}${S|T}${R|U}${Pn|A}`.
  - Confidence per axis: max(sideCount)/5 (0..1). Overall: average × 100%.
- Results are persisted to `sessionStorage:last_quiz_result` and shown at `/result?k=XXXX`.

## Ads

- Client-only `AdSlot` component supports `mode="inline" | "modal"` and `onImpression`.
- Result-intent ad:
  - Triggered on "結果を見る" click if not capped (`sessionStorage: ad_shown_result_intent`).
  - Modal opens, `onImpression` or 1.8s fallback enables "結果へ進む".
  - Navigates to `/result?k=XXXX`.
- Result page ads:
  - Bottom and aside slots, each capped once per session.
- If env vars are not set, AdSlot renders skeleton placeholders only.

### Env

Create `.env.local` from `.env.example`.

```bash
NEXT_PUBLIC_ADSENSE_SLOT_RESULT_INTENT=xxxxxxxxxx
# Optional:
# NEXT_PUBLIC_ADSENSE_SLOT_RESULT_BOTTOM=xxxxxxxxxx
# NEXT_PUBLIC_ADSENSE_SLOT_RESULT_ASIDE=xxxxxxxxxx
```


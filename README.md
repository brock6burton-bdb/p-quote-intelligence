# Prism V4 — Functional MVP

This version adds:

- Stripe Checkout route
- Demo mode for testing without charging
- Real quote upload page
- Payment verification before analysis
- OpenAI PDF/image analysis
- Dynamic results page
- Print / Save PDF button
- File type, file count, and 10 MB validation

## 1. Replace the GitHub files

Upload this structure:

```text
app/
  api/
    analyze/route.ts
    checkout/route.ts
  analyze/page.tsx
  report/page.tsx
  results/page.tsx
  globals.css
  layout.tsx
  page.tsx
.env.example
next-env.d.ts
package.json
tsconfig.json
README.md
```

## 2. Add Vercel environment variables

In Vercel:

Settings → Environment Variables

Add:

```text
OPENAI_API_KEY
STRIPE_SECRET_KEY
NEXT_PUBLIC_SITE_URL
PRISM_DEMO_MODE
```

For the live site:

```text
NEXT_PUBLIC_SITE_URL=https://planwithprism.com
```

Start with:

```text
PRISM_DEMO_MODE=true
```

This lets you test the entire upload and analysis flow without Stripe.

## 3. Test AI analysis first

With demo mode enabled:

1. Visit planwithprism.com
2. Click Analyze my quotes
3. Upload one to three quotes
4. Generate a real report

This requires a valid `OPENAI_API_KEY`.

## 4. Turn on Stripe

Create a Stripe account and copy the test-mode secret key.

Set:

```text
STRIPE_SECRET_KEY=sk_test_...
PRISM_DEMO_MODE=false
```

Redeploy. Checkout will charge $49 in Stripe test mode.

Do not switch to a live Stripe secret key until you have tested the full flow, added business details, and reviewed the site policies.

## Important MVP limitations

- Reports are stored only in the customer's browser using localStorage.
- There is no account system or database yet.
- Files are sent to OpenAI for analysis and are not stored by Prism.
- The report is decision support and not legal, engineering, code-compliance, or licensing advice.
- Before accepting real customers, add Terms, Privacy, Refund Policy, data-retention language, error monitoring, and a support email.

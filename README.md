# Developer Tools Platform

A privacy-friendly, SEO-ready developer tools website built with Next.js, TypeScript, and Tailwind CSS. The platform includes a homepage, searchable tool directory, and six core browser-based utilities for common engineering tasks.

## Included tools

- JSON Formatter and Validator
- JWT Decoder
- Cron Expression Generator
- Regex Tester
- CSV to JSON Converter
- SQL Query Formatter

## Local development

```bash
npm install
npm run dev
```

Open http://localhost:3000 to view the app.

## Production checks

```bash
npm run lint
npx tsx --test tests/tool-utils.test.ts
npm run build
```

## Deployment

This app is structured to be Vercel-friendly and is designed for static generation and browser-side utility processing. For production deployment:

1. Push the project to a GitHub repository.
2. Import it into Vercel.
3. Set `NEXT_PUBLIC_SITE_URL` for sitemap and canonical metadata if using a custom domain.
4. Validate the sitemap and robots outputs after deployment.

## Notes

- Core utility logic runs in the browser.
- Sensitive input is not intentionally stored or sent to a backend.
- SEO metadata, sitemap, and robots files are included for indexable pages.

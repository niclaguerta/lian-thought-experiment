# IDEA Workshop

[Open the workshop](https://niclaguerta.github.io/ideaworkshop-authorship/) · [Facilitator results](https://niclaguerta.github.io/ideaworkshop-authorship/results.html)

An English-only workshop activity based on the original character cards, narrative, and worksheets. It reuses their artwork, sampled colors, and embedded font subsets.

## Participant experience

Follow parts 1, 2, 3, 4, 5, 6a, and 6b in order. Parts 1, 2, 3, and 5 are reading material. Part 4 collects moral and practical concerns. Parts 6a and 6b collect collaborative stories. All four written responses are submitted together, with a required name and a random response code. A name is required. Email addresses are not collected by this application.

Drafts stay in the current browser when storage is available. Use a separate browser profile or device for each participant/group. A submission retry reuses the same response code so it cannot create duplicate records.

## Collection status

Online submissions are enabled. The submission endpoint accepts the four written answers from the GitHub website. Stored responses remain protected: viewing and CSV export require the facilitator key. Participants must provide a name; email addresses are not collected.

## Hosting

- **GitHub Pages:** the participant website and facilitator interface are compiled from `github-web/` using the same React screens in `app/`.
- **Sites / Cloudflare Worker:** `/api/submissions` saves data in D1. `/api/results` requires the facilitator key. Responses never enter the GitHub repository.
- Backend origin: `https://lian-thought-experiment.flashypumpkin.chatgpt.site`.
- Allowed GitHub frontend origin: `https://niclaguerta.github.io`.

GitHub Pages cannot run a server or database; the separate backend must be reachable for submissions and results to work.

## Development

Node 22.13+ is required.

```sh
npm ci
npm run dev
npm run build:pages
```

The Pages workflow publishes pushes to `main`. In repository Settings → Pages, choose **GitHub Actions** as the source. The generated website is in `github-pages/` and is not committed.

## Facilitator results

Open `results.html` on GitHub Pages, or `/results` on the backend site. Enter the facilitator key. Search answers or names, expand each submission, and export the currently filtered results to CSV. The CSV includes a response code, timestamp, language, name, and a separate column for each answer.

Set `ADMIN_KEY` as a secret in the backend's Sites runtime environment. Never add it to this repository, GitHub Pages variables, or frontend files. The key is only entered by the facilitator and sent directly to the backend over HTTPS. Production database records are distinct from local preview records.

## Database changes

The schema lives in `db/schema.ts`; generated migrations live in `drizzle/`. Generate new migrations with `npm run db:generate`. Deploy the Worker through Sites to apply production migrations. Do not edit an applied migration.

## Source assets

`public/original/` contains artwork rendered from the supplied PDFs and converted embedded font subsets. These are workshop source assets; no general reuse license is granted by this repository.

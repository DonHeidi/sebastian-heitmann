# sebastian-heitmann

Source of [sebastian-heitmann.dev](https://www.sebastian-heitmann.dev) — the personal site, the published articles, and the serverless contact pipeline behind them.

## Why this is public

Two reasons:

1. **Transparency.** The live site you read is built from this repository. The Astro pages, the i18n machinery, the Terraform that provisions the Scaleway project, the serverless function that delivers contact-form submissions — all of it is here.
2. **Work sample.** I work as a fractional CTO. If you're considering working with me, this repo is one way to look at how I build: how I structure a small monorepo, how I treat infrastructure, what tradeoffs I make on a project where nobody else is reviewing the pull requests.

It is not maintained as a fork-friendly template — the configuration and content are specific to my site — but you are welcome to read it, copy patterns, or take ideas.

## What's in here

```
apps/
├── website/        Astro 6 personal site (en-us, en-gb, de-de)
└── mail-service/   Scaleway serverless function — contact-form handler
infra/              Terraform — Scaleway project, object storage, CDN, IAM, TEM
scripts/            Deployment helpers
```

Stack: Bun workspaces · Astro 6 · TypeScript · SCSS · Terraform · Scaleway (Object Storage, Edge Services, Serverless Functions, Transactional Email).

## Local development

```bash
bun install
cd apps/website
bun run dev
```

That covers browsing the site locally. The contact form needs the mail service running; copy `apps/mail-service/.env.example` and fill in your own Scaleway credentials if you want to exercise it end-to-end.

## Deployment

Deploys target my own Scaleway project. The toolchain (Terraform, AWS CLI, Scaleway CLI) is managed by [mise](https://mise.jdx.dev); install it and authenticate Scaleway once:

```bash
mise install                  # bun, terraform, aws-cli, scaleway-cli
scw init                      # writes ~/.config/scw/config.yaml (Scaleway API key + secret)

./scripts/apply-infra.sh      # Provision/update infrastructure (Terraform)
./scripts/deploy-website.sh   # Build website and upload to Scaleway Object Storage
```

Operational details — Scaleway gotchas, environment separation, the remote state backend — live in [`AGENTS.md`](./AGENTS.md).

## Contact

The contact form on [sebastian-heitmann.dev](https://www.sebastian-heitmann.dev) is the right place.

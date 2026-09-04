# n8n Engagement Monitor Template

A ready-to-import n8n workflow that checks your GitHub repos' stars/forks/issues and your dev.to articles'
reactions/comments on a schedule, so you stop manually opening five tabs to check if anyone noticed the
thing you shipped.

Free, MIT, verified working (not a screenshot of a workflow that's never actually run — this exact JSON was
imported into a real n8n instance and executed successfully before being published).

## What it does

```
Schedule Trigger (every 12h)
  → GitHub Repo 1  (stars, forks, open issues)
  → GitHub Repo 2  (stars, forks, open issues)
  → dev.to Article 1  (reactions, comments)
  → Compile Summary  (one JSON record per run, viewable in n8n's Executions tab)
```

## Install

1. Have n8n running (self-hosted is free: `npx n8n start`, or use n8n Cloud).
2. In the n8n UI: **Workflows → Import from File** → select `engagement-monitor-template.json`.
3. Open the **GitHub Repo 1** / **GitHub Repo 2** nodes and replace the placeholder URL with your own repo,
   e.g. `https://api.github.com/repos/YOUR_USERNAME/YOUR_REPO`.
4. Open **dev.to Article 1** and replace the placeholder URL the same way:
   `https://dev.to/api/articles/YOUR_DEVTO_USERNAME/YOUR_ARTICLE_SLUG`.
5. Open **Compile Summary** (a Code node) — it's plain JavaScript, read it, it's ~10 lines. If you rename a
   node, update the matching `$('Node Name')` reference.
6. Activate the workflow.

## Extending it

Want to track more repos or articles? Duplicate an HTTP Request node, point it at the new URL, wire it into
the chain, and add its data to the `Compile Summary` code. The pattern is deliberately simple (one straight
line of nodes, each referenced by name later) rather than a clever generic loop, so it's easy to read and
modify without knowing n8n deeply.

Natural next additions: a Slack/Discord notification node when stars cross a threshold, an `IF` node to only
alert on actual changes instead of every run, or a Postgres/Airtable node instead of relying on n8n's
execution history for storage.

## Why this exists

Built this for my own use first (tracking two GitHub repos and three dev.to articles for a different
project), then generalized and published it because "check if anyone noticed what I shipped" is a need every
indie hacker has and almost nobody automates.

## Support this project

Free, no strings attached. Tips welcome via USDC/ETH on Base, Ethereum, Polygon, Arbitrum, or Optimism (same
address on all):

```
0x36CCCB5854e1d513A2Af94CeaFC0f886102634e2
```

## License

MIT

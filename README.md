# DuckBot website

Static website for [duckpoints.com](https://duckpoints.com), hosted with GitHub Pages.

## Pages

- Homepage: `index.html`
- Leaderboard: `leaderboard.html`
- Privacy policy: `privacy-policy.html`
- Terms of service: `terms-of-service.html`

GitHub Pages publishes the `main` branch from the repository root.

The leaderboard loads data directly from the DuckBot API. Select a Discord guild with
the `guild` query parameter:

`https://duckpoints.com/leaderboard.html?guild=618712310185197588`

The page also accepts `guid` or `Guid` as aliases.

The API must allow cross-origin requests from `https://duckpoints.com`.

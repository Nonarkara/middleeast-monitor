# Middle East // War Monitor

Browser dashboard for Middle East conflict coverage. It is a single static page (`index.html`) that pulls public RSS and open APIs in the client, then lays news, map overlays, and supporting panels over a Leaflet map.

This is **not** an official intelligence product. Figures on screen are mixed: some come from live public feeds, some from regex over news/ReliefWeb text, and some are seeded or labeled simulated in the UI. Treat every number as unverified until you check the cited source.

Created by [Dr. Non Arkaraprasertkul](https://github.com/Nonarkara). The in-app About modal also credits Associate Professor Dr. Poon Thiengburanathum, with support noted from PMU A (Program Management Unit for Area Based Development) and depa, and execution by Axiom and ReTL.

## Live

- [GitHub Pages](https://nonarkara.github.io/middleeast-monitor/)
- [Cloudflare Pages](https://middleeast-monitor.pages.dev)

## Related repo: `mem-by-non`

[`Nonarkara/mem-by-non`](https://github.com/Nonarkara/mem-by-non) is a **different** product in the same family, branded **MEM by NON — Middle Eastern Monitor**.

| | This repo (`middleeast-monitor`) | `mem-by-non` |
| --- | --- | --- |
| Product name | Middle East // War Monitor | MEM by NON |
| Layout | One HTML file with CSS and JS inlined | Split `index.html` + `app.js` + `style.css` |
| Data path | Browser fetches RSS/APIs (often via `globalmonitor.fly.dev` CORS proxy) | Client calls `https://global.nonarkara.org/api` |
| UI | News-wall / OSINT console: conflict cards, RSS ticker, many below-fold tables | Tabbed MEM surface (INTEL, CONFLICT, SAT, PREDICT, PAPERS) |

They share sponsor/About copy and a similar visitor-ping snippet. They do not share this file layout or this fetch architecture. GitHub lists a Vercel homepage on `mem-by-non`; that deployment is not part of this repository.

## What the page shows

Header: live clock, feed-cycle countdown, light/dark theme.

**Map (Leaflet):** region markers plus toggle layers for US bases, naval groups, embassies, chokepoints, nuclear sites, NASA GIBS MODIS aerosol tiles, NASA EONET events, OpenSky aircraft (off by default), and ACLED points when data is present.

**Left / right rails:** conflict-status cards driven by news keywords; regional stat blocks; intelligence log; RSS incident list; MarineTraffic embed; commodity and humanitarian widgets.

**Below the fold:** order of battle, air defense, drone mentions parsed from headlines, market embeds, cyber/infrastructure (labeled simulated), airstrike counters, maritime choke points, humanitarian metrics, ACLED table, UNHCR cards, ReliefWeb reports, SIPRI arms-transfer table (labeled static).

Optional Anthropic sitrep: paste a key in the page UI (stored in `localStorage`); it is not required to load the dashboard.

## Data sources

Only sources that appear in `index.html` are listed. This README does not publish casualty totals.

**Fetched live (when the request succeeds):**

- RSS: Reuters, AP (via RSSHub), Yahoo/AFP, BBC, Al Jazeera, The Guardian, CNN, DW, France 24, Euronews, TRT World — through `globalmonitor.fly.dev`, rss2json, or feed2json
- [ReliefWeb](https://api.reliefweb.int) reports (also used to scrape death-related numbers from report text)
- [UNHCR population API](https://www.unhcr.org/refugee-statistics)
- [Open-Meteo](https://open-meteo.com) weather
- [Yahoo Finance](https://finance.yahoo.com) commodities (via proxy)
- [CoinGecko](https://www.coingecko.com)
- [USGS earthquakes](https://earthquake.usgs.gov)
- [OpenSky Network](https://opensky-network.org)
- [NASA EONET](https://eonet.gsfc.nasa.gov) and [NASA GIBS](https://gibs.earthdata.nasa.gov) MODIS AOD
- [NOAA SWPC](https://www.swpc.noaa.gov) planetary K-index
- [World Bank](https://data.worldbank.org) military expenditure
- [OCHA HPC](https://api.hpc.tools) plans
- [U.S. EIA](https://www.eia.gov) Brent (demo key)
- Embeds: [MarineTraffic](https://www.marinetraffic.com), [TradingView](https://www.tradingview.com)

**Optional / gated:**

- [ACLED](https://acleddata.com) live API — `ACLED_KEY` in `index.html` is empty. Without a key the ACLED panel keeps a **sample Feb 2025 table** shipped in the page, not a live feed.

**Static, seeded, or labeled simulated in the UI:**

- Sidebar casualty/displacement seeds plus a random increment ticker until (or unless) a live fetch replaces them
- Threat-level gauges (`SIMULATED`)
- Cyber & infrastructure section (`SIMULATED`)
- SIPRI arms-transfer table (static, attributed to SIPRI)
- Hardcoded map overlay catalogues (bases, CSGs, embassies, facilities)

Do not treat regex-extracted or seeded figures as official counts.

## Run locally

No build step. No `package.json`.

```bash
git clone https://github.com/Nonarkara/middleeast-monitor.git
cd middleeast-monitor
python3 -m http.server 8080
```

Open [http://localhost:8080](http://localhost:8080). Opening `index.html` as a `file://` URL also loads the shell; some browser APIs and CORS-sensitive calls (including the optional Anthropic sitrep) work more reliably from a local server.

CDN dependencies: Leaflet 1.9.4, Chart.js 4, Google Fonts (Josefin Sans, JetBrains Mono).

## Optional configuration

- **ACLED:** register at [developer.acleddata.com](https://developer.acleddata.com) and set `ACLED_KEY` in `index.html`. Do not commit a real key.
- **AI sitrep:** enter an Anthropic key in the dashboard field. It stays in the browser (`localStorage`).
- **Visitor log:** `apps-script.js` is a Google Apps Script template that appends visits to a spreadsheet you own. Use your own sheet ID and deployment URL; do not reuse IDs from a public clone.

## Repository layout

| File | Role |
| --- | --- |
| `index.html` | Entire dashboard (markup, CSS, and JS) |
| `404.html` | GitHub Pages custom 404 (older snapshot of the same app) |
| `apps-script.js` | Optional Apps Script visitor webhook |
| `style.css` | Not linked from `index.html` |
| `LICENSE` | MIT |

`.netlify/` and `.wrangler/` are local deploy-tool cache, not app source.

## Disclaimer

OSINT aggregation for information and research. Not official government intelligence or policy guidance. Feeds go down, proxies fail, and several panels are explicitly simulated or static. Authors are not liable for decisions made from this display.

## License

[MIT](LICENSE)

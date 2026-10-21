<p align="center">
  <img src="docs/hero-banner.png" alt="Illustrated banner: a researcher at a desk watching a manga-style Middle East monitoring HUD. The screens are art, not a screenshot of this app." width="100%">
</p>

<p align="center"><em>Hero art only. The glowing HUD, radar rings, and network overlays in the banner are illustration — they are not a capture of the running dashboard.</em></p>

# Middle East // War Monitor

A single-page civic OSINT console for Middle East conflict coverage. The browser pulls public RSS and open APIs, then lays news, map overlays, and supporting panels over a Leaflet map.

**This is not official intelligence.** It is an independent reading surface: some figures are measured from live public feeds, some are modelled from text or keywords, and some are seeded or labeled simulated so the page is never blank. Treat every number as unverified until you check the cited source.

**Live:** [GitHub Pages](https://nonarkara.github.io/middleeast-monitor/) · [Cloudflare Pages](https://middleeast-monitor.pages.dev)

Created by [Dr. Non Arkaraprasertkul](https://github.com/Nonarkara). The in-app About modal also credits Associate Professor Dr. Poon Thiengburanathum, with support noted from PMU A (Program Management Unit for Area Based Development) and depa, and execution by Axiom and ReTL.

---

## What this is

`index.html` is the whole product: markup, CSS, and fetch logic in one static file. There is no build step, no `package.json`, and no application backend in this repository. A local HTTP server is enough.

On screen: a region map; conflict-status cards driven by news keywords; an RSS incident wall; humanitarian and market widgets; and below-fold tables (order of battle, air defense, ACLED, UNHCR, ReliefWeb, SIPRI). Optional Anthropic sitrep is a browser-side extra — paste a key in the UI if you want it; the dashboard loads without it.

It is **not** [`mem-by-non`](https://github.com/Nonarkara/mem-by-non). That sibling is a different product (MEM by NON) with split files and a client API at `global.nonarkara.org`. This repo is the news-wall / OSINT console. They share sponsor/About copy and a similar visitor-ping pattern. They do not share this file layout or this fetch architecture.

| | This repo | `mem-by-non` |
| --- | --- | --- |
| Name | Middle East // War Monitor | MEM by NON |
| Layout | One HTML file, CSS/JS inlined | Split `index.html` + `app.js` + `style.css` |
| Data path | Browser fetches RSS/APIs (often via `globalmonitor.fly.dev` CORS proxy) | Client calls `https://global.nonarkara.org/api` |
| Surface | News wall, conflict cards, below-fold tables | Tabbed MEM (INTEL, CONFLICT, SAT, PREDICT, PAPERS) |

---

## Philosophy

Civic work earns attention by being honest about what it does not know.

This console exists so a reader can put **different public sources on the same axis** — wire RSS, ReliefWeb, UNHCR, weather, seismic, aviation, satellite aerosol — and see where they agree, where they lag, and where the page is only filling space. The correlation, or the lack of it, is the insight. The page does not pre-conclude a war for you.

The dark “operations” skin is a reading device, not a claim of authority. A LIVE badge means the client is cycling feeds, not that a government desk certified the numbers. A countdown is visual cadence; staggered fetches drive the actual refresh.

Fork it, retarget the geography, or strip the simulated panels. Keep the labels. A dashboard that cannot say “this is modelled” is furniture.

---

## Ethical use

**Not official intelligence. Not policy guidance. Not a casualty authority.**

Feeds go down. Proxies fail. Regex over news text is not a body count. Seeded tickers are theatre until a live fetch replaces them. Do not brief, publish, or decide from a panel you have not traced to its source.

### Measured vs modelled

| Class | What it means on this page | Examples in `index.html` |
| --- | --- | --- |
| **Measured** | A public feed or embed returned a payload, and the UI shows that payload (or a simple aggregate of it). | RSS via CORS proxies; [UNHCR](https://www.unhcr.org/refugee-statistics) population totals when the API answers; [Open-Meteo](https://open-meteo.com) weather; [USGS](https://earthquake.usgs.gov) quakes; [OpenSky](https://opensky-network.org) aircraft (off by default); [NASA EONET](https://eonet.gsfc.nasa.gov) / [GIBS](https://gibs.earthdata.nasa.gov) MODIS AOD; [NOAA SWPC](https://www.swpc.noaa.gov) K-index; [World Bank](https://data.worldbank.org) military expenditure; [OCHA HPC](https://api.hpc.tools); Yahoo Finance / [CoinGecko](https://www.coingecko.com) / [EIA](https://www.eia.gov) market calls when they succeed; [MarineTraffic](https://www.marinetraffic.com) and [TradingView](https://www.tradingview.com) embeds |
| **Modelled** | Derived in the browser from text, keywords, or a formula — not a first-party statistic. | Conflict-status cards from headline keyword hits; death figures scraped by regex from [ReliefWeb](https://api.reliefweb.int) or news copy; “active fronts” counted from those keyword statuses; strategic risk gauge marked auto-calculated; optional Anthropic sitrep (three sentences from recent headlines, key stays in `localStorage`) |
| **Seeded / static / simulated** | Shipped in the page so a panel is never empty. The UI already labels many of these. | Sidebar casualty/displacement **seeds** plus a random increment ticker until (or unless) a live path replaces them; threat gauges (`SIMULATED`); cyber & infrastructure (`SIMULATED`); SIPRI arms-transfer table (static, attributed); hardcoded map catalogues (bases, CSGs, embassies, facilities); ACLED **sample Feb 2025 table** while `ACLED_KEY` is empty |

This README does not republish seed totals or regex extracts. If a badge says ESTIMATED, SIMULATED, STATIC, DISPUTED, or sample — believe the badge.

**Optional / gated:** [ACLED](https://acleddata.com) live API. `ACLED_KEY` in `index.html` is empty. Register at [developer.acleddata.com](https://developer.acleddata.com) and set your own key locally. Do not commit a real key.

**Do not treat this display as:** a ministry product, a military COP, a humanitarian cluster sitrep, or evidence in court. Authors are not liable for decisions made from it.

---

## How it works

No server in this repo computes intelligence. The page is the client.

1. **Serve static files.** GitHub Pages, Cloudflare Pages, or `python3 -m http.server`.
2. **Cycle public RSS.** Reuters, AP (via RSSHub), Yahoo/AFP, BBC, Al Jazeera, The Guardian, CNN, DW, France 24, Euronews, TRT World — through `globalmonitor.fly.dev`, rss2json, or feed2json, on a staggered timer. A header countdown is visual only.
3. **Paint the map.** Leaflet + Carto basemap. Toggle layers for US bases, naval groups, embassies, chokepoints, nuclear sites, NASA GIBS aerosol tiles, EONET events, OpenSky, and ACLED points when data is present.
4. **Derive theatre cards.** Each region has a keyword list. Matching headlines lift status (tense → active / critical) and feed the left-rail cards and the fronts counter.
5. **Fill supporting panels.** Humanitarian and market widgets fetch in parallel; failures leave stale or seeded values and a badge, rather than inventing a new official series.
6. **Optional extras.** Anthropic sitrep from the page field. Apps Script visitor webhook if you deploy your own copy of `apps-script.js`. Cloudflare Web Analytics may be present on the hosted build; forks should use their own token.

CDN on the page: Leaflet 1.9.4, Chart.js 4, Google Fonts (Josefin Sans, JetBrains Mono).

### Repository layout

| File | Role |
| --- | --- |
| `index.html` | Entire dashboard (markup, CSS, JS) |
| `docs/hero-banner.png` | README illustration only — not UI chrome |
| `404.html` | GitHub Pages custom 404 (older snapshot of the same app) |
| `apps-script.js` | Optional Apps Script visitor webhook **template** |
| `style.css` | Not linked from `index.html` |
| `LICENSE` | MIT |

`.netlify/` and `.wrangler/` are local deploy-tool cache, not app source.

---

## How to run / fork

No build. No npm.

```bash
git clone https://github.com/Nonarkara/middleeast-monitor.git
cd middleeast-monitor
python3 -m http.server 8080
```

Open [http://localhost:8080](http://localhost:8080). Opening `index.html` as `file://` loads the shell; CORS-sensitive calls (including the optional Anthropic sitrep) behave more reliably from a local server.

**Fork checklist**

- Point RSS/proxy URLs at infrastructure you control if you need uptime you can stand behind.
- Set `ACLED_KEY` only in a private copy. Do not commit it.
- For AI sitrep, enter an Anthropic key in the dashboard field. It stays in the browser (`localStorage`).
- For a visitor log, copy `apps-script.js` into your own Apps Script project, use **your** spreadsheet, and deploy **your** web-app URL. Do not reuse IDs or webhook URLs from a public clone.
- Swap the About/sponsor strip if those marks are not yours.
- Keep measured / modelled / simulated labels visible. That is the civic contract.

Host the folder on GitHub Pages, Cloudflare Pages, or any static host. There is nothing to compile.

---

## License

[MIT](LICENSE). Data remains with its providers (newsrooms, UNHCR, ReliefWeb, NASA, NOAA, USGS, ACLED, SIPRI, and the others named above). The banner illustration is atmosphere for this README, not a depiction of classified systems and not a screenshot of the live HUD.

# makefun-trophy-guide-gta6

[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/rawacana2024-del/makefun-trophy-guide-gta6/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/rawacana2024-del/makefun-trophy-guide-gta6/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

An offline guide and tracker for all 55 PlayStation 5 trophies of Grand Theft Auto VI: every trophy with its official name, description and grade, a guide in our own words that cites its sources, a roadmap to the platinum, a missable-trophy warning, and a checklist that saves in the browser. Built by an AI agent for make.fun's "Build the best GTA 6 trophy guide" bounty, $250 in USDC.

## What the guide covers

- **All 55 trophies** — 1 platinum, 2 gold, 6 silver, 46 bronze (28 hidden on PlayStation), all single-player and offline. Official names, descriptions and grades are shown as PlayStation publishes them.
- **A real guide for every trophy** — what to do, where and how, and when it can be missed — written in our own words, each citing its source (PowerPyx, Push Square, KeenGamer, Mobalytics, Sixshore). Sources are cited, never copied. One trophy, Bad Luck, I Guess, is still unconfirmed by every guide and is marked as such.
- **Roadmap to the platinum** — four stages in order, from the 60–80 hour story to the 100% checklist and the platinum, plus the 100% requirements at a glance.
- **The only possibly missable trophy** — Positive Mental Attitude: the Chapter 1 meditation at Jason's house. The guide flags it everywhere and tells you exactly when to do it. Everything else can be earned after the story in free-roam.
- **Tracker** — tick trophies off and progress saves in localStorage; export progress to a file and import it back. Filters by kind (story, missable, collectibles, activities, online — there are no online trophies), by grade, by search, and a hide-earned switch. A spoiler-free mode hides the names and descriptions of story trophies until you earn them.

## Run it

```sh
node serve.ts
```

Then open http://localhost:8080. No build step, no network: every file the app loads is a file under `app/`.

To hand the entry in (what the grader runs):

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` copies `app/` and `screenshots/` to the output directory and writes `dossier.json` with the vendored make.fun library.

## Screenshots

The four screenshots in `screenshots/` are real renders of this app in a browser (taken with a headless Chromium, then converted to JPEG quality 82 so each fits the 256 KiB cap — same pixels, no editing): the checklist with a guide open, the roadmap, the spoiler-free story filter, and the tracker with progress.

---

<sub>Entered on [make.fun](https://make.fun/?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01) · AI agents build software for cash rewards</sub>

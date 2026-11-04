# Lexi

**English** · [Português](README.pt-BR.md)

An English dictionary for Android and iOS: browse words with infinite scroll, see meanings and phonetics, listen to the pronunciation, and keep favorites and a viewing history.

> This is a challenge by [Coodesh](https://coodesh.com/)

🚧 **In progress.** The project is built in stages (see [`todo.md`](todo.md)). Stages 1 to 3 are done: the app runs on Expo Go with light and dark themes, downloads the 370,000-word list once and shows it as an infinite 3-column grid (opening with common words), and opens each word with its phonetic, pronunciation and meanings, cached on the device, with Previous/Next through the list. Favorites, the history screen and login come in the next stages.

## Technologies

| Area | Choice |
| --- | --- |
| App | React Native 0.88 + TypeScript (`strict`), Expo SDK 58, Expo Router |
| Styling | NativeWind 4 (Tailwind 3) with tokens taken from the Figma design, light and dark themes |
| Navigation | Expo Router: top tabs (`TopTabs`) with a custom tab bar, word detail as a native form sheet |
| Dependency injection | tsyringe |
| Tests | Jest (`jest-expo`) + React Native Testing Library |
| Quality | ESLint + Prettier, with rules against hardcoded colors and `any` |
| Fonts and icons | Fraunces and Inter (Google Fonts), Lucide |
| Local data | SQLite (`expo-sqlite`) + Drizzle ORM, rows validated with Zod, TanStack Query |
| Lists | FlashList (3-column grid with infinite scroll and a fast scrollbar) |
| Pronunciation | `expo-audio` (API mp3, cached with `expo-file-system`) and `expo-speech` (device voice as fallback) |
| Planned | Zustand, Supabase (auth and sync) |

## How to run

Requirements: [Node.js](https://nodejs.org/) 22.13 or newer and the **Expo Go** app (SDK 58) on an Android or iOS device.

```bash
git clone https://github.com/EnzoFelyx/lexi-mobile-challenge.git
cd lexi-mobile-challenge
npm install
npx expo start
```

Scan the QR code with the camera (iOS) or with Expo Go (Android). The phone and the computer must be on the same network; otherwise use `npx expo start --tunnel`.

### Scripts

| Command | What it does |
| --- | --- |
| `npm start` | Starts the dev server (Expo Go) |
| `npm run lint` | ESLint + Prettier |
| `npm run typecheck` | TypeScript type checking |
| `npm test` | Unit and component tests |
| `npm run format` | Formats the code with Prettier |

## Design

The screens follow this [Figma file](https://www.figma.com/design/2SH7Dc3Qpr9ZjIw0iv8GGv/Untitled?node-id=0-1) (light and dark versions, loading and error states, and a component showcase). The interface follows the challenge wireframe. Where the app differs from the Figma on purpose (for contrast or performance), the reason is recorded in [`CLAUDE.md`](CLAUDE.md).

## Architecture

Folders by feature, with layers inside each one. The UI only knows the `domain` interfaces; the DI container picks the implementation.

```text
src/
  app/        # Expo Router routes (thin: they only compose screens)
  features/   # words, favorites, history, auth → domain / data / hooks / components
  core/       # theme (Figma tokens), DI container, database and Supabase clients
  shared/     # reusable components, hooks and utils
  i18n/       # all UI strings
  constants/  # named values (page size, sheet height…)
```

## Process and decisions

The challenge asks for the investigation process and the decisions to be documented. This repository was created from the [Coodesh challenge template](https://github.com/coodesh/mobile-challenge-20240202); the original description is kept in [`CHALLENGE.md`](CHALLENGE.md), with the [wireframe](img/wireframe.png). The process lives in versioned files (in Portuguese):

- [`CLAUDE.md`](CLAUDE.md): project context, challenge requirements, every decision with its date and reason, design tokens, stack and architecture.
- [`REGRAS.md`](REGRAS.md): code rules (layers, DI, centralized theme, safe async calls, no duplication).
- [`todo.md`](todo.md): roadmap split into stages, each with its "done when" criteria.
- [`CHANGELOG.md`](CHANGELOG.md): what changed in each stage, with the commit hashes.

Some decisions so far:

- **Common words first, in a random but stable order.** In alphabetical order the list would start with "a", "aa", "aaa"…, and the dwyl file is full of rare words missing from the API. Like the wireframe (hello, today, great…), the list opens with Ogden's Basic English, then the most frequent English words, then the rest. Each word gets a random sort key inside its group when the list is stored, so the order varies but stays the same between sessions.
- **Local-first with an optional login.** The app opens straight on the list. Without an account, favorites and history stay on the device; when the user logs in, they are merged into the account and linked to the user ID.
- **Runs on Expo Go.** No custom native code, so the evaluator can test on iOS without a paid Apple account. An Android APK will also be published.
- **English interface.** The challenge wireframe mixes languages (tabs and "Meanings" in English, "Voltar/Próximo" in Portuguese). Since every definition, example and part of speech from the Free Dictionary API is in English, the whole interface is in English for consistency; "Previous/Next" keep the wireframe's function. A Portuguese/English switch inside the app is planned as an extra.
- **Accessibility.** WCAG AA contrast is checked by a test on every color pair. The light secondary text was slightly darkened from the Figma value to pass on the tab rail.

## Credits

- Word list: [dwyl/english-words](https://github.com/dwyl/english-words) (`words_dictionary.json`).
- Common words at the top of the list: [Ogden's Basic English](https://simple.wikipedia.org/wiki/Wikipedia:BASIC_English_alphabetical_wordlist) (public domain) and [google-10000-english](https://github.com/first20hours/google-10000-english) (educational use), built by `scripts/build-common-words.mjs`.
- Definitions, phonetics and audio: [Free Dictionary API](https://dictionaryapi.dev/).
- Fonts: [Fraunces](https://fonts.google.com/specimen/Fraunces) and [Inter](https://fonts.google.com/specimen/Inter), under the SIL Open Font License 1.1.
- Icons: [Lucide](https://lucide.dev/).

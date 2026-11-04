# Lexi

**English** · [Português](README.pt-BR.md)

An English dictionary for Android and iOS: browse words with infinite scroll, see meanings and phonetics, listen to the pronunciation, and keep favorites and a viewing history.

> This is a challenge by [Coodesh](https://coodesh.com/)

🚧 **In progress.** The project is built in stages (see [`todo.md`](todo.md)). Stage 1 (foundation) is done: the app runs on Expo Go with light and dark themes, the navigation and the base components. The word list, word detail, favorites, history and login come in the next stages.

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
| Planned | SQLite + Drizzle ORM (word list and cache), TanStack Query, Zustand, Supabase (auth and sync), `expo-audio` + `expo-speech` |

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

- **Random but stable word order.** In alphabetical order the list would start with "a", "aa", "aaa"…, many of them missing from the API. Each word gets a random sort key when the list is stored, so the order varies but stays the same between sessions.
- **Local-first with an optional login.** The app opens straight on the list. Without an account, favorites and history stay on the device; when the user logs in, they are merged into the account and linked to the user ID.
- **Runs on Expo Go.** No custom native code, so the evaluator can test on iOS without a paid Apple account. An Android APK will also be published.
- **English interface.** The challenge wireframe mixes languages (tabs and "Meanings" in English, "Voltar/Próximo" in Portuguese). Since every definition, example and part of speech from the Free Dictionary API is in English, the whole interface is in English for consistency; "Previous/Next" keep the wireframe's function. A Portuguese/English switch inside the app is planned as an extra.
- **Accessibility.** WCAG AA contrast is checked by a test on every color pair. The light secondary text was slightly darkened from the Figma value to pass on the tab rail.

## Credits

- Word list: [dwyl/english-words](https://github.com/dwyl/english-words) (`words_dictionary.json`).
- Definitions, phonetics and audio: [Free Dictionary API](https://dictionaryapi.dev/).
- Fonts: [Fraunces](https://fonts.google.com/specimen/Fraunces) and [Inter](https://fonts.google.com/specimen/Inter), under the SIL Open Font License 1.1.
- Icons: [Lucide](https://lucide.dev/).

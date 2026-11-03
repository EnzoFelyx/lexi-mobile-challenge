# Changelog

Todas as mudanças do Lexi, da mais recente para a mais antiga, agrupadas por etapa do `todo.md`.
Cada item indica o commit em que entrou, para conferir no histórico do git (`git show <hash>`).

Formato baseado no [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/). Tipos: **Adicionado**, **Alterado**, **Corrigido**, **Removido**, **Infraestrutura** e **Documentação**.

---

## 2026-11-03 — Etapa 1 (fundação)

### Corrigido

- `textSecondary` do tema claro escurecido de `#67716B` (Figma) para `#636D67` (decisão do autor): o texto da aba inativa sobre o trilho (`surfaceMuted`) passa de 4,37:1 para 4,64:1 (AA). Teste novo confere o contraste AA de todos os pares de texto nos dois temas. (`8d48597`)

### Adicionado

- Hook `useTheme`/`useThemeMode` (tema do sistema) e ponte dos tokens de cor do `theme.ts` para variáveis CSS (`--color-*`, em canais RGB), base do dark mode no NativeWind. (`d98c462`)
- Fontes Fraunces SemiBold e Inter Regular/Medium/SemiBold (`@expo-google-fonts/*`, licença SIL OFL 1.1) carregadas com `useFonts` antes de esconder o splash, importando só os pesos usados. Se falharem, o app segue com a fonte do sistema. (`fab7f10`)
- `src/i18n/en.ts` com os textos da interface por área (header, abas, Word list, History, Favorites, detalhe, login), lidos do Figma, e `src/constants/` com a grade de 3 colunas, a página de 60 palavras e a altura da folha do detalhe. (`9f11953`)
- Componentes compartilhados do Figma (Component showcase e Word list): `AppText` (tipografia por variante e tom), `Button` (primary/secondary, 52pt, ícone Lucide opcional) e `AppHeader` (logo com o ponto da marca e botão de conta de 44pt). Tokens novos lidos do Figma no `theme.ts`: tipografia `logo` (30, tracking -1,4), entrelinha 38 e tracking -0,7 do `display`, header 64, ponto da marca 6, ícones 18/19 com traço 1,7. Entram `lucide-react-native`, `react-native-svg` e `react-native-pager-view`. (`db18f1f`)
- Rotas da seção 11 com telas provisórias: abas superiores com o `TopTabs` do expo-router 58 (o `material-top-tabs` embutido no router) e `tabBar` própria (`SegmentedTabBar` → `SegmentedTabs` do Figma, com papel `tab` e estado `selected`), carregamento preguiçoso e deslizar entre abas; header com logo e botão de conta abrindo o login; detalhe `word/[word]` como `formSheet` (92% da tela, puxador do sistema) com botão "X"; tema da navegação a partir dos tokens. Entra `react-native-tab-view`. (`7a0ee22`)

### Infraestrutura

- Branch `chore/project-foundation` criada a partir da `main`.
- Template do Expo limpo: telas e componentes de demo, `reset-project`, suporte web (`react-native-web`, `react-dom`, config `web`), dependências só da demo (`@expo/ui`, `expo-device`, `expo-glass-effect`, `expo-symbols`, `expo-web-browser`, `expo-image`) e assets sem uso. (`f9caa53`)
- `.gitignore` com `.env` e `coverage/`; `.env.example` com as variáveis do Supabase. (`db970c3`)
- TypeScript `strict` com `noUncheckedIndexedAccess` e um único alias `@/` → `./src/`. (`f3dcc6f`)
- ESLint (`eslint-config-expo` + `eslint-plugin-react-native` + Prettier) com as regras do `REGRAS.md`, inclusive `no-restricted-syntax` contra cor crua em `className` e valor arbitrário de cor (`bg-[#fff]`). Prettier com `singleQuote`, `trailingComma: all`, `printWidth: 100`. Scripts `lint`, `format` e `typecheck`. (`2d8bd8c`)
- Pastas das features (`words`, `favorites`, `history`, `auth`). (`6443b7d`)
- Splash com o fundo do tema no claro (`#F8F7F3`) e no escuro (`#111715`), no lugar do azul do template. (`51ddf4e`)
- NativeWind 4.2.7 (Tailwind 3) com `tailwind.config.ts` lendo cores (variáveis CSS), fontes, tipografia, spacing, radius e tamanhos do `theme.ts`, sem a escala padrão do Tailwind, e `ThemeProvider` trocando as variáveis entre claro e escuro. (`4864823`)
- tsyringe com `reflect-metadata`, `babel-plugin-transform-typescript-metadata` (os decorators legacy já vêm do `babel-preset-expo`) e container + `TOKENS` em `src/core/di/`. (`0abd099`)
- Jest 30 (`jest-expo`) + React Native Testing Library, com alias `@/`, container limpo entre testes e os primeiros testes (variáveis de cor e injeção pelo container). (`f5d66e9`)
- Repositório público `EnzoFelyx/lexi-mobile-challenge` criado, com o primeiro push da `main`.
- ECC instalado localmente com o `ecc-rn-setup` (perfil core, hooks `standard`, GateGuard desligado), preservando o plugin do Expo. A `.claude/` saiu do git. (`6a56b2a`)

---

## 2026-11-03 — Etapa 0 (decisões pendentes)

### Documentação

- Decisões da etapa 0 registradas no `CLAUDE.md`, no `REGRAS.md` e no `todo.md`: NativeWind lendo o `theme.ts` (dark mode por variáveis CSS), Drizzle + `drizzle-zod`, FlashList, ordem aleatória e estável da lista (`sort_key`), login opcional com modo visitante e mescla ao entrar, detalhe em `formSheet`, `material-top-tabs` com `tabBar` própria, README bilíngue e repositório público `EnzoFelyx/lexi-mobile-challenge`. (`1e1ce9a`)

---

## 2026-11-03 — Planejamento

### Documentação

- `CLAUDE.md` com o contexto do projeto, a ordem de prioridade (README da Coodesh > decisões do Lexi > padrões do Pinny > ECC), os requisitos do desafio, as regras de comportamento, os tokens e as telas do Figma, a stack, a arquitetura e os dados. (`1e1ce9a`)
- `REGRAS.md` com as regras de código (camadas por feature, DI com tsyringe, tema centralizado, chamadas assíncronas seguras, zero duplicidade) e o checklist de entrega. (`1e1ce9a`)
- `todo.md` com as etapas 0 a 7, sem prazo fixo. (`1e1ce9a`)

### Adicionado

- `src/core/theme/theme.ts` com os tokens extraídos do Figma: cores light e dark, fontes (Fraunces e Inter), escala tipográfica, espaçamentos, raios e tamanhos. (`73247a2`)

### Infraestrutura

- Branch principal renomeada de `master` para `main`.
- Projeto criado com o template do Expo SDK 58 (Expo Router, TypeScript). (`b430cd3`)

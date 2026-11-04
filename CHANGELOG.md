# Changelog

Todas as mudanças do Lexi, da mais recente para a mais antiga, agrupadas por etapa do `todo.md`.
Cada item indica o commit em que entrou, para conferir no histórico do git (`git show <hash>`).

Formato baseado no [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/). Tipos: **Adicionado**, **Alterado**, **Corrigido**, **Removido**, **Infraestrutura** e **Documentação**.

---

## 2026-11-04 — Etapa 3 (detalhe da palavra)

### Adicionado

- Busca da palavra na Free Dictionary API (`FreeDictionaryService`, resposta validada com Zod) e cache persistente no SQLite (`SqliteWordCacheRepository`), inclusive para o 404. `lookUpWord` consulta o cache antes da API, guarda a resposta e não guarda erro de rede; `toWordDetail` junta as entradas da API (fonética, áudios sem repetidos e significados por classe gramatical). Decisões da etapa registradas no `CLAUDE.md` (coração escondido até a etapa 4, histórico gravado já agora, voz do aparelho no mesmo player, até 3 significados por classe com "Show more"). (`001a68e`)

---

## 2026-11-03 — Etapa 2 (lista de palavras)

Etapa concluída em 2026-11-04: a lista abre pelas palavras comuns, rola até o fim sem travar, o download só roda uma vez e os testes passam (conferido no Expo Go pelo autor).

### Documentação

- Link público do Figma no README (seção "Design") e no `CLAUDE.md`. (`e7647d8`)

### Adicionado

- Banco local com `expo-sqlite` + Drizzle ORM 0.45: schema das tabelas `words`, `word_cache`, `favorites` e `history` (fonte única dos tipos), migration gerada por `npm run db:generate` e embutida como texto (`babel-plugin-inline-import` + extensão `.sql` no Metro), aplicada ao abrir o app antes do splash sumir. Leituras validadas com schemas Zod derivados do schema (`drizzle-zod`). Banco em modo WAL, registrado no container (`TOKENS.Database`). Se as migrations falharem, o app mostra uma tela de erro (`MessageScreen`) em vez de travar. (`d5e877b`)
- Download único da lista do dwyl (370.100 palavras, ~7 MB) validado com Zod e gravado no SQLite numa transação exclusiva, em lotes de 5.000 com `sort_key` aleatório; entre lotes o JS thread fica livre para a barra de progresso. O fluxo passa pelo React Query (entra o `@tanstack/react-query`, com `QueryClientProvider` no layout raiz). Tela genérica de "preparando o dicionário" (indicador ao baixar, barra com porcentagem ao gravar, erro com "Try again") antes das abas; nas aberturas seguintes, vai direto. `ProgressBar` compartilhada, acessível como `progressbar`. (`c0789fc`)
- `WordRepository` (domínio) e `SqliteWordRepository` com paginação keyset por (`sort_key`, `word`): busca `limit + 1` linhas para saber se há próxima página sem consulta extra, valida com Zod e está registrado no container. Testado com SQL real: `better-sqlite3` (só em desenvolvimento) roda as mesmas migrations do app num banco em memória. (`b01a68b`)
- A Word list abre com palavras comuns em ordem aleatória (decisão do autor): camadas de `sort_key` com o Basic English de Ogden (854), depois 8.117 palavras frequentes (google-10000-english filtrada) e por fim o resto do dwyl. Lista gerada por `scripts/build-common-words.mjs` e embutida no app; a migration `0001` esvazia `words` uma vez para refazer o seed com a ordem nova. (`83c4b4c`)
- Hook `useWordList` com `useInfiniteQuery` (páginas de 60 pelo `WordRepository` do container): entrega as palavras, os estados de primeira carga, de "carregando mais" e de erro (primeira página ou próxima), e as ações `loadNextPage` e `retry`. A trava contra páginas duplicadas (só busca com próxima página e sem busca em andamento, e `cancelRefetch: false`) foi testada também ao contrário: sem ela, o teste falha com 4 buscas em vez de 2. (`b2f7ade`)
- Aba Word list de verdade: grade de 3 colunas com FlashList (entra `@shopify/flash-list` 2.3.2), título "Word list" com o texto de apoio rolando junto, `WordCard` do Figma só com a palavra (palavras longas encolhem em vez de quebrar) e rodapé "Finding more words…" com o ícone `loader-circle` girando (parado com "Reduzir movimento"); erro da próxima página com "Try again" no rodapé; carregamento, erro e lista vazia tratados. Tocar no card abre o detalhe. Tokens novos do Figma: tipografia `subtitle` (13/18) e `note` (11), altura do card e ícone de 16. (`a6f87fd`)
- Rolagem rápida na grade (pedido do autor): barrinha no canto direito que aparece ao rolar, some depois de 1,2 s parada e, arrastada, percorre todo o conteúdo já carregado usando a altura inteira da tela, igual em Android e iOS. Fica no gutter de 24pt (não cobre os cards), só aparece com 3 telas ou mais de conteúdo, respeita "Reduzir movimento" e fica oculta para leitores de tela. (`8cd1c86`)

### Testes

- Seed e paginação ponta a ponta num SQLite real: o SQL de inserção em lotes roda como no app (3 lotes), uma falha no meio desfaz tudo, a lista abre pelas palavras comuns, percorre todas as palavras uma única vez e mantém a ordem entre leituras. O banco de teste ganhou uma conexão que imita a do `expo-sqlite`. Cobertura de `domain` e `data` da lista de palavras: 100%. (`0a8daa7`)

---

## 2026-11-03 — Etapa 1 (fundação)

Etapa concluída: o app abre no Expo Go em Android e iOS, nos temas claro e escuro (conferido pelo autor), com lint, typecheck e testes passando.

### Corrigido

- `LICENSE` do template removida: atribuía o projeto à Expo (650 Industries). O desafio não pede licença (decisão do autor). (`dbe56e1`)
- `textSecondary` do tema claro escurecido de `#67716B` (Figma) para `#636D67` (decisão do autor): o texto da aba inativa sobre o trilho (`surfaceMuted`) passa de 4,37:1 para 4,64:1 (AA). Teste novo confere o contraste AA de todos os pares de texto nos dois temas. (`8d48597`)

### Adicionado

- Hook `useTheme`/`useThemeMode` (tema do sistema) e ponte dos tokens de cor do `theme.ts` para variáveis CSS (`--color-*`, em canais RGB), base do dark mode no NativeWind. (`d98c462`)
- Fontes Fraunces SemiBold e Inter Regular/Medium/SemiBold (`@expo-google-fonts/*`, licença SIL OFL 1.1) carregadas com `useFonts` antes de esconder o splash, importando só os pesos usados. Se falharem, o app segue com a fonte do sistema. (`fab7f10`)
- `src/i18n/en.ts` com os textos da interface por área (header, abas, Word list, History, Favorites, detalhe, login), lidos do Figma, e `src/constants/` com a grade de 3 colunas, a página de 60 palavras e a altura da folha do detalhe. (`9f11953`)
- Componentes compartilhados do Figma (Component showcase e Word list): `AppText` (tipografia por variante e tom), `Button` (primary/secondary, 52pt, ícone Lucide opcional) e `AppHeader` (logo com o ponto da marca e botão de conta de 44pt). Tokens novos lidos do Figma no `theme.ts`: tipografia `logo` (30, tracking -1,4), entrelinha 38 e tracking -0,7 do `display`, header 64, ponto da marca 6, ícones 18/19 com traço 1,7. Entram `lucide-react-native`, `react-native-svg` e `react-native-pager-view`. (`db18f1f`)
- Rotas da seção 11 com telas provisórias: abas superiores com o `TopTabs` do expo-router 58 (o `material-top-tabs` embutido no router) e `tabBar` própria (`SegmentedTabBar` → `SegmentedTabs` do Figma, com papel `tab` e estado `selected`), carregamento preguiçoso e deslizar entre abas; header com logo e botão de conta abrindo o login; detalhe `word/[word]` como `formSheet` (92% da tela, puxador do sistema) com botão "X"; tema da navegação a partir dos tokens. Entra `react-native-tab-view`. (`7a0ee22`)

### Documentação

- README do template trocado pelo README do projeto, bilíngue (`README.md` em inglês e `README.pt-BR.md` em português): título, descrição, tecnologias, como rodar no Expo Go, scripts, arquitetura, processo e decisões, créditos e a frase da Coodesh. Ele cresce a cada etapa. (`76c8415`)

### Infraestrutura

- Repositório recriado a partir do template da Coodesh (`coodesh/mobile-challenge-20240202`), o Passo 1 do desafio, com o histórico juntado por merge (hashes preservados). O enunciado original ficou em `CHALLENGE.md` e o wireframe em `img/wireframe.png`; o repositório anterior foi renomeado e depois excluído pelo autor (o conteúdo dos commits do PR #1 da etapa 1 está todo no histórico atual). (`ed893d8`)
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

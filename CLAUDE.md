# CLAUDE.md — Contexto do projeto Lexi

> Este arquivo reúne tudo o que já foi decidido sobre o app. Leia-o inteiro antes de qualquer tarefa.
> Sempre que uma decisão nova for tomada, atualize este arquivo (com a data e, quando for o caso, "decisão do autor").

## ⚠️ Ordem de prioridade (decisão do autor, 2026-11-03)

Em qualquer conflito, vale o item de número menor:

1. **README do desafio Coodesh** (seção 2 deste arquivo).
2. **Decisões do Lexi registradas neste arquivo** (tomadas antes de olhar o Pinny e o ECC).
3. **Padrões herdados do Pinny** (formato dos docs, git, lint, nomes, textos centralizados…): só preenchem lacunas.
4. **Regras do ECC** (`.claude/rules/ecc/`): por último.

Na dúvida, **pare e pergunte ao autor**.

## ⚠️ Regras de código obrigatórias

Antes de escrever, alterar ou revisar qualquer código, siga as regras do arquivo abaixo:

@REGRAS.md

---

## 1. Visão geral

**Lexi** é um dicionário de inglês para mobile, feito como **desafio técnico da Coodesh** (Mobile Challenge 20240202) num processo seletivo.

O app lista as palavras do arquivo do dwyl com rolagem infinita, mostra significados, fonética e áudio de cada uma (Free Dictionary API), guarda favoritos e o histórico de palavras vistas, com login para associar esses dados ao usuário.

O avaliador olha **o resultado e o processo**: o README da Coodesh pede para documentar hipóteses e decisões. Por isso os docs deste repositório (`CLAUDE.md`, `REGRAS.md`, `todo.md`, `CHANGELOG.md`) ficam versionados e públicos.

### Tom do produto

- **Dicionário editorial moderno:** limpo, tipográfico, calmo. Cara de livro bem diagramado, fluido como app atual.
- Interface em **inglês** (como no Figma). Documentação de processo em **português**.

---

## 2. Requisitos do desafio (README da Coodesh)

### Obrigatórios

- **Tecnologias:** nativo ou híbrido (React Native ✅), estilização própria ou biblioteca, gestão de dados (SQLite, Context etc.), back-end Firebase/Supabase.
- **Organização:** padrões de Clean Code e **validação de chamadas assíncronas para evitar travamentos**.
- **Usabilidade:** interface com elementos visuais adequados.
- **Obrigatório 1 — casos de uso:**
  - ver uma lista de palavras com **rolagem infinita**
  - ver uma palavra, seus **significados** e a **fonética**
  - **salvar** a palavra como favorito
  - **remover** a palavra dos favoritos
  - ver a lista de **palavras já vistas** (histórico)
  - A lista vem do arquivo [`words_dictionary.json` do dwyl](https://github.com/dwyl/english-words/blob/master/words_dictionary.json) (a API não lista palavras).
- **Obrigatório 2:** **cache** das respostas das requisições.
- **Obrigatório 3:** seguir o **wireframe** da listagem (pode mudar a posição dos itens, mantendo as funcionalidades): abas Word list / History / Favorites, grade de 3 colunas; detalhe com "X", palavra + fonética, player, Meanings, Voltar/Próximo.

### Diferenciais (todos entram no Lexi)

1. **Tocador de áudio** (recursos nativos ou API).
2. **Injeção de dependência** com alguma ferramenta.
3. **Testes** unitários ou E2E.
4. **Login com usuário e senha**, com favoritos e histórico associados ao ID do usuário.

### Entrega

- README com: título, descrição em uma frase, lista de tecnologias, como instalar e usar, `.gitignore` e a frase **"This is a challenge by [Coodesh](https://coodesh.com/)"**.
- Documentar o processo de investigação e as decisões.
- Link do repositório na plataforma + commit final. Pode haver vídeo de apresentação gravado na plataforma.

---

## 3. Nome: **Lexi** ✅

- Vem de *lexicon*: curto, funciona em inglês e português.
- Defina o nome em **um único lugar** (`app.json` e a constante `appName` em `src/i18n/en.ts`).

---

## 4. Escopo

### ✅ Dentro

Tudo da seção 2 (obrigatórios e os 4 diferenciais), as telas da seção 7, **tema claro e escuro** e **Android + iOS**.

### ❌ Fora

- **Web** (o template traz suporte web; será removido na etapa 1).
- Publicação nas lojas e build instalável de iOS (exige conta paga da Apple). iOS é testado pelo **Expo Go**; Android também ganha **APK** no GitHub Releases.
- Módulos nativos próprios (o app precisa rodar no **Expo Go**).
- Busca, etimologia, sinônimos e outras telas além das do Figma, salvo pedido do autor.

---

## 5. Identidade visual

Estilo **editorial**: tipografia em destaque, uma cor de acento, cards suaves com bastante respiro.

### Cores (extraídas do Figma em 2026-11-03) ✅

O Figma **não tem variáveis**: os valores foram lidos das camadas (Component showcase · Light/Dark).

| Token | Light | Dark | Uso |
|---|---|---|---|
| `background` | `#F8F7F3` | `#111715` | Fundo das telas |
| `surface` | `#FFFFFF` | `#1C2521` | Cards, inputs, botão secundário, aba ativa |
| `surfaceMuted` | `#EEEFE9` | `#26322C` | Trilho das abas, botão de favorito (contorno) |
| `border` | `#DFE3DC` | `#34423A` | Bordas, divisores, trilho do progresso |
| `textPrimary` | `#202925` | `#F0F2EB` | Texto principal |
| `textSecondary` | `#67716B` | `#ACB8AF` | Fonética, placeholders, legendas |
| `accent` | `#14665C` | `#82D3BF` | Aba ativa, botão primário, progresso, chips |
| `onAccent` | `#FFFFFF` | `#102B23` | Texto sobre o botão primário |
| `accentSoft` | `#E5F0EA` | `#213E34` | Fundo do chip de classe gramatical |
| `playerIdle` | `#E4E7E0` | `#304038` | Botão de play enquanto o áudio carrega |

- **Contraste AA conferido (2026-11-03):** texto principal, secundário e acento passam com folga sobre `background`, `surface` e `accentSoft` nos dois temas (mínimo 4,72:1); `onAccent` sobre `accent` dá 6,81:1 (claro) e 8,64:1 (escuro).
- ⏳ **Pendência de contraste (perguntar ao autor antes da etapa 2):** no tema claro, `textSecondary` sobre `surfaceMuted` dá **4,37:1** (mínimo 4,5). Afeta o texto da aba inativa se ela usar `textSecondary` sobre o trilho. Não alterar a cor do Figma sem decisão do autor.
- As cores viram variáveis CSS `--color-<token-em-kebab>` em canais RGB (`src/core/theme/colorVariables.ts`); o hook `useTheme()` (`src/core/theme/useTheme.ts`) entrega os tokens do tema ativo para o que não aceita `className`.
- Tema segue o sistema (`userInterfaceStyle: automatic`).

### Tipografia ✅

- **Fraunces SemiBold** (serifada): logo, palavras (headwords) e títulos.
- **Inter** Regular/Medium/SemiBold: interface.
- Escala lida do Figma: display 32 · headword do card 19/26 (tracking -0.3) · body 14 · button 14 · label 13 · description 12/19 · chip 11 · caption 10/14 · eyebrow 10 (tracking 1.5, maiúsculas).
- ⏳ Tamanho do headword grande do detalhe: conferir no frame "Word detail" (caixa de 54pt).
- Fontes pelo `@expo-google-fonts/fraunces` e `@expo-google-fonts/inter` (licença **SIL Open Font License 1.1**, que permite uso e redistribuição no app; citar nos créditos do README na etapa 7). Carregadas com `useFonts` (`src/core/theme/useThemeFonts.ts`), que funciona no Expo Go; o config plugin do `expo-font` não funciona no Expo Go. Só os pesos do `theme.ts` são importados, por subcaminho (`@expo-google-fonts/inter/500Medium`).

### Medidas do Figma ✅

Grade de 8pt · gutter lateral 24 · área de toque mínima **44** · abas 52 (itens 44) · botão 52 · input 56 · chip 26 · card de palavra 106×104 com gap 12 · trilho do progresso 4 · raios 8 (chip, aba interna), 12 (cards, botões, inputs) e pill (play, favorito, progresso).

Os tokens já estão em **`src/core/theme/theme.ts`**, gerado do Figma (cores light/dark, fontes, tipografia, spacing, radius e sizes). Ele continua sendo a **fonte única**: na etapa 1, o `tailwind.config.ts` passa a ler dele as cores (como variáveis CSS, para o dark mode), as fontes, a tipografia, o spacing e o radius (ver seção 10, estilização).

### Ícones

O Figma usa ícones **Lucide** (`x`, `heart`, `user-round`, `history`, `book-search`, `book-open`, `info`, `rotate-cw`, `arrow-left`, `arrow-right`, `eye-off`, `loader-circle`): `lucide-react-native` + `react-native-svg`.

---

## 6. Funcionalidades e regras de comportamento (decididas em 2026-11-03)

### 6.1 Lista de palavras

- O JSON do dwyl (~370 mil palavras, formato `{ "a": 1, … }`) é **baixado na primeira execução** e gravado no **SQLite** em lotes de 1.000 a 5.000 dentro de transação, com tela de "preparando o dicionário" com progresso e erro com "tentar de novo".
- **Ordem aleatória e estável (decisão do autor, 2026-11-03):** o seed grava um `sort_key` aleatório por palavra, e a lista é ordenada por (`sort_key`, `word`). Em ordem alfabética a lista começaria por "a", "aa", "aaa"…, muitas sem resultado na API. A ordem não muda entre sessões. Registrar a decisão no README.
- Paginação por **keyset** (`WHERE (sort_key, word) > (?, ?) ORDER BY sort_key, word LIMIT 60`), nunca `OFFSET`. 60 = 20 linhas × 3 colunas.
- Grade com **FlashList** (`numColumns={3}`).
- `onEndReached` com trava contra páginas duplicadas.

### 6.2 Detalhe da palavra

- Abre como **folha nativa** sobre as abas: `presentation: 'formSheet'` do Expo Router, com altura alta (decisão do autor, 2026-11-03). Puxador e arrastar para fechar são do sistema. Figma: drag handle, "X" à esquerda, coração à direita.
- Card com a palavra (Fraunces), fonética, player de áudio e **Meanings** agrupados por classe gramatical (chips `noun`, `verb`), com definição e exemplo.
- **404 da API:** mostra "Word not found" com **Retry** e **Next**; o 404 também vai para o cache, para não chamar a API de novo.
- **Previous / Next:** navegam dentro da **lista de origem** (Word list, History ou Favorites). O detalhe recebe a origem e o índice; nas pontas, o botão fica desabilitado.
- Abrir o detalhe **registra no histórico** automaticamente.

### 6.3 Histórico

- Sem duplicados: rever uma palavra atualiza o `viewed_at` e ela sobe para o topo. Ordem: mais recente primeiro.

### 6.4 Favoritos

- Favoritar/desfavoritar com **atualização otimista**: o coração muda na hora, sincroniza com o Supabase em segundo plano e reverte (com aviso) se falhar.

### 6.5 Áudio

- Toca o primeiro `phonetics[].audio` não vazio. Sem mp3, cai para **TTS** (`expo-speech`). O play nunca fica sem função.

### 6.6 Cache (obrigatório 2)

- Ordem: **React Query (memória) → SQLite (`word_cache`) → API**. Palavra já buscada abre na hora, inclusive offline e depois de fechar o app.

### 6.7 Login (diferencial 4)

- Supabase Auth com **e-mail e senha**, sessão persistida. Telas de login e cadastro; botão de conta no header.
- **Login opcional, com modo visitante (decisão do autor, 2026-11-03):** o app abre direto na lista. Sem login, favoritos e histórico ficam só no aparelho, como visitante (`user_id` nulo). O botão de conta no header leva ao login.
- **Ao entrar:** os dados do visitante são mesclados na conta e sincronizados. Favoritos por união; no histórico, vale o `viewed_at` mais recente de cada palavra.
- ⏳ **Ao sair:** comportamento a definir na etapa 5 (ex.: limpar os dados da conta do aparelho e voltar ao visitante).
- **Local-first:** lista, cache, favoritos e histórico funcionam pelo SQLite; o Supabase sincroniza por `user_id`. Se o back-end estiver fora (ex.: projeto pausado no plano gratuito), o app continua usável.

---

## 7. Telas (Figma)

Arquivo `2SH7Dc3Qpr9ZjIw0iv8GGv`, página 1, frames de 390×844. Node IDs (Light / Dark):

| Tela | Light | Dark |
|---|---|---|
| Word list | `3:15553` | `3:16117` |
| History | `3:15625` | `3:16189` |
| History empty | `3:15690` | `3:16254` |
| Favorites | `3:15731` | `3:16295` |
| Favorites empty | `3:15798` | `3:16362` |
| Word detail | `3:15839` | `3:16403` |
| Word detail loading (skeleton) | `3:15914` | `3:16478` |
| Word detail error | `3:15979` | `3:16543` |
| Login | `3:16034` | `3:16598` |
| Sign up | `3:16074` | `3:16638` |
| Component showcase | `3:16681` | `3:16795` |

Estrutura comum: header com o logo "Lexi" (+ ponto da marca) e botão de conta · abas segmentadas · título de seção com texto de apoio · grade de 3 colunas. Listagem com "carregando mais" no fim; History e Favorites com resumo (contagem) e nota no rodapé.

---

## 8. Biblioteca de componentes (Figma, Component showcase)

Segmented tabs (3 estados) · Word card · Favorite (contorno / preenchido, 44×44) · Audio player (pronto / carregando) · Part-of-speech chip · Primary e Secondary button · Email field e Password field (com mostrar/ocultar senha) · Skeleton · Empty state · Header com logo e conta.

---

## 9. Design no Figma

As telas foram geradas com a **IA do Figma** a partir deste prompt:

```
Design a mobile app called "Lexi", an English dictionary built for a coding challenge. Follow the wireframe structure closely.

The app will be built in React Native for iOS and Android, so use cross-platform patterns and build every screen with Auto Layout and reusable components.

Style: modern editorial dictionary. Clean, typographic and calm. Use Fraunces (serif) for headwords and the logo, Inter for the UI. Off-white background, near-black text, and one accent color (deep teal) for the active tab, favorites and the audio player. Rounded cards, generous spacing, 8pt grid. Create light and dark versions.

Screens (iPhone, 390x844):

1. Word List: segmented tabs at the top "Word list | History | Favorites" with the active tab highlighted. Section title below the tabs. Scrollable 3-column grid of word cards (hello, today, great, peace, chair, diary, value, common, watch, stop, sun, review). Loading indicator at the bottom for infinite scroll.

2. History: same layout and grid, showing previously viewed words. Include an empty state.

3. Favorites: same layout and grid with saved words. Include an empty state.

4. Word Detail (modal over the tabs): close "X" top-left, heart favorite toggle top-right. Highlight card with the word large in serif and the phonetic below in italic ("hello" / həˈləʊ). Audio player row: play button and progress bar. "Meanings" section with definitions grouped by part of speech, using chips (noun, verb) and short examples. Bottom: two buttons, "Previous" and "Next", to move through words in the current list.

5. States: loading skeleton for Word Detail, and an error state "Word not found" with Retry and Next options.

6. Login / Sign up: email and password fields, primary button, link to switch between login and sign up.

Components: segmented tabs, word card, favorite icon (filled/outline), audio player, part-of-speech chip, primary and secondary buttons. Accessibility: minimum 44pt touch targets and good contrast.
```

> A linha sobre React Native foi a sugerida para acrescentar ao prompt original. Se o prompt enviado ao Figma foi diferente, atualize este bloco.

- Em caso de conflito entre o Figma e este arquivo, **pergunte ao autor**.
- O Figma MCP está no plano **Starter** (cota mensal baixa): leia só os frames necessários, um por vez.

---

## 10. Stack técnica

### Decidido (2026-11-03)

- **React Native + TypeScript** (`strict`), **Expo SDK 58** com **Expo Router**. App na **raiz** do repositório (template já criado).
- **Expo Go**: tudo precisa rodar sem código nativo próprio. Testar em **Android e iOS**.
- **Abas superiores (decisão do autor, 2026-11-03):** `@react-navigation/material-top-tabs` via `withLayoutContext` do Expo Router, com **`tabBar` própria** que desenha o SegmentedTabs do Figma. Cada aba é uma rota, com deslizar entre abas e carregamento preguiçoso (`react-native-pager-view`, incluído no Expo Go).
  - **Forma no SDK 58 (2026-11-03, etapa 1):** o expo-router 58 embute o próprio React Navigation, inclusive o `material-top-tabs`, já integrado como `TopTabs` em `expo-router/js-top-tabs`. Usamos esse (mesma biblioteca e mesmo comportamento) em vez de instalar `@react-navigation/material-top-tabs`, que seria uma segunda cópia do React Navigation fora do contexto do router. Ele pede `react-native-tab-view` (JS) + `react-native-pager-view`. A `tabBar` do SDK 58 recebe `emitter` e `navigateToTab(routeKey)` (não há mais `navigation`): ver `src/shared/components/SegmentedTabBar.tsx`.
- **Detalhe em `formSheet`** (decisão do autor, 2026-11-03), ver seção 6.2.
- **Estilização: NativeWind (decisão do autor, 2026-11-03)**, como no Pinny: `className` primeiro; `StyleSheet`/`style` só para Reanimated, valores calculados em runtime ou bibliotecas sem `className`. O `tailwind.config.ts` não tem valores próprios: lê do `theme.ts` cores, fontes, tipografia, spacing e radius, e substitui a paleta padrão (não existe `bg-white`). **Dark mode** com as cores como variáveis CSS (`vars()` do NativeWind) trocadas pelo tema ativo. Na etapa 1, conferir a versão do NativeWind compatível com o Expo SDK 58 e com o Expo Go.
- **Banco local:** `expo-sqlite` + **Drizzle ORM** + **`drizzle-zod`** (decisão do autor, 2026-11-03; o README da Coodesh não indica ferramenta). O schema (`src/core/database/schema.ts`) é a fonte única: tipos e schemas Zod derivam dele. Migrations geradas (`npm run db:generate`) e embutidas como texto (`babel-plugin-inline-import` para `.sql`). O seed em massa pode usar SQL direto dentro da transação, se for mais rápido.
- **Listas: FlashList** (`@shopify/flash-list`, incluída no Expo Go) (decisão do autor, 2026-11-03).
- **Ícones:** `lucide-react-native` + `react-native-svg` (os mesmos do Figma).
- **Requisições e cache:** **TanStack Query** + cache persistente no SQLite.
- **Estado global leve:** **Zustand** (sessão, favoritos em memória para o coração responder na hora).
- **Back-end e login:** **Supabase** (`@supabase/supabase-js`), Auth com e-mail e senha, tabelas com **RLS** (`user_id = auth.uid()`), tipos gerados pela CLI.
- **Injeção de dependência:** **tsyringe** (`reflect-metadata` + plugins de decorators no Babel).
- **Áudio:** `expo-audio` para o mp3 da API e `expo-speech` como fallback.
- **Testes:** Jest (`jest-expo`) + React Native Testing Library, mocks registrados no container da tsyringe. **Maestro** para E2E é opcional (primeiro a cortar).
- **CI:** GitHub Actions com lint, `tsc` e testes, badge no README.
- **Lint e formatação:** ESLint + Prettier no padrão do autor (ver `REGRAS.md`).
- **Bibliotecas:** instale cada uma **na etapa em que for usada** (`npx expo install`).

### Repositório e documentação (decisão do autor, 2026-11-03)

- GitHub: **`EnzoFelyx/lexi-mobile-challenge`**, **público**.
- **README bilíngue:** `README.md` em inglês e `README.pt-BR.md` em português, com link de um para o outro. Os docs de processo (`CLAUDE.md`, `REGRAS.md`, `todo.md`, `CHANGELOG.md`) ficam em português.

### Compatibilidade conferida (2026-11-03, etapa 1)

- **NativeWind 4.2.7 + Tailwind 3.4** (o v5 ainda é RC): peer `react-native-reanimated >=3.6.2`, ok com o Reanimated 4.7.1 + Worklets 0.13 do SDK 58. JSX passa pelo `react-native-css-interop`.
- **tsyringe com React Compiler ligado:** o `babel-preset-expo` 58 já ativa decorators em modo `legacy`; o `babel-plugin-transform-typescript-metadata` emite o `design:paramtypes`. O compilador só mexe em componentes e hooks, não nas classes. Provado com bundle e com teste no Jest.
- **FlashList 2.3.2 e `expo-sqlite`** estão entre os módulos nativos do Expo Go do SDK 58; **Drizzle** é só JS. Os quatro foram empacotados juntos (`expo export` para Android e iOS) sem erro. Drizzle, `expo-sqlite` e FlashList foram desinstalados de novo e voltam na etapa 2 (regra de instalar na etapa em que se usa).
- A execução dentro do Expo Go em aparelho real é conferida pelo autor no fim da etapa 1.

### Convenções da fundação (2026-11-03)

- **Classes do tema:** os nomes vêm dos tokens em kebab-case. Cores: `bg-surface`, `text-text-primary`, `bg-accent-soft`, `border-border` (aceitam opacidade, `bg-accent/50`). Fontes: `font-serif-semi-bold`, `font-sans-regular`, `font-sans-medium`, `font-sans-semi-bold`. Tipografia (tamanho, entrelinha e tracking): `text-display`, `text-headword-card`, `text-body`, `text-eyebrow`… Spacing `p-xl`, `gap-md`; raios `rounded-sm|md|pill`; tamanhos de componente `h-button`, `min-h-touch-target`, `h-input`, `h-chip`.
- A tipografia do Tailwind não carrega a fonte: o componente de texto combina `font-*` + `text-*` (mapa tipado por variante).
- **TypeScript 6:** `types: ["jest"]` no `tsconfig` (o TS 6 não inclui mais todos os `@types`), `experimentalDecorators` para os decorators da tsyringe e `noUncheckedIndexedAccess` ligado.
- **Lint:** ESLint 9 (o `eslint-plugin-react-native` ainda não declara suporte ao 10), flat config em `eslint.config.js`, ignorando a `.claude/` local.
- **Testes:** `__tests__/` ao lado do código; `container.reset()` depois de cada teste (`jest.setup.ts`).
- **Componentes compartilhados (`src/shared/components/`):** `AppText` com `variant` (token de tipografia) e `tone` (`primary`, `secondary`, `accent`, `onAccent`), nunca cor solta; `Button` com `variant` e `icon` (componente Lucide); `AppHeader`. O ponto da marca é uma `View` `bg-accent` (o SVG do Figma tinha a cor fixa e não trocaria de tema). Ícones Lucide recebem cor, tamanho e traço do `useTheme()`.
- **Jest e Lucide:** o `moduleNameMapper` aponta `lucide-react-native` para o build CommonJS (a condição `react-native` resolve um `.mjs` que o jest-expo não transforma). A Testing Library 14 tem `render` e `fireEvent` assíncronos: use `await`.
- **Navegação:** `src/shared/utils/navigation.ts` concentra as idas para o detalhe (`openWordDetail`) e o login (`openLogin`). As rotas da etapa 1 usam `PlaceholderScreen`/`WordDetailPlaceholder`, que saem quando cada tela real chegar. O tema da navegação (`createNavigationTheme`) usa os tokens, para a folha e o header nativo seguirem claro/escuro.
- **Exceção de cor (COR-HARDCODED):** o `expo-splash-screen` no `app.json` usa `#F8F7F3` (claro) e `#111715` (escuro), iguais a `palette.*.background`. O JSON não lê o tema nem aceita comentário; se o fundo mudar no `theme.ts`, mude aqui também. O fundo do ícone adaptativo do Android (`#E6F4FE`) ainda é o do template e muda junto com o ícone do app.
- **Textos e constantes:** `src/i18n/en.ts` exporta `en` (objeto `as const` por área; labels com parâmetro são funções). `src/constants/` separa por assunto (`words.ts`, `navigation.ts`), cada valor com comentário do porquê.

### ⏳ A decidir

Nada bloqueando no momento. Decisões novas: proponha e confirme com o autor antes de seguir.

---

## 11. Arquitetura e pastas (decidido em 2026-11-03)

Pastas **por feature, com camadas dentro**. A UI só conhece as **interfaces do `domain`**; o container decide a implementação.

```
src/
  app/                    # rotas Expo Router (finas: só compõem a tela)
    _layout.tsx           # providers (React Query, DI, tema) + Stack
    (auth)/login.tsx
    (tabs)/_layout.tsx    # material-top-tabs com tabBar própria (SegmentedTabs)
    (tabs)/index.tsx      # Word list
    (tabs)/history.tsx
    (tabs)/favorites.tsx
    word/[word].tsx       # detalhe (formSheet)
  features/
    words/                # lista, detalhe, player
      domain/             # entidades e interfaces (Word, WordRepository, DictionaryService)
      data/               # implementações (SqliteWordRepository, FreeDictionaryService)
      hooks/              # useWordList, useWordDetail (React Query)
      components/
    favorites/
    history/
    auth/
  core/
    database/             # client SQLite + Drizzle, schema, migrations, seed, validação (Zod)
    supabase/             # client
    di/                   # container e tokens da tsyringe
    theme/                # tokens do Figma (light/dark)
  shared/                 # componentes, hooks e utils genéricos
  i18n/                   # textos da UI (en.ts)
  constants/              # valores nomeados
```

Registro no container (exemplo):

```ts
container.registerSingleton<WordRepository>(TOKENS.WordRepository, SqliteWordRepository);
container.registerSingleton<DictionaryService>(TOKENS.DictionaryService, FreeDictionaryService);
```

Nos testes, `container.registerInstance(TOKENS.DictionaryService, mockService)` troca a implementação sem mexer nos componentes.

---

## 12. Dados

### SQLite (local, via Drizzle)

- `words`: `word` e `sort_key` (aleatório, gravado no seed), com índice em (`sort_key`, `word`).
- `word_cache`: `word`, `payload` (JSON), `status` (ok / not_found), `fetched_at`.
- `favorites`: `user_id` (nulo = visitante), `word`, `created_at`.
- `history`: `user_id` (nulo = visitante), `word`, `viewed_at` (único por usuário e palavra).
- Toda leitura passa pelo Zod antes de chegar ao domínio.

### Supabase (remoto)

- `favorites`: `user_id`, `word`, `created_at`, chave única (`user_id`, `word`).
- `history`: `user_id`, `word`, `viewed_at`.
- RLS ligado nas duas tabelas: cada usuário só lê e escreve as próprias linhas.

### Segredos

- `EXPO_PUBLIC_SUPABASE_URL` e `EXPO_PUBLIC_SUPABASE_ANON_KEY` no `.env` (fora do git) com `.env.example` versionado.
- A *anon key* pode ir no app (o RLS protege os dados). **Nunca** a `service_role` key, nem no app nem no repositório.

---

## 13. Testes e qualidade (decidido em 2026-11-03)

- **Unitários na camada de dados e nas regras:** paginação keyset, fluxo de cache (SQLite → API → grava; 404 cacheado não chama a API), histórico sem duplicados, fallback do áudio, favorito otimista revertendo.
- **Componentes e telas:** grade renderiza, detalhe com loading/erro/sucesso, coração alterna, Previous/Next desabilitados nas pontas.
- Meta: ~70% de cobertura em `domain` e `data`, citada no README. (O 80% e o TDD obrigatório do ECC são só recomendação aqui.)
- GitHub Actions rodando lint, `tsc` e testes a cada push.

---

## 14. Entrega

- **README bilíngue** (`README.md` em inglês e `README.pt-BR.md` em português), com os itens da seção 2, as decisões técnicas, a arquitetura, instruções do **Expo Go** (`npm install`, `npx expo start`, escanear o QR) e um **GIF ou vídeo curto** do fluxo (lista, detalhe, áudio, favoritar, histórico, login).
- **APK** gerado com EAS Build (`eas build -p android --profile preview`) anexado a uma release **`v1.0.0`** no GitHub.
- Como reativar o projeto Supabase ou usar o próprio (`.env.example`). Entrar no painel perto da avaliação para o projeto não pausar.

---

## 15. Orientações para o Claude neste projeto

- **Respeite a ordem de prioridade** do topo deste arquivo.
- **Siga a ordem de etapas do `todo.md`.** Antes de começar, veja em que etapa o projeto está. Ao concluir uma tarefa, marque `[x]` e atualize a tabela de status.
- **Não decida sozinho** o que está na etapa 0 ou não está registrado aqui: proponha e pergunte.
- **Expo muda a cada SDK:** antes de usar uma API do Expo, confira a documentação da versão 58 (ver `AGENTS.md`). Instale com `npx expo install`.
- **Tudo precisa rodar no Expo Go**, em Android e iOS.
- **Código limpo e exemplar:** é avaliação técnica. TypeScript bem tipado, camadas claras, DI de verdade.
- **Use o Figma como referência** (node IDs na seção 7), lendo um frame por vez.
- **Mantenha este arquivo, o `todo.md` e o `CHANGELOG.md` atualizados**: cada commit `feat:` vem seguido de um `docs:` que registra as decisões.
- **Antes de dar uma tarefa como pronta:** `npm run lint`, `npm run typecheck` e `npm test`.

---

## 16. Ferramentas de desenvolvimento

### ECC (via `EnzoFelyx/ecc-rn-setup`)

- **Instalado em 2026-11-03** com o `./install.sh` do repositório privado `ecc-rn-setup`: ECC `2.2.3`, perfil core, hooks `standard`, 25 agents, 50 commands, 31 skills, regras `common`, `typescript`, `react-native`, `swift` e `kotlin`, GateGuard desligado (`env.ECC_DISABLED_HOOKS`), `includeCoAuthoredBy: false` e `env.CLAUDE_PLUGIN_ROOT` absoluto (`…/Coodesh/Lexi/.claude`; se a pasta mudar de lugar, atualize).
- O plugin `expo@claude-plugins-official` do template foi preservado no `.claude/settings.json`.
- **A `/.claude/` é local e fica fora do git** (`.gitignore`): o `settings.json` do template, que estava versionado, saiu do repositório porque passou a ter caminhos da máquina do autor.
- O aprendizado (instincts) só separa por projeto dentro de um **repositório git com remote**.
- **Prioridade:** as regras do ECC ficam abaixo deste arquivo e do `REGRAS.md`.

### Repositório git

- Repositório único, app na raiz, remote `https://github.com/EnzoFelyx/lexi-mobile-challenge.git` (público). Branch principal: `main` (o template criou `master`, renomeada em 2026-11-03).
- Commits como `EnzoFelyx`, sem rodapé `Co-Authored-By`.
- Uma branch por etapa (`chore/project-foundation`, `feat/word-list`…), merge por PR.
- Conventional Commits em inglês.

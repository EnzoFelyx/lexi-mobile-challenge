# Changelog

Todas as mudanças do Lexi, da mais recente para a mais antiga, agrupadas por etapa do `todo.md`.
Cada item indica o commit em que entrou, para conferir no histórico do git (`git show <hash>`).

Formato baseado no [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/). Tipos: **Adicionado**, **Alterado**, **Corrigido**, **Removido**, **Infraestrutura** e **Documentação**.

---

## 2026-11-05 — Etapa 5 (Supabase e login)

Reorganizada pelo autor em três partes: visual do Figma, Supabase e integração.

### Adicionado

- Tela de perfil e configurações, aberta pelo botão de conta: perfil de visitante ("Keep your words.", com Log in e Create account) e de quem está logado (e-mail e Log out), seta de voltar no header e as preferências. Até o Supabase entrar, a conta é de mentira (`alex@example.com`) e a sessão fica no Zustand. Appearance abre um diálogo nativo com Light, Dark e System, aplica na hora, salva no aparelho e é aplicado antes da primeira tela; a barra de status passa a seguir o tema do app. Textos do perfil simplificados pelo autor em relação ao Figma. (`9af9874`)
- Interface em inglês ou português, escolhida em Configurações e salva no aparelho (pedido do autor). A tradução completa foi revisada pelo autor; tudo o que vem da API continua em inglês. No iOS, Aparência e Idioma abrem o menu do sistema com ✓ na opção atual (entra o `@expo/ui`); no Android, um diálogo no meio da tela. Textos das telas vazias de History e Favorites encurtados a pedido do autor. (`7832985`)
- Estados reutilizáveis do Figma: campos de texto, e-mail e senha (erro, desabilitado, mostrar/ocultar senha), botão carregando, erro do formulário e header de login e cadastro, com os tokens de cor de erro e de desabilitado no claro e no escuro (contraste AA testado). As telas de login e cadastro, que usarão esses componentes, vêm a seguir. (`1c5b2b4`)
- Telas de login e cadastro, com e-mail e senha, erros nos campos e no formulário, carregamento, ícones e contorno verde em foco. Em relação ao Figma: textos mais curtos, sem o card "rediscover" e sem os termos; o login ganha "Continue as guest". A autenticação ainda é de mentira (`wrong@example.com` e `taken@example.com` simulam os erros). (`8f38c24`)

- Supabase: tabelas `favorites` e `history` com RLS (SQL em `supabase/migrations/`), client com a sessão salva no aparelho e tipos gerados. O client fica nulo sem o `.env` e ainda não é usado pelo app; acesso anônimo conferido como negado. Confirmação de e-mail desligada no painel. (`8a9b9b3`)
- Login real com o Supabase e favoritos e histórico por conta: entrar, cadastrar e sair com os erros reais nas telas. Ao entrar, os dados do visitante passam para a conta, nova ou existente; cada mudança entra numa fila local e é enviada quando houver conexão; ao sair, os dados da conta são apagados do aparelho e voltam ao entrar de novo. Sem o `.env`, o app segue como visitante. Conferido pelo autor no aparelho. (`fd3eaad`)

### Removido

- A autenticação de mentira da parte 1. (`fd3eaad`)

### Alterado

- Senha mínima de 6 caracteres, igual ao padrão do painel do Supabase, no lugar dos 8 do Figma (decisão do autor). (`7ad75f0`)
- O login passa a ser a primeira tela do app, com a conta opcional (decisão do autor, substitui a abertura na lista). A escolha do visitante fica salva, e quem tem sessão ou já escolheu abre direto na lista. Em Settings, Log in e Create account abrem as novas telas. Ao sair da conta, a pessoa continua no app como visitante. (`8f38c24`)
- As telas de falha (lista, banco, histórico, favoritos e preparação do dicionário) passam ao layout "Recoverable error" do Figma, igual ao do estado vazio, sempre com o título "A brief pause." / "Uma breve pausa." e a explicação de cada caso (decisão do autor). (`1c5b2b4`)

### Corrigido

- No iOS, o primeiro arrasto para uma aba ainda não exibida parava cerca de 85pt fora do lugar. Sem `screenOptions={{ lazy: true }}` no `TopTabs`, o erro some, conferido pelo autor no aparelho; a causa exata não foi identificada. (`68c7caa`)
- Some o aviso `onAnimatedValueUpdate` a cada arrasto entre abas (pedido do autor): vai para a lista de avisos de bibliotecas, só em desenvolvimento. (`763eb3f`)
- O aviso `onAnimatedValueUpdate` também some do terminal, com um filtro no envio dos logs, em desenvolvimento (pedido do autor). (`5399d1f`)
- A linha ao lado dos chips em Meanings nunca aparecia: a classe `h-px` não existe com o tema do Lexi; agora usa o token `divider`. (`8f38c24`)
- Erro no Expo Go ao mudar a barra de status pelas telas da Stack: agora só o `StatusBar` controla a barra, e o `app.json` desliga `UIViewControllerBasedStatusBarAppearance` também no build. (`0331b46`)

---

## 2026-11-05 — Etapa 6 (qualidade, itens adiantados)

### Adicionado

- Splash do Figma (pedido do autor): a marca "Lexi" sobre o fundo do tema, em claro e escuro, no `expo-splash-screen`; sai o ícone do template. Só aparece no app compilado (conferido pelo autor com `npx expo run:ios`); no Expo Go, a tela de abertura é a do próprio Expo Go. (`8c52762`)

### Corrigido

- Some o aviso amarelo "ImageBackground is deprecated", que vinha do NativeWind (o Lexi não usa `ImageBackground`): um ponto de entrada próprio (`index.ts`) esconde só esse aviso, em desenvolvimento, na tela e no terminal, antes de qualquer componente carregar. (`187f1e3`)

---

## 2026-11-05 — Etapa 4 (favoritos e histórico)

Etapa concluída em 2026-11-05, com **todos os obrigatórios do desafio prontos**: favoritar e desfavoritar, ver o histórico e navegar por History e Favorites funcionam para o visitante, com lint, typecheck e testes passando (conferido no Expo Go no iPhone pelo autor; o Android fica para a etapa 7, decisão do autor).

### Documentação

- Marco dos obrigatórios prontos: tag `v0.4.0` ("All required features of the challenge") no merge commit da etapa (`127c316`).
- README principal em português (decisão do autor): `README.md` passa a ser o português, com link para o `README.en.md` em inglês (antes, `README.md` em inglês e `README.pt-BR.md` em português). (`3c35a17`)

### Adicionado

- Favoritos no SQLite (`FavoritesRepository`, `SqliteFavoritesRepository`) e leitura do histórico, da visita mais recente para a mais antiga, para o visitante. O coração terá atualização otimista pelo React Query (decisão do autor, no lugar do Zustand): muda na hora e, se a gravação falhar, volta ao estado anterior com um alerta do sistema. Gravar uma visita atualiza a aba History. Decisões da etapa registradas no `CLAUDE.md` (alerta do sistema, Previous/Next seguindo a posição ao desfavoritar, cards sem fonética, listas inteiras sem paginação). (`6757c8a`)

- Coração do Figma na barra do detalhe: contorno quando a palavra não é favorita e preenchido quando é, mudando na hora ao tocar. Só aparece com a palavra encontrada. No iOS 26, a folha do detalhe flutua com margem embaixo (visual nativo do sistema para folhas abaixo da altura máxima); o autor decidiu manter. (`25169ea`)

- Abas History e Favorites do Figma: título, linha de resumo, a mesma grade da Word list e a nota no fim, com os estados vazios (ilustração, texto e "Explore word list", que volta para a Word list), carregamento e erro tratados. Na History, a contagem vai para o rótulo ("3 WORDS VIEWED") e um "Clear" sublinhado apaga o histórico depois de uma confirmação do sistema (pedido do autor). A grade e o card de palavra passam a ser componentes compartilhados. (`766dbf3`)

- Previous/Next também a partir de History e Favorites, para melhorar a navegação (motivação registrada no `CLAUDE.md`, seção 6.8, e na nova seção "Navigation and interaction" dos READMEs). O detalhe anda pela lista da aba como estava ao abrir: abrir uma palavra (que a leva ao topo da History) ou desfavoritá-la não muda a ordem até o detalhe fechar. (`ff5d67e`)

- Toque duplo no card da palavra ou nos significados para favoritar ou desfavoritar, como nas redes sociais (pedido do autor, para agilizar o uso; motivação no `CLAUDE.md`, seção 6.8). Ao favoritar, um coração aparece no centro da área visível e some; ao desfavoritar, só o coração da barra muda. Play e "Show more" continuam com o toque deles. (`6137276`)

- Arrastar para os lados no detalhe troca de palavra, na mesma lista do Previous/Next (pedido do autor, para navegar sem depender só dos botões; motivação no `CLAUDE.md`, seção 6.8). Gatilho sensível (40pt ou um arrasto rápido), sem movimento na tela e só para arrastos horizontais: diagonais são ignoradas, e a rolagem e o fechar da folha continuam iguais. O pulso da folha ao toque no iOS 26 é do sistema e ficou (decisão do autor). (`cd53309`)

### Infraestrutura

- O wrapper de testes do React Query não deixa mais um timer aberto nas mutações, que às vezes impedia o Jest de terminar. (`6757c8a`)

---

## 2026-11-04 — Etapa 3 (detalhe da palavra)

Etapa concluída em 2026-11-04: qualquer palavra abre com dados ou erro tratado, a segunda abertura vem do cache, o áudio sempre toca algo (mp3 ou voz do aparelho) e o Previous/Next anda pela lista (conferido no Expo Go pelo autor).

### Adicionado

- Busca da palavra na Free Dictionary API (`FreeDictionaryService`, resposta validada com Zod) e cache persistente no SQLite (`SqliteWordCacheRepository`), inclusive para o 404. `lookUpWord` consulta o cache antes da API, guarda a resposta e não guarda erro de rede; `toWordDetail` junta as entradas da API (fonética, áudios sem repetidos e significados por classe gramatical). Decisões da etapa registradas no `CLAUDE.md` (coração escondido até a etapa 4, histórico gravado já agora, voz do aparelho no mesmo player, até 3 significados por classe com "Show more"). (`001a68e`)
- Hook `useWordDetail` com o React Query na frente do cache (palavra aberta de novo na mesma sessão nem consulta o SQLite), estados de carregamento, encontrada, "Word not found" e erro de rede, e `retry` que passa por cima do 404 guardado. `HistoryRepository` (`features/history`) com o registro da palavra vista, sem duplicados (atualiza a data), separado por usuário, e o hook `useRecordWordView`, que registra só as palavras encontradas (decisão do autor). (`dd488d4`)
- Tela do detalhe do Figma na folha `formSheet`: barra com "X" e "WORD EXPLORER", card da palavra (Fraunces 48 e fonética em itálico) e "Meanings" com chips de classe gramatical, definições, exemplos e "Show more" depois de 3 significados. Abrir uma palavra encontrada a grava no histórico. Entra o Inter Itálico; carregamento e erros ainda provisórios (o skeleton e o "Word not found" do Figma vêm depois). (`3fe0b07`)
- Player de pronúncia do Figma dentro do card da palavra (entram `expo-audio` e `expo-speech`): toca o primeiro mp3 da API com o sotaque no rótulo ("British pronunciation"), duração e progresso; sem mp3, ou se o mp3 não carregar em 8 s, usa a voz do aparelho ("Device voice"). O plugin do `expo-audio` não pede microfone nem áudio em segundo plano, e entra o `expo-asset`, que ele exige fora do Expo Go. No iOS, a sessão de áudio é configurada para tocar mesmo com a chave de silencioso (o padrão nativo do `expo-audio` a deixava muda). Enquanto o áudio carrega, o círculo do play mostra um indicador de atividade e "Preparing audio" ganha reticências animadas (pedido do autor). O mp3 é baixado uma vez para o cache do aparelho (entra o `expo-file-system`) e tocado do arquivo local: a mesma palavra toca na hora depois, inclusive offline, e uma falha do servidor de áudio troca para a voz na hora. A voz do aparelho aparece como "Pronunciation" (decisão do autor). Corrigido o layout do detalhe que às vezes quebrava no iOS (barra coberta e conteúdo sem margem): a raiz da folha não pode ser achatada pelo Fabric, senão o `formSheet` estica o `ScrollView` por cima de tudo. Logs passam pelo `logger` (só em desenvolvimento): falhas de verdade continuam como aviso; a troca esperada para a voz vira registro de depuração, sem aviso amarelo no celular, acontece uma vez só por abertura e não repete o download que falhou na mesma sessão. (`23f3d8a`)
- Estados do Figma no detalhe: skeleton enquanto a palavra carrega e tela de erro com ilustração, texto, "Your place is saved…" e Retry, em três variantes: "Word not found" (404), falha de rede e limite da API (429, "Too many lookups…"). O 429 não é repetido automaticamente (erro marcado como não repetível no `QueryClient`). (`4c62a3e`)
- "Word not found": o 404 guardado no cache passa a valer 7 dias (depois, a API é consultada de novo), porque o 404 dessa API às vezes vem do CDN dela, como em "every". As palavras continuam na lista (decisão do autor: esconder foi descartado). O download inicial ignora palavras com hífen ou símbolos (só 2 no dwyl). (`ef1079e`)
- O player não mostra mais "–:––" enquanto o áudio carrega: a duração só aparece quando é conhecida (decisão do autor; o Figma mostrava o marcador). O log da pronúncia registra só quando o servidor de áudio cai e quando volta, não uma linha por palavra (pedido do autor). (`2a57f95`)
- Previous/Next no detalhe, dentro da lista de origem: a rota recebe a origem e a posição (validadas com Zod), a palavra troca dentro da mesma folha, o "Next" no fim do que já foi carregado busca a próxima página, e os botões ficam desabilitados nas pontas. Entram o "Next" no erro "Word not found" e os blocos do rodapé no skeleton. No card da Word list, palavra longa passa a quebrar em até 2 linhas no tamanho normal (com hífen no Android) em vez de encolher (decisão do autor). (`826c639`)

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

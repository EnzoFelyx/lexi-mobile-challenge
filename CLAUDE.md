# CLAUDE.md — Contexto do projeto Lexi

> Este arquivo reúne tudo o que já foi decidido sobre o app. Leia-o inteiro antes de qualquer tarefa.
> Sempre que uma decisão nova for tomada, atualize este arquivo (com a data e, quando for o caso, "decisão do autor").

## ⚠️ Ordem de prioridade (decisão do autor, 2026-11-03)

Em qualquer conflito, vale o item de número menor:

1. **README do desafio Coodesh** (texto original em `CHALLENGE.md`, com o wireframe em `img/wireframe.png`; resumo na seção 2 deste arquivo).
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
- **Idioma da interface (decisão do autor, 2026-11-03):** inglês. O wireframe da Coodesh mistura idiomas (abas, título e "Meanings" em inglês; "Voltar/Próximo" em português), mas o conteúdo da Free Dictionary API (significados, exemplos, classes gramaticais) só existe em inglês, então a interface fica em inglês por consistência e imersão. "Previous/Next" cumprem a função de "Voltar/Próximo" (o Obrigatório 3 cobra as funcionalidades, não os textos). Registrar no README.
- **Extra planejado (etapa 6, opcional):** chave de idioma **PT/EN dentro do app**, escolhida pelo usuário e independente do idioma do aparelho. Os textos já ficam em `src/i18n/en.ts`; entra um `pt-BR.ts` com o mesmo formato e a escolha persistida. O conteúdo do dicionário continua em inglês.

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
| `textSecondary` | `#636D67` ¹ | `#ACB8AF` | Fonética, placeholders, legendas |
| `accent` | `#14665C` | `#82D3BF` | Aba ativa, botão primário, progresso, chips |
| `onAccent` | `#FFFFFF` | `#102B23` | Texto sobre o botão primário |
| `accentSoft` | `#E5F0EA` | `#213E34` | Fundo do chip de classe gramatical |
| `playerIdle` | `#E4E7E0` | `#304038` | Botão de play enquanto o áudio carrega |

¹ No Figma é `#67716B`. Escurecido para `#636D67` (decisão do autor, 2026-11-03) porque dava 4,37:1 sobre `surfaceMuted` (texto da aba inativa); agora dá 4,64:1.

- **Contraste AA conferido (2026-11-03):** todos os pares de texto (principal, secundário e acento sobre `background`, `surface`, `surfaceMuted` e `accentSoft`; `onAccent` sobre `accent`) passam de 4,5:1 nos dois temas. O teste `src/core/theme/__tests__/contrast.test.ts` garante isso a cada mudança de cor.
- As cores viram variáveis CSS `--color-<token-em-kebab>` em canais RGB (`src/core/theme/colorVariables.ts`); o hook `useTheme()` (`src/core/theme/useTheme.ts`) entrega os tokens do tema ativo para o que não aceita `className`.
- Tema segue o sistema (`userInterfaceStyle: automatic`).

### Tipografia ✅

- **Fraunces SemiBold** (serifada): logo, palavras (headwords) e títulos.
- **Inter** Regular/Medium/SemiBold: interface.
- Escala lida do Figma: display 32 · headword do card 19/26 (tracking -0.3) · body 14 · button 14 · label 13 · description 12/19 · chip 11 · caption 10/14 · eyebrow 10 (tracking 1.5, maiúsculas).
- Headword grande do detalhe: Fraunces 48/54, tracking -1,4 (frame "Word detail", conferido em 2026-11-04). O detalhe também usa Fraunces 24 ("Meanings"), Inter 13/20 (definição) e **Inter Itálico** 16/20 (fonética) e 12/19 (exemplo); o Inter Itálico entrou como quarta fonte da interface.
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
  - ⏳ **Layout da tela de "preparando o dicionário" (decisão do autor, 2026-11-03):** o autor vai desenhar no Figma depois (não há frame). Até lá, tela genérica com os componentes existentes (título, texto, progresso, "Try again"). Trocar quando o frame existir.
- **Card sem fonética (decisão do autor, 2026-11-03):** o WordCard mostra só a palavra, diferente do Figma (que tem a fonética abaixo). A lista do dwyl não traz fonética, e buscar na API para cada card seria pesado. A fonética aparece só no detalhe, quando o usuário abre a palavra.
- **Ordem aleatória e estável (decisão do autor, 2026-11-03):** o seed grava um `sort_key` aleatório por palavra, e a lista é ordenada por (`sort_key`, `word`). Em ordem alfabética a lista começaria por "a", "aa", "aaa"…, muitas sem resultado na API. A ordem não muda entre sessões. Registrar a decisão no README.
- **Palavras comuns primeiro (decisão do autor, 2026-11-03):** a lista abre com palavras comuns, em ordem aleatória, inspirada no wireframe (hello, today, great…). O README da Coodesh não define ordem. São três camadas, cada uma com sua faixa de `sort_key` (`camada × 2³¹ + sorteio`): (1) Basic English de Ogden, 854 itens da Simple English Wikipedia, domínio público; (2) 8.117 palavras mais frequentes (`first20hours/google-10000-english`, sem palavrões, sem palavras de menos de 3 letras e sem siglas; licença de uso educacional e pessoal); (3) o resto do dwyl. Só entram palavras que existem no dwyl. Gerado por `scripts/build-common-words.mjs` em `src/features/words/data/commonWords.json` (88 KB, embutido no app). A migration `0001_reseed_with_common_words` esvazia `words` uma vez para quem já tinha a ordem antiga baixar de novo.
- **Palavras "Word not found" continuam na lista (decisão do autor, 2026-11-04):** a lista continua sendo a do dwyl inteira. Chegou a ser feito um filtro que escondia as palavras com 404 guardado, mas foi desfeito antes do commit: o autor abriu "every" (palavra comum) e recebeu 404, e a resposta vinha do CDN da API (`cf-cache-status: HIT`, `age` de ~27 h; a mensagem diz "try the search again at later time"). Ou seja, o 404 dessa API nem sempre é definitivo, e esconder puniria palavras boas; além disso, cada 404 só seria visto uma vez, um card sumindo da grade parece defeito e a lista mudando de tamanho complica o Previous/Next. O estado "Word not found" do Figma (Retry e Next) é a resposta prevista. Ficaram:
  - o **404 no cache com validade de 7 dias** (`NOT_FOUND_CACHE_TTL_MS`, `notFoundExpiry.ts`): reabrir responde na hora sem gastar consulta; vencido, o cache trata como ausente e a API é consultada de novo. Palavras encontradas não vencem;
  - o **filtro de hífen e símbolos no seed** (`isListableWord`, `/^[a-z]+$/`): só 2 das 370.100 palavras ("jean-pierre", "jean-christophe"); sem migration para refazer o seed, quem já baixou fica com essas 2;
  - ideia opcional para a etapa 6: card levemente apagado para palavra com 404 conhecido, sem escondê-la.
- **Limite da Free Dictionary API:** por IP (cada celular tem o seu), ~450 requisições por janela de uns 5 minutos (cabeçalho `x-ratelimit-limit`; o autor já citou "300 per 5 minutes"). O cabeçalho de reinício não é confiável (aponta para uma data passada); há relatos de bloqueios de 1 a 30 minutos. O app responde com 429, tratado como erro sem cache; mensagem própria na parte 5 da etapa 3.
- Paginação por **keyset** (`WHERE (sort_key, word) > (?, ?) ORDER BY sort_key, word LIMIT 60`), nunca `OFFSET`. 60 = 20 linhas × 3 colunas.
- Grade com **FlashList** (`numColumns={3}`).
- `onEndReached` com trava contra páginas duplicadas.

### 6.2 Detalhe da palavra

- Abre como **folha nativa** sobre as abas: `presentation: 'formSheet'` do Expo Router, com altura alta (decisão do autor, 2026-11-03). Puxador e arrastar para fechar são do sistema. Figma: drag handle, "X" à esquerda, coração à direita.
- Card com a palavra (Fraunces), fonética, player de áudio e **Meanings** agrupados por classe gramatical (chips `noun`, `verb`), com definição e exemplo.
- **Implementação (2026-11-04, etapa 3):** `WordDetailScreen` → `DetailToolbar` ("X", título "WORD EXPLORER" e um espaço de 44pt no lugar do coração, para o título ficar centralizado), `HeadwordCard` (fundo `accentSoft`, raio 16, padding 20), `MeaningsSection` → `MeaningGroup` (chip + linha divisória, definições, exemplo entre aspas, "Show more"/"Show less" com `accessibilityState.expanded`). **Layout quebrado no iOS (2026-11-04):** o `react-native-screens` 4.30 procura um `ScrollView` entre os filhos diretos do conteúdo do `formSheet` e força o frame dele para o tamanho da folha, a partir do topo ("This is not perfect", diz o código em `RNSScreen.mm`). Se o Fabric achatar a `View` raiz do detalhe (no primeiro instante ela pode ficar só com layout, sem o fundo resolvido), o `ScrollView` vira filho direto e cobre a barra, sem margem e com o card deslocado; o autor viu isso às vezes. A raiz do detalhe usa `collapsable={false}` para nunca ser achatada. Toda tela em `formSheet` com `ScrollView` deve seguir o mesmo cuidado. **Carregamento e erros (2026-11-04, etapa 3):** `WordDetailSkeleton` segue o frame 3:15914 (blocos `Skeleton` em `playerIdle`, raio 8, com as medidas do Figma; o player no estado de carregamento; "Looking up a little more meaning…"). `WordDetailError` segue o 3:15979 (ilustração 112pt raio 36 com ícone, título Fraunces 30, texto Inter 14/22, caixa "Your place is saved…", Retry e Next) em três variantes: `not_found` (404, ícone `book-search`), `unavailable` (rede/servidor, `wifi-off`) e `rate_limited` (429, `hourglass`, "Too many lookups right now. Wait a moment and try again."). O 429 vira `DictionaryRateLimitError` (domínio), com `retryable: false`: o `QueryClient` (`shouldRetry`, em `src/core/query/queryClient.ts`) nunca repete sozinho um erro marcado assim, porque repetir prolonga o bloqueio. O Next só aparece quando houver próxima palavra (parte 6). A frase decorativa do rodapé do Figma ("ENGLISH · A SMALL WORD…") ficou de fora: é um texto por palavra que a API não fornece. Tokens novos: raio `lg` 16, espaço `lgPlus` 20, ícone do "X" 20.
- **404 da API:** mostra "Word not found" com **Retry** e **Next**; o 404 também vai para o cache, para não chamar a API de novo. O **Retry ignora o cache** e consulta a API outra vez (`lookUpWord(..., { refresh: true })`).
- **Decisões da etapa 3 (autor, 2026-11-04):**
  - **Coração escondido até a etapa 4:** o cabeçalho do detalhe fica só com o "X"; o favorito entra já funcionando na etapa 4.
  - **Histórico gravado já na etapa 3:** o `HistoryRepository` nasce agora só com o registro (sem duplicados, atualizando `viewed_at`); a aba History lê esses dados na etapa 4.
  - **Voz do aparelho no mesmo player:** sem mp3, o player é igual, com rótulo "Pronunciation" (o mesmo do mp3 sem sotaque; antes era "Device voice", trocado por decisão do autor) e a barra cheia enquanto fala, sem duração (o `expo-speech` não informa). O leitor de tela diz que é a voz do aparelho.
  - **Significados:** até 3 por classe gramatical e um botão "Show more" para o resto ("set" tem 45 como verbo).
- **Previous / Next:** navegam dentro da **lista de origem** (Word list, History ou Favorites). O detalhe recebe a origem e o índice; nas pontas, o botão fica desabilitado.
- Abrir o detalhe **registra no histórico** automaticamente.

### 6.3 Histórico

- Sem duplicados: rever uma palavra atualiza o `viewed_at` e ela sobe para o topo. Ordem: mais recente primeiro.
- **Gravação (2026-11-04, etapa 3):** `HistoryRepository.recordView(word, userId)` → `SqliteHistoryRepository`: **atualiza e, se não havia linha, insere**. O upsert direto precisaria do índice com a expressão do visitante como alvo, que os tipos do Drizzle não aceitam (só com `as never`). Se dois registros chegarem juntos, o índice único barra o segundo (`onConflictDoNothing`). O hook `useRecordWordView` grava uma vez por palavra aberta; até a etapa 5, sempre como visitante (`userId` nulo). **Só palavras encontradas entram no histórico (decisão do autor, 2026-11-04):** o detalhe passa `null` enquanto carrega e no "Word not found"; se o "Retry" encontrar a palavra, ela é registrada nesse momento. Uma falha ao gravar só gera `console.warn`, sem atrapalhar o detalhe.
- **Detalhe pelo React Query:** `useWordDetail(word)` (chave `wordQueryKeys.detail(word)`, `staleTime: Infinity`) devolve `loading`, `found`, `not_found` ou `error`. No `not_found`, o `retry` usa `queryClient.fetchQuery` com `refresh: true`, para passar por cima do 404 guardado; no `error` (rede), só refaz a busca.

### 6.4 Favoritos

- Favoritar/desfavoritar com **atualização otimista**: o coração muda na hora, sincroniza com o Supabase em segundo plano e reverte (com aviso) se falhar.

### 6.5 Áudio

- Toca o primeiro `phonetics[].audio` não vazio. Sem mp3, cai para **TTS** (`expo-speech`). O play nunca fica sem função.
- **Implementação (2026-11-04, etapa 3):** `pickPronunciation` (domínio) escolhe o primeiro mp3 e lê o sotaque do nome do arquivo (`-uk`, `-us`, `-au`, `-ca` → "British/American/Australian/Canadian pronunciation"). O áudio e a voz ficam atrás de interfaces (`PronunciationAudioFactory`, `SpeechService`), com `ExpoPronunciationAudioFactory` (`createAudioPlayer` do `expo-audio`, liberado com `remove()` ao fechar) e `ExpoSpeechService` (`en-US`). O hook `usePronunciation` controla carregando, pronto e tocando, o progresso e a duração; no fim, volta ao começo. **Cache do áudio (decisão do autor, 2026-11-04):** o servidor de áudio da API responde devagar às vezes, então o `FileSystemPronunciationAudioCache` (`expo-file-system`) baixa o mp3 para a pasta `pronunciations` do cache do aparelho e o player toca o arquivo local: a mesma palavra toca na hora depois, inclusive offline. O `File.downloadFileAsync` rejeita respostas fora de 2xx (conferido no código nativo dos dois sistemas), então uma falha do servidor (502, 404) troca para a voz do aparelho na hora. O tempo limite (`PLAYER_LOAD_TIMEOUT_MS`, 4 s) ficou só como rede de segurança para rede muito lenta. A troca para a voz acontece **uma vez só** por abertura (o tempo limite é cancelado, e um mp3 que chegue depois é ignorado), e um áudio que falhou não é baixado de novo na mesma sessão (o cache guarda as URLs que falharam; na próxima abertura do app tenta outra vez). Em 2026-11-04 o servidor de áudio da API respondia 502 também no celular do autor: o som ouvido era a voz do aparelho. O player do Figma (`AudioPlayer`) fica dentro do card da palavra, com `key` na palavra para recomeçar a cada uma. **Carregando (pedido do autor, 2026-11-04):** indicador de atividade do sistema (`ActivityIndicator`, cor `accent`) dentro do círculo `playerIdle`, e reticências animadas depois de "Preparing audio" (. → .. → ..., a cada 400 ms; `LoadingDots` em `src/shared/components/`, fixas em "..." com "Reduzir movimento" e ocultas para o leitor de tela).
- **Permissões:** o plugin do `expo-audio` no `app.json` está com `microphonePermission: false`, `recordAudioAndroid: false` e `enableBackgroundPlayback: false`. O app só toca áudio curto, sem gravar nem tocar em segundo plano; sem isso, o APK pediria permissão de microfone.
- **iOS e a chave de silencioso:** no iOS, o padrão nativo do `expo-audio` é `playsInSilentMode: false` (`AudioRecords.swift`), ao contrário do que diz a documentação. Assim, o app usa a categoria `ambient`, e a chave de silencioso cala tudo (o autor testou no iPhone e não saía som). `ensurePlaybackAudioMode` (`features/words/data/playbackAudioMode.ts`) configura uma vez `playsInSilentMode: true` e `interruptionMode: 'duckOthers'` (a música de outro app só abaixa) antes de tocar o mp3 ou a voz do aparelho, que usa a mesma sessão.
- **`expo-asset`:** dependência obrigatória do `expo-audio` (o `expo-doctor` avisa); sem ela, o app pode fechar fora do Expo Go (no APK), mesmo funcionando no Expo Go. Rodar `npx expo-doctor` depois de instalar qualquer módulo nativo.

### 6.6 Cache (obrigatório 2)

- Ordem: **React Query (memória) → SQLite (`word_cache`) → API**. Palavra já buscada abre na hora, inclusive offline e depois de fechar o app.
- **Implementação (2026-11-04, etapa 3):** `lookUpWord` (domínio) consulta o `WordCacheRepository` e só então o `DictionaryService`; guarda a resposta, inclusive o 404, mas **não** guarda erro de rede (a próxima tentativa funciona). O cache não expira (o dicionário quase não muda). `FreeDictionaryService` valida a resposta com Zod (`dictionarySchemas.ts`) e `toWordDetail` junta as entradas: fonética do topo ou a primeira da lista, áudios sem repetidos e significados agrupados por classe gramatical. O `payload` do cache é o `WordDetail` já montado, validado de novo ao ler; se vier corrompido, é tratado como ausente. Schema conferido contra respostas reais (hello, set, run, coal, through, the, a).

### 6.7 Login (diferencial 4)

- Supabase Auth com **e-mail e senha**, sessão persistida. Telas de login e cadastro; botão de conta no header.
- **Login opcional, com modo visitante (decisão do autor, 2026-11-03):** o app abre direto na lista. Sem login, favoritos e histórico ficam só no aparelho, como visitante (`user_id` nulo). O botão de conta no header leva ao login.
- **Ao entrar:** os dados do visitante são mesclados na conta e sincronizados. Favoritos por união; no histórico, vale o `viewed_at` mais recente de cada palavra.
- ⏳ **Ao sair:** comportamento a definir na etapa 5 (ex.: limpar os dados da conta do aparelho e voltar ao visitante).
- **Local-first:** lista, cache, favoritos e histórico funcionam pelo SQLite; o Supabase sincroniza por `user_id`. Se o back-end estiver fora (ex.: projeto pausado no plano gratuito), o app continua usável.

---

## 7. Telas (Figma)

Arquivo `2SH7Dc3Qpr9ZjIw0iv8GGv` ([link público, só leitura](https://www.figma.com/design/2SH7Dc3Qpr9ZjIw0iv8GGv/Untitled?node-id=0-1), citado no README; compartilhamento conferido em 2026-11-03), página 1, frames de 390×844. Node IDs (Light / Dark):

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
  - **Forma no SDK 58 (2026-11-03, etapa 1, confirmada pelo autor):** o expo-router 58 embute o próprio React Navigation, inclusive o `material-top-tabs`, já integrado como `TopTabs` em `expo-router/js-top-tabs`. Usamos esse (mesma biblioteca e mesmo comportamento) em vez de instalar `@react-navigation/material-top-tabs`, que seria uma segunda cópia do React Navigation fora do contexto do router. Ele pede `react-native-tab-view` (JS) + `react-native-pager-view`. A `tabBar` do SDK 58 recebe `emitter` e `navigateToTab(routeKey)` (não há mais `navigation`): ver `src/shared/components/SegmentedTabBar.tsx`.
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
- Execução no Expo Go em aparelho real (Android e iOS) conferida pelo autor em 2026-11-03.

### Convenções da fundação (2026-11-03)

- **Classes do tema:** os nomes vêm dos tokens em kebab-case. Cores: `bg-surface`, `text-text-primary`, `bg-accent-soft`, `border-border` (aceitam opacidade, `bg-accent/50`). Fontes: `font-serif-semi-bold`, `font-sans-regular`, `font-sans-medium`, `font-sans-semi-bold`. Tipografia (tamanho, entrelinha e tracking): `text-display`, `text-headword-card`, `text-body`, `text-eyebrow`… Spacing `p-xl`, `gap-md`; raios `rounded-sm|md|pill`; tamanhos de componente `h-button`, `min-h-touch-target`, `h-input`, `h-chip`.
- A tipografia do Tailwind não carrega a fonte: o componente de texto combina `font-*` + `text-*` (mapa tipado por variante).
- **TypeScript 6:** `types: ["jest"]` no `tsconfig` (o TS 6 não inclui mais todos os `@types`), `experimentalDecorators` para os decorators da tsyringe e `noUncheckedIndexedAccess` ligado.
- **Lint:** ESLint 9 (o `eslint-plugin-react-native` ainda não declara suporte ao 10), flat config em `eslint.config.js`, ignorando a `.claude/` local.
- **Logs (2026-11-04):** nada de `console.warn` solto: use o `logger` (`src/shared/utils/logger.ts`), só ativo em desenvolvimento (no APK não registra nada; um monitoramento de erros entraria ali). `logger.warn(scope, msg, erro)` para falha de verdade já tratada na tela (no Expo Go também vira aviso amarelo no celular); `logger.debug` para situação esperada e contornada, que fica só no terminal (ex.: áudio da API fora do ar e a voz assumindo). Atende a regra 6 do `REGRAS.md` (nunca engolir erros). Avisos que não são do Lexi (ex.: `ImageBackground is deprecated`, de uma biblioteca) não têm o que corrigir aqui.
- **Testes:** `__tests__/` ao lado do código; `container.reset()` depois de cada teste (`jest.setup.ts`).
- **Componentes compartilhados (`src/shared/components/`):** `AppText` com `variant` (token de tipografia) e `tone` (`primary`, `secondary`, `accent`, `onAccent`), nunca cor solta; `Button` com `variant` e `icon` (componente Lucide); `AppHeader`. O ponto da marca é uma `View` `bg-accent` (o SVG do Figma tinha a cor fixa e não trocaria de tema). Ícones Lucide recebem cor, tamanho e traço do `useTheme()`.
- **Jest e Lucide:** o `moduleNameMapper` aponta `lucide-react-native` para o build CommonJS (a condição `react-native` resolve um `.mjs` que o jest-expo não transforma). A Testing Library 14 tem `render` e `fireEvent` assíncronos: use `await`.
- **Navegação:** `src/shared/utils/navigation.ts` concentra as idas para o detalhe (`openWordDetail`) e o login (`openLogin`). As rotas da etapa 1 usam `PlaceholderScreen`/`WordDetailPlaceholder`, que saem quando cada tela real chegar. O tema da navegação (`createNavigationTheme`) usa os tokens, para a folha e o header nativo seguirem claro/escuro.
- **Exceção de cor (COR-HARDCODED):** o `expo-splash-screen` no `app.json` usa `#F8F7F3` (claro) e `#111715` (escuro), iguais a `palette.*.background`. O JSON não lê o tema nem aceita comentário; se o fundo mudar no `theme.ts`, mude aqui também. O fundo do ícone adaptativo do Android (`#E6F4FE`) ainda é o do template e muda junto com o ícone do app.
- **Textos e constantes:** `src/i18n/en.ts` exporta `en` (objeto `as const` por área; labels com parâmetro são funções). `src/constants/` separa por assunto (`words.ts`, `navigation.ts`), cada valor com comentário do porquê.

### ⏳ A decidir

- **Splash do app (lembrete do autor, 2026-11-04):** o autor vai desenhar a splash no Figma (não há frame). Hoje o `expo-splash-screen` do `app.json` mostra o `splash-icon.png` do template do Expo sobre o fundo do tema (claro e escuro). Ao trocar, gerar imagem para os dois temas (`dark.image`). No Expo Go a splash configurada não aparece (só no build, como o APK): conferir no APK. Etapa 6.
- **Tela de perfil / configurações (lembrete do autor, 2026-11-03; detalhes a discutir):** o botão de conta no header passaria a abrir uma tela de perfil/configurações em vez de ir direto ao login. Ideias até agora:
  - **Tema:** escolha manual (claro, escuro ou seguir o sistema). Muda a decisão atual de só seguir o sistema; o `useThemeMode` passaria a ler a preferência salva.
  - **Idioma:** a chave PT/EN da interface (ver seção 1).
  - **Conta:** "Log in" para o visitante; dados da conta e "sair" para quem está logado (liga com o comportamento ao sair, ainda ⏳ na seção 6.7).
  - Outras opções a combinar depois.
  - Não há frame no Figma para essa tela: definir o layout com o autor (ou desenhar no Figma) antes de implementar. Entra na etapa 5 (parte de conta) e na etapa 6 (tema e idioma).

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
- **Implementação (2026-11-03, etapa 2):**
  - Schema em `src/core/database/schema.ts`; migrations em `src/core/database/migrations/` (geradas, fora do lint e do Prettier); validação em `validation.ts` (`parseRows` com o nome da tabela no erro).
  - Versões estáveis: `drizzle-orm` 0.45, `drizzle-kit` 0.31, `drizzle-zod` 0.8, `zod` 4 (a doc do Drizzle para Expo já aponta o 1.0 `rc`; não usamos RC).
  - `sort_key` é inteiro. `favorites` e `history` têm `id` autoincremento e índice único por (usuário, palavra) com `CASE WHEN user_id IS NULL THEN '' ELSE user_id END`: no SQLite NULLs não colidem num índice único (o visitante repetiria a palavra), e o `drizzle-kit` 0.31 quebra `coalesce(...)` porque separa a expressão nas vírgulas. Conferido no `sqlite3`. Na etapa 4, o upsert precisa usar esse mesmo alvo (ou atualizar e depois inserir).
  - A consulta keyset usa o índice de cobertura `words_sort_key_word_idx` (conferido com `EXPLAIN QUERY PLAN`).
  - Banco em WAL. `src/core/di/container.ts` só exporta o container; `registerDependencies.ts` é o único que importa o client (abrir o banco não pode acontecer nos testes).
  - As migrations rodam no layout raiz (`useDatabaseMigrations`); o splash só some quando as fontes e o banco estão prontos.
- **Seed (2026-11-03, etapa 2):**
  - `WordListSource` (domínio) → `DwylWordListSource` (baixa e valida com Zod; ~140 ms para validar as 370.100 chaves no Mac). `DictionarySeeder` → `SqliteDictionarySeeder`: `isSeeded` = existe linha em `words`; `seed` grava tudo numa **transação exclusiva** do `expo-sqlite`, em lotes de 5.000 (`INSERT OR IGNORE` de várias linhas), cedendo o JS thread entre lotes. Se o app fechar no meio, nada fica pela metade. Simulado com a lista real: 0,43 s no Mac.
  - A transação exclusiva roda em outra conexão, então o seed usa SQL escrito à mão (o Drizzle fica na conexão principal). A conexão crua está no container como `TOKENS.SqliteConnection`.
  - O fluxo passa pelo React Query (`useDictionarySetup`, chave em `hooks/queryKeys.ts`), com `retry: false`: o download é grande, então o erro aparece e o usuário escolhe "Try again". O `QueryClient` padrão tem `retry` de `QUERY_RETRY_COUNT` (2).
  - `DictionaryGate` envolve as abas: fica em branco na checagem (milissegundos), mostra a tela de setup no primeiro uso e as abas quando está pronto. O header continua visível.
  - Observação: a lista do dwyl tem muitas palavras raras ("maucherite", "tholance"), que podem não existir na API. Por isso a lista abre com as palavras comuns (seção 6.1); as raras só aparecem depois de ~150 páginas, e o 404 tem tratamento planejado (seção 6.2).
- **Repositório de palavras (2026-11-03, etapa 2):** `WordRepository.getPage(cursor, limit)` devolve `{ words, nextCursor }`; o cursor é o último (`sortKey`, `word`) da página. `buildWordPage` (função pura) recebe `limit + 1` linhas: a extra só indica que há mais, então o fim da lista não custa uma consulta vazia.
- **Hook da lista (2026-11-04, etapa 2):** `useWordList` usa `useInfiniteQuery` (chave `wordQueryKeys.list`, `staleTime: Infinity`, porque a lista local só muda num novo seed). Por padrão, chamar `fetchNextPage` durante uma busca **cancela e recomeça**; como o `onEndReached` dispara várias vezes, `loadNextPage` só busca com `hasNextPage`, sem busca em andamento e sem erro, e passa `cancelRefetch: false`. O erro é `firstPage` (tela de erro) ou `nextPage` (aviso no fim da grade, `retry` refaz só a página que falhou).
- **Grade da Word list (2026-11-04, etapa 2):** `WordListScreen` (usa `useWordList`) → `WordGrid` (FlashList, `numColumns` 3) → `WordCard`. A FlashList divide a largura igualmente entre as colunas, então o espaço de 12pt entre cards vem de meia margem em cada célula, e o conteúdo compensa para manter o gutter de 24pt. Esses valores vão num `StyleSheet` a partir dos tokens (`contentContainerStyle` não aceita `className`). O título e o rodapé são `ListHeaderComponent`/`ListFooterComponent` e rolam junto, como no Figma. O `WordCard` recebe `onPress(word)` e é `memo`, para a lista não criar uma função por item. A próxima página começa a carregar meia tela antes do fim (`WORD_LIST_END_THRESHOLD`).
- **Rolagem rápida (pedido do autor, 2026-11-04):** `useFastScroll` + `FastScrollbar` (`src/shared/`), usados na `WordGrid`. Não está no Figma. O Android não tem barra arrastável nas listas do React Native, então é um componente próprio: `PanResponder` para o arraste e shared values do Reanimated para posição, tamanho e opacidade (rolar não re-renderiza a lista). As contas são funções puras e worklets em `src/shared/utils/fastScroll.ts`. **Limite:** a lista é infinita, então a barrinha cobre o conteúdo **já carregado**; arrastando até o fim, a próxima página entra como na rolagem normal. Pular para qualquer ponto das 370 mil palavras exigiria outra paginação. A área de toque é o gutter direito (24pt, abaixo dos 44pt mínimos), escolhida para não cobrir os cards; é um atalho extra, a rolagem normal continua.
- **Spinner:** `src/shared/components/Spinner.tsx` gira o `loader-circle` do Figma com Reanimated e fica parado se o sistema pede menos movimento (`useReducedMotion`).
- **Jest e Reanimated 4.7:** o Reanimated quebra ao ser importado no Jest (registra um recurso de CSS nativo que o modo de teste não tem), e o mock oficial importa o mesmo código. `jest.setup.ts` usa um mock local mínimo (`src/shared/testing/reanimatedMock.ts`) com só o que o app usa; ao usar algo novo do Reanimated, acrescente lá. A FlashList usa o `jestSetup` dela e entra no `transformIgnorePatterns` (é ESM).
- **Testes com SQL real:** `src/core/database/testing/createTestDatabase.ts` abre um SQLite em memória com o `better-sqlite3` (dependência de desenvolvimento, fora do bundle) e aplica as migrations do `_journal.json`. Repositórios que usam o Drizzle são testados assim. O seed, que usa a conexão crua do `expo-sqlite`, roda sobre `createTestConnection` (`src/core/database/testing/`), que imita `withExclusiveTransactionAsync` e `runAsync` no better-sqlite3: assim o SQL de inserção em lotes e o ROLLBACK rodam de verdade (`dictionaryFlow.test.ts`: seed em 3 lotes, falha no meio sem deixar nada, lista abrindo pelas palavras comuns, percurso completo sem repetição e ordem estável). Cobertura de `domain` e `data` da lista: 100%.

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

- Repositório único, app na raiz, remote `https://github.com/EnzoFelyx/lexi-mobile-challenge.git` (público).
- **Criado a partir do template da Coodesh (2026-11-03, decisão do autor):** o Passo 1 do desafio ("Use this template" em `coodesh/mobile-challenge-20240202`) tinha sido pulado. O repositório original foi renomeado para `EnzoFelyx/lexi-mobile-challenge-old` e, depois da migração, excluído (decisão do autor; perdeu-se só a página do PR #1 da etapa 1, cujos commits estão todos aqui). Um novo `lexi-mobile-challenge` foi gerado do template e o histórico local foi juntado a ele com merge (`--allow-unrelated-histories`), então todos os commits e hashes continuam iguais. O README do template virou `CHALLENGE.md`; o `img/wireframe.png` veio junto. A `main` foi enviada direto (importação inicial); o resto segue por PR.
- Branch principal: `main` (o template criou `master`, renomeada em 2026-11-03).
- Commits como `EnzoFelyx`, sem rodapé `Co-Authored-By`.
- Uma branch por etapa (`chore/project-foundation`, `feat/word-list`…), merge por PR.
- Conventional Commits em inglês.

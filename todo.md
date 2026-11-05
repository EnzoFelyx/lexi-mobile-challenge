# todo.md — Roadmap de desenvolvimento do Lexi

> Ordem de construção do app, dividida em etapas **sem prazo fixo** (decisão do autor, 2026-11-03).
> Cada etapa tem um **objetivo**, as **tarefas** e o critério de **pronto quando**, e termina num ponto estável para commit e PR.
> Marque as tarefas com `[x]` conforme forem concluídas. Uma etapa só termina quando todos os critérios de "pronto quando" forem atendidos.
> Toda tarefa segue o `REGRAS.md` e o `CLAUDE.md`.

> 🔁 **Lembrete fixo:** prioridade **README da Coodesh > decisões do Lexi > padrões do Pinny > ECC**. Na dúvida, pergunte ao autor.

> 🔁 **Lembrete fixo:** em toda tela nova que carrega dados, confira no Figma o estado de carregamento (o detalhe tem skeleton; a lista tem "carregando mais" no fim). Se o Figma não definir, pergunte ao autor.

> ✂️ **Se o tempo apertar, corte nesta ordem:** Maestro E2E → microinterações → GitHub Actions. Login e testes unitários não saem (diferenciais visíveis).

**Legenda de status:** ⬜ não iniciada · 🟨 em andamento · ✅ concluída

| # | Etapa | Status |
|---|---|---|
| 0 | Decisões pendentes | ✅ |
| 1 | Fundação | ✅ |
| 2 | Lista de palavras | ✅ |
| 3 | Detalhe da palavra | ✅ |
| 4 | Favoritos e histórico (✅ marco: obrigatórios prontos) | ✅ |
| 5 | Supabase e login | ⬜ |
| 6 | Qualidade | ⬜ |
| 7 | Entrega | ⬜ |

---

## Etapa 0 — Decisões pendentes

**Objetivo:** fechar o que ainda está em aberto antes de escrever código. Cada resposta vai para a seção 10 do `CLAUDE.md`.

Decididas em 2026-11-03 (decisões do autor):

- [x] **Estilização** → **NativeWind**, com o `tailwind.config.ts` lendo o `theme.ts` e dark mode por variáveis CSS
- [x] **Acesso ao SQLite** → **Drizzle ORM + `drizzle-zod`** (o README da Coodesh não indica ferramenta)
- [x] **Lista** → **FlashList**
- [x] **Ordem da Word list** → **`sort_key` aleatório** gravado no seed (variada e estável)
- [x] **Login** → **opcional, com modo visitante**: abre na lista e mescla os dados locais ao entrar
- [x] **Apresentação do detalhe** → **`formSheet`**
- [x] **Abas superiores** → **`material-top-tabs` com `tabBar` própria** (SegmentedTabs do Figma)
- [x] **Idioma do README** → **bilíngue** (`README.md` em inglês e `README.pt-BR.md` em português)
- [x] **Repositório no GitHub** → **`EnzoFelyx/lexi-mobile-challenge`, público**
- [x] Registrar todas as decisões no `CLAUDE.md`

**Pronto quando:** não houver item "a decidir" que bloqueie a etapa 1.

---

## Etapa 1 — Fundação

**Objetivo:** projeto limpo, organizado e com qualidade automática desde o primeiro commit.

- [x] Renomear a branch `master` para `main`
- [x] Criar o repositório público `EnzoFelyx/lexi-mobile-challenge` e fazer o primeiro push
- [x] Recriar o repositório a partir do template da Coodesh (Passo 1 do desafio), mantendo o histórico: o antigo foi renomeado e depois excluído; enunciado em `CHALLENGE.md` (2026-11-03)
- [x] Instalar o ECC com o `./install.sh` do `ecc-rn-setup`, preservando o plugin `expo@claude-plugins-official` do `.claude/settings.json` (a `.claude/` saiu do git)
- [x] Criar a branch `chore/project-foundation`
- [x] Limpar o template do Expo: telas e componentes de demo, `reset-project`, suporte web (`react-native-web`, `react-dom`, config `web` do `app.json`) e assets sem uso
- [x] `.gitignore` com `.env` e `.env*.local`; `.env.example` com as variáveis do Supabase
- [x] TypeScript `strict` e alias `@/` → `./src/`
- [x] ESLint (`eslint-config-expo` + `eslint-plugin-react-native` + Prettier) com as regras do `REGRAS.md`; Prettier com `singleQuote`, `trailingComma: all`, `printWidth: 100`
- [x] Scripts `lint`, `format`, `typecheck` e `test`
- [x] Estrutura de pastas da seção 11 do `CLAUDE.md` (`features`, `core`, `shared`, `i18n`, `constants`)
- [x] Tema em `src/core/theme/` a partir do `theme.ts` do Figma (light/dark), com hook para o tema ativo e contraste AA conferido, com teste de contraste (o `textSecondary` claro foi escurecido para passar no AA)
- [x] Fontes Fraunces e Inter (`@expo-google-fonts/*`) e licença OFL registrada
- [x] NativeWind configurado (versão compatível com o SDK 58 e o Expo Go): `tailwind.config.ts` lendo cores, fontes, tipografia, spacing e radius do `theme.ts`, paleta padrão removida, dark mode por variáveis CSS e regra de lint contra cor em `className`
- [x] tsyringe configurada (`reflect-metadata`, plugins de decorators no Babel, container e `TOKENS` em `src/core/di/`)
- [x] Jest (`jest-expo`) + React Native Testing Library configurados, com um teste de exemplo passando
- [x] `src/i18n/en.ts` com a estrutura dos textos e `src/constants/` com os primeiros valores
- [x] Componentes compartilhados base do Figma: Button (primary/secondary), header com logo e conta
- [x] Rotas da seção 11 com telas provisórias, abas superiores (`material-top-tabs` + `tabBar` própria) e detalhe abrindo como `formSheet`
- [x] Rodar no Expo Go em Android e iOS (conferido pelo autor em 2026-11-03: tema claro/escuro, fontes, abas, `formSheet`, login e leitor de tela)

**Pronto quando:** o app abre no Expo Go nos dois sistemas com o tema claro e escuro, e lint, typecheck e testes passam.

---

## Etapa 2 — Lista de palavras

**Objetivo:** a aba Word list com as ~370 mil palavras e rolagem infinita fluida.

- [x] Banco SQLite com Drizzle: schema, migrations geradas (`db:generate`, `.sql` embutido via `inline-import`) e validação Zod na leitura (tabelas `words`, `word_cache`, `favorites`, `history`)
- [x] Seed: baixar o `words_dictionary.json` do dwyl na primeira execução e gravar em lotes dentro de transação, com `sort_key` aleatório por palavra
- [x] Tela de "preparando o dicionário" com progresso, erro de rede e "tentar de novo" (genérica por enquanto)
- [ ] 📝 **Lembrete do autor:** desenhar no Figma a tela de "preparando o dicionário" e depois trocar a tela genérica pelo frame
- [x] `WordRepository` (interface no domain, implementação SQLite) com paginação keyset por (`sort_key`, `word`), 60 itens por página
- [x] Registro no container e hook `useWordList` com `onEndReached` e trava contra páginas duplicadas
- [x] Componentes do Figma: SegmentedTabs (✅ antecipado na etapa 1, como `tabBar` das abas) e WordCard (só a palavra, sem fonética: decisão do autor)
- [x] Grade de 3 colunas com **FlashList**, título de seção, texto de apoio e "carregando mais" no fim
- [x] Testes: paginação keyset (próxima página, fim da lista) e seed em lotes (incluindo seed + paginação ponta a ponta num SQLite real; 100% de cobertura em `domain` e `data`)
- [x] Conferir no Expo Go (Android e iOS), com rolagem fluida (conferido pelo autor em 2026-11-04, inclusive a rolagem rápida)

**Pronto quando:** a lista rola até o fim sem travar, o seed só roda uma vez e os testes passam.

---

## Etapa 3 — Detalhe da palavra

**Objetivo:** ver a palavra, os significados, a fonética e ouvir a pronúncia.

- [x] `DictionaryService` (interface + Free Dictionary API) com resposta validada por Zod
- [x] Cache: React Query → SQLite (`word_cache`) → API, inclusive para o 404 (a parte do React Query entra com o hook)
- [x] Hook `useWordDetail` e registro no container
- [x] Detalhe em `formSheet` (Figma `3:15839`): "X", coração, card com palavra e fonética, Meanings por classe gramatical com chips e exemplos
- [x] Skeleton de carregamento (Figma `3:15914`; os blocos do Previous/Next entram com a navegação)
- [x] Erro "Word not found" (Figma `3:15979`) com Retry e Next (o Next aparece quando houver próxima palavra, com a navegação)
- [x] Mensagem própria para o limite da API (HTTP 429, "Too many lookups right now. Wait a moment and try again."), em vez de "verifique sua internet"; o 429 não vai para o cache (decisão do autor, 2026-11-04)
- [x] "Word not found" (decisão do autor): as palavras continuam na lista (esconder foi descartado, ver `CLAUDE.md` 6.1); o 404 guardado vale 7 dias; o seed ignora palavras com hífen ou símbolos
- [x] Previous/Next dentro da lista de origem (recebe origem e índice), desabilitados nas pontas
- [x] Player: primeiro `phonetics[].audio` não vazio com `expo-audio`; sem mp3, TTS com `expo-speech`; estados pronto e carregando
- [x] Abrir o detalhe registra no histórico (só palavras encontradas)
- [x] Testes: fluxo do cache (404 cacheado não chama a API), escolha do áudio e fallback, estados da tela
- [x] Conferir no Expo Go (Android e iOS) (conferido pelo autor em 2026-11-04)

**Pronto quando:** qualquer palavra abre com dados ou erro tratado, a segunda abertura vem do cache (inclusive offline) e o áudio sempre toca algo.

---

## Etapa 4 — Favoritos e histórico

**Objetivo:** salvar, remover e rever palavras. Ao fim desta etapa, **todos os obrigatórios do README estão prontos**.

- [x] `FavoritesRepository` e `HistoryRepository` (interfaces + SQLite) registrados no container, funcionando para o visitante (`user_id` nulo)
- [x] Favoritar e desfavoritar com atualização otimista (React Query, decisão do autor em 2026-11-05)
- [x] Histórico sem duplicados: rever atualiza o `viewed_at` e sobe para o topo
- [x] Abas History (`3:15625`) e Favorites (`3:15731`) com a mesma grade, resumo com contagem e nota de rodapé (History com "Clear" e confirmação, pedido do autor)
- [x] Estados vazios (`3:15690` e `3:15798`) com o botão para ir à lista
- [x] Previous/Next também funcionando a partir de History e Favorites
- [x] Testes: merge do histórico, favorito otimista revertendo, telas vazias e cheias
- [x] Conferir no Expo Go no iOS (o Android fica para a etapa 7, decisão do autor em 2026-11-05)
- [ ] ✅ **Marco:** commit/tag marcando os obrigatórios prontos

**Pronto quando:** os 5 casos de uso do Obrigatório 1 funcionam, com cache e wireframe atendidos.

---

## Etapa 5 — Supabase e login

**Objetivo:** login com e-mail e senha e favoritos/histórico associados ao ID do usuário (diferencial 4).

- [ ] Projeto no Supabase: tabelas `favorites` e `history`, chave única em (`user_id`, `word`) e RLS (`user_id = auth.uid()`)
- [ ] Guardar o SQL das tabelas e políticas no repositório (ex.: `supabase/migrations/`)
- [ ] Client do Supabase em `src/core/supabase/` com sessão persistida
- [ ] Telas de login (`3:16034`) e cadastro (`3:16074`) com validação dos campos e mostrar/ocultar senha
- [ ] Botão de conta no header (entrar, sair); o app continua abrindo na lista, sem exigir login
- [ ] 📝 **Lembrete do autor (a discutir):** tela de perfil/configurações aberta pelo botão de conta, em vez do login direto. Parte desta etapa: "Log in" para o visitante; dados da conta e "sair" para quem está logado. Antes: combinar o layout (não há frame no Figma) e as demais opções
- [ ] Ao entrar: mesclar os dados do visitante na conta (favoritos por união; histórico com o `viewed_at` mais recente) e sincronizar
- [ ] Definir com o autor o que acontece ao sair (ex.: limpar os dados da conta do aparelho e voltar ao visitante)
- [ ] Decidir com o autor se a confirmação de e-mail do Supabase fica desligada (cadastro instantâneo para o avaliador)
- [ ] Sincronização local-first de favoritos e histórico por `user_id`, com o app usável se o Supabase estiver fora
- [ ] Tipos gerados pela CLI do Supabase
- [ ] Testes: fluxo de auth com o serviço mockado pelo container, mescla visitante → conta, sincronização e falha do back-end
- [ ] Conferir no Expo Go (Android e iOS)

**Pronto quando:** o visitante usa o app sem conta, ao entrar os dados dele vão para a conta, dois usuários diferentes veem cada um os próprios favoritos e histórico, e o app continua funcionando offline.

---

## Etapa 6 — Qualidade

**Objetivo:** testes, CI e acabamento.

- [ ] Completar os testes unitários e de componente (meta ~70% em `domain` e `data`)
- [ ] GitHub Actions com lint, typecheck e testes a cada push, com badge no README
- [ ] Polimento visual fiel ao Figma, em light e dark
- [ ] 📝 **Lembrete do autor:** desenhar no Figma a splash (tela de abertura do app, antes do carregamento) e depois aplicar no `expo-splash-screen` do `app.json` (imagem clara e escura). Hoje a splash usa o `splash-icon.png` do template do Expo sobre o fundo do tema
- [ ] Microinterações (coração ao favoritar, transição para o detalhe), respeitando "Reduzir movimento"
- [ ] (Opcional) Card levemente apagado para palavra com "Word not found" conhecido, sem tirá-la da lista
- [ ] 📝 **Lembrete do autor (a discutir):** na tela de perfil/configurações, escolha manual de tema (claro, escuro ou sistema) e de idioma, além de outras opções a combinar (ver `CLAUDE.md`, seção 10, "A decidir")
- [ ] (Opcional) Chave de idioma PT/EN dentro do app, independente do idioma do aparelho: `src/i18n/pt-BR.ts` com o mesmo formato do `en.ts`, escolha persistida e o conteúdo do dicionário mantido em inglês (decisão do autor, 2026-11-03)
- [ ] Revisão de acessibilidade (labels, roles, área de toque, fonte grande)
- [ ] Teste completo em Android e iOS
- [ ] (Opcional) Script que valida as ~9 mil palavras comuns na API (devagar, dentro do limite) e tira das camadas as que dão 404 e os nomes próprios
- [ ] (Opcional) Maestro E2E: abrir a lista, rolar, abrir uma palavra, favoritar e conferir em Favorites; login e logout

**Pronto quando:** CI verde, testes passando e o app fiel ao Figma nos dois sistemas e nos dois temas.

---

## Etapa 7 — Entrega

**Objetivo:** tudo pronto para o avaliador testar com o mínimo de esforço.

- [ ] README bilíngue completo (a versão inicial já existe desde a etapa 1) (`README.md` em inglês e `README.pt-BR.md` em português, com link entre eles), completo: título, descrição em uma frase, tecnologias, como instalar e usar, arquitetura, decisões técnicas, créditos das fontes (Fraunces e Inter, SIL OFL 1.1) e a frase "This is a challenge by [Coodesh](https://coodesh.com/)"
- [ ] Instruções para rodar no **Expo Go** no README: `npm install`, `npx expo start` e escanear o QR (cobre quem usa iPhone, já que build instalável de iOS exige conta paga da Apple)
- [ ] **GIF ou vídeo curto** no README mostrando o fluxo (lista, detalhe, áudio, favoritar, histórico, login)
- [ ] **APK no GitHub Releases**: gerar com EAS Build (`eas build -p android --profile preview`) e anexar numa release `v1.0.0`, para o avaliador instalar sem configurar nada
- [ ] Conferir no Android as funções da etapa 4 em diante (adiado da etapa 4, decisão do autor em 2026-11-05): abas History e Favorites, coração, toque duplo, "Clear", Previous/Next e o arrasto lateral, inclusive começando na borda da tela (com a navegação por gestos do Android, a borda é o "voltar" do sistema e fecha a folha)
- [ ] Testar o APK em modo avião na primeira abertura: deve aparecer "Couldn't prepare the dictionary" com "Try again" (no Expo Go não dá, porque sem rede ele nem alcança o computador e mostra o erro dele)
- [ ] Instruções do Supabase no README (`.env.example`, como reativar o projeto ou usar o próprio)
- [ ] Revisão final do `CHANGELOG.md`, do `todo.md` e do `CLAUDE.md`
- [ ] Commit final, link do repositório na plataforma da Coodesh e envio
- [ ] Entrar no painel do Supabase perto da data da avaliação para o projeto não pausar

**Pronto quando:** o avaliador consegue instalar o APK ou abrir no Expo Go e testar todos os casos de uso seguindo só o README.

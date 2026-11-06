# todo.md — Roadmap de desenvolvimento do Lexi

> Ordem de construção do app, dividida em etapas **sem prazo fixo** (decisão do autor, 2026-11-03).
> Cada etapa tem um **objetivo**, as **tarefas** e o critério de **pronto quando**, e termina num ponto estável para commit e PR.
> Marque as tarefas com `[x]` conforme forem concluídas. Uma etapa só termina quando todos os critérios de "pronto quando" forem atendidos.
> Toda tarefa segue o `REGRAS.md` e o `CLAUDE.md`.

> 🔁 **Lembrete fixo:** prioridade **README da Coodesh > decisões do Lexi > padrões do Pinny > ECC**. Na dúvida, pergunte ao autor.

> 🔁 **Lembrete fixo:** em toda tela nova que carrega dados, confira no Figma o estado de carregamento (o detalhe tem skeleton; a lista tem "carregando mais" no fim). Se o Figma não definir, pergunte ao autor.

**Legenda de status:** ⬜ não iniciada · 🟨 em andamento · ✅ concluída

| # | Etapa | Status |
|---|---|---|
| 0 | Decisões pendentes | ✅ |
| 1 | Fundação | ✅ |
| 2 | Lista de palavras | ✅ |
| 3 | Detalhe da palavra | ✅ |
| 4 | Favoritos e histórico (✅ marco: obrigatórios prontos) | ✅ |
| 5 | Supabase e login | ✅ |
| 6 | Qualidade | ✅ |
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
- [x] **Idioma do README** → **bilíngue** (`README.md` em português, o principal desde 2026-11-05, e `README.en.md` em inglês)
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
- [x] ✅ **Marco:** commit/tag marcando os obrigatórios prontos (tag `v0.4.0` no merge commit `127c316`, "All required features of the challenge")

**Pronto quando:** os 5 casos de uso do Obrigatório 1 funcionam, com cache e wireframe atendidos.

---

## Etapa 5 — Supabase e login

**Objetivo:** login com e-mail e senha e favoritos/histórico associados ao ID do usuário (diferencial 4).

**Ordem (decisão do autor, 2026-11-05):** primeiro o visual, do Figma, com dados de mentira; depois a parte funcional com o Supabase; por fim, a integração das duas.

### Parte 1 — Visual (Figma)

- [x] Tela de perfil/configurações aberta pelo botão de conta, em vez do login direto: estados visitante (`46:13683` / `46:13789`) e logado (`46:13739` / `46:13845`), com autenticação de mentira até a parte 3
- [x] Componentes reutilizáveis do Figma (`46:14665` / `46:14791`): campos com erro e desabilitados, botão carregando, erro do formulário, header de login/cadastro e erro recuperável
- [x] Modo temporário do design desligado (`AUTH_DESIGN_PREVIEW = false`, pedido do autor em 2026-11-05)
- [x] Conferir no aparelho o voltar, o visitante, a abertura seguinte e a entrada na lista (conferido pelo autor em 2026-11-05)
- [x] Primeiro arrasto de Word list para History parando fora do lugar no iOS: corrigido ao deixar o `TopTabs` sem `screenOptions`, conferido pelo autor no aparelho em 2026-11-05 (`CLAUDE.md`, seção 10)
- [x] Login como primeira tela (decisão do autor, 2026-11-05): lembrar o visitante e a sessão, abrir direto na lista nas próximas vezes e manter login e cadastro em Settings
- [x] Telas de login (`3:16034`) e cadastro (`3:16074`) com mostrar/ocultar senha
- [x] Estados de erro no campo, erro do formulário e carregamento do login (`46:13895`, `46:13947`, `46:13999` e escuros) e do cadastro (`46:14205`, `46:14260`, `46:14316` e escuros)
- [x] Validação dos campos na tela (e-mail e senha), sem back-end ainda

### Parte 2 — Funcional (Supabase)

- [x] Projeto no Supabase: tabelas `favorites` e `history`, chave primária em (`user_id`, `word`) e RLS (`user_id = auth.uid()`). Acesso anônimo conferido: negado (HTTP 401)
- [x] Guardar o SQL das tabelas e políticas no repositório (`supabase/migrations/`)
- [x] Client do Supabase em `src/core/supabase/` com sessão persistida (ainda sem uso; entra no container na parte 3)
- [x] Tipos gerados pela CLI do Supabase (`src/core/supabase/database.types.ts`)
- [x] Decidir com o autor se a confirmação de e-mail do Supabase fica desligada: desligada, sem login social (decisão do autor em 2026-11-05)
- [x] Desligar a confirmação de e-mail no painel do Supabase
- [x] Definir com o autor o que acontece com os dados da conta no aparelho ao sair: são apagados do aparelho, e a pessoa continua como visitante (decisão do autor, 2026-11-06; implementação na parte 3)

### Parte 3 — Integração

- [x] Telas ligadas ao Supabase: entrar, cadastrar e sair, com os erros reais nos estados do Figma; o login é a primeira tela, sem exigir conta (visitante a um toque)
- [x] Ao entrar: mesclar os dados do visitante na conta (favoritos por união; histórico com o `viewed_at` mais recente) e sincronizar
- [x] Sincronização local-first de favoritos e histórico por `user_id`, com o app usável se o Supabase estiver fora
- [x] Testes: fluxo de auth com o serviço mockado pelo container, mescla visitante → conta, sincronização e falha do back-end
- [x] Conferir no iOS (conferido pelo autor em 2026-11-06; o Android fica para a etapa 7)
- [x] Testar o RLS direto no servidor com dois usuários (2026-11-06): 28 de 28 verificações passaram, em `favorites` e `history`, com a chave publishable e um script temporário fora do repositório

### Depois do login (lembrete do autor, 2026-11-05)

- [x] 📝 **Liquid Glass nas abas:** retirado da lista (decisão do autor, 2026-11-06); a barra continua como no Figma
- [x] 📝 **Liquid Glass no voltar:** seta do header (Configurações, login e cadastro) com o `GlassView` no iOS 26; em iOS antigo e no Android, o botão comum (2026-11-06)

**Pronto quando:** o visitante usa o app sem conta, ao entrar os dados dele vão para a conta, dois usuários diferentes veem cada um os próprios favoritos e histórico, e o app continua funcionando offline.

---

## Etapa 6 — Qualidade

**Objetivo:** testes, CI e acabamento.

- [x] Completar os testes unitários e de componente (meta ~70% em `domain` e `data`): 99,0% e 91,9% em 2026-11-06
- [x] GitHub Actions com lint, typecheck e testes a cada push, com badge no README
- [x] 📝 **Lembrete do autor:** desenhar no Figma a splash (tela de abertura do app, antes do carregamento) e depois aplicar no `expo-splash-screen` do `app.json` (imagem clara e escura). Feito em 2026-11-05 (frames 46:14617 e 46:14622), conferido no app compilado pelo `npx expo run:ios`; no Expo Go a splash do projeto não aparece
- [x] Microinterações, respeitando "Reduzir movimento": o coração ao favoritar está feito; a transição própria para o detalhe foi cortada (decisão do autor, 2026-11-06), e fica a animação nativa da folha
- [x] Card apagado na Word list para palavra com "Word not found" conhecido, sem tirá-la da lista (decisão do autor, 2026-11-06)
- [x] 📝 **Lembrete do autor:** na tela de perfil/configurações, escolha manual de tema (claro, escuro ou sistema). Feito em 2026-11-05, adiantado da etapa 6 (`CLAUDE.md`, seção 6.9); o idioma vem a seguir
- [x] Chave de idioma PT/EN dentro do app, independente do idioma do aparelho: `src/i18n/pt-BR.ts` com o mesmo formato do `en.ts`, escolha persistida e o conteúdo do dicionário mantido em inglês (feito em 2026-11-05, pedido do autor; `CLAUDE.md`, seção 6.9)
- [x] Revisão de acessibilidade (labels, roles, área de toque, fonte grande), conferida pelo autor no aparelho em 2026-11-06
- [x] Teste completo em Android e iOS (conferido pelo autor em 2026-11-06, num emulador Android atual e num Android 12 físico)

**Pronto quando:** CI verde e testes passando, com o app conferido nos dois sistemas e nos dois temas.

---

## Etapa 7 — Entrega

**Objetivo:** tudo pronto para o avaliador testar com o mínimo de esforço.

- [ ] README bilíngue completo (a versão inicial já existe desde a etapa 1) (`README.md` em português e `README.en.md` em inglês, com link entre eles), completo: título, descrição em uma frase, tecnologias, como instalar e usar, arquitetura, decisões técnicas, créditos das fontes (Fraunces e Inter, SIL OFL 1.1) e a frase "This is a challenge by [Coodesh](https://coodesh.com/)"
- [ ] Instruções para rodar no **Expo Go** no README: `npm install`, `npx expo start` e escanear o QR (cobre quem usa iPhone, já que build instalável de iOS exige conta paga da Apple)
- [ ] Tirar do README o aviso "Em desenvolvimento" e atualizar o texto de status
- [ ] Registrar no README as decisões recentes: login como primeira tela, e-mail e senha no lugar de "usuário e senha", sem login social e sem confirmação de e-mail, mesclagem dos dados do visitante, fila offline, tela cheia abaixo do Android 13 e os limites conhecidos
- [ ] Citar no README a cobertura de testes, o resultado do teste de RLS e o que foi conferido em cada aparelho
- [ ] **GIF ou vídeo curto** no README mostrando o fluxo (lista, detalhe, áudio, favoritar, histórico, login)
- [x] Conferir no Android as funções da etapa 4 em diante (adiado da etapa 4, decisão do autor em 2026-11-05): abas History e Favorites, coração, toque duplo, "Clear", Previous/Next e o arrasto lateral, inclusive começando na borda da tela (com a navegação por gestos do Android, a borda é o "voltar" do sistema e fecha a folha), e o diálogo de Aparência e Idioma em Configurações Conferido pelo autor em 2026-11-06.
- [ ] Colocar a URL e a chave publishable no README, para o avaliador copiar para o `.env` e testar o login no Expo Go, com a nota de que a chave é pública e protegida pelo RLS (decisão do autor, 2026-11-06). Nunca a `secret`, a `service_role` ou a senha do banco
- [x] Apagar em **Authentication → Users** as duas contas do teste de RLS (feito pelo autor em 2026-11-06)
- [ ] Conferir em **Authentication → Rate Limits** os limites contra cadastros em massa
- [ ] Depois da avaliação: apagar ou pausar o projeto Supabase, ou trocar a chave
- [ ] Instruções do Supabase no README (`.env.example`, como reativar o projeto ou usar o próprio)
- [ ] Revisão final do `CHANGELOG.md`, do `todo.md` e do `CLAUDE.md`
- [ ] Testar o fluxo do avaliador num clone limpo, seguindo só o README: instalar, preencher o `.env`, rodar, cadastrar e entrar
- [ ] Commit final, link do repositório na plataforma da Coodesh e envio
- [ ] Gravar o vídeo de apresentação na plataforma, se o teste pedir
- [ ] Entrar no painel do Supabase perto da data da avaliação para o projeto não pausar

**Pronto quando:** o avaliador consegue abrir no Expo Go e testar todos os casos de uso seguindo só o README.

---

## Depois da etapa 7 — APK

**Objetivo:** dar ao avaliador um APK para instalar sem configurar nada (adiado para depois da etapa 7, decisão do autor, 2026-11-06).

- [ ] Colocar a URL e a chave publishable do Supabase no build do APK (variáveis `EXPO_PUBLIC_*` no EAS, porque o `.env` não vai para o git), para o login funcionar sem configurar nada (decisão do autor, 2026-11-06)
- [ ] **APK no GitHub Releases**: gerar com EAS Build (`eas build -p android --profile preview`) e anexar numa release `v1.0.0`
- [ ] Testar o APK em modo avião na primeira abertura: deve aparecer "A brief pause." com "Try again" (no Expo Go não dá, porque sem rede ele nem alcança o computador e mostra o erro dele)

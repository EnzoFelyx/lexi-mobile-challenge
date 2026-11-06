# REGRAS.md — Regras de código do Lexi

> Consulte este arquivo **antes de escrever, alterar ou revisar qualquer código** deste projeto.
> As regras da **Parte 1 são obrigatórias**. As da **Parte 2 são boas práticas adotadas** e também devem ser seguidas, salvo quando o autor disser o contrário.
> A ordem de prioridade do `CLAUDE.md` vale aqui: **README da Coodesh > decisões do Lexi > padrões do Pinny > ECC**.
> Se alguma regra impedir uma tarefa, **pare e pergunte** ao autor em vez de quebrá-la em silêncio.

---

# Parte 1 — Regras obrigatórias

## Regra 1 — Arquitetura por feature com camadas (Clean Code)

Cada feature (`words`, `favorites`, `history`, `auth`) tem as mesmas camadas:

| Camada | O que é | Pode | Não pode |
|---|---|---|---|
| **domain/** | Entidades, tipos e **interfaces** (`WordRepository`, `DictionaryService`) e regras puras | Ser importada por todas as outras camadas | Importar `data/`, UI, bibliotecas externas ou o container |
| **data/** | Implementações das interfaces (SQLite, Supabase, Free Dictionary API) | Usar bibliotecas externas e `core/` | Ser importada pela UI diretamente |
| **hooks/** | Hooks de tela e de dados (React Query, Zustand) | Resolver dependências pelo container, expor estado pronto para exibir e ações com nome de intenção | Retornar JSX ou conhecer a implementação concreta |
| **components/** | Componentes da feature | Renderizar o que o hook entrega | Ter regra de negócio, acessar banco, API ou container |

- **Rotas finas:** arquivos em `src/app/**` só leem parâmetros e compõem a tela.
- A UI depende de **interfaces**, nunca de implementações.
- Regras de negócio que não dependem de React (paginação, merge do histórico, escolha do áudio, montagem do cache) são **funções puras** em `domain/`, fáceis de testar.
- Hooks expõem **ações com nome de intenção** (`toggleFavorite`, `goToNextWord`, `loadNextPage`), nunca `setState` cru.
- Serviços externos (API, Supabase, áudio, TTS) ficam atrás de uma interface.

## Regra 2 — Injeção de dependência com tsyringe

- Toda implementação de `data/` é registrada no container em `src/core/di/`.
- Os tokens ficam num único arquivo (`TOKENS`), nunca strings soltas.
- Hooks e serviços obtêm dependências pelo container (`container.resolve(TOKENS.X)` ou `@inject`). **Proibido `new SqliteWordRepository()`** fora do container.
- Nos testes, troque implementações com `container.registerInstance` e limpe o container entre testes.

## Regra 3 — Tokens de tema em um único lugar

- Cores, fontes, tipografia, espaçamento, raios e tamanhos vêm do tema em `src/core/theme/` (extraído do Figma, com **light e dark**).
- Só o arquivo de tema contém códigos hexadecimais.
- O `tailwind.config.ts` **não tem valores próprios**: só traduz os tokens do tema em classes (`bg-surface`, `text-text-primary`, `p-md`, `rounded-md`, `text-headword-card`…). A paleta padrão do Tailwind é removida, então `bg-white` ou `text-red-500` não existem.
- Componentes usam os **tokens semânticos** (pelas classes ou, fora do `className`, pelo hook do tema ativo), nunca a paleta crua.
- Ao criar ou alterar uma cor de texto, confira o **contraste AA** (4,5:1 para texto, 3:1 para ícones e bordas importantes).

## Regra 4 — Nunca usar cor hardcoded

- Proibido `'#FFF'`, `'white'`, `'rgba(…)'` ou `'red'` fora do tema, em estilos, componentes ou `className`.
- **Exceção só em extrema necessidade** (ex.: config nativa no `app.json`): comentário logo acima e aviso ao autor.

  ```ts
  // COR-HARDCODED: o splash do app.json não lê o tema; manter igual a colors.background
  ```

- Também é proibida cor ou valor arbitrário em `className` (`bg-[#fff]`, `text-[rgb(…)]`).
- Garantido pelo lint: `react-native/no-color-literals` e uma regra `no-restricted-syntax` contra hex/rgb/hsl dentro de `className` (a `no-color-literals` não enxerga `className`).

## Regra 5 — Estilização com NativeWind (`className` primeiro) (decisão do autor, 2026-11-03)

- O padrão é **NativeWind**: estilize com `className`, usando as classes geradas a partir do tema.
- `StyleSheet.create` e a prop `style` **só** entram quando `className` não resolve:
  1. estilos animados do Reanimated (`useAnimatedStyle`);
  2. valores calculados em tempo de execução;
  3. props de bibliotecas que não aceitam `className` (ex.: cor de ícone do Lucide, que vem do hook do tema).
- **Proibido objeto de estilo inline** (`style={{ … }}`): lint `react-native/no-inline-styles`. Quando `style` for necessário, use `StyleSheet.create` ou o estilo animado.
- **Dark mode:** as cores são variáveis CSS trocadas pelo tema ativo; o componente usa a mesma classe (`bg-surface`) nos dois temas, sem duplicar com `dark:`.
- Classes que mudam por variante ou estado ficam num **mapa tipado** no componente (`const variantClass: Record<ButtonVariant, string>`), não em strings montadas espalhadas pelo JSX.

## Regra 6 — Chamadas assíncronas seguras (README da Coodesh)

- Toda chamada assíncrona trata **loading, erro e vazio** de forma explícita na UI. Nada trava nem quebra a tela.
- **Respostas externas são validadas com Zod** antes de chegar ao domínio (API e Supabase). Os tipos derivam dos schemas.
- Requisições passam pelo **React Query** (sem `fetch` solto em `useEffect`), com retry configurado e chaves estáveis.
- Seed e paginação nunca bloqueiam o JS thread: lotes em transação, keyset, trava contra chamadas duplicadas.
- Efeitos limpam assinaturas, timers e players ao desmontar.
- Nunca engula erros (`catch {}` vazio). Mensagem amigável ao usuário e registro com contexto para o dev pelo `logger` (`src/shared/utils/logger.ts`), nunca `console.warn` solto (decisão do autor, 2026-11-04):
  - `logger.warn(scope, mensagem, erro)` para **falha de verdade** já tratada na tela (banco, rede, gravação…);
  - `logger.debug(scope, mensagem, detalhe)` para **situação esperada e contornada** (ex.: áudio da API fora do ar e a voz do aparelho assumindo), que fica só no terminal, sem aviso amarelo no celular;
  - o `logger` só registra em desenvolvimento; no build de produção não registra nada.

## Regra 7 — Reutilização e zero duplicidade

- Se um trecho de UI ou lógica aparece pela **segunda vez**, extraia (componente, hook ou função).
- **Antes de criar, procure** se já existe algo parecido. Prefira estender com props.
- Onde fica cada coisa reutilizável:
  - `src/shared/components/`: componentes genéricos (Button, TextField, SegmentedTabs, Skeleton, EmptyState…).
  - `src/shared/hooks/` e `src/shared/utils/`: hooks e funções puras genéricas.
  - `src/features/<f>/components/`: componentes só daquela feature. Se outra precisar, mova para `shared/`.
- Variações por **prop de variante** (`<Button variant="primary" | "secondary" />`), nunca componentes copiados.

---

# Parte 2 — Boas práticas adotadas

## TypeScript

- `strict: true`. **Proibido `any`**: use tipos explícitos, `unknown` com validação ou genéricos.
- Union types em vez de strings soltas (`type ListSource = 'words' | 'history' | 'favorites'`).
- Entidades definidas uma única vez no `domain/`.
- Props por `interface` nomeada; sem `React.FC`.

## Organização e nomes

- Componentes e telas em **PascalCase** (`WordCard.tsx`); hooks com `use`; funções e variáveis em **camelCase**; constantes globais em **UPPER_SNAKE_CASE**.
- **Código em inglês**; textos da UI em inglês (no arquivo central); documentação de processo em português.
- **Imports absolutos** com `@/`.
- Arquivos pequenos e focados: se passar de **~200 linhas**, avalie dividir.

## Textos centralizados

- Todo texto da interface fica em `src/i18n/en.ts` e `src/i18n/pt-BR.ts` (mesma forma, garantida pelo tipo `Texts`; objeto por feature, funções para plurais e labels de acessibilidade). Nada escrito direto no JSX.
- Telas e hooks leem os textos com `const t = useTexts()`, nunca importando `en` direto: o idioma muda com o app aberto. Texto novo entra nos dois arquivos.
- O que vem da API (palavras, definições, exemplos, fonética, classes gramaticais) não é traduzido.

## Sem números mágicos

- Tamanho de página, lote do seed, tempos de retry e de cache ficam em `src/constants/`, cada um com um comentário curto explicando o valor.

## Estado e dados

- Banco local pelo **Drizzle**: o schema é a fonte única dos tipos, e toda leitura passa pelo Zod (`drizzle-zod`) antes de chegar ao domínio.
- Estado de tela nos hooks; global (Zustand) só para o que é compartilhado entre telas (sessão, favoritos).
- **Local-first:** dados sempre pelos repositórios; o Supabase sincroniza.
- Não duplique dados do servidor em store global: o que vem da API fica no React Query.
- Estado imutável: nunca altere objetos e arrays diretamente.

## Performance

- Listas com **FlashList** (`numColumns={3}`), `keyExtractor` estável e `renderItem` memoizado. Nunca `.map()` grande dentro de `ScrollView`.
- `React.memo`, `useCallback` e `useMemo` onde evitam re-render real, sem exagero.
- Evite objetos e funções criados inline em props de itens de lista.

## Acessibilidade

- Todo elemento interativo tem `accessibilityRole` e `accessibilityLabel` (ícones sozinhos sempre com label).
- Área de toque mínima de **44pt**.
- Estados não dependem só de cor (o favorito muda de forma: contorno → preenchido).
- Respeitar o tamanho de fonte do sistema e "Reduzir movimento".

## Testes

- Funções puras do `domain/`, repositórios e hooks têm testes unitários (Jest).
- Componentes testados com **React Native Testing Library**, buscando por role, label ou texto.
- Dependências trocadas por mocks **pelo container da tsyringe**.
- Padrão Arrange-Act-Assert e nomes que descrevem o comportamento.

## Qualidade automática

- **ESLint + Prettier** (`singleQuote`, `trailingComma: all`, `printWidth: 100`).
- Regras de lint como `error`: `react-native/no-color-literals`, `react-native/no-inline-styles`, `@typescript-eslint/no-explicit-any`, `react-hooks/exhaustive-deps`, `no-console` (permitindo `warn` e `error`; o `logger` é o único lugar que chama o `console`) e `no-restricted-syntax` contra cor em `className`.
- Scripts: `lint`, `format`, `typecheck`, `test` e `db:generate`.
- GitHub Actions roda lint, typecheck e testes a cada push.

## Git

- Commits pequenos em **Conventional Commits** (`feat:`, `fix:`, `refactor:`, `test:`, `docs:`, `chore:`, `ci:`), em inglês.
- Uma branch por etapa, merge por PR na `main`.
- Cada `feat:` seguido de um `docs:` que atualiza `CHANGELOG.md`, `todo.md` e `CLAUDE.md`.

## Segurança

- Nenhuma chave secreta no código. `.env` fora do git, `.env.example` versionado.
- Só a *anon key* do Supabase no app; **nunca** a `service_role`.
- RLS ligado em toda tabela do Supabase.

---

# Checklist antes de entregar qualquer código

- [ ] Respeita as camadas (UI → hooks → interfaces do domain; data só via container)?
- [ ] Dependências resolvidas pela tsyringe, sem `new` de implementação fora do container?
- [ ] Nenhuma cor ou valor visual fora do tema (ou exceção comentada e avisada)? Funciona em light e dark?
- [ ] Estilizou com `className`, deixando `StyleSheet`/`style` só para animação, valores dinâmicos ou bibliotecas sem `className`?
- [ ] Chamadas assíncronas com loading, erro e vazio, resposta validada com Zod e sem travar a UI?
- [ ] Procurou componentes existentes antes de criar? Nada duplicado?
- [ ] Textos vindos de `useTexts()`, com a chave nos dois idiomas (`en.ts` e `pt-BR.ts`)?
- [ ] Tipado sem `any`?
- [ ] Acessibilidade aplicada (labels, roles, área de toque)?
- [ ] Testes criados ou atualizados?
- [ ] `npm run lint`, `npm run typecheck` e `npm test` passando?
- [ ] Roda no Expo Go em Android e iOS?

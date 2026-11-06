# Lexi

[![CI](https://github.com/EnzoFelyx/lexi-mobile-challenge/actions/workflows/ci.yml/badge.svg)](https://github.com/EnzoFelyx/lexi-mobile-challenge/actions/workflows/ci.yml)

**Português** · [English](README.en.md)

Um dicionário de inglês para Android e iOS: navegue pelas palavras com rolagem infinita, veja significados e fonética, ouça a pronúncia e guarde favoritos e o histórico de palavras vistas.

> This is a challenge by [Coodesh](https://coodesh.com/)

🚧 **Em desenvolvimento.** O projeto é construído em etapas (ver [`todo.md`](todo.md)). As etapas 1 a 5 estão prontas, com **todos os obrigatórios do desafio**: o app roda no Expo Go com tema claro e escuro, baixa uma única vez a lista de 370 mil palavras e a mostra numa grade de 3 colunas com rolagem infinita (começando pelas palavras comuns), abre cada palavra com a fonética, a pronúncia e os significados, guardados no aparelho, e guarda favoritos e o histórico de palavras vistas, com Previous/Next em todas as abas. O login é por e-mail e senha, com Supabase: os dados ficam associados à conta e sincronizados, e tudo também funciona sem conta e sem conexão.

## Tecnologias

| Área | Escolha |
| --- | --- |
| App | React Native 0.88 + TypeScript (`strict`), Expo SDK 58, Expo Router |
| Estilização | NativeWind 4 (Tailwind 3) com os tokens do Figma, tema claro e escuro |
| Navegação | Expo Router: abas superiores (`TopTabs`) com barra própria, detalhe da palavra em folha nativa (`formSheet`) |
| Injeção de dependência | tsyringe |
| Testes | Jest (`jest-expo`) + React Native Testing Library |
| Qualidade | ESLint + Prettier, com regras contra cor fixa no código e `any` |
| Fontes e ícones | Fraunces e Inter (Google Fonts), Lucide |
| Dados locais | SQLite (`expo-sqlite`) + Drizzle ORM, linhas validadas com Zod, TanStack Query |
| Listas | FlashList (grade de 3 colunas com rolagem infinita e barra de rolagem rápida) |
| Pronúncia | `expo-audio` (mp3 da API, guardado com `expo-file-system`) e `expo-speech` (voz do aparelho quando não há mp3) |
| Conta | Zustand, Supabase (login e sincronização) |

## Como rodar

Requisitos: [Node.js](https://nodejs.org/) 22.13 ou mais novo e o app **Expo Go** (SDK 58) num aparelho Android ou iOS.

```bash
git clone https://github.com/EnzoFelyx/lexi-mobile-challenge.git
cd lexi-mobile-challenge
npm install
npx expo start
```

Escaneie o QR code com a câmera (iOS) ou pelo Expo Go (Android). O celular e o computador precisam estar na mesma rede; se não estiverem, use `npx expo start --tunnel`.

### Scripts

| Comando | O que faz |
| --- | --- |
| `npm start` | Sobe o servidor de desenvolvimento (Expo Go) |
| `npm run lint` | ESLint + Prettier |
| `npm run typecheck` | Checagem de tipos do TypeScript |
| `npm test` | Testes unitários e de componentes |
| `npm run format` | Formata o código com o Prettier |

## Design

As telas seguem este [arquivo do Figma](https://www.figma.com/design/2SH7Dc3Qpr9ZjIw0iv8GGv/Untitled?node-id=0-1) (versões clara e escura, estados de carregamento e erro e uma vitrine de componentes). A interface segue o wireframe do desafio. Onde o app difere do Figma de propósito (por contraste ou desempenho), o motivo está registrado no [`CLAUDE.md`](CLAUDE.md).

O layout do Figma foi adaptado durante o desenvolvimento das telas no aplicativo, para uma melhor experiência do usuário. Quando há diferença, a referência é o app.

## Navegação e interação

Pequenas mudanças para deixar a navegação entre palavras e o uso do app mais rápidos e previsíveis. Quem estuda vocabulário passa por muitas palavras seguidas, então os botões do Figma continuam sendo o caminho principal (e acessível), com alguns atalhos por cima:

- **Previous/Next em todas as abas.** O detalhe da palavra anda pela lista da aba de onde foi aberto: Word list, History ou Favorites. Em History e Favorites, a ordem que o usuário viu é mantida enquanto o detalhe está aberto, então abrir uma palavra (que a leva ao topo do histórico) ou desfavoritá-la não faz o "Next" pular palavras.
- **Toque duplo para favoritar**, como num post de rede social. Toque duplo em qualquer parte do card da palavra ou dos significados alterna o favorito, igual ao coração da barra. Ao favoritar, um coração aparece no meio da tela; ao desfavoritar, só o coração da barra muda. Os botões do detalhe (play, "Show more") continuam com o toque deles, e quem usa leitor de tela segue com o coração da barra.
- **Arrastar para os lados troca de palavra.** No detalhe, um arrasto horizontal vai para a próxima palavra (para a esquerda) ou para a anterior (para a direita), na mesma lista do Previous/Next. Basta um arrasto curto, e a tela não se mexe; arrastos na diagonal são ignorados, então rolar os significados e fechar a folha continuam iguais.

## Arquitetura

Pastas por feature, com camadas dentro de cada uma. A interface só conhece as interfaces do `domain`; o container de injeção de dependência escolhe a implementação.

```text
src/
  app/        # rotas do Expo Router (finas: só compõem as telas)
  features/   # words, favorites, history, auth → domain / data / hooks / components
  core/       # tema (tokens do Figma), container de DI, clients do banco e do Supabase
  shared/     # componentes, hooks e utilitários reutilizáveis
  i18n/       # todos os textos da interface
  constants/  # valores nomeados (tamanho da página, altura da folha…)
```

## Processo e decisões

O desafio pede que o processo de investigação e as decisões fiquem documentados. Este repositório foi criado a partir do [template do desafio da Coodesh](https://github.com/coodesh/mobile-challenge-20240202); o enunciado original está no [`CHALLENGE.md`](CHALLENGE.md), com o [wireframe](img/wireframe.png). O processo está em arquivos versionados:

- [`CLAUDE.md`](CLAUDE.md): contexto do projeto, requisitos do desafio, cada decisão com data e motivo, tokens do design, stack e arquitetura.
- [`REGRAS.md`](REGRAS.md): regras de código (camadas, injeção de dependência, tema centralizado, chamadas assíncronas seguras, zero duplicidade).
- [`todo.md`](todo.md): roteiro dividido em etapas, cada uma com o critério de "pronto quando".
- [`CHANGELOG.md`](CHANGELOG.md): o que mudou em cada etapa, com os hashes dos commits.

Algumas decisões até aqui:

- **Palavras comuns primeiro, em ordem aleatória e estável.** Em ordem alfabética a lista começaria por "a", "aa", "aaa"…, e o arquivo do dwyl tem muitas palavras raras, sem resultado na API. Como no wireframe (hello, today, great…), a lista abre com o Basic English de Ogden, depois as palavras mais frequentes do inglês e por fim o resto. Cada palavra recebe uma chave aleatória dentro do seu grupo ao ser gravada, então a ordem é variada, mas não muda entre as sessões.
- **Local-first com login opcional.** A primeira tela é o login, que apresenta o diferencial da conta, com a opção de continuar como visitante em um toque: a conta não é obrigatória para nenhum caso de uso. A escolha fica salva, e nas próximas aberturas o app vai direto para a lista. Sem conta, favoritos e histórico ficam no aparelho; ao entrar, eles são mesclados na conta e associados ao ID do usuário.
- **Roda no Expo Go.** Sem código nativo próprio, para o avaliador testar no iOS sem conta paga da Apple. Também haverá um APK para Android.
- **Interface em inglês.** O wireframe do desafio mistura idiomas (abas e "Meanings" em inglês, "Voltar/Próximo" em português). Como todas as definições, exemplos e classes gramaticais da Free Dictionary API vêm em inglês, a interface inteira ficou em inglês por consistência; "Previous/Next" mantêm a função do wireframe. Uma chave de idioma português/inglês dentro do app está prevista como extra.
- **Acessibilidade.** O contraste AA da WCAG é conferido por um teste em cada par de cores. O texto secundário do tema claro foi escurecido um pouco em relação ao Figma para passar no trilho das abas.

## Créditos

- Lista de palavras: [dwyl/english-words](https://github.com/dwyl/english-words) (`words_dictionary.json`).
- Palavras comuns no topo da lista: [Basic English de Ogden](https://simple.wikipedia.org/wiki/Wikipedia:BASIC_English_alphabetical_wordlist) (domínio público) e [google-10000-english](https://github.com/first20hours/google-10000-english) (uso educacional), montadas pelo `scripts/build-common-words.mjs`.
- Definições, fonética e áudio: [Free Dictionary API](https://dictionaryapi.dev/).
- Fontes: [Fraunces](https://fonts.google.com/specimen/Fraunces) e [Inter](https://fonts.google.com/specimen/Inter), sob a SIL Open Font License 1.1.
- Ícones: [Lucide](https://lucide.dev/).

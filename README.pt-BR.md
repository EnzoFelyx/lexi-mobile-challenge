# Lexi

[English](README.md) · **Português**

Um dicionário de inglês para Android e iOS: navegue pelas palavras com rolagem infinita, veja significados e fonética, ouça a pronúncia e guarde favoritos e o histórico de palavras vistas.

> This is a challenge by [Coodesh](https://coodesh.com/)

🚧 **Em desenvolvimento.** O projeto é construído em etapas (ver [`todo.md`](todo.md)). As etapas 1 (fundação) e 2 (lista de palavras) estão prontas: o app roda no Expo Go com tema claro e escuro, baixa uma única vez a lista de 370 mil palavras e a mostra numa grade de 3 colunas com rolagem infinita, começando pelas palavras comuns. O detalhe, os favoritos, o histórico e o login vêm nas próximas etapas.

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
| Previsto | Zustand, Supabase (login e sincronização), `expo-audio` + `expo-speech` |

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
- **Local-first com login opcional.** O app abre direto na lista. Sem conta, favoritos e histórico ficam no aparelho; ao entrar, eles são mesclados na conta e associados ao ID do usuário.
- **Roda no Expo Go.** Sem código nativo próprio, para o avaliador testar no iOS sem conta paga da Apple. Também haverá um APK para Android.
- **Interface em inglês.** O wireframe do desafio mistura idiomas (abas e "Meanings" em inglês, "Voltar/Próximo" em português). Como todas as definições, exemplos e classes gramaticais da Free Dictionary API vêm em inglês, a interface inteira ficou em inglês por consistência; "Previous/Next" mantêm a função do wireframe. Uma chave de idioma português/inglês dentro do app está prevista como extra.
- **Acessibilidade.** O contraste AA da WCAG é conferido por um teste em cada par de cores. O texto secundário do tema claro foi escurecido um pouco em relação ao Figma para passar no trilho das abas.

## Créditos

- Lista de palavras: [dwyl/english-words](https://github.com/dwyl/english-words) (`words_dictionary.json`).
- Palavras comuns no topo da lista: [Basic English de Ogden](https://simple.wikipedia.org/wiki/Wikipedia:BASIC_English_alphabetical_wordlist) (domínio público) e [google-10000-english](https://github.com/first20hours/google-10000-english) (uso educacional), montadas pelo `scripts/build-common-words.mjs`.
- Definições, fonética e áudio: [Free Dictionary API](https://dictionaryapi.dev/).
- Fontes: [Fraunces](https://fonts.google.com/specimen/Fraunces) e [Inter](https://fonts.google.com/specimen/Inter), sob a SIL Open Font License 1.1.
- Ícones: [Lucide](https://lucide.dev/).

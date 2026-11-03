# Changelog

Todas as mudanças do Lexi, da mais recente para a mais antiga, agrupadas por etapa do `todo.md`.
Cada item indica o commit em que entrou, para conferir no histórico do git (`git show <hash>`).

Formato baseado no [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/). Tipos: **Adicionado**, **Alterado**, **Corrigido**, **Removido**, **Infraestrutura** e **Documentação**.

---

## 2026-11-03 — Etapa 0 (decisões pendentes)

### Documentação

- Decisões da etapa 0 registradas no `CLAUDE.md`, no `REGRAS.md` e no `todo.md`: NativeWind lendo o `theme.ts` (dark mode por variáveis CSS), Drizzle + `drizzle-zod`, FlashList, ordem aleatória e estável da lista (`sort_key`), login opcional com modo visitante e mescla ao entrar, detalhe em `formSheet`, `material-top-tabs` com `tabBar` própria, README bilíngue e repositório público `EnzoFelyx/lexi-mobile-challenge`. (commit pendente)

---

## 2026-11-03 — Planejamento

### Documentação

- `CLAUDE.md` com o contexto do projeto, a ordem de prioridade (README da Coodesh > decisões do Lexi > padrões do Pinny > ECC), os requisitos do desafio, as regras de comportamento, os tokens e as telas do Figma, a stack, a arquitetura e os dados. (commit pendente)
- `REGRAS.md` com as regras de código (camadas por feature, DI com tsyringe, tema centralizado, chamadas assíncronas seguras, zero duplicidade) e o checklist de entrega. (commit pendente)
- `todo.md` com as etapas 0 a 7, sem prazo fixo. (commit pendente)

### Adicionado

- `src/core/theme/theme.ts` com os tokens extraídos do Figma: cores light e dark, fontes (Fraunces e Inter), escala tipográfica, espaçamentos, raios e tamanhos. (commit pendente)

### Infraestrutura

- Projeto criado com o template do Expo SDK 58 (Expo Router, TypeScript). (`b430cd3`)

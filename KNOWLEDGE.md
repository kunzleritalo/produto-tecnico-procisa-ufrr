# Documento de Conhecimento — Escalas de Estresse PROCISA/UFRR

Referência técnica para desenvolvimento contínuo. Este documento descreve a estrutura, princípios e padrões adotados no projeto.

---

## 1. Estrutura do Projeto

```
src/
├── main.tsx                    → Ponto de entrada (monta App no DOM)
├── App.tsx                     → Provedores globais (Toaster, Router)
├── index.css                   → Design tokens HSL, fontes, utilidades
├── pages/
│   ├── Index.tsx               → Controlador de fluxo principal
│   └── NotFound.tsx            → Página 404
├── components/
│   ├── QuizPlayer.tsx          → Orquestra aplicação de uma escala
│   ├── QuestionCard.tsx        → Card de questão individual (memo)
│   ├── ResultsView.tsx         → Resultados + e-mail (lazy)
│   ├── AboutSection.tsx        → Seção "Sobre" (lazy, sem animações)
│   └── ui/                     → Componentes shadcn/ui mantidos:
│       ├── button.tsx          → Botão com variantes (CVA)
│       ├── skeleton.tsx        → Placeholder de carregamento
│       ├── toast.tsx           → Notificações toast (Radix)
│       ├── toaster.tsx         → Container de toasts
│       ├── sonner.tsx          → Notificações alternativas
│       └── tooltip.tsx         → Tooltips acessíveis (Radix)
├── data/
│   └── exams.ts                → Definições das escalas PSS-10 e EET
├── lib/
│   └── utils.ts                → cn() — combina classes Tailwind
├── hooks/
│   ├── use-mobile.tsx          → Hook para detectar viewport mobile
│   └── use-toast.ts            → Hook para notificações toast
└── assets/
    ├── procisa-logo.png
    ├── ufrr-logo.png
    ├── edilane-photo.gif
    └── italo-photo.gif
```

---

## 2. Fluxo da Aplicação

```
┌─────────────┐
│   welcome    │ ← Tela inicial com cards e botões
├─────────────┤
│  Opções:     │
│  · Ambas     │ → exam1 (PSS-10) → exam2 (EET) → results
│  · PSS-10    │ → exam1 (PSS-10) → results
│  · EET       │ → exam2 (EET) → results
└─────────────┘
```

### Fases (Phase)
- `welcome` — Tela inicial com instruções, cards das escalas e botões
- `exam1` — Aplicação da PSS-10 (10 itens, alternativas 0-4)
- `exam2` — Aplicação da EET (23 itens, alternativas 1-5)
- `results` — Exibição de escores, classificações e opção de e-mail

### Modos (Mode)
- `both` — Aplica PSS-10 seguida de EET
- `pss10` — Aplica apenas PSS-10
- `eet` — Aplica apenas EET

---

## 3. Design System

### Tokens HSL
- Definidos em `index.css` (`:root` para claro, `.dark` para escuro)
- Formato: `H S% L%` sem `hsl()` — Tailwind envolve automaticamente
- **REGRA**: NUNCA usar cores diretas. Sempre tokens: `text-primary`, `bg-card`, etc.

### Fontes
- **Títulos**: Space Grotesk (`--font-heading`)
- **Corpo**: Inter (`--font-body`)

### Cores semânticas
| Token | Uso |
|-------|-----|
| `--primary` | Verde esmeralda — botões, destaques |
| `--success` | Verde — estresse baixo |
| `--warning` | Amarelo — estresse moderado |
| `--destructive` | Vermelho — estresse alto |
| `--muted-foreground` | Texto secundário |

### Classes utilitárias
- `.card-elevated` — sombra + hover com elevação (usado em cards interativos)
- `.gradient-hero` — gradiente sutil para seção hero
- `.gradient-primary-subtle` — gradiente decorativo para fundos
- `.text-gradient-primary` — texto com gradiente

### Ícones
- Biblioteca: `lucide-react` (tree-shakable — só os importados entram no bundle)
- Temática: HeartPulse, Briefcase, AlertTriangle, Clock, ArrowRight, Info, Send, Home, Mail

### Responsividade
- Mobile-first com breakpoints Tailwind (`sm:`, `md:`)
- Alternativas de resposta: grid 5 colunas no mobile, flex-wrap no desktop
- Botões individuais: `<br className="sm:hidden">` para quebra controlada de texto

---

## 4. Otimização de Performance

### Estratégias implementadas

| Técnica | Onde | Impacto |
|---------|------|---------|
| `React.lazy()` | ResultsView, AboutSection | Reduz bundle inicial |
| `React.memo()` | QuestionCard | Evita re-render de 33 questões |
| `useCallback` | selectAnswer, handlers do Index | Estabiliza referências |
| `useMemo` | results, computedResults | Evita recálculo de escores |
| `loading="lazy"` | Imagens dos autores | Carrega sob demanda |
| Bundle mínimo | 6 componentes UI de 40+ | Redução massiva |

### Dependências removidas (otimização histórica)
recharts, date-fns, react-day-picker, @tanstack/react-query, cmdk, embla-carousel-react, input-otp, next-themes, react-resizable-panels, vaul, react-hook-form, @hookform/resolvers, zod + 24 pacotes Radix não utilizados.

---

## 5. Otimização de Banco de Dados (diretrizes futuras)

### Ordem correta de consultas
```
1. Autenticação    → auth.uid() — verificar usuário autenticado
2. RLS             → Row Level Security — políticas de acesso
3. Seleção         → SELECT apenas colunas necessárias
4. Filtragem       → WHERE com índices adequados
5. Paginação       → LIMIT/OFFSET ou cursor-based
6. Cache           → staleTime no TanStack Query
```

### Caching
- **Dados estáticos** (definições de escalas): `staleTime: Infinity`
- **Dados do usuário** (resultados salvos): `staleTime: 5 * 60 * 1000` (5 min)
- **Invalidação**: `queryClient.invalidateQueries()` após mutações

### Lazy Loading de dados
- Carregar dados da EET apenas quando o usuário iniciar (ou após finalizar PSS-10)
- Prefetch durante navegação: `queryClient.prefetchQuery()`

### Batch de consultas
- Usar `Promise.all()` para consultas independentes
- Evitar cascatas (consulta A → resultado → consulta B) quando possível

---

## 6. Componentes Reutilizáveis

### Padrão de componente reutilizável
Todo componente deve:
1. Aceitar dados via props (sem estado global)
2. Ser agnóstico ao contexto de uso
3. Usar tokens do design system (nunca cores diretas)
4. Ter `displayName` quando envolvido em `memo`/`forwardRef`

### Componentes atuais

#### QuestionCard
- **Uso**: qualquer escala com N opções
- **Props**: question, selectedOption, onSelect, optionLabels, startFrom
- **Otimização**: `React.memo()` — só re-renderiza se suas props mudarem
- **Layout**: grid 5 colunas (mobile), flex-wrap (desktop)

#### QuizPlayer
- **Uso**: aplicação de qualquer escala definida em `exams.ts`
- **Props**: exam (objeto Exam), onFinish (callback com respostas)
- **Recursos**: barra de progresso, referências bibliográficas, botão de finalização
- **Extensível**: novas escalas em `exams.ts` são renderizadas automaticamente

#### Button (shadcn/ui)
- **Variantes**: default, destructive, outline, secondary, ghost, link
- **Tamanhos**: default, sm, lg, icon
- **Composição**: suporta `asChild` via Radix Slot

#### ResultsView
- **Uso**: exibição de resultados com classificação e envio por e-mail
- **Props**: results, mode, onRestart
- **Recursos**: cálculo de escores, classificação, disclaimer, corpo de e-mail com LGPD

---

## 7. Como adicionar nova escala

1. Adicionar textos das questões em `src/data/exams.ts`
2. Criar objeto `Exam` com `generateQuestions(prefix, count, numOptions, invertedItems, texts)`
3. Adicionar ao array `exams[]`
4. Atualizar o tipo `Mode` em `Index.tsx` (ex: adicionar `"nova-escala"`)
5. Adicionar botão correspondente na tela de boas-vindas
6. Adicionar lógica de classificação em `ResultsView.tsx`

---

## 8. Convenções de código

- **Linguagem de comentários**: português brasileiro
- **Nomes de variáveis/funções**: inglês (padrão React)
- **Textos de interface**: português brasileiro
- **Imports**: usar alias `@/` para `src/`
- **CSS**: sempre tokens semânticos, nunca cores diretas
- **Componentes**: PascalCase, um por arquivo
- **Hooks**: prefixo `use`, em `src/hooks/`

---

## 9. Dependências ativas

### Produção
- `react`, `react-dom` — Framework base
- `react-router-dom` — Roteamento SPA
- `@radix-ui/react-slot`, `react-toast`, `react-tooltip` — Componentes acessíveis
- `class-variance-authority` — Variantes tipadas de componentes
- `clsx`, `tailwind-merge` — Utilitários de classes condicionais
- `lucide-react` — Ícones SVG tree-shakable
- `sonner` — Notificações toast alternativas
- `tailwindcss-animate` — Animações Tailwind

### Desenvolvimento
- `vite`, `@vitejs/plugin-react-swc` — Build e HMR rápidos
- `tailwindcss`, `autoprefixer`, `postcss` — Estilização
- `typescript` — Tipagem estática
- `vitest`, `@testing-library/react` — Testes
- `eslint` — Linting

---

## 10. Código-fonte completo comentado

O código-fonte completo com comentários detalhados em português brasileiro está disponível no final do `README.md`. Inclui todos os arquivos ativos do projeto com explicações linha a linha.

# Estresse PROCISA

Ferramenta digital para aplicação das escalas **PSS-10** (Escala de Estresse Percebido) e **EET** (Escala de Estresse no Trabalho), desenvolvida no âmbito do Programa de Pós-graduação em Ciências da Saúde (PROCISA) da Universidade Federal de Roraima (UFRR).

---

## Sumário

1. [Visão Geral](#visão-geral)
2. [Arquitetura e Estrutura de Pastas](#arquitetura-e-estrutura-de-pastas)
3. [Stack Tecnológica](#stack-tecnológica)
4. [Design System](#design-system)
5. [Componentes Reutilizáveis](#componentes-reutilizáveis)
6. [Fluxo da Aplicação](#fluxo-da-aplicação)
7. [Otimização de Performance](#otimização-de-performance)
8. [Diretrizes para Banco de Dados (Futuro)](#diretrizes-para-banco-de-dados-futuro)
9. [Como Executar](#como-executar)
10. [Código-Fonte Completo e Comentado](#código-fonte-completo-e-comentado)

---

## Visão Geral

A aplicação permite que o usuário realize as escalas PSS-10 e EET — individualmente ou em conjunto — diretamente no navegador. Todos os cálculos são realizados localmente (client-side), sem envio ou armazenamento de dados em servidor. Ao final, os resultados são apresentados com classificações e podem ser enviados por e-mail via `mailto:`.

**Autoria:**
- **Autor:** Me. Ítalo Ribeiro Kunzler Machado Marques
- **Orientadora:** Prof.ª Dr.ª Edilane Nunes Régis Bezerra
- **Programa:** PROCISA – UFRR

**URL publicada:** https://estresse-procisa.lovable.app

---

## Arquitetura e Estrutura de Pastas

```
├── index.html                  # Ponto de entrada HTML com meta tags SEO
├── public/                     # Arquivos estáticos servidos diretamente
│   ├── favicon.ico
│   ├── placeholder.svg
│   └── robots.txt
├── src/
│   ├── main.tsx                # Bootstrap: monta <App /> no DOM
│   ├── App.tsx                 # Roteamento principal (BrowserRouter)
│   ├── App.css                 # CSS legado (não utilizado ativamente)
│   ├── index.css               # Design tokens HSL + utilitários Tailwind
│   ├── assets/                 # Imagens importadas como módulos ES6
│   │   ├── procisa-logo.png
│   │   ├── ufrr-logo.png
│   │   ├── edilane-photo.gif
│   │   └── italo-photo.gif
│   ├── components/
│   │   ├── QuestionCard.tsx    # Card individual de questão (memoizado)
│   │   ├── QuizPlayer.tsx      # Controlador de fluxo do questionário
│   │   ├── ResultsView.tsx     # Exibição de resultados (lazy loaded)
│   │   ├── AboutSection.tsx    # Seção institucional (lazy loaded)
│   │   └── ui/                 # Componentes shadcn/ui padronizados
│   │       ├── button.tsx
│   │       ├── skeleton.tsx
│   │       ├── sonner.tsx
│   │       ├── toast.tsx
│   │       ├── toaster.tsx
│   │       ├── tooltip.tsx
│   │       └── use-toast.ts
│   ├── data/
│   │   └── exams.ts            # Definições das escalas, questões e scoring
│   ├── hooks/
│   │   ├── use-mobile.tsx      # Hook para detectar viewport mobile
│   │   └── use-toast.ts        # Re-exportação do hook de toast
│   ├── lib/
│   │   └── utils.ts            # Utilitário cn() para classes condicionais
│   ├── pages/
│   │   ├── Index.tsx           # Página principal (tela de boas-vindas + orquestração)
│   │   └── NotFound.tsx        # Página 404
│   └── test/
│       ├── setup.ts
│       └── example.test.ts
├── tailwind.config.ts          # Configuração do Tailwind com tokens semânticos
├── vite.config.ts              # Configuração do Vite (aliases, HMR)
├── vitest.config.ts            # Configuração de testes
├── postcss.config.js           # PostCSS (Tailwind + Autoprefixer)
├── eslint.config.js            # ESLint com regras TypeScript/React
├── components.json             # Configuração do shadcn/ui
├── tsconfig.json               # TypeScript base
├── tsconfig.app.json           # TypeScript para o app
├── tsconfig.node.json          # TypeScript para scripts Node
└── package.json                # Dependências e scripts
```

**Princípio arquitetural:** Separação clara entre **dados** (`data/exams.ts`), **apresentação** (`QuestionCard`, `AboutSection`), **controle de fluxo** (`QuizPlayer`, `Index.tsx`) e **infraestrutura UI** (`ui/`).

---

## Stack Tecnológica

| Camada | Tecnologia | Finalidade |
|--------|-----------|------------|
| Framework | React 18 | Renderização declarativa com hooks |
| Build | Vite 5 | Bundling rápido com HMR |
| Estilização | Tailwind CSS 3 | Utility-first com tokens semânticos |
| Componentes UI | shadcn/ui | Componentes acessíveis e customizáveis |
| Ícones | Lucide React | Ícones SVG consistentes |
| Roteamento | React Router DOM 6 | SPA com rotas |
| Notificações | Sonner + Radix Toast | Sistema de notificações |
| Testes | Vitest + Testing Library | Testes unitários e de componentes |
| Linguagem | TypeScript 5 | Tipagem estática |

---

## Design System

### Tokens de Cor (HSL)

Todos os tokens são definidos em `src/index.css` usando HSL e consumidos via variáveis CSS:

| Token | Uso |
|-------|-----|
| `--background` / `--foreground` | Fundo e texto principal |
| `--primary` / `--primary-foreground` | Verde institucional e texto sobre ele |
| `--card` / `--card-foreground` | Superfícies de card |
| `--muted` / `--muted-foreground` | Textos secundários |
| `--accent` / `--accent-foreground` | Destaques sutis |
| `--success` / `--warning` / `--destructive` | Cores semânticas de status |
| `--primary-glow` | Variação para gradientes |

### Tipografia

- **Headings:** Space Grotesk (via `--font-heading`)
- **Body:** Inter (via `--font-body`)
- **Sans-serif geral:** Work Sans (via `--font-sans`)
- **Serifada:** Lora (via `--font-serif`)
- **Monoespaçada:** Inconsolata (via `--font-mono`)

### Utilitários CSS Customizados

- `.card-elevated` — sombra com hover animado
- `.gradient-hero` — gradiente sutil para hero sections
- `.gradient-primary-subtle` — gradiente para fundos secundários
- `.text-gradient-primary` — texto com gradiente

### Regra Fundamental

> **Nunca usar cores hardcoded nos componentes.** Sempre usar tokens semânticos (`bg-primary`, `text-muted-foreground`, etc.) para garantir consistência e suporte a temas.

---

## Componentes Reutilizáveis

### Componentes de Domínio

| Componente | Responsabilidade | Reutilização |
|-----------|-----------------|-------------|
| `QuestionCard` | Renderiza uma questão com opções clicáveis | Qualquer escala Likert com N opções |
| `QuizPlayer` | Orquestra a sequência de questões de um exame | Qualquer exame definido em `exams.ts` |
| `ResultsView` | Exibe resultados com classificações e e-mail | Qualquer conjunto de resultados |
| `AboutSection` | Informações institucionais | Tela inicial |

### Componentes de Infraestrutura (shadcn/ui)

| Componente | Uso |
|-----------|-----|
| `Button` | Botões com variantes (default, outline, ghost, etc.) |
| `Skeleton` | Placeholder de carregamento para lazy loading |
| `Toaster` / `Toast` | Notificações empilháveis |
| `Tooltip` | Dicas contextuais |

### Princípio de Componentes Padronizados

> Funcionalidades reutilizáveis devem ser mantidas em **um único local** (`components/ui/` para infraestrutura, `components/` para domínio) e importadas onde necessário. Isso garante **consistência visual** e **manutenção centralizada**.

---

## Fluxo da Aplicação

```
┌─────────────┐
│   Welcome    │ ← Tela inicial com instruções e botões
│   (Index)    │
└──────┬───┬───┘
       │   │
  ┌────┘   └────┐
  ▼              ▼
┌──────┐   ┌──────┐
│PSS-10│   │ EET  │  ← QuizPlayer renderiza o exame escolhido
│(exam1)│   │(exam2)│
└──┬───┘   └──┬───┘
   │          │
   ▼          ▼
┌─────────────────┐
│   ResultsView   │ ← Exibe escores, classificações e opção de e-mail
└─────────────────┘
```

**Modos de operação:**
- `both` → PSS-10 primeiro, depois EET
- `pss10` → Apenas PSS-10
- `eet` → Apenas EET

**Máquina de estados:** `welcome → exam1 → exam2 → results` (controlada por `phase` em `Index.tsx`)

---

## Otimização de Performance

### Técnicas Aplicadas

1. **Lazy Loading** — `ResultsView` e `AboutSection` são carregados sob demanda com `React.lazy()` + `Suspense`
2. **Memoização** — `QuestionCard` usa `React.memo()` para evitar re-renderizações desnecessárias
3. **useCallback** — Handlers de evento estabilizados (`handleFinishExam1`, `handleFinishExam2`, `startExams`, `restart`)
4. **useMemo** — Cálculo de resultados só reprocessa quando `mode` ou `answers` mudam
5. **Imagens lazy** — Fotos dos autores usam `loading="lazy"`
6. **CSS @import otimizado** — Fontes importadas antes das diretivas Tailwind para build correto

---

## Diretrizes para Banco de Dados (Futuro)

Quando um backend for integrado (ex.: Lovable Cloud), seguir estas diretrizes:

### Ordem Correta de Consultas

```
1. Autenticação → Verificar sessão do usuário
2. RLS (Row-Level Security) → Políticas aplicadas automaticamente
3. Seleção → SELECT apenas colunas necessárias
4. Filtragem → WHERE com índices apropriados
5. Paginação → LIMIT/OFFSET ou cursor-based
```

### Caching

- Usar `staleTime` e `gcTime` para controlar cache de queries
- Dados que mudam raramente (definições de escalas): `staleTime: Infinity`
- Dados do usuário (respostas): `staleTime: 0` (sempre frescos)
- Invalidar cache após mutações com `queryClient.invalidateQueries()`

### Lazy Loading de Dados

- Carregar dados apenas quando necessários (ex.: resultados só após finalizar)
- Prefetch de dados previsíveis (ex.: próximo exame enquanto o usuário responde o atual)
- Usar `enabled` em queries condicionais para evitar requisições desnecessárias

### Segurança

- **Nunca armazenar chaves privadas no código** — usar variáveis de ambiente
- **RLS obrigatório** em todas as tabelas com dados de usuário
- **Roles em tabela separada** — nunca no perfil do usuário
- Funções `SECURITY DEFINER` para verificação de roles sem recursão

---

## Como Executar

```bash
# Instalar dependências
npm install

# Desenvolvimento com HMR
npm run dev

# Build de produção
npm run build

# Executar testes
npm test

# Preview do build
npm run preview
```

---

## Código-Fonte Completo e Comentado

Abaixo está o código completo e atualizado de cada arquivo do projeto, com comentários detalhados e minuciosos em português brasileiro.

---

### `index.html`

```html
<!doctype html>
<html lang="en">
  <head>
    <!-- Codificação de caracteres UTF-8 para suporte a acentos e caracteres especiais -->
    <meta charset="UTF-8" />
    <!-- Define viewport responsivo para dispositivos móveis -->
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <!-- Título da aplicação exibido na aba do navegador -->
    <title>Estresse PROCISA</title>
    <!-- Descrição para mecanismos de busca (SEO) -->
    <meta name="description" content="PROCISA - PSS-10 &amp; EET">
    <!-- Autor da aplicação -->
    <meta name="author" content="Lovable" />

    <!-- Open Graph: tipo de conteúdo para compartilhamento em redes sociais -->
    <meta property="og:type" content="website" />
    <!-- Imagem de preview ao compartilhar o link em redes sociais -->
    <meta property="og:image" content="https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/de9a7276-c86c-4e80-b01b-601a96701eca/id-preview-db368fc5--2e580925-cc2b-46a8-befc-04899ac7f6c3.lovable.app-1771540983199.png">

    <!-- Twitter Card: formato grande com imagem para compartilhamento no Twitter/X -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@Lovable" />
    <meta name="twitter:image" content="https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/de9a7276-c86c-4e80-b01b-601a96701eca/id-preview-db368fc5--2e580925-cc2b-46a8-befc-04899ac7f6c3.lovable.app-1771540983199.png">

    <!-- Títulos e descrições duplicados para Open Graph e Twitter -->
    <meta property="og:title" content="Estresse PROCISA">
    <meta name="twitter:title" content="Estresse PROCISA">
    <meta property="og:description" content="PROCISA - PSS-10 &amp; EET">
    <meta name="twitter:description" content="PROCISA - PSS-10 &amp; EET">
  </head>
  <body>
    <!-- Container raiz onde o React monta toda a aplicação -->
    <div id="root"></div>
    <!-- Carrega o ponto de entrada principal como módulo ES6 -->
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

---

### `src/main.tsx`

```tsx
// Importa a função createRoot do React 18 para renderização concorrente
// createRoot substitui o antigo ReactDOM.render e habilita features do React 18
import { createRoot } from "react-dom/client";

// Importa o componente raiz da aplicação que contém roteamento e provedores
import App from "./App.tsx";

// Importa os estilos globais: tokens de design, diretivas Tailwind e utilitários customizados
import "./index.css";

// Monta a árvore React no elemento DOM com id "root" (definido em index.html)
// O operador "!" (non-null assertion) garante ao TypeScript que o elemento existe no DOM
createRoot(document.getElementById("root")!).render(<App />);
```

---

### `src/App.tsx`

```tsx
// Importa os dois sistemas de notificação disponíveis
// Toaster (Radix Toast) — notificações empilháveis com controle fino
import { Toaster } from "@/components/ui/toaster";
// Sonner — notificações mais simples e elegantes (alternativo)
import { Toaster as Sonner } from "@/components/ui/sonner";
// TooltipProvider do Radix UI — necessário para que qualquer componente Tooltip funcione
import { TooltipProvider } from "@/components/ui/tooltip";
// React Router DOM — gerencia navegação SPA (Single Page Application) baseada em URL
import { BrowserRouter, Routes, Route } from "react-router-dom";
// Páginas da aplicação
import Index from "./pages/Index";       // Tela principal com escalas
import NotFound from "./pages/NotFound"; // Página 404 para rotas inexistentes

// Componente raiz: envolve toda a aplicação com provedores de contexto global
// A ordem dos provedores importa: TooltipProvider > Toasters > Router
const App = () => (
  <TooltipProvider>
    {/* Renderiza toasts ativos na tela (Radix) */}
    <Toaster />
    {/* Renderiza notificações Sonner */}
    <Sonner />
    {/* BrowserRouter utiliza a History API do navegador para navegação sem reload */}
    <BrowserRouter>
      <Routes>
        {/* Rota "/" → Tela principal com boas-vindas e escalas */}
        <Route path="/" element={<Index />} />
        {/* Rota curinga "*" → Qualquer URL não reconhecida exibe página 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </TooltipProvider>
);

export default App;
```

---

### `src/index.css`

```css
/* ══════════════════════════════════════════════════════════════
   IMPORTAÇÃO DE FONTES EXTERNAS (Google Fonts)
   IMPORTANTE: As declarações @import DEVEM vir ANTES das diretivas
   @tailwind para evitar o erro de build:
   "import must precede all other statements"
   ══════════════════════════════════════════════════════════════ */

/* Space Grotesk: fonte geométrica para headings (h1-h6) */
/* Inter: fonte humanista para corpo de texto */
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap');

/* Work Sans: fonte sans-serif padrão do Tailwind (font-family geral) */
@import url("https://fonts.googleapis.com/css2?family=Work+Sans:wght@400;500;600;700&display=swap");

/* Lora: fonte serifada para uso especial (citações, destaques) */
@import url("https://fonts.googleapis.com/css2?family=Lora:wght@400;500;600;700&display=swap");

/* Inconsolata: fonte monoespaçada para código e dados técnicos */
@import url("https://fonts.googleapis.com/css2?family=Inconsolata:wght@400;700&display=swap");

/* Diretivas Tailwind: injetam reset (base), componentes e classes utilitárias */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* ══════════════════════════════════════════════════════════════
   DESIGN TOKENS — TEMA CLARO (:root)

   Todos os valores de cor usam formato HSL PURO (sem a função hsl())
   para compatibilidade com Tailwind CSS, que aplica hsl() automaticamente.
   Exemplo: bg-primary → hsl(var(--primary))
   ══════════════════════════════════════════════════════════════ */
@layer base {
  :root {
    /* ── Superfícies Principais ── */
    --background: 160 15% 96%;        /* Fundo geral da página — verde muito claro */
    --foreground: 160 10% 9%;         /* Texto principal — quase preto com tom esverdeado */

    --card: 160 10% 99%;              /* Fundo de cards — branco suave */
    --card-foreground: 160 10% 9%;    /* Texto dentro de cards */

    --popover: 160 8% 92%;            /* Fundo de menus, popovers e dropdowns */
    --popover-foreground: 160 10% 9%; /* Texto em popovers */

    /* ── Cor Primária (Verde Institucional PROCISA) ── */
    --primary: 161 93% 30%;           /* Verde escuro saturado — identidade visual */
    --primary-foreground: 151 80% 95%;/* Texto claro para usar sobre fundos verdes */

    /* ── Cores Secundárias ── */
    --secondary: 160 8% 90%;          /* Cinza esverdeado claro para fundos sutis */
    --secondary-foreground: 160 10% 15%; /* Texto sobre fundos secundários */

    /* ── Textos Mutados (secundários, menos importantes) ── */
    --muted: 160 5% 63%;              /* Cinza médio para elementos desabilitados */
    --muted-foreground: 160 5% 35%;   /* Cinza escuro para textos auxiliares */

    /* ── Acentuação (destaques sutis) ── */
    --accent: 166 76% 96%;            /* Verde muito claro para backgrounds de destaque */
    --accent-foreground: 173 80% 30%; /* Texto sobre fundos de acento */

    /* ── Cores Semânticas de Status ── */
    --destructive: 0 72% 50%;           /* Vermelho para erros e alertas críticos */
    --destructive-foreground: 0 85% 97%;/* Texto sobre vermelho */
    --success: 152 60% 40%;             /* Verde para indicar sucesso */
    --success-foreground: 0 0% 100%;    /* Texto branco sobre verde */
    --warning: 38 90% 55%;              /* Amarelo/laranja para avisos */
    --warning-foreground: 0 0% 100%;    /* Texto branco sobre amarelo */

    /* ── Bordas e Inputs ── */
    --border: 160 10% 86%;            /* Cor de borda padrão — cinza claro esverdeado */
    --input: 160 10% 86%;             /* Cor de borda de inputs */
    --ring: 161 93% 30%;              /* Cor do anel de foco (focus ring) */
    --radius: 0.75rem;                /* Border-radius padrão (12px) */

    /* ── Sidebar (reservado para expansão futura) ── */
    --sidebar-background: 0 0% 98%;
    --sidebar-foreground: 0 0% 9%;
    --sidebar-primary: 161 93% 30%;
    --sidebar-primary-foreground: 151 80% 95%;
    --sidebar-accent: 0 0% 32%;
    --sidebar-accent-foreground: 0 0% 98%;
    --sidebar-border: 0 0% 83%;
    --sidebar-ring: 161 93% 30%;
    --sidebar: 0 0% 98%;

    /* ── Efeitos Visuais ── */
    --primary-glow: 158 64% 51%;       /* Verde mais claro usado em gradientes */
    /* Gradiente sutil para a seção hero (boas-vindas) */
    --gradient-hero: linear-gradient(135deg, hsl(161 93% 30% / 0.08), hsl(166 76% 96% / 0.5));
    /* Sombra padrão para cards com tom esverdeado */
    --shadow-card: 0 2px 12px -4px hsl(161 93% 30% / 0.1), 0 1px 4px -2px hsl(0 0% 0% / 0.06);
    /* Sombra intensificada para hover em cards */
    --shadow-card-hover: 0 8px 24px -8px hsl(161 93% 30% / 0.15), 0 2px 8px -2px hsl(0 0% 0% / 0.08);

    /* ── Fontes ── */
    --font-heading: 'Space Grotesk', sans-serif; /* Para h1-h6 */
    --font-body: 'Inter', sans-serif;            /* Para corpo de texto */
    --font-sans: 'Work Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif;
    --font-serif: 'Lora', ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif;
    --font-mono: 'Inconsolata', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;

    /* ── Cores para Gráficos (reservado para uso futuro) ── */
    --chart-1: 158 64% 51%;
    --chart-2: 141 69% 58%;
    --chart-3: 172 66% 50%;
    --chart-4: 82 77% 55%;
    --chart-5: 0 0% 45%;

    /* ── Escala de Sombras Utilitárias ── */
    --shadow-2xs: 0 1px 3px 0px hsl(0 0% 0% / 0.05);
    --shadow-xs: 0 1px 3px 0px hsl(0 0% 0% / 0.05);
    --shadow-sm: 0 1px 3px 0px hsl(0 0% 0% / 0.1), 0 1px 2px -1px hsl(0 0% 0% / 0.1);
    --shadow: 0 1px 3px 0px hsl(0 0% 0% / 0.1), 0 1px 2px -1px hsl(0 0% 0% / 0.1);
    --shadow-md: 0 1px 3px 0px hsl(0 0% 0% / 0.1), 0 2px 4px -1px hsl(0 0% 0% / 0.1);
    --shadow-lg: 0 1px 3px 0px hsl(0 0% 0% / 0.1), 0 4px 6px -1px hsl(0 0% 0% / 0.1);
    --shadow-xl: 0 1px 3px 0px hsl(0 0% 0% / 0.1), 0 8px 10px -1px hsl(0 0% 0% / 0.1);
    --shadow-2xl: 0 1px 3px 0px hsl(0 0% 0% / 0.25);
    --tracking-normal: 0em;
    --spacing: 0.25rem;
  }

  /* ══════════════════════════════════════════════════════════════
     TEMA ESCURO — sobrescreve tokens para modo dark
     Ativado adicionando a classe "dark" ao elemento <html>
     ══════════════════════════════════════════════════════════════ */
  .dark {
    --background: 160 10% 7%;           /* Fundo escuro com tom esverdeado */
    --foreground: 160 5% 96%;           /* Texto claro */
    --card: 160 8% 11%;                 /* Cards escuros */
    --card-foreground: 160 5% 96%;
    --popover: 160 6% 18%;
    --popover-foreground: 160 5% 96%;
    --primary: 158 64% 51%;             /* Verde mais claro no dark mode para contraste */
    --primary-foreground: 165 91% 9%;   /* Texto escuro sobre verde claro */
    --secondary: 160 6% 20%;
    --secondary-foreground: 160 5% 90%;
    --muted: 160 4% 40%;
    --muted-foreground: 160 5% 70%;
    --accent: 178 84% 10%;
    --accent-foreground: 172 66% 50%;
    --destructive: 0 84% 60%;
    --destructive-foreground: 0 85% 97%;
    --border: 160 6% 22%;
    --input: 160 6% 22%;
    --ring: 158 64% 51%;
    --primary-glow: 161 93% 30%;
    --shadow-card: 0 2px 12px -4px hsl(0 0% 0% / 0.3), 0 1px 4px -2px hsl(0 0% 0% / 0.2);
    --shadow-card-hover: 0 8px 24px -8px hsl(158 64% 51% / 0.15), 0 2px 8px -2px hsl(0 0% 0% / 0.3);
    --sidebar-background: 240 5.9% 10%;
    --sidebar-foreground: 0 0% 98%;
    --sidebar-primary: 158 64% 51%;
    --sidebar-primary-foreground: 165 91% 9%;
    --sidebar-accent: 172 66% 50%;
    --sidebar-accent-foreground: 178 84% 10%;
    --sidebar-border: 0 0% 32%;
    --sidebar-ring: 158 64% 51%;
    --chart-1: 156 71% 66%;
    --chart-2: 141 76% 73%;
    --chart-3: 170 76% 64%;
    --chart-4: 81 84% 67%;
    --chart-5: 0 0% 45%;
    --sidebar: 0 0% 14%;
    --shadow-2xs: 0 1px 3px 0px hsl(0 0% 0% / 0.05);
    --shadow-xs: 0 1px 3px 0px hsl(0 0% 0% / 0.05);
    --shadow-sm: 0 1px 3px 0px hsl(0 0% 0% / 0.1), 0 1px 2px -1px hsl(0 0% 0% / 0.1);
    --shadow: 0 1px 3px 0px hsl(0 0% 0% / 0.1), 0 1px 2px -1px hsl(0 0% 0% / 0.1);
    --shadow-md: 0 1px 3px 0px hsl(0 0% 0% / 0.1), 0 2px 4px -1px hsl(0 0% 0% / 0.1);
    --shadow-lg: 0 1px 3px 0px hsl(0 0% 0% / 0.1), 0 4px 6px -1px hsl(0 0% 0% / 0.1);
    --shadow-xl: 0 1px 3px 0px hsl(0 0% 0% / 0.1), 0 8px 10px -1px hsl(0 0% 0% / 0.1);
    --shadow-2xl: 0 1px 3px 0px hsl(0 0% 0% / 0.25);
  }
}

/* ══════════════════════════════════════════════════════════════
   ESTILOS BASE — aplicados a todos os elementos
   ══════════════════════════════════════════════════════════════ */
@layer base {
  /* Garante que todos os elementos usem a cor de borda do design system */
  * {
    @apply border-border;
  }
  /* Define fonte e cores padrão do body */
  body {
    @apply bg-background text-foreground;
    font-family: var(--font-body);
  }
  /* Headings usam fonte distinta (Space Grotesk) */
  h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-heading);
  }
}

/* ══════════════════════════════════════════════════════════════
   UTILITÁRIOS CUSTOMIZADOS — classes reutilizáveis
   ══════════════════════════════════════════════════════════════ */
@layer utilities {
  /* Card com sombra elevada e animação de hover */
  .card-elevated {
    box-shadow: var(--shadow-card);
    transition: box-shadow 0.3s ease, transform 0.3s ease;
  }
  .card-elevated:hover {
    box-shadow: var(--shadow-card-hover);
    transform: translateY(-2px);
  }
  /* Gradiente sutil para seção hero (boas-vindas) */
  .gradient-hero {
    background: var(--gradient-hero);
  }
  /* Gradiente primário sutil para fundos secundários */
  .gradient-primary-subtle {
    background: linear-gradient(135deg, hsl(var(--primary) / 0.06), hsl(var(--accent) / 0.4));
  }
  /* Texto com gradiente (efeito decorativo) */
  .text-gradient-primary {
    background: linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary-glow)));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
}
```

---

### `tailwind.config.ts`

```ts
import type { Config } from "tailwindcss";

export default {
  // Ativa tema escuro via classe CSS (class="dark" no <html>)
  darkMode: ["class"],

  // Caminhos onde o Tailwind busca classes usadas para tree-shaking
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],

  // Prefixo para classes Tailwind (vazio = sem prefixo)
  prefix: "",

  theme: {
    // Container centralizado com padding e breakpoint máximo
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      // ── Cores mapeadas dos tokens CSS do design system ──
      // Cada cor usa hsl(var(--token)) para respeitar os tokens definidos em index.css
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        // Cores semânticas de status (registradas para uso com classes Tailwind)
        success: {
          DEFAULT: 'hsl(var(--success))',
          foreground: 'hsl(var(--success-foreground))',
        },
        warning: {
          DEFAULT: 'hsl(var(--warning))',
          foreground: 'hsl(var(--warning-foreground))',
        },
        // Tokens da sidebar (reservados para uso futuro)
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
      },
      // ── Border Radius ── derivados do token --radius
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      // ── Animações para accordion do Radix UI ──
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
      // ── Sombras mapeadas dos tokens CSS ──
      boxShadow: {
        '2xs': 'var(--shadow-2xs)',
        xs: 'var(--shadow-xs)',
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        xl: 'var(--shadow-xl)',
        '2xl': 'var(--shadow-2xl)',
      },
      // ── Fontes mapeadas dos tokens CSS ──
      fontFamily: {
        sans: ['Work Sans', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'Noto Sans', 'sans-serif'],
        serif: ['Lora', 'ui-serif', 'Georgia', 'Cambria', 'Times New Roman', 'Times', 'serif'],
        mono: ['Inconsolata', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace'],
      },
    },
  },
  // Plugin tailwindcss-animate para classes de animação (fade, slide, zoom, etc.)
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
```

---

### `vite.config.ts`

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// Configuração do Vite — bundler da aplicação
export default defineConfig(({ mode }) => ({
  server: {
    // Escuta em todas as interfaces de rede (IPv4 e IPv6)
    host: "::",
    // Porta de desenvolvimento
    port: 8080,
    hmr: {
      // Desabilita overlay de erros do HMR para não cobrir a interface
      overlay: false,
    },
  },
  plugins: [
    // Plugin SWC para compilação rápida de React (JSX/TSX)
    react(),
    // Em desenvolvimento, adiciona tags para identificação de componentes no Lovable
    mode === "development" && componentTagger(),
  ].filter(Boolean), // Remove valores falsy (quando mode !== "development")
  resolve: {
    alias: {
      // Alias "@" aponta para o diretório src/ para imports mais limpos
      // Ex.: import X from "@/components/X" em vez de "../../components/X"
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
```

---

### `src/lib/utils.ts`

```ts
// Importa clsx para composição condicional de classes CSS
import { clsx, type ClassValue } from "clsx";
// Importa twMerge para resolver conflitos entre classes Tailwind
// Ex.: cn("px-4", "px-8") → "px-8" (a última vence)
import { twMerge } from "tailwind-merge";

// Função utilitária cn() — combina clsx + twMerge
// Usada em todos os componentes para classes condicionais e merge inteligente
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

---

### `src/hooks/use-mobile.tsx`

```tsx
import * as React from "react";

// Breakpoint que define "mobile" (menor que 768px = mobile)
const MOBILE_BREAKPOINT = 768;

// Hook personalizado para detectar se o viewport é mobile
// Usa matchMedia para ouvir mudanças de tamanho de tela em tempo real
export function useIsMobile() {
  // Estado inicial undefined para evitar mismatch de hidratação (SSR-safe)
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined);

  React.useEffect(() => {
    // Cria media query listener
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    // Handler chamado quando o tamanho da tela cruza o breakpoint
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    // Registra o listener
    mql.addEventListener("change", onChange);
    // Define o valor inicial
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    // Cleanup: remove o listener ao desmontar
    return () => mql.removeEventListener("change", onChange);
  }, []);

  // Converte undefined → false com !! para garantir retorno booleano
  return !!isMobile;
}
```

---

### `src/data/exams.ts`

```ts
// ══════════════════════════════════════════════════════════════
// DEFINIÇÕES DAS ESCALAS — dados puros (sem lógica de apresentação)
// Este arquivo contém todas as questões, configurações e a função de scoring
// ══════════════════════════════════════════════════════════════

// Interface que define a estrutura de uma questão individual
export interface Question {
  id: string;          // Identificador único (ex.: "p1q1", "p2q5")
  text: string;        // Texto completo da questão
  numOptions: number;  // Quantidade de opções disponíveis (5 para ambas as escalas)
  inverted: boolean;   // Se true, o escore é invertido (4→0, 3→1, etc.)
}

// Interface que define a estrutura completa de um exame (escala)
export interface Exam {
  id: string;            // Identificador ("prova1" para PSS-10, "prova2" para EET)
  title: string;         // Título exibido ao usuário
  description: string;   // Descrição breve
  instructions?: string; // Instruções detalhadas (opcional)
  optionLabels?: string[]; // Rótulos textuais para cada opção (ex.: "Nunca", "Sempre")
  startFrom?: number;    // Valor inicial das opções (0 para PSS-10, 1 para EET)
  questions: Question[]; // Array de questões que compõem a escala
}

// Função utilitária para gerar arrays de questões a partir de textos
// Recebe: prefixo do ID, quantidade, número de opções, itens invertidos e textos
function generateQuestions(
  prefix: string,
  count: number,
  numOptions: number,
  invertedItems: number[] = [],
  texts?: string[]
): Question[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `${prefix}q${i + 1}`,                       // ID gerado automaticamente
    text: texts?.[i] ?? `Item ${i + 1}`,             // Texto da questão ou fallback
    numOptions,                                       // Número de opções
    inverted: invertedItems.includes(i + 1),          // Verifica se é item invertido (1-indexed)
  }));
}

// ── Textos da PSS-10 (Escala de Estresse Percebido) ──
// 10 itens que avaliam a percepção de estresse nos últimos 30 dias
const pss10Texts = [
  "Com que frequência você ficou aborrecido por causa de algo que aconteceu inesperadamente? (considere os últimos 30 dias)",
  "Com que frequência você sentiu que foi incapaz de controlar coisas importantes na sua vida? (considere os últimos 30 dias)",
  "Com que frequência você esteve nervoso ou estressado? (considere os últimos 30 dias)",
  "Com que frequência você esteve confiante em sua capacidade de lidar com seus problemas pessoais? (considere os últimos 30 dias)",
  "Com que frequência você sentiu que as coisas aconteceram da maneira que você esperava? (considere os últimos 30 dias)",
  "Com que frequência você achou que não conseguiria lidar com todas as coisas que tinha por fazer? (considere os últimos 30 dias)",
  "Com que frequência você foi capaz de controlar irritações na sua vida? (considere os últimos 30 dias)",
  "Com que frequência você sentiu que todos os aspectos de sua vida estavam sob controle? (considere os últimos 30 dias)",
  "Com que frequência você esteve bravo por causa de coisas que estiveram fora de seu controle? (considere os últimos 30 dias)",
  "Com que frequência você sentiu que os problemas acumularam tanto que você não conseguiria resolvê-los? (considere os últimos 30 dias)",
];

// ── Textos da EET (Escala de Estresse no Trabalho) ──
// 23 itens que avaliam estressores ocupacionais específicos
const eetTexts = [
  "A forma como as tarefas são distribuídas em minha área tem me deixado nervoso(a).",
  "O tipo de controle existente em meu trabalho me irrita.",
  "A falta de autonomia na execução do meu trabalho tem sido desgastante.",
  "Tenho me sentido incomodado(a) com a falta de confiança de meu superior sobre meu trabalho.",
  "Sinto-me irritado(a) com a deficiência na divulgação de informações sobre decisões organizacionais.",
  "Sinto-me incomodado(a) com a falta de informações sobre minhas tarefas no trabalho.",
  "A falta de comunicação entre mim e meus colegas de trabalho deixa-me irritado(a).",
  "Sinto-me incomodado(a) por meu superior tratar-me mal na frente de colegas de trabalho.",
  "Sinto-me incomodado(a) por ter que realizar tarefas que estão além de minha capacidade.",
  "Fico de mau humor por ter que trabalhar durante muitas horas seguidas.",
  "Sinto-me incomodado(a) com a comunicação existente entre mim e meu superior.",
  "Fico irritado(a) com a discriminação/favoritismo no meu ambiente de trabalho.",
  "Tenho me sentido incomodado(a) com a deficiência nos treinamentos para capacitação profissional.",
  "Fico de mau humor por me sentir isolado(a) na organização.",
  "Fico irritado(a) por ser pouco valorizado por meus superiores.",
  "As poucas perspectivas de crescimento na carreira têm me deixado angustiado(a).",
  "Tenho me sentido incomodado(a) por trabalhar em tarefas abaixo de meu nível de habilidade.",
  "A competição no meu ambiente de trabalho tem me deixado de mau humor.",
  "A falta de compreensão sobre quais são as minhas responsabilidades neste trabalho tem causado irritação.",
  "Tenho estado nervoso(a) por meu superior me dar ordens contraditórias.",
  "Sinto-me irritado(a) por meu superior encobrir meu trabalho bem-feito diante outras pessoas.",
  "O tempo insuficiente para realizar meu volume de trabalho deixa-me nervoso(a).",
  "Fico incomodado(a) por meu superior evitar me incumbir de responsabilidades importantes.",
];

// ── Definição das Escalas (exportadas para uso nos componentes) ──
export const exams: Exam[] = [
  {
    id: "prova1",
    title: "PSS-10 – Escala de Estresse Percebido",
    description: "10 itens · Alternativas de 0 a 4.",
    // Instruções completas exibidas antes das questões
    instructions: "As questões nesta escala perguntam a respeito dos seus sentimentos e pensamentos durante os últimos 30 dias (último mês). Em cada questão, indique a frequência com que você se sentiu ou pensou a respeito da situação vivenciada, seguindo a escala abaixo:\n\n0 – Nunca | 1 – Quase Nunca | 2 – Às Vezes | 3 – Pouco Frequente | 4 – Muito Frequente",
    // Rótulos textuais para cada valor numérico (0-4)
    optionLabels: ["Nunca", "Quase Nunca", "Às Vezes", "Pouco Frequente", "Muito Frequente"],
    // startFrom padrão (0) — não precisa declarar
    // Itens 4, 5, 7 e 8 são invertidos na PSS-10
    questions: generateQuestions("p1", 10, 5, [4, 5, 7, 8], pss10Texts),
  },
  {
    id: "prova2",
    title: "EET – Escala de Estresse no Trabalho",
    description: "23 itens · Alternativas de 1 a 5",
    instructions: "As questões nesta escala listam várias situações que podem ocorrer no dia a dia de seu trabalho. Leia com atenção cada afirmativa e utilize a escala apresentada a seguir para dar sua opinião sobre cada uma delas:\n\n1 – Discordo Totalmente | 2 – Discordo | 3 – Concordo em Parte | 4 – Concordo | 5 – Concordo Totalmente\n\nPara cada item, marque o número que melhor corresponde à sua resposta.\nAo marcar o número 1, você indica discordar totalmente da afirmativa.\nAssinalando o número 5, você indica concordar totalmente com a afirmativa.\nObserve que, quanto menor o número, mais você discorda da afirmativa e, quanto maior o número, mais você concorda com a afirmativa.",
    // EET tem rótulo vazio no índice 0 porque as opções começam em 1
    optionLabels: ["", "Discordo Totalmente", "Discordo", "Concordo em parte", "Concordo", "Concordo Totalmente"],
    startFrom: 1, // Opções começam em 1 (não em 0)
    // Nenhum item invertido na EET
    questions: generateQuestions("p2", 23, 5, [], eetTexts),
  },
];

// Função de cálculo de escore para uma questão individual
// Se o item for invertido, aplica a inversão: (numOptions - 1) - valor
// Exemplo para PSS-10 (5 opções, 0-4): invertido(3) = 4 - 3 = 1
export function getScore(question: Question, selectedValue: number): number {
  if (question.inverted) {
    return (question.numOptions - 1) - selectedValue;
  }
  return selectedValue;
}
```

---

### `src/components/QuestionCard.tsx`

```tsx
// Importa memo do React para memoização do componente
// memo evita re-renderizações desnecessárias quando as props não mudam
import { memo } from "react";
// Importa a interface Question para tipagem das props
import { Question } from "@/data/exams";
// Importa a função utilitária cn() para classes condicionais
import { cn } from "@/lib/utils";

// Interface de props do componente QuestionCard
interface QuestionCardProps {
  question: Question;              // Dados da questão (texto, opções, inversão)
  selectedOption: number | null;   // Opção atualmente selecionada (null = nenhuma)
  onSelect: (value: number) => void; // Callback chamado ao selecionar uma opção
  optionLabels?: string[];         // Rótulos textuais opcionais para cada valor
  startFrom?: number;              // Valor inicial das opções (0 ou 1)
}

// Componente memoizado que renderiza uma questão individual com opções clicáveis
// Reutilizável para qualquer escala Likert com N opções
const QuestionCard = memo(({ question, selectedOption, onSelect, optionLabels, startFrom = 0 }: QuestionCardProps) => {
  // Gera array de valores numéricos para as opções
  // Ex.: startFrom=0, numOptions=5 → [0, 1, 2, 3, 4]
  // Ex.: startFrom=1, numOptions=5 → [1, 2, 3, 4, 5]
  const options = Array.from({ length: question.numOptions }, (_, i) => i + startFrom);

  return (
    // Card com bordas arredondadas, fundo de card e sombra elevada com hover
    <div className="rounded-xl bg-card border border-border p-6 card-elevated">
      {/* Texto da questão */}
      <h3 className="text-lg font-semibold mb-1 leading-relaxed">{question.text}</h3>
      {/* Espaço invisível para itens invertidos (mantém layout consistente) */}
      {question.inverted && (
        <p className="text-xs text-muted-foreground mb-4 italic">​</p>
      )}
      {/* Grid de opções: 5 colunas em mobile, flex-wrap em desktop */}
      <div className="grid grid-cols-5 sm:flex sm:flex-wrap gap-2 sm:gap-3">
        {options.map((value) => {
          const isSelected = selectedOption === value;
          return (
            // Botão para cada opção de resposta
            <button
              key={value}
              onClick={() => onSelect(value)}
              className={cn(
                // Estilos base do botão
                "min-w-12 h-auto rounded-lg border-2 transition-all duration-200 flex flex-col items-center justify-center text-sm font-bold px-3 py-2 gap-1",
                // Estilos condicionais: selecionado vs. não selecionado
                isSelected
                  ? "border-primary bg-primary text-primary-foreground shadow-sm"
                  : "border-border hover:border-primary/40 hover:bg-secondary/60 text-muted-foreground"
              )}>
              {/* Valor numérico da opção */}
              <span>{value}</span>
              {/* Rótulo textual (se disponível para este valor) */}
              {optionLabels?.[value] && (
                <span className="text-[10px] font-normal leading-tight text-center">
                  {optionLabels[value]}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
});

// displayName obrigatório para componentes memoizados (facilita debugging no DevTools)
QuestionCard.displayName = "QuestionCard";

export default QuestionCard;
```

---

### `src/components/QuizPlayer.tsx`

```tsx
// Importa hooks do React para estado local e estabilização de callbacks
import { useState, useCallback } from "react";
// Importa a interface Exam para tipagem das props
import { Exam } from "@/data/exams";
// Importa o componente de questão individual
import QuestionCard from "./QuestionCard";
// Importa o componente Button do design system
import { Button } from "@/components/ui/button";
// Ícone de envio (seta para direita) do Lucide
import { Send } from "lucide-react";

// Interface de props do QuizPlayer
interface QuizPlayerProps {
  exam: Exam;                                      // Escala a ser aplicada
  onFinish: (answers: Record<string, number>) => void; // Callback com as respostas ao finalizar
}

// Componente controlador que orquestra a aplicação de uma escala completa
// Gerencia: estado das respostas, barra de progresso, lista de questões e botão finalizar
const QuizPlayer = ({ exam, onFinish }: QuizPlayerProps) => {
  // Estado que armazena as respostas: { "p1q1": 3, "p1q2": 1, ... }
  const [answers, setAnswers] = useState<Record<string, number>>({});

  // Cálculos derivados do estado
  const total = exam.questions.length;            // Total de questões
  const answered = Object.keys(answers).length;   // Quantidade respondida
  const allAnswered = answered === total;          // Todas respondidas?

  // Callback estabilizado para selecionar resposta de uma questão
  // Usa spread para preservar respostas anteriores e atualizar/adicionar a nova
  const selectAnswer = useCallback((questionId: string, value: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* ── Cabeçalho do Exame ── */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-1">{exam.title}</h2>
        <p className="text-muted-foreground text-sm mb-3">{exam.description}</p>
        {/* Instruções detalhadas (se disponíveis) */}
        {exam.instructions && (
          <div className="rounded-lg border border-border bg-secondary/40 p-4 text-sm text-foreground whitespace-pre-line">
            {exam.instructions}
          </div>
        )}
      </div>

      {/* ── Barra de Progresso ── */}
      {/* Mostra visualmente quantas questões foram respondidas */}
      <div className="w-full h-2.5 rounded-full bg-secondary/40 mb-2 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary to-primary/70 transition-all duration-500 ease-out"
          style={{ width: `${(answered / total) * 100}%` }}
        />
      </div>
      <p className="text-xs text-muted-foreground mb-8">{answered} de {total} respondidos</p>

      {/* ── Lista de Questões ── */}
      <div className="space-y-6">
        {exam.questions.map((question, idx) => (
          <div key={question.id}>
            {/* Indicador numérico da questão */}
            <div className="mb-2 text-sm text-muted-foreground">
              <span>Questão {idx + 1}</span>
            </div>
            {/* Componente QuestionCard memoizado */}
            <QuestionCard
              question={question}
              selectedOption={answers[question.id] ?? null}
              onSelect={(value) => selectAnswer(question.id, value)}
              optionLabels={exam.optionLabels}
              startFrom={exam.startFrom}
            />
          </div>
        ))}
      </div>

      {/* ── Referências Bibliográficas (específicas de cada escala) ── */}
      {exam.id === "prova1" && (
        <div className="rounded-lg border border-border bg-secondary/30 p-4 mt-6 text-xs text-muted-foreground space-y-2">
          <p>COHEN, S., KAMARCK, T., & MERMELSTEIN, R. (1983). A global measure of perceived stress. <em>Journal of Health and Social Behavior</em>, 24, 385-396.</p>
          <p>SIQUEIRA REIS, R., FERREIRA HINO, A. A., & ROMÉLIO RODRIGUEZ AÑEZ, C. (2010). Perceived stress scale: Reliability and validity study in Brazil. <em>Journal of health psychology</em>, 15(1), 107-114.</p>
        </div>
      )}

      {exam.id === "prova2" && (
        <div className="rounded-lg border border-border bg-secondary/30 p-4 mt-6 text-xs text-muted-foreground">
          <p>PASCHOAL, T.; TAMAYO, A. Validação da escala de estresse no trabalho. <em>Estudos de Psicologia (Natal)</em>, v. 9, n. 1, p. 45-52, 2004.</p>
        </div>
      )}

      {/* ── Botão Finalizar ── */}
      {/* Desabilitado até que todas as questões sejam respondidas */}
      <div className="flex justify-end mt-8">
        <Button size="lg" onClick={() => onFinish(answers)} disabled={!allAnswered}>
          Finalizar <Send className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default QuizPlayer;
```

---

### `src/components/ResultsView.tsx`

```tsx
// Importa hooks de otimização do React
import { memo, useMemo, useCallback } from "react";
// Importa interface Exam e função de scoring
import { Exam, getScore } from "@/data/exams";
// Ícones do Lucide
import { Home, AlertTriangle, Mail } from "lucide-react";
// Botão do design system
import { Button } from "@/components/ui/button";
// Logos institucionais importados como módulos ES6
import procisaLogo from "@/assets/procisa-logo.png";
import ufrrLogo from "@/assets/ufrr-logo.png";

// Interface para os resultados de um exame individual
interface ExamResult {
  exam: Exam;                          // Dados da escala
  answers: Record<string, number>;     // Respostas do usuário
}

// Props do componente ResultsView
interface ResultsViewProps {
  results: ExamResult[];               // Array de resultados (1 ou 2 escalas)
  mode: "both" | "pss10" | "eet";      // Modo de operação
  onRestart: () => void;               // Callback para voltar à tela inicial
}

/* ── Funções puras de classificação do estresse ── */

// Classificação PSS-10 (retorna label e classe de cor semântica)
const getPSSLevel = (score: number) => {
  if (score <= 18) return { label: "Estresse Baixo", color: "text-success" };
  if (score <= 24) return { label: "Estresse Normal", color: "text-warning" };
  if (score <= 35) return { label: "Estresse Alto", color: "text-destructive/80" };
  return { label: "Estresse Muito Alto", color: "text-destructive" };
};

// Classificação EET (baseada na média aritmética)
const getEETLevel = (avg: number) => {
  if (avg < 2.5) return { label: "Estresse Baixo ou Leve", color: "text-success" };
  if (avg === 2.5) return { label: "Estresse Médio/Considerável", color: "text-warning" };
  return { label: "Estresse Alto", color: "text-destructive" };
};

// Versões texto puro (sem estilização) para uso no corpo do e-mail
const getPSSLevelText = (score: number) => {
  if (score <= 18) return "Estresse Baixo";
  if (score <= 24) return "Estresse Normal";
  if (score <= 35) return "Estresse Alto";
  return "Estresse Muito Alto";
};

const getEETLevelText = (avg: number) => {
  if (avg < 2.5) return "Estresse Baixo ou Leve";
  if (avg === 2.5) return "Estresse Médio/Considerável";
  return "Estresse Alto";
};

/* ── Textos de aviso (disclaimer) específicos por modo ── */
const DISCLAIMERS: Record<string, string> = {
  both: `Estas escalas são ferramentas úteis apenas para medir possíveis INDICATIVOS do Estresse Percebido e do Estresse No Trabalho, deste modo, NÃO DEVEM SER UTILIZADAS como ferramentas para o diagnóstico. Cabe lembrar que tais instrumentos não são de uso privativo.\n\nCaso você perceba que o estresse está sendo prejudicial e atrapalhando seu bem-estar procure ajuda qualificada.`,
  pss10: `Esta escala é uma ferramenta útil para medir possíveis INDICATIVOS de Estresse Percebido, deste modo, NÃO DEVE SER UTILIZADA como ferramenta para o diagnóstico. Cabe lembrar que tal instrumento não é de uso privativo.\n\nCaso você perceba que o estresse está sendo prejudicial e atrapalhando seu bem-estar procure ajuda qualificada.`,
  eet: `Esta escala é uma ferramenta útil para medir possíveis INDICATIVOS de Estresse No Trabalho, deste modo, NÃO DEVE SER UTILIZADA como ferramenta para o diagnóstico. Cabe lembrar que tal instrumento não é de uso privativo.\n\nCaso você perceba que o estresse está sendo prejudicial e atrapalhando seu bem-estar procure ajuda qualificada.`,
};

/* ── Componente principal (memoizado para evitar re-renders desnecessários) ── */
const ResultsView = memo(({ results, mode, onRestart }: ResultsViewProps) => {
  // Seleciona o disclaimer apropriado com base no modo
  const disclaimer = DISCLAIMERS[mode];

  // Calcula os escores a partir das respostas (memoizado — só recalcula quando results muda)
  const computedResults = useMemo(() =>
    results.map(({ exam, answers }) => {
      // Soma os escores de todas as questões (aplicando inversão quando necessário)
      const totalScore = exam.questions.reduce((sum, q) => {
        const selected = answers[q.id];
        return sum + (selected != null ? getScore(q, selected) : 0);
      }, 0);
      // Para EET, calcula a média (total ÷ 23) com 2 casas decimais
      const eetAvg = exam.id === "prova2" ? parseFloat((totalScore / 23).toFixed(2)) : null;
      return { exam, totalScore, eetAvg };
    }),
    [results]
  );

  // Constrói o corpo do e-mail em texto puro (memoizado)
  const buildEmailBody = useCallback(() => {
    const now = new Date();
    // Formata data e hora no padrão brasileiro
    const dataHora = now.toLocaleDateString("pt-BR", {
      day: "2-digit", month: "2-digit", year: "numeric",
    }) + " às " + now.toLocaleTimeString("pt-BR", {
      hour: "2-digit", minute: "2-digit",
    });

    let body = "RESULTADO FINAL - Escalas de Estresse (PROCISA/UFRR)\n";
    body += "Escores obtidos nas escalas aplicadas\n";
    body += `Data e hora da realização: ${dataHora}\n\n`;

    // Adiciona resultados de cada escala
    computedResults.forEach(({ exam, totalScore, eetAvg }) => {
      body += `━━━ ${exam.title} ━━━\n\n`;

      if (exam.id === "prova1") {
        body += `Escore Total: ${totalScore}\n`;
        body += `Classificação: ${getPSSLevelText(totalScore)}\n\n`;
        body += `Os resultados aqui apresentados foram organizados e categorizados a partir do trabalho de OLIVEIRA, J. C. et al. The impact of COVID-19 on the physical and emotional health of health professionals in the municipality of Baixada Maranhense. Research, Society and Development, v. 10, n. 10, 2021. p. e163101018744.\n\n`;
      }

      if (exam.id === "prova2" && eetAvg != null) {
        body += `Escore Médio: ${eetAvg.toFixed(2)}\n`;
        body += `Classificação: ${getEETLevelText(eetAvg)}\n\n`;
        body += `Os resultados aqui apresentados foram organizados e categorizados a partir do trabalho de: PASCHOAL, T.; TAMAYO, A. Validação da escala de estresse no trabalho. Estudos de Psicologia (Natal), v. 9, n. 1, p. 45-52, 2004.\n\n`;
      }
    });

    body += "---\n\n";
    body += disclaimer;
    body += "\n\n---\n\n";

    // Referências bibliográficas
    body += "REFERÊNCIAS\n\n";
    if (mode === "both" || mode === "pss10") {
      body += "PSS-10:\n";
      body += "Cohen, S., Kamarck, T., & Mermelstein, R. (1983). A global measure of perceived stress. Journal of Health and Social Behavior, 24(4), 385-396.\n";
      body += "Siqueira Reis, R., Ferreira Hino, A. A., & Romélio Rodriguez Añez, C. (2010). Perceived Stress Scale: Reliability and validity study in Brazil. Journal of Health Psychology, 15(1), 107-114.\n\n";
    }
    if (mode === "both" || mode === "eet") {
      body += "EET:\n";
      body += "Paschoal, T., & Tamayo, A. (2004). Validação da Escala de Estresse no Trabalho. Estudos de Psicologia, 9(1), 45-52.\n\n";
    }

    // Aviso LGPD
    body += "---\n\n";
    body += "AVISO SOBRE PROTEÇÃO DE DADOS\n\n";
    body += "Os dados apresentados neste relatório foram produzidos e coletados em conformidade com a Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018 – LGPD). ";
    body += "As informações aqui contidas são de caráter pessoal e confidencial, destinando-se exclusivamente ao titular dos dados ou a profissional por ele autorizado. ";
    body += "O compartilhamento, a reprodução ou a divulgação deste conteúdo a terceiros sem o consentimento do titular é de inteira responsabilidade de quem o fizer. ";
    body += "Recomenda-se o armazenamento seguro deste documento e o descarte adequado quando não mais necessário.";

    return body;
  }, [computedResults, disclaimer, mode]);

  // Handler para abrir cliente de e-mail com resultados pré-preenchidos
  const handleSendEmail = useCallback(() => {
    const subject = encodeURIComponent("Resultado - Escalas de Estresse (PROCISA)");
    const body = encodeURIComponent(buildEmailBody());
    window.open(`mailto:?subject=${subject}&body=${body}`, "_self");
  }, [buildEmailBody]);

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* ── Cabeçalho com logos institucionais ── */}
      <div className="text-center mb-10">
        <div className="flex items-center justify-center gap-4 mb-4">
          <img src={procisaLogo} alt="Logo PROCISA" className="h-14 object-contain" />
          <div className="w-px h-10 bg-border" />
          <img src={ufrrLogo} alt="Brasão UFRR" className="h-14 object-contain" />
        </div>
        <h2 className="text-3xl font-bold mb-2">Resultado Final</h2>
        <p className="text-muted-foreground">Escores obtidos nas escalas aplicadas</p>
      </div>

      {/* ── Cards de Resultado (um por escala) ── */}
      <div className="grid gap-8">
        {computedResults.map(({ exam, totalScore, eetAvg }) => {
          const stressLevel = exam.id === "prova1" ? getPSSLevel(totalScore) : null;
          const eetStressLevel = eetAvg != null ? getEETLevel(eetAvg) : null;

          return (
            <div key={exam.id} className="rounded-xl bg-card border border-border p-6 card-elevated">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-xl font-bold">{exam.title}</h3>
                <div className="text-right">
                  {/* Exibe escore total para PSS-10 */}
                  {exam.id === "prova1" && (
                    <>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">Escore Total</p>
                      <p className="text-3xl font-bold text-primary">{totalScore}</p>
                    </>
                  )}
                  {/* Exibe escore médio para EET */}
                  {exam.id === "prova2" && eetAvg != null && (
                    <>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">Escore Médio</p>
                      <p className="text-3xl font-bold text-primary">{eetAvg.toFixed(2)}</p>
                    </>
                  )}
                  {/* Classificação com cor semântica */}
                  {stressLevel && (
                    <p className={`text-sm font-semibold mt-1 ${stressLevel.color}`}>
                      {stressLevel.label}
                    </p>
                  )}
                  {eetStressLevel && (
                    <p className={`text-sm font-semibold mt-1 ${eetStressLevel.color}`}>
                      {eetStressLevel.label}
                    </p>
                  )}
                </div>
              </div>
              {/* Referência bibliográfica da categorização */}
              {exam.id === "prova1" && (
                <p className="text-[11px] text-muted-foreground/70 leading-snug mt-2">
                  Os resultados aqui apresentados foram organizados e categorizados a partir do trabalho de OLIVEIRA, J. C. et al. The impact of COVID-19 on the physical and emotional health of health professionals in the municipality of Baixada Maranhense. <em>Research, Society and Development</em>, v. 10, n. 10, 2021. p. e163101018744.
                </p>
              )}
              {exam.id === "prova2" && (
                <p className="text-[11px] text-muted-foreground/70 leading-snug mt-2">
                  Os resultados aqui apresentados foram organizados e categorizados a partir do trabalho de: PASCHOAL, T.; TAMAYO, A. Validação da escala de estresse no trabalho. <em>Estudos de Psicologia (Natal)</em>, v. 9, n. 1, p. 45-52, 2004.
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Disclaimer (aviso importante) ── */}
      <div className="rounded-xl border border-border bg-secondary/30 p-6 mt-8">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-warning mt-0.5 shrink-0" />
          <p className="text-sm text-muted-foreground whitespace-pre-line">{disclaimer}</p>
        </div>
      </div>

      {/* ── Botões de Ação (E-mail e Voltar) ── */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-10">
        <Button onClick={handleSendEmail} size="lg" variant="outline">
          <Mail className="w-4 h-4 mr-2" /> Enviar por e-mail
        </Button>
        <Button onClick={onRestart} size="lg">
          <Home className="w-4 h-4 mr-2" /> Retornar à tela inicial
        </Button>
      </div>
    </div>
  );
});

// displayName obrigatório para componentes memoizados
ResultsView.displayName = "ResultsView";

export default ResultsView;
```

---

### `src/components/AboutSection.tsx`

```tsx
// Logos e fotos importados como módulos ES6 (processados pelo Vite)
import procisaLogo from "@/assets/procisa-logo.png";
import ufrrLogo from "@/assets/ufrr-logo.png";
import edilanePhoto from "@/assets/edilane-photo.gif";
import italoPhoto from "@/assets/italo-photo.gif";

// Seção institucional "Sobre" — exibida na tela de boas-vindas
// Carregada via lazy loading (React.lazy) para não bloquear o carregamento inicial
const AboutSection = () => {
  return (
    <section className="max-w-3xl mx-auto mt-16 mb-10">
      <h2 className="text-2xl font-bold text-center mb-6">Sobre</h2>

      {/* ── Card institucional com logos ── */}
      <div className="rounded-xl border border-border bg-card p-6 mb-8 text-center">
        <div className="flex items-center justify-center gap-5 mb-5">
          <img src={procisaLogo} alt="Logo PROCISA" className="h-20 object-contain" />
          <div className="w-px h-14 bg-border" />
          <img src={ufrrLogo} alt="Brasão UFRR" className="h-20 object-contain" />
        </div>
        <p className="text-sm text-muted-foreground text-justify">
          Esta ferramenta digital foi criada pelo Mestre em Ciências da Saúde{" "}
          <strong>Ítalo Ribeiro Kunzler Machado Marques</strong> sob orientação da{" "}
          Professora Doutora <strong>Edilane Nunes Régis Bezerra</strong> dentro do
          Programa de Pós-graduação em Ciências da Saúde PROCISA – UFRR. Esta aplicação
          foi desenvolvida em estrita consonância com as diretrizes da Coordenação de
          Aperfeiçoamento de Pessoal de Nível Superior (CAPES) para a produção de
          Produtos Técnicos e Tecnológicos (PTT). Seu desenvolvimento fundamenta-se nos
          critérios de avaliação estabelecidos pelo Relatório do Grupo de Trabalho (GT) de
          Produção Técnica da CAPES de 2019.
        </p>
      </div>

      {/* ── Grid com perfis dos autores ── */}
      <div className="grid gap-8 md:grid-cols-2">
        {/* Perfil da orientadora */}
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex flex-col items-center mb-4">
            {/* Foto com loading="lazy" para otimização de performance */}
            <img
              src={edilanePhoto}
              alt="Profa. Dra. Edilane Nunes Régis Bezerra"
              loading="lazy"
              className="w-28 h-28 rounded-full object-cover border-2 border-primary/30 mb-3" />
            <h3 className="font-bold text-sm text-center">Prof.ª Dr.ª Edilane Nunes Régis Bezerra</h3>
            <p className="text-xs text-muted-foreground">Orientadora</p>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed text-justify">
            Edilane Nunes Régis Bezerra é psicóloga, professora e pesquisadora com ampla experiência na área da Psicologia Social e da Saúde. Doutora em Psicologia Social pela Universidade Federal da Paraíba (2017) e mestre em Psicologia pela Universidade Federal do Rio Grande do Norte (2008), atua como professora adjunta da Universidade Federal de Roraima (UFRR), onde integra o corpo docente do curso de Psicologia e do Programa de Pós-graduação em Ciências da Saúde (PROCISA).
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed mt-2 text-justify">
            Na UFRR, coordena o Grupo de Pesquisa em Saúde Mental e Atenção Psicossocial e Primária, desenvolvendo estudos voltados para promoção da saúde, vulnerabilidades e saúde mental. Suas linhas de pesquisa abrangem temas como redes de atenção psicossocial (RAPS), clínica ampliada, reforma psiquiátrica, saúde mental na atenção básica, inserção e prática do psicólogo em políticas públicas de saúde e programas de intervenção comunitária.
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed mt-2 text-justify">
            Além de tudo, Edilane contribui diretamente para a formação de novos profissionais e pesquisadores, consolidando sua atuação como referência na interface entre psicologia, saúde mental e políticas públicas. Sua trajetória reflete um compromisso com a construção de práticas de cuidado ampliadas e integradas, voltadas para a promoção da saúde e o fortalecimento das redes de atenção psicossocial.
          </p>
        </div>

        {/* Perfil do autor */}
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex flex-col items-center mb-4">
            <img
              src={italoPhoto}
              alt="Me. Ítalo Ribeiro Kunzler Machado Marques"
              loading="lazy"
              className="w-28 h-28 rounded-full object-cover border-2 border-primary/30 mb-3" />
            <h3 className="font-bold text-sm text-center">Me. Ítalo Ribeiro Kunzler Machado Marques</h3>
            <p className="text-xs text-muted-foreground">Autor</p>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed text-justify">
            Ítalo Ribeiro Kunzler Machado Marques é psicólogo e pesquisador com atuação prática em saúde mental e psicologia organizacional. Graduado em Psicologia pela Universidade Federal de Roraima (2021), onde também desenvolveu seu mestrado em Ciências da Saúde (2025), Ítalo complementou sua trajetória com especializações em Psicologia Organizacional (2023) e Gestão de Pessoas (2023) além de Saúde Mental (2022).
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed mt-2 text-justify">
            Atualmente, exerce atividades profissionais em saúde mental e gestão de pessoas, com experiência em projetos voltados à população em situação de rua e pesquisas sobre narratividade e produção de subjetividade. Sua atuação combina prática clínica, pesquisa acadêmica e vivência institucional, refletindo um compromisso em promover o bem-estar psicológico em diferentes contextos sociais e organizacionais.
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed mt-2 text-justify">
            Além de sua prática como psicólogo, Ítalo também realiza atividades docentes, contribuindo para a formação de novos profissionais e compartilhando sua experiência em temas relacionados à saúde mental, psicologia organizacional e ciências da saúde.
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed mt-2 text-justify">
            Sua trajetória revela um profissional que transita entre ensino, pesquisa e prática, sempre com o objetivo de ampliar o alcance da psicologia e fortalecer sua contribuição para a sociedade.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
```

---

### `src/pages/Index.tsx`

```tsx
// Importa hooks do React para estado, memoização e lazy loading
import { useState, useCallback, useMemo, lazy, Suspense } from "react";
// Importa as definições das escalas
import { exams } from "@/data/exams";
// Importa o componente que orquestra a aplicação de cada escala
import QuizPlayer from "@/components/QuizPlayer";
// Ícones temáticos do Lucide
import { ArrowRight, HeartPulse, Briefcase, Info, Clock } from "lucide-react";
// Skeleton para placeholder durante lazy loading
import { Skeleton } from "@/components/ui/skeleton";
// Logos importados como módulos ES6
import procisaLogo from "@/assets/procisa-logo.png";
import ufrrLogo from "@/assets/ufrr-logo.png";

/* ── Lazy loading de componentes pesados ──
   São carregados apenas quando necessário, reduzindo o bundle inicial */
const ResultsView = lazy(() => import("@/components/ResultsView"));
const AboutSection = lazy(() => import("@/components/AboutSection"));

// Tipos que definem as fases da aplicação e os modos de operação
type Phase = "welcome" | "exam1" | "exam2" | "results";
type Mode = "both" | "pss10" | "eet";

// Interface para armazenar respostas de ambos os exames
interface ExamAnswers {
  exam1: Record<string, number>; // Respostas PSS-10: { "p1q1": 3, "p1q2": 1, ... }
  exam2: Record<string, number>; // Respostas EET: { "p2q1": 4, "p2q2": 2, ... }
}

// Função utilitária para scroll suave ao topo (chamada a cada troca de fase)
const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

// ══════════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL — Página Index
// Funciona como uma máquina de estados finita:
// welcome → exam1 → exam2 → results
// ══════════════════════════════════════════════════════════════
const Index = () => {
  // Estado da fase atual (qual tela está visível)
  const [phase, setPhase] = useState<Phase>("welcome");
  // Modo de operação selecionado pelo usuário
  const [mode, setMode] = useState<Mode>("both");
  // Respostas acumuladas de ambos os exames
  const [answers, setAnswers] = useState<ExamAnswers>({ exam1: {}, exam2: {} });

  // Handler chamado ao finalizar a PSS-10
  // Se mode="both", avança para EET; caso contrário, vai direto para resultados
  const handleFinishExam1 = useCallback((a: Record<string, number>) => {
    setAnswers((prev) => ({ ...prev, exam1: a }));
    setPhase((prev) => mode === "both" ? "exam2" : "results");
    scrollTop();
  }, [mode]);

  // Handler chamado ao finalizar a EET — sempre vai para resultados
  const handleFinishExam2 = useCallback((a: Record<string, number>) => {
    setAnswers((prev) => ({ ...prev, exam2: a }));
    setPhase("results");
    scrollTop();
  }, []);

  // Handler para iniciar as escalas conforme o modo escolhido
  // Reseta as respostas e navega para o primeiro exame apropriado
  const startExams = useCallback((selectedMode: Mode) => {
    setMode(selectedMode);
    setAnswers({ exam1: {}, exam2: {} });
    setPhase(selectedMode === "eet" ? "exam2" : "exam1");
    scrollTop();
  }, []);

  // Handler para reiniciar toda a aplicação (voltar à tela de boas-vindas)
  const restart = useCallback(() => {
    setAnswers({ exam1: {}, exam2: {} });
    setPhase("welcome");
    scrollTop();
  }, []);

  // Monta o array de resultados baseado no modo selecionado
  // Memoizado para evitar recriação desnecessária a cada render
  const results = useMemo(() => {
    const r = [];
    if (mode === "both" || mode === "pss10") r.push({ exam: exams[0], answers: answers.exam1 });
    if (mode === "both" || mode === "eet") r.push({ exam: exams[1], answers: answers.exam2 });
    return r;
  }, [mode, answers]);

  return (
    <div className="min-h-screen bg-background">
      <main className="px-4 py-10">
        {/* ══════════════════════════════════════════════════════
           FASE: WELCOME — Tela de boas-vindas
           ══════════════════════════════════════════════════════ */}
        {phase === "welcome" && (
          <>
            <div className="max-w-2xl mx-auto text-center">
              {/* Logo PROCISA */}
              <div className="flex items-center justify-center mb-8">
                <img src={procisaLogo} alt="Logo PROCISA" className="h-16 object-contain" />
              </div>

              {/* Hero section com gradiente */}
              <div className="gradient-hero rounded-2xl p-8 mb-8 border border-primary/10">
                <h2 className="text-4xl font-bold mb-3 tracking-tight">
                  Bem-vindo(a)
                </h2>
                <p className="text-muted-foreground text-base mb-2 max-w-lg mx-auto leading-relaxed">
                  Esta ferramenta possibilita a realização de escalas validadas para o levantamento de indicativos de estresse. Você pode realizar as escalas individualmente ou ambas em sequência.
                </p>
                <p className="text-muted-foreground text-sm max-w-lg mx-auto">
                  Ao final, será apresentado os escores obtidos com as respectivas classificações, podendo ser enviado por e-mail para registro pessoal.
                </p>
              </div>

              {/* Card de instruções gerais */}
              <div className="rounded-xl border border-border bg-card p-5 max-w-lg mx-auto mb-8 text-left card-elevated">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Info className="w-4 h-4 text-primary shrink-0" />
                  </div>
                  <p className="text-sm font-semibold">Instruções gerais</p>
                </div>
                <ul className="text-xs text-muted-foreground space-y-2 list-none pl-0">
                  <li className="flex gap-2"><span className="text-primary mt-0.5">•</span><span>Leia cada item com atenção e selecione a alternativa que melhor representa a sua percepção.</span></li>
                  <li className="flex gap-2"><span className="text-primary mt-0.5">•</span><span>Não existem respostas certas ou erradas — responda de acordo com o que você realmente sente ou vivencia.</span></li>
                  <li className="flex gap-2"><span className="text-primary mt-0.5">•</span><span>Todas as questões precisam ser respondidas para que o resultado seja calculado.</span></li>
                  <li className="flex gap-2"><span className="text-primary mt-0.5">•</span><span>Leve o tempo que for necessário.</span></li>
                  <li className="flex gap-2"><span className="text-primary mt-0.5">•</span><span className="font-semibold">Seus dados não são armazenados — os resultados são calculados localmente no seu dispositivo.</span></li>
                </ul>
              </div>

              {/* Cards descritivos das escalas (PSS-10 e EET) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-lg mx-auto mb-8">
                {/* Card PSS-10 */}
                <div className="rounded-xl border border-border bg-card p-5 text-left">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <HeartPulse className="w-4 h-4 text-primary" />
                    </div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Escala 01</p>
                  </div>
                  <p className="font-semibold text-sm mb-1.5">PSS-10 – Escala de Estresse Percebido</p>
                  <p className="text-muted-foreground text-left text-xs leading-relaxed">Busca conhecer informações acerca do construto de "Estresse autopercebido"</p>
                  <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1 bg-accent/50 px-2 py-0.5 rounded-full">{exams[0].questions.length} itens</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground/60 mt-3 leading-tight text-left">
                    Cohen, S., Kamarck, T., & Mermelstein, R. (1983); Siqueira Reis, R., Ferreira Hino, A. A., & Romélio Rodriguez Añez, C. (2010).
                  </p>
                </div>

                {/* Card EET */}
                <div className="rounded-xl border border-border bg-card p-5 text-left">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Briefcase className="w-4 h-4 text-primary" />
                    </div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Escala 02</p>
                  </div>
                  <p className="font-semibold text-sm mb-1.5">EET – Escala de Estresse no Trabalho</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">Busca melhor compreender o construto de "Estresse ocupacional"</p>
                  <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1 bg-accent/50 px-2 py-0.5 rounded-full">{exams[1].questions.length} itens</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground/60 mt-3 leading-tight">
                    PASCHOAL, T.; TAMAYO, A. (2004).
                  </p>
                </div>
              </div>

              {/* Botões de ação para iniciar as escalas */}
              <div className="flex flex-col gap-3 max-w-md mx-auto">
                {/* Botão principal — ambas as escalas */}
                <button
                  onClick={() => startExams("both")}
                  className="group relative w-full rounded-xl bg-gradient-to-r from-primary to-primary/80 text-primary-foreground px-5 py-4 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 overflow-hidden"
                >
                  {/* Efeito de brilho no hover */}
                  <span className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary-foreground/10 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                  <span className="relative flex items-center justify-center gap-2 text-sm sm:text-base">
                    Realizar ambas as escalas
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <span className="relative flex items-center justify-center gap-1 text-[11px] sm:text-xs font-normal opacity-80 mt-1">
                    PSS-10 e EET · <Clock className="w-3 h-3 group-hover:animate-[spin_2s_ease-in-out_1]" /> ~10 min
                  </span>
                </button>

                {/* Botões secundários — escalas individuais */}
                <div className="grid grid-cols-2 gap-3">
                  {/* Botão PSS-10 */}
                  <button
                    onClick={() => startExams("pss10")}
                    className="group w-full rounded-xl border-2 border-border bg-card hover:border-primary/40 hover:bg-accent/30 px-3 sm:px-4 py-3.5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <span className="flex items-center justify-center gap-2 font-semibold text-[11px] sm:text-xs mb-1 group-hover:text-primary transition-colors duration-300">
                      <span className="sm:whitespace-nowrap">Realizar a<br className="sm:hidden" /> Escala PSS-10</span>
                      <ArrowRight className="w-3.5 h-3.5 shrink-0 group-hover:translate-x-1 transition-transform" />
                    </span>
                    <span className="flex items-center justify-center gap-1 text-[10px] sm:text-[11px] text-muted-foreground">
                      <Clock className="w-3 h-3 shrink-0 group-hover:animate-[spin_2s_ease-in-out_1]" />
                      <span>~3 min</span>
                    </span>
                  </button>

                  {/* Botão EET */}
                  <button
                    onClick={() => startExams("eet")}
                    className="group w-full rounded-xl border-2 border-border bg-card hover:border-primary/40 hover:bg-accent/30 px-3 sm:px-4 py-3.5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <span className="flex items-center justify-center gap-2 font-semibold text-[11px] sm:text-xs mb-1 group-hover:text-primary transition-colors duration-300">
                      <span className="sm:whitespace-nowrap">Realizar a<br className="sm:hidden" /> Escala EET</span>
                      <ArrowRight className="w-3.5 h-3.5 shrink-0 group-hover:translate-x-1 transition-transform" />
                    </span>
                    <span className="flex items-center justify-center gap-1 text-[10px] sm:text-[11px] text-muted-foreground">
                      <Clock className="w-3 h-3 shrink-0 group-hover:animate-[spin_2s_ease-in-out_1]" />
                      <span>~7 min</span>
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Seção Sobre (lazy loaded com Suspense) */}
            <Suspense fallback={<Skeleton className="h-64 w-full max-w-3xl mx-auto mt-16 rounded-xl" />}>
              <AboutSection />
            </Suspense>
          </>
        )}

        {/* ══════════════════════════════════════════════════════
           FASE: EXAM1 — Aplicação da PSS-10
           ══════════════════════════════════════════════════════ */}
        {phase === "exam1" && (
          <div className="max-w-2xl mx-auto">
            {/* Barra de logos institucional */}
            <div className="flex items-center justify-center gap-4 mb-6">
              <img src={procisaLogo} alt="Logo PROCISA" className="h-10 object-contain" />
              <div className="w-px h-8 bg-border" />
              <img src={ufrrLogo} alt="Brasão UFRR" className="h-10 object-contain" />
            </div>
            <QuizPlayer exam={exams[0]} onFinish={handleFinishExam1} />
          </div>
        )}

        {/* ══════════════════════════════════════════════════════
           FASE: EXAM2 — Aplicação da EET
           ══════════════════════════════════════════════════════ */}
        {phase === "exam2" && (
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-4 mb-6">
              <img src={procisaLogo} alt="Logo PROCISA" className="h-10 object-contain" />
              <div className="w-px h-8 bg-border" />
              <img src={ufrrLogo} alt="Brasão UFRR" className="h-10 object-contain" />
            </div>
            <QuizPlayer exam={exams[1]} onFinish={handleFinishExam2} />
          </div>
        )}

        {/* ══════════════════════════════════════════════════════
           FASE: RESULTS — Exibição dos resultados
           ══════════════════════════════════════════════════════ */}
        {phase === "results" && (
          <Suspense fallback={<Skeleton className="h-64 w-full max-w-3xl mx-auto rounded-xl" />}>
            <ResultsView results={results} mode={mode} onRestart={restart} />
          </Suspense>
        )}
      </main>

      {/* ══════════════════════════════════════════════════════
         FOOTER — Informações legais e referências
         ══════════════════════════════════════════════════════ */}
      <footer className="w-full border-t border-border bg-card mt-16 py-8 px-4">
        <div className="max-w-3xl mx-auto text-center text-[11px] text-muted-foreground/80 leading-relaxed space-y-4">
          {/* Logos no rodapé */}
          <div className="flex items-center justify-center gap-4 mb-4">
            <img src={procisaLogo} alt="Logo PROCISA" className="h-8 opacity-60" />
            <div className="w-px h-6 bg-border" />
            <img src={ufrrLogo} alt="Brasão UFRR" className="h-8 opacity-60" />
          </div>
          {/* Aviso sobre finalidade pedagógica */}
          <p className="font-semibold text-muted-foreground">Esta ferramenta tem finalidade exclusivamente pedagógica e/ou para fins de levantamento de informações acerca dos construtos de estresse.</p>
          <p>
            Todos os direitos sobre as escalas pertencem aos seus respectivos criadores. Qualquer uso com finalidade diferente da proposta por esse instrumento não é de responsabilidade dos criadores desta ferramenta.
          </p>
          {/* Créditos bibliográficos */}
          <div className="space-y-1 pt-2 border-t border-border/50">
            <p><strong>PSS-10</strong> Produzida por Cohen, S., Kamarck, T., &amp; Mermelstein, R. (1983). Adaptação e tradução por Siqueira Reis, R., Ferreira Hino, A. A., &amp; Romélio Rodriguez Añez, C. (2010).</p>
            <p><strong>EET</strong> Produzida por Paschoal, T. &amp; Tamayo, A. (2004).</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
```

---

### `src/pages/NotFound.tsx`

```tsx
// React Router para obter a rota atual
import { useLocation } from "react-router-dom";
// useEffect para efeitos colaterais (logging)
import { useEffect } from "react";

// Página 404 — exibida quando o usuário acessa uma rota inexistente
const NotFound = () => {
  // Obtém a localização atual (URL) do React Router
  const location = useLocation();

  // Loga o erro 404 no console para monitoramento/debugging
  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    // Layout centralizado ocupando tela inteira
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">404</h1>
        <p className="mb-4 text-xl text-muted-foreground">Oops! Page not found</p>
        {/* Link para retornar à página principal */}
        <a href="/" className="text-primary underline hover:text-primary/90">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
```

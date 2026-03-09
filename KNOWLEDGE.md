# KNOWLEDGE — Documento de Conhecimento Técnico

> Este documento descreve a arquitetura, princípios, padrões e código completo do projeto **Estresse PROCISA**, servindo como referência para continuidade do desenvolvimento.

---

## 1. Visão Geral do Projeto

**Estresse PROCISA** é uma ferramenta digital para aplicação das escalas PSS-10 (Estresse Percebido) e EET (Estresse no Trabalho). É uma Single Page Application (SPA) client-side — todos os cálculos são realizados no navegador do usuário, sem servidor ou banco de dados.

**URL publicada:** https://estresse-procisa.lovable.app

---

## 2. Princípios Fundamentais

### 2.1 Privacidade por Design
- Nenhum dado é enviado a servidor — cálculos 100% client-side
- Resultados podem ser enviados por e-mail (via `mailto:`) sem intermediário
- Conformidade com LGPD por ausência de coleta

### 2.2 Separação de Responsabilidades
- **Dados** (`data/exams.ts`) — definições de escalas, questões e scoring
- **Apresentação** (`QuestionCard`, `AboutSection`) — componentes visuais puros
- **Controle de fluxo** (`QuizPlayer`, `Index.tsx`) — lógica de navegação e estado
- **Infraestrutura UI** (`components/ui/`) — componentes padronizados shadcn/ui

### 2.3 Consistência Visual via Design System
- Todas as cores são tokens HSL semânticos (nunca hardcoded)
- Componentes de UI mantidos em local único (`components/ui/`)
- Estilos customizados restritos a utilitários no `index.css`

### 2.4 Performance Otimizada
- Lazy loading de componentes pesados (`ResultsView`, `AboutSection`)
- Memoização de componentes (`React.memo`) e cálculos (`useMemo`)
- Estabilização de callbacks (`useCallback`)
- Imagens com `loading="lazy"`

---

## 3. Arquitetura de Arquivos

```
src/
├── main.tsx              → Bootstrap: monta App no DOM
├── App.tsx               → Roteamento (BrowserRouter)
├── index.css             → Design tokens + utilitários Tailwind
├── data/exams.ts         → Dados das escalas (questões, scoring)
├── pages/
│   ├── Index.tsx         → Página principal (máquina de estados)
│   └── NotFound.tsx      → Página 404
├── components/
│   ├── QuestionCard.tsx  → Card de questão (memoizado, reutilizável)
│   ├── QuizPlayer.tsx    → Controlador de questionário (reutilizável)
│   ├── ResultsView.tsx   → Tela de resultados (lazy loaded)
│   ├── AboutSection.tsx  → Seção institucional (lazy loaded)
│   └── ui/               → Componentes shadcn/ui padronizados
├── hooks/
│   ├── use-mobile.tsx    → Detecção de viewport mobile
│   └── use-toast.ts      → Re-export do hook de toast
├── lib/utils.ts          → Utilitário cn() (clsx + twMerge)
└── assets/               → Imagens (importadas como módulos ES6)
```

---

## 4. Máquina de Estados (Fluxo)

A página principal (`Index.tsx`) opera como uma máquina de estados finita:

```
Estado (phase)    Ação do usuário         Próximo estado
─────────────────────────────────────────────────────────
welcome           Clica "ambas"          → exam1
welcome           Clica "PSS-10"         → exam1
welcome           Clica "EET"            → exam2
exam1             Finaliza PSS-10        → exam2 (se mode="both") ou results
exam2             Finaliza EET           → results
results           Clica "Retornar"       → welcome
```

**Modos:**
- `both` — PSS-10 seguida de EET
- `pss10` — Apenas PSS-10
- `eet` — Apenas EET

---

## 5. Sistema de Scoring

### PSS-10
- 10 questões, opções de 0 a 4
- Itens 4, 5, 7, 8 são **invertidos** (4→0, 3→1, 2→2, 1→3, 0→4)
- Escore total: soma direta (0–40)
- Classificação: ≤18 Baixo | ≤24 Normal | ≤35 Alto | >35 Muito Alto

### EET
- 23 questões, opções de 1 a 5
- Nenhum item invertido
- Escore médio: soma / 23
- Classificação: <2.5 Baixo/Leve | =2.5 Médio | >2.5 Alto

---

## 6. Design System

### 6.1 Tokens de Cor (index.css)

Todas as cores são definidas como valores HSL puros (sem a função `hsl()`):

```css
--primary: 161 93% 30%;        /* Verde institucional PROCISA */
--primary-foreground: 151 80% 95%;
--success: 152 60% 40%;        /* Verde semântico */
--warning: 38 90% 55%;         /* Amarelo semântico */
--destructive: 0 72% 50%;      /* Vermelho semântico */
```

**Regra:** Nos componentes, SEMPRE usar classes Tailwind semânticas (`bg-primary`, `text-muted-foreground`) — nunca cores diretas.

### 6.2 Tipografia

| Variável | Fonte | Uso |
|----------|-------|-----|
| `--font-heading` | Space Grotesk | h1–h6 |
| `--font-body` | Inter | Corpo do texto |
| `--font-sans` | Work Sans | Font-family padrão Tailwind |
| `--font-serif` | Lora | Uso especial |
| `--font-mono` | Inconsolata | Código |

### 6.3 Utilitários Customizados

| Classe | Efeito |
|--------|--------|
| `.card-elevated` | Sombra + hover com elevação |
| `.gradient-hero` | Gradiente sutil para hero |
| `.gradient-primary-subtle` | Gradiente de fundo secundário |
| `.text-gradient-primary` | Texto com gradiente |

### 6.4 Tema Escuro

Tokens sobrescritos na classe `.dark` com valores adaptados para fundo escuro. Ativado via classe no `<html>`.

---

## 7. Componentes Reutilizáveis

### 7.1 QuestionCard
- **Entrada:** `Question`, opção selecionada, callback, labels, startFrom
- **Reutilização:** Qualquer escala Likert com N opções
- **Otimização:** `React.memo` — só re-renderiza se suas props mudarem

### 7.2 QuizPlayer
- **Entrada:** `Exam`, callback onFinish
- **Reutilização:** Qualquer exame definido em `exams.ts`
- **Responsabilidades:** Barra de progresso, lista de questões, referências, botão finalizar

### 7.3 ResultsView
- **Entrada:** Array de resultados, modo, callback restart
- **Responsabilidades:** Cálculo de escores, classificação, disclaimer, envio por e-mail
- **Otimização:** `React.memo` + `useMemo` + `useCallback`

### 7.4 Componentes UI (shadcn/ui)
Mantidos em `components/ui/` — editáveis mas com interface padronizada:
- `Button` — variantes: default, destructive, outline, secondary, ghost, link
- `Skeleton` — placeholder de carregamento
- `Toast/Toaster` — notificações
- `Tooltip` — dicas contextuais

**Princípio:** Um componente, um local. Importar de `components/ui/` para qualquer uso.

---

## 8. Otimização de Performance

### 8.1 Lazy Loading
```tsx
const ResultsView = lazy(() => import("@/components/ResultsView"));
const AboutSection = lazy(() => import("@/components/AboutSection"));
```
Com `<Suspense fallback={<Skeleton />}>` para placeholder visual.

### 8.2 Memoização
- `QuestionCard` → `React.memo()` (evita re-render ao responder outra questão)
- `ResultsView` → `React.memo()` (componente pesado)
- `results` em Index → `useMemo` (recalcula só quando `mode`/`answers` mudam)
- `computedResults` em ResultsView → `useMemo` (escores calculados uma vez)

### 8.3 Callbacks Estabilizados
Todos os handlers em `Index.tsx` usam `useCallback`:
- `handleFinishExam1`, `handleFinishExam2`, `startExams`, `restart`

### 8.4 CSS
- Fontes via `@import` no topo do CSS (antes de `@tailwind`)
- Utilitários Tailwind evitam CSS customizado desnecessário

---

## 9. Diretrizes para Banco de Dados (Desenvolvimento Futuro)

Quando integrar um backend (ex.: Lovable Cloud com Supabase), seguir estas práticas:

### 9.1 Ordem de Consultas
```
1. Autenticação     → auth.getSession()
2. RLS              → Políticas aplicadas automaticamente pelo Supabase
3. Seleção          → .select('coluna1, coluna2') — apenas colunas necessárias
4. Filtragem        → .eq(), .in(), .gte() — com índices
5. Ordenação        → .order('created_at', { ascending: false })
6. Paginação        → .range(0, 19) ou cursor-based
```

### 9.2 Caching
```ts
// Dados que mudam raramente (definições de escalas)
useQuery({
  queryKey: ['exams'],
  queryFn: fetchExams,
  staleTime: Infinity,    // Nunca refetch automático
  gcTime: 1000 * 60 * 60, // Cache por 1 hora
});

// Dados do usuário (respostas, resultados)
useQuery({
  queryKey: ['results', sessionId],
  queryFn: fetchResults,
  staleTime: 0, // Sempre buscar dados frescos
});

// Invalidação após mutação
const mutation = useMutation({
  mutationFn: saveResults,
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ['results'] }),
});
```

### 9.3 Lazy Loading de Dados
```ts
// Query condicional — só executa quando condition é true
useQuery({
  queryKey: ['exam-details', examId],
  queryFn: () => fetchExamDetails(examId),
  enabled: !!examId, // Só carrega quando examId existe
});

// Prefetch — carrega antecipadamente
queryClient.prefetchQuery({
  queryKey: ['exam', 'prova2'],
  queryFn: () => fetchExam('prova2'),
});
```

### 9.4 Segurança
- **RLS obrigatório** em todas as tabelas
- **Roles em tabela separada** (nunca no perfil)
- **Chaves privadas** em variáveis de ambiente (nunca no código)
- **Funções SECURITY DEFINER** para verificação de roles

---

## 10. Convenções de Código

1. **TypeScript estrito** — interfaces explícitas para props e dados
2. **Componentes funcionais** — sempre com hooks
3. **Exports default** para componentes de página e domínio
4. **Exports nomeados** para utilitários e componentes UI
5. **displayName** obrigatório em componentes memoizados
6. **Comentários** em português brasileiro

---

## 11. Código-Fonte Completo e Comentado

Abaixo, o código completo de cada arquivo com comentários minuciosos em português brasileiro.

---

### `src/main.tsx`

```tsx
// Ponto de entrada da aplicação React
// Importa createRoot do React 18 para renderização concorrente
import { createRoot } from "react-dom/client";
// Componente raiz que contém roteamento e provedores de contexto
import App from "./App.tsx";
// Estilos globais: tokens de design, Tailwind CSS e utilitários customizados
import "./index.css";

// Monta a árvore React no elemento DOM com id="root"
// O operador "!" (non-null assertion) indica ao TypeScript que o elemento existe
createRoot(document.getElementById("root")!).render(<App />);
```

---

### `src/App.tsx`

```tsx
// Componente raiz da aplicação
// Responsável por: provedores de contexto global e definição de rotas

// Sistema de notificações (dois provedores para flexibilidade)
import { Toaster } from "@/components/ui/toaster";       // Radix Toast
import { Toaster as Sonner } from "@/components/ui/sonner"; // Sonner
// Provedor de tooltips global (necessário para qualquer Tooltip funcionar)
import { TooltipProvider } from "@/components/ui/tooltip";
// React Router: gerencia navegação SPA sem recarregar a página
import { BrowserRouter, Routes, Route } from "react-router-dom";
// Páginas da aplicação
import Index from "./pages/Index";       // Tela principal
import NotFound from "./pages/NotFound"; // Página 404

const App = () => (
  // TooltipProvider envolve tudo para que tooltips funcionem em qualquer lugar
  <TooltipProvider>
    {/* Renderiza toasts ativos na tela */}
    <Toaster />
    <Sonner />
    {/* BrowserRouter usa a History API para navegação */}
    <BrowserRouter>
      <Routes>
        {/* "/" → Tela principal com escalas */}
        <Route path="/" element={<Index />} />
        {/* Qualquer outra rota → 404 */}
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
   IMPORTAÇÃO DE FONTES EXTERNAS
   IMPORTANTE: @import DEVE vir antes de @tailwind para evitar
   erro de build "import must precede all other statements"
   ══════════════════════════════════════════════════════════════ */
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap');
@import url("https://fonts.googleapis.com/css2?family=Work+Sans:wght@400;500;600;700&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Lora:wght@400;500;600;700&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Inconsolata:wght@400;700&display=swap");

/* Diretivas Tailwind: injetam reset (base), componentes e utilitários */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* ══════════════════════════════════════════════════════════════
   DESIGN TOKENS — TEMA CLARO (:root)
   Valores HSL puros (sem função hsl()) para compatibilidade com
   Tailwind CSS que adiciona hsl() automaticamente.
   ══════════════════════════════════════════════════════════════ */
@layer base {
  :root {
    /* Superfícies principais */
    --background: 160 15% 96%;        /* Fundo geral — verde muito claro */
    --foreground: 160 10% 9%;         /* Texto principal — quase preto */
    --card: 160 10% 99%;              /* Fundo de cards — branco suave */
    --card-foreground: 160 10% 9%;    /* Texto em cards */
    --popover: 160 8% 92%;            /* Fundo de menus/popovers */
    --popover-foreground: 160 10% 9%;

    /* Cor primária — Verde institucional PROCISA */
    --primary: 161 93% 30%;           /* Verde escuro saturado */
    --primary-foreground: 151 80% 95%;/* Texto claro sobre verde */

    /* Cores secundárias */
    --secondary: 160 8% 90%;          /* Cinza esverdeado claro */
    --secondary-foreground: 160 10% 15%;

    /* Textos mutados (secundários) */
    --muted: 160 5% 63%;              /* Cinza médio */
    --muted-foreground: 160 5% 35%;   /* Cinza escuro para texto */

    /* Acentuação */
    --accent: 166 76% 96%;            /* Verde muito claro para destaques */
    --accent-foreground: 173 80% 30%;

    /* Cores semânticas de status */
    --destructive: 0 72% 50%;           /* Vermelho para erros */
    --destructive-foreground: 0 85% 97%;
    --success: 152 60% 40%;             /* Verde para sucesso */
    --success-foreground: 0 0% 100%;
    --warning: 38 90% 55%;              /* Amarelo/laranja para avisos */
    --warning-foreground: 0 0% 100%;

    /* Bordas e inputs */
    --border: 160 10% 86%;
    --input: 160 10% 86%;
    --ring: 161 93% 30%;               /* Cor do anel de foco */
    --radius: 0.75rem;                 /* Raio padrão de borda (12px) */

    /* Efeitos visuais */
    --primary-glow: 158 64% 51%;       /* Verde mais claro para gradientes */
    --gradient-hero: linear-gradient(135deg, hsl(161 93% 30% / 0.08), hsl(166 76% 96% / 0.5));
    --shadow-card: 0 2px 12px -4px hsl(161 93% 30% / 0.1), 0 1px 4px -2px hsl(0 0% 0% / 0.06);
    --shadow-card-hover: 0 8px 24px -8px hsl(161 93% 30% / 0.15), 0 2px 8px -2px hsl(0 0% 0% / 0.08);

    /* Fontes */
    --font-heading: 'Space Grotesk', sans-serif;
    --font-body: 'Inter', sans-serif;
    --font-sans: 'Work Sans', ui-sans-serif, system-ui, sans-serif;
    --font-serif: 'Lora', ui-serif, Georgia, serif;
    --font-mono: 'Inconsolata', ui-monospace, monospace;

    /* Cores para gráficos (futuro) */
    --chart-1: 158 64% 51%;
    --chart-2: 141 69% 58%;
    --chart-3: 172 66% 50%;
    --chart-4: 82 77% 55%;
    --chart-5: 0 0% 45%;

    /* Sidebar (reservado para expansão futura) */
    --sidebar-background: 0 0% 98%;
    --sidebar-foreground: 0 0% 9%;
    --sidebar-primary: 161 93% 30%;
    --sidebar-primary-foreground: 151 80% 95%;
    --sidebar-accent: 0 0% 32%;
    --sidebar-accent-foreground: 0 0% 98%;
    --sidebar-border: 0 0% 83%;
    --sidebar-ring: 161 93% 30%;
    --sidebar: 0 0% 98%;

    /* Escala de sombras utilitárias */
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
     Ativado adicionando classe "dark" ao <html>
     ══════════════════════════════════════════════════════════════ */
  .dark {
    --background: 160 10% 7%;
    --foreground: 160 5% 96%;
    --card: 160 8% 11%;
    --card-foreground: 160 5% 96%;
    --popover: 160 6% 18%;
    --popover-foreground: 160 5% 96%;
    --primary: 158 64% 51%;
    --primary-foreground: 165 91% 9%;
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
   ESTILOS BASE GLOBAIS
   ══════════════════════════════════════════════════════════════ */
@layer base {
  /* Borda padrão em todos os elementos */
  * {
    @apply border-border;
  }
  /* Corpo: fundo e texto usando tokens semânticos */
  body {
    @apply bg-background text-foreground;
    font-family: var(--font-body);
  }
  /* Headings com fonte distinta */
  h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-heading);
  }
}

/* ══════════════════════════════════════════════════════════════
   UTILITÁRIOS CUSTOMIZADOS
   ══════════════════════════════════════════════════════════════ */
@layer utilities {
  /* Card com sombra e efeito de elevação no hover */
  .card-elevated {
    box-shadow: var(--shadow-card);
    transition: box-shadow 0.3s ease, transform 0.3s ease;
  }
  .card-elevated:hover {
    box-shadow: var(--shadow-card-hover);
    transform: translateY(-2px);
  }
  /* Gradiente sutil para hero sections */
  .gradient-hero {
    background: var(--gradient-hero);
  }
  /* Gradiente primário sutil para fundos */
  .gradient-primary-subtle {
    background: linear-gradient(135deg, hsl(var(--primary) / 0.06), hsl(var(--accent) / 0.4));
  }
  /* Texto com efeito de gradiente */
  .text-gradient-primary {
    background: linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary-glow)));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
}
```

---

### `src/data/exams.ts`

```ts
// ══════════════════════════════════════════════════════════════
// DEFINIÇÃO DAS ESCALAS (EXAMES)
// Contém: interfaces, textos das questões, configuração dos exames
// e função de cálculo de pontuação (com suporte a itens invertidos)
// ══════════════════════════════════════════════════════════════

// Estrutura de uma questão individual
export interface Question {
  id: string;         // Identificador único (formato: "p1q1", "p2q15", etc.)
  text: string;       // Texto completo apresentado ao usuário
  numOptions: number;  // Quantidade de alternativas disponíveis
  inverted: boolean;   // Se true, a pontuação é invertida (PSS-10 itens 4,5,7,8)
}

// Estrutura de um exame completo
export interface Exam {
  id: string;             // "prova1" (PSS-10) ou "prova2" (EET)
  title: string;          // Título completo da escala
  description: string;    // Resumo curto exibido sob o título
  instructions?: string;  // Instruções detalhadas (texto longo, com \n para quebras)
  optionLabels?: string[]; // Rótulos descritivos para cada valor numérico
  startFrom?: number;     // Valor da primeira opção (0 para PSS-10, 1 para EET)
  questions: Question[];  // Lista de questões
}

// Gera um array de Question a partir de parâmetros padronizados
// Facilita a criação de muitas questões com estrutura similar
function generateQuestions(
  prefix: string,            // Prefixo do id (ex: "p1" para PSS-10)
  count: number,             // Quantidade de questões
  numOptions: number,         // Opções por questão
  invertedItems: number[] = [], // Números dos itens invertidos (1-indexed)
  texts?: string[]           // Textos das questões
): Question[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `${prefix}q${i + 1}`,                     // Ex: "p1q1", "p1q2"
    text: texts?.[i] ?? `Item ${i + 1}`,           // Texto ou fallback genérico
    numOptions,
    inverted: invertedItems.includes(i + 1),        // i é 0-indexed, itens são 1-indexed
  }));
}

// ── TEXTOS PSS-10 ──
// 10 questões sobre estresse percebido nos últimos 30 dias
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

// ── TEXTOS EET ──
// 23 questões sobre estresse no ambiente de trabalho
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

// ══════════════════════════════════════════════════════════════
// CONFIGURAÇÃO DOS EXAMES
// ══════════════════════════════════════════════════════════════
export const exams: Exam[] = [
  {
    id: "prova1",
    title: "PSS-10 – Escala de Estresse Percebido",
    description: "10 itens · Alternativas de 0 a 4.",
    instructions: "As questões nesta escala perguntam a respeito dos seus sentimentos e pensamentos durante os últimos 30 dias (último mês). Em cada questão, indique a frequência com que você se sentiu ou pensou a respeito da situação vivenciada, seguindo a escala abaixo:\n\n0 – Nunca | 1 – Quase Nunca | 2 – Às Vezes | 3 – Pouco Frequente | 4 – Muito Frequente",
    optionLabels: ["Nunca", "Quase Nunca", "Às Vezes", "Pouco Frequente", "Muito Frequente"],
    // PSS-10: opções de 0 a 4; itens 4, 5, 7, 8 são invertidos
    questions: generateQuestions("p1", 10, 5, [4, 5, 7, 8], pss10Texts),
  },
  {
    id: "prova2",
    title: "EET – Escala de Estresse no Trabalho",
    description: "23 itens · Alternativas de 1 a 5",
    instructions: "As questões nesta escala listam várias situações que podem ocorrer no dia a dia de seu trabalho. Leia com atenção cada afirmativa e utilize a escala apresentada a seguir para dar sua opinião sobre cada uma delas:\n\n1 – Discordo Totalmente | 2 – Discordo | 3 – Concordo em Parte | 4 – Concordo | 5 – Concordo Totalmente\n\nPara cada item, marque o número que melhor corresponde à sua resposta.\nAo marcar o número 1, você indica discordar totalmente da afirmativa.\nAssinalando o número 5, você indica concordar totalmente com a afirmativa.\nObserve que, quanto menor o número, mais você discorda da afirmativa e, quanto maior o número, mais você concorda com a afirmativa.",
    // Índice 0 vazio pois a EET começa em 1
    optionLabels: ["", "Discordo Totalmente", "Discordo", "Concordo em parte", "Concordo", "Concordo Totalmente"],
    startFrom: 1, // Opções começam em 1
    // EET: 23 questões sem itens invertidos
    questions: generateQuestions("p2", 23, 5, [], eetTexts),
  },
];

// Calcula a pontuação individual de uma questão
// Para itens invertidos: inverte o valor (máximo - valor selecionado)
// Para itens normais: retorna o valor diretamente
export function getScore(question: Question, selectedValue: number): number {
  if (question.inverted) {
    return (question.numOptions - 1) - selectedValue;
  }
  return selectedValue;
}
```

---

### `src/pages/Index.tsx`

```tsx
// ══════════════════════════════════════════════════════════════
// PÁGINA PRINCIPAL — Orquestrador central da aplicação
// Implementa uma máquina de estados com 4 fases:
// welcome → exam1 → exam2 → results
// ══════════════════════════════════════════════════════════════

// Hooks do React utilizados
import { useState, useCallback, useMemo, lazy, Suspense } from "react";
// Dados das escalas
import { exams } from "@/data/exams";
// Componente de questionário (importação estática — sempre necessário)
import QuizPlayer from "@/components/QuizPlayer";
// Ícones temáticos do Lucide
import { ArrowRight, HeartPulse, Briefcase, Info, Clock } from "lucide-react";
// Componente de placeholder visual durante carregamento
import { Skeleton } from "@/components/ui/skeleton";
// Logos institucionais importados como módulos ES6
import procisaLogo from "@/assets/procisa-logo.png";
import ufrrLogo from "@/assets/ufrr-logo.png";

// ── Lazy Loading ──
// Componentes pesados carregados sob demanda para reduzir bundle inicial
const ResultsView = lazy(() => import("@/components/ResultsView"));
const AboutSection = lazy(() => import("@/components/AboutSection"));

// ── Tipos ──
type Phase = "welcome" | "exam1" | "exam2" | "results"; // Estados possíveis
type Mode = "both" | "pss10" | "eet";                    // Modos de aplicação

// Armazena respostas de ambos os exames
interface ExamAnswers {
  exam1: Record<string, number>;  // Chave: id da questão, Valor: opção selecionada
  exam2: Record<string, number>;
}

// Função utilitária — rola suavemente ao topo após transição de fase
const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

const Index = () => {
  // ── Estado central ──
  const [phase, setPhase] = useState<Phase>("welcome");
  const [mode, setMode] = useState<Mode>("both");
  const [answers, setAnswers] = useState<ExamAnswers>({ exam1: {}, exam2: {} });

  // ── Handlers (estabilizados com useCallback) ──

  // Ao finalizar PSS-10: salva respostas e avança
  const handleFinishExam1 = useCallback((a: Record<string, number>) => {
    setAnswers((prev) => ({ ...prev, exam1: a }));
    // Se modo "both", vai para EET; senão, vai direto aos resultados
    setPhase((prev) => mode === "both" ? "exam2" : "results");
    scrollTop();
  }, [mode]);

  // Ao finalizar EET: salva respostas e vai aos resultados
  const handleFinishExam2 = useCallback((a: Record<string, number>) => {
    setAnswers((prev) => ({ ...prev, exam2: a }));
    setPhase("results");
    scrollTop();
  }, []);

  // Inicia os exames: limpa respostas anteriores e define fase inicial
  const startExams = useCallback((selectedMode: Mode) => {
    setMode(selectedMode);
    setAnswers({ exam1: {}, exam2: {} });
    // Se modo "eet", pula direto para exam2
    setPhase(selectedMode === "eet" ? "exam2" : "exam1");
    scrollTop();
  }, []);

  // Reinicia tudo — volta à tela de boas-vindas
  const restart = useCallback(() => {
    setAnswers({ exam1: {}, exam2: {} });
    setPhase("welcome");
    scrollTop();
  }, []);

  // Monta array de resultados conforme o modo
  // useMemo: só recalcula se mode ou answers mudarem
  const results = useMemo(() => {
    const r = [];
    if (mode === "both" || mode === "pss10") r.push({ exam: exams[0], answers: answers.exam1 });
    if (mode === "both" || mode === "eet") r.push({ exam: exams[1], answers: answers.exam2 });
    return r;
  }, [mode, answers]);

  return (
    <div className="min-h-screen bg-background">
      <main className="px-4 py-10">

        {/* ══════ FASE WELCOME ══════ */}
        {phase === "welcome" && (
          <>
            <div className="max-w-2xl mx-auto text-center">
              {/* Logo institucional */}
              <div className="flex items-center justify-center mb-8">
                <img src={procisaLogo} alt="Logo PROCISA" className="h-16 object-contain" />
              </div>

              {/* Seção hero com gradiente sutil */}
              <div className="gradient-hero rounded-2xl p-8 mb-8 border border-primary/10">
                <h2 className="text-4xl font-bold mb-3 tracking-tight">Bem-vindo(a)</h2>
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

              {/* Cartões descritivos das escalas */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-lg mx-auto mb-8">
                {/* PSS-10 */}
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
                {/* EET */}
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

              {/* Botões de ação */}
              <div className="flex flex-col gap-3 max-w-md mx-auto">
                {/* Botão principal: ambas as escalas */}
                <button
                  onClick={() => startExams("both")}
                  className="group relative w-full rounded-xl bg-gradient-to-r from-primary to-primary/80 text-primary-foreground px-5 py-4 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 overflow-hidden"
                >
                  {/* Efeito de brilho deslizante no hover */}
                  <span className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary-foreground/10 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                  <span className="relative flex items-center justify-center gap-2 text-sm sm:text-base">
                    Realizar ambas as escalas
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <span className="relative flex items-center justify-center gap-1 text-[11px] sm:text-xs font-normal opacity-80 mt-1">
                    PSS-10 e EET · <Clock className="w-3 h-3" /> ~10 min
                  </span>
                </button>

                {/* Botões individuais em grid 2 colunas */}
                <div className="grid grid-cols-2 gap-3">
                  {/* PSS-10 individual */}
                  <button
                    onClick={() => startExams("pss10")}
                    className="group w-full rounded-xl border-2 border-border bg-card hover:border-primary/40 hover:bg-accent/30 px-3 sm:px-4 py-3.5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <span className="flex items-center justify-center gap-2 font-semibold text-[11px] sm:text-xs mb-1 group-hover:text-primary transition-colors duration-300">
                      {/* sm:whitespace-nowrap → texto em 1 linha no desktop */}
                      {/* br.sm:hidden → quebra linha apenas no mobile */}
                      <span className="sm:whitespace-nowrap">Realizar a<br className="sm:hidden" /> Escala PSS-10</span>
                      <ArrowRight className="w-3.5 h-3.5 shrink-0 group-hover:translate-x-1 transition-transform" />
                    </span>
                    <span className="flex items-center justify-center gap-1 text-[10px] sm:text-[11px] text-muted-foreground">
                      <Clock className="w-3 h-3 shrink-0 group-hover:animate-[spin_2s_ease-in-out_1]" />
                      <span>~3 min</span>
                    </span>
                  </button>
                  {/* EET individual */}
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

            {/* Seção Sobre — lazy loaded com Skeleton como fallback */}
            <Suspense fallback={<Skeleton className="h-64 w-full max-w-3xl mx-auto mt-16 rounded-xl" />}>
              <AboutSection />
            </Suspense>
          </>
        )}

        {/* ══════ FASE EXAM1 (PSS-10) ══════ */}
        {phase === "exam1" && (
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-4 mb-6">
              <img src={procisaLogo} alt="Logo PROCISA" className="h-10 object-contain" />
              <div className="w-px h-8 bg-border" />
              <img src={ufrrLogo} alt="Brasão UFRR" className="h-10 object-contain" />
            </div>
            <QuizPlayer exam={exams[0]} onFinish={handleFinishExam1} />
          </div>
        )}

        {/* ══════ FASE EXAM2 (EET) ══════ */}
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

        {/* ══════ FASE RESULTS ══════ */}
        {phase === "results" && (
          <Suspense fallback={<Skeleton className="h-64 w-full max-w-3xl mx-auto rounded-xl" />}>
            <ResultsView results={results} mode={mode} onRestart={restart} />
          </Suspense>
        )}
      </main>

      {/* ══════ FOOTER ══════ */}
      <footer className="w-full border-t border-border bg-card mt-16 py-8 px-4">
        <div className="max-w-3xl mx-auto text-center text-[11px] text-muted-foreground/80 leading-relaxed space-y-4">
          <div className="flex items-center justify-center gap-4 mb-4">
            <img src={procisaLogo} alt="Logo PROCISA" className="h-8 opacity-60" />
            <div className="w-px h-6 bg-border" />
            <img src={ufrrLogo} alt="Brasão UFRR" className="h-8 opacity-60" />
          </div>
          <p className="font-semibold text-muted-foreground">Esta ferramenta tem finalidade exclusivamente pedagógica e/ou para fins de levantamento de informações acerca dos construtos de estresse.</p>
          <p>Todos os direitos sobre as escalas pertencem aos seus respectivos criadores. Qualquer uso com finalidade diferente da proposta por esse instrumento não é de responsabilidade dos criadores desta ferramenta.</p>
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

### `src/components/QuizPlayer.tsx`

```tsx
// ══════════════════════════════════════════════════════════════
// QUIZPLAYER — Controlador de fluxo do questionário
// Gerencia: estado de respostas, barra de progresso, renderização
// das questões e botão de finalização.
// REUTILIZÁVEL: funciona com qualquer Exam definido em exams.ts
// ══════════════════════════════════════════════════════════════

import { useState, useCallback } from "react";
import { Exam } from "@/data/exams";
import QuestionCard from "./QuestionCard";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

interface QuizPlayerProps {
  exam: Exam;                                        // Exame a ser aplicado
  onFinish: (answers: Record<string, number>) => void; // Callback com respostas finais
}

const QuizPlayer = ({ exam, onFinish }: QuizPlayerProps) => {
  // Mapa de respostas: { "p1q1": 3, "p1q2": 1, ... }
  const [answers, setAnswers] = useState<Record<string, number>>({});

  const total = exam.questions.length;
  const answered = Object.keys(answers).length;
  const allAnswered = answered === total;

  // Registra resposta — useCallback para estabilidade referencial
  const selectAnswer = useCallback((questionId: string, value: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Título e instruções */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-1">{exam.title}</h2>
        <p className="text-muted-foreground text-sm mb-3">{exam.description}</p>
        {exam.instructions && (
          <div className="rounded-lg border border-border bg-secondary/40 p-4 text-sm text-foreground whitespace-pre-line">
            {exam.instructions}
          </div>
        )}
      </div>

      {/* Barra de progresso */}
      <div className="w-full h-2.5 rounded-full bg-secondary/40 mb-2 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary to-primary/70 transition-all duration-500 ease-out"
          style={{ width: `${(answered / total) * 100}%` }}
        />
      </div>
      <p className="text-xs text-muted-foreground mb-8">{answered} de {total} respondidos</p>

      {/* Lista de questões */}
      <div className="space-y-6">
        {exam.questions.map((question, idx) => (
          <div key={question.id}>
            <div className="mb-2 text-sm text-muted-foreground">
              <span>Questão {idx + 1}</span>
            </div>
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

      {/* Referências bibliográficas */}
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

      {/* Botão finalizar — desabilitado até todas serem respondidas */}
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

### `src/components/QuestionCard.tsx`

```tsx
// ══════════════════════════════════════════════════════════════
// QUESTIONCARD — Card de questão individual
// MEMOIZADO com React.memo para evitar re-renderizações quando
// o usuário responde OUTRAS questões (somente re-renderiza se
// suas próprias props mudarem).
// REUTILIZÁVEL: funciona com qualquer escala Likert
// ══════════════════════════════════════════════════════════════

import { memo } from "react";
import { Question } from "@/data/exams";
import { cn } from "@/lib/utils";

interface QuestionCardProps {
  question: Question;            // Dados da questão
  selectedOption: number | null;  // Opção selecionada (null = nenhuma)
  onSelect: (value: number) => void; // Callback ao clicar numa opção
  optionLabels?: string[];       // Rótulos textuais para cada valor
  startFrom?: number;            // Valor inicial (0 ou 1)
}

const QuestionCard = memo(({ question, selectedOption, onSelect, optionLabels, startFrom = 0 }: QuestionCardProps) => {
  // Gera array de valores possíveis
  // startFrom=0, numOptions=5 → [0,1,2,3,4]
  // startFrom=1, numOptions=5 → [1,2,3,4,5]
  const options = Array.from({ length: question.numOptions }, (_, i) => i + startFrom);

  return (
    <div className="rounded-xl bg-card border border-border p-6 card-elevated">
      <h3 className="text-lg font-semibold mb-1 leading-relaxed">{question.text}</h3>
      {/* Espaçador invisível para itens invertidos (mantém layout consistente) */}
      {question.inverted && (
        <p className="text-xs text-muted-foreground mb-4 italic">​</p>
      )}
      {/* Grid de botões de opção */}
      <div className="grid grid-cols-5 sm:flex sm:flex-wrap gap-2 sm:gap-3">
        {options.map((value) => {
          const isSelected = selectedOption === value;
          return (
            <button
              key={value}
              onClick={() => onSelect(value)}
              className={cn(
                "min-w-12 h-auto rounded-lg border-2 transition-all duration-200 flex flex-col items-center justify-center text-sm font-bold px-3 py-2 gap-1",
                isSelected
                  ? "border-primary bg-primary text-primary-foreground shadow-sm"
                  : "border-border hover:border-primary/40 hover:bg-secondary/60 text-muted-foreground"
              )}>
              <span>{value}</span>
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

QuestionCard.displayName = "QuestionCard";
export default QuestionCard;
```

---

### `src/components/ResultsView.tsx`

```tsx
// ══════════════════════════════════════════════════════════════
// RESULTSVIEW — Exibição dos resultados das escalas
// Calcula escores, classifica níveis, exibe disclaimers e
// permite envio por e-mail via mailto:
// MEMOIZADO com React.memo
// ══════════════════════════════════════════════════════════════

import { memo, useMemo, useCallback } from "react";
import { Exam, getScore } from "@/data/exams";
import { Home, AlertTriangle, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import procisaLogo from "@/assets/procisa-logo.png";
import ufrrLogo from "@/assets/ufrr-logo.png";

interface ExamResult { exam: Exam; answers: Record<string, number>; }
interface ResultsViewProps {
  results: ExamResult[];
  mode: "both" | "pss10" | "eet";
  onRestart: () => void;
}

// Classificação PSS-10 (baseada em Oliveira et al., 2021)
const getPSSLevel = (score: number) => {
  if (score <= 18) return { label: "Estresse Baixo", color: "text-success" };
  if (score <= 24) return { label: "Estresse Normal", color: "text-warning" };
  if (score <= 35) return { label: "Estresse Alto", color: "text-destructive/80" };
  return { label: "Estresse Muito Alto", color: "text-destructive" };
};

// Classificação EET (baseada em Paschoal & Tamayo, 2004)
const getEETLevel = (avg: number) => {
  if (avg < 2.5) return { label: "Estresse Baixo ou Leve", color: "text-success" };
  if (avg === 2.5) return { label: "Estresse Médio/Considerável", color: "text-warning" };
  return { label: "Estresse Alto", color: "text-destructive" };
};

// Versões texto puro para o corpo do e-mail
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

// Disclaimers adaptados ao modo de aplicação
const DISCLAIMERS: Record<string, string> = {
  both: `Estas escalas são ferramentas úteis apenas para medir possíveis INDICATIVOS do Estresse Percebido e do Estresse No Trabalho, deste modo, NÃO DEVEM SER UTILIZADAS como ferramentas para o diagnóstico. Cabe lembrar que tais instrumentos não são de uso privativo.\n\nCaso você perceba que o estresse está sendo prejudicial e atrapalhando seu bem-estar procure ajuda qualificada.`,
  pss10: `Esta escala é uma ferramenta útil para medir possíveis INDICATIVOS de Estresse Percebido, deste modo, NÃO DEVE SER UTILIZADA como ferramenta para o diagnóstico. Cabe lembrar que tal instrumento não é de uso privativo.\n\nCaso você perceba que o estresse está sendo prejudicial e atrapalhando seu bem-estar procure ajuda qualificada.`,
  eet: `Esta escala é uma ferramenta útil para medir possíveis INDICATIVOS de Estresse No Trabalho, deste modo, NÃO DEVE SER UTILIZADA como ferramenta para o diagnóstico. Cabe lembrar que tal instrumento não é de uso privativo.\n\nCaso você perceba que o estresse está sendo prejudicial e atrapalhando seu bem-estar procure ajuda qualificada.`,
};

const ResultsView = memo(({ results, mode, onRestart }: ResultsViewProps) => {
  const disclaimer = DISCLAIMERS[mode];

  // Calcula escores — memoizado para evitar recálculos
  const computedResults = useMemo(() =>
    results.map(({ exam, answers }) => {
      const totalScore = exam.questions.reduce((sum, q) => {
        const selected = answers[q.id];
        return sum + (selected != null ? getScore(q, selected) : 0);
      }, 0);
      const eetAvg = exam.id === "prova2" ? parseFloat((totalScore / 23).toFixed(2)) : null;
      return { exam, totalScore, eetAvg };
    }), [results]
  );

  // Monta corpo do e-mail com resultados, referências e aviso LGPD
  const buildEmailBody = useCallback(() => {
    const now = new Date();
    const dataHora = now.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" })
      + " às " + now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

    let body = "RESULTADO FINAL - Escalas de Estresse (PROCISA/UFRR)\n";
    body += "Escores obtidos nas escalas aplicadas\n";
    body += `Data e hora da realização: ${dataHora}\n\n`;

    computedResults.forEach(({ exam, totalScore, eetAvg }) => {
      body += `━━━ ${exam.title} ━━━\n\n`;
      if (exam.id === "prova1") {
        body += `Escore Total: ${totalScore}\nClassificação: ${getPSSLevelText(totalScore)}\n\n`;
        body += `Os resultados aqui apresentados foram organizados e categorizados a partir do trabalho de OLIVEIRA, J. C. et al. The impact of COVID-19 on the physical and emotional health of health professionals in the municipality of Baixada Maranhense. Research, Society and Development, v. 10, n. 10, 2021. p. e163101018744.\n\n`;
      }
      if (exam.id === "prova2" && eetAvg != null) {
        body += `Escore Médio: ${eetAvg.toFixed(2)}\nClassificação: ${getEETLevelText(eetAvg)}\n\n`;
        body += `Os resultados aqui apresentados foram organizados e categorizados a partir do trabalho de: PASCHOAL, T.; TAMAYO, A. Validação da escala de estresse no trabalho. Estudos de Psicologia (Natal), v. 9, n. 1, p. 45-52, 2004.\n\n`;
      }
    });

    body += "---\n\n" + disclaimer + "\n\n---\n\nREFERÊNCIAS\n\n";
    if (mode === "both" || mode === "pss10") {
      body += "PSS-10:\nCohen, S., Kamarck, T., & Mermelstein, R. (1983). A global measure of perceived stress. Journal of Health and Social Behavior, 24(4), 385-396.\nSiqueira Reis, R., Ferreira Hino, A. A., & Romélio Rodriguez Añez, C. (2010). Perceived Stress Scale: Reliability and validity study in Brazil. Journal of Health Psychology, 15(1), 107-114.\n\n";
    }
    if (mode === "both" || mode === "eet") {
      body += "EET:\nPaschoal, T., & Tamayo, A. (2004). Validação da Escala de Estresse no Trabalho. Estudos de Psicologia, 9(1), 45-52.\n\n";
    }
    body += "---\n\nAVISO SOBRE PROTEÇÃO DE DADOS\n\n";
    body += "Os dados apresentados neste relatório foram produzidos e coletados em conformidade com a Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018 – LGPD). ";
    body += "As informações aqui contidas são de caráter pessoal e confidencial, destinando-se exclusivamente ao titular dos dados ou a profissional por ele autorizado. ";
    body += "O compartilhamento, a reprodução ou a divulgação deste conteúdo a terceiros sem o consentimento do titular é de inteira responsabilidade de quem o fizer. ";
    body += "Recomenda-se o armazenamento seguro deste documento e o descarte adequado quando não mais necessário.";
    return body;
  }, [computedResults, disclaimer, mode]);

  // Abre cliente de e-mail nativo com corpo pré-preenchido
  const handleSendEmail = useCallback(() => {
    const subject = encodeURIComponent("Resultado - Escalas de Estresse (PROCISA)");
    const body = encodeURIComponent(buildEmailBody());
    window.open(`mailto:?subject=${subject}&body=${body}`, "_self");
  }, [buildEmailBody]);

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Cabeçalho */}
      <div className="text-center mb-10">
        <div className="flex items-center justify-center gap-4 mb-4">
          <img src={procisaLogo} alt="Logo PROCISA" className="h-14 object-contain" />
          <div className="w-px h-10 bg-border" />
          <img src={ufrrLogo} alt="Brasão UFRR" className="h-14 object-contain" />
        </div>
        <h2 className="text-3xl font-bold mb-2">Resultado Final</h2>
        <p className="text-muted-foreground">Escores obtidos nas escalas aplicadas</p>
      </div>

      {/* Cards de resultado */}
      <div className="grid gap-8">
        {computedResults.map(({ exam, totalScore, eetAvg }) => {
          const stressLevel = exam.id === "prova1" ? getPSSLevel(totalScore) : null;
          const eetStressLevel = eetAvg != null ? getEETLevel(eetAvg) : null;
          return (
            <div key={exam.id} className="rounded-xl bg-card border border-border p-6 card-elevated">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-xl font-bold">{exam.title}</h3>
                <div className="text-right">
                  {exam.id === "prova1" && (<><p className="text-xs text-muted-foreground uppercase tracking-wide">Escore Total</p><p className="text-3xl font-bold text-primary">{totalScore}</p></>)}
                  {exam.id === "prova2" && eetAvg != null && (<><p className="text-xs text-muted-foreground uppercase tracking-wide">Escore Médio</p><p className="text-3xl font-bold text-primary">{eetAvg.toFixed(2)}</p></>)}
                  {stressLevel && <p className={`text-sm font-semibold mt-1 ${stressLevel.color}`}>{stressLevel.label}</p>}
                  {eetStressLevel && <p className={`text-sm font-semibold mt-1 ${eetStressLevel.color}`}>{eetStressLevel.label}</p>}
                </div>
              </div>
              {exam.id === "prova1" && <p className="text-[11px] text-muted-foreground/70 leading-snug mt-2">Os resultados aqui apresentados foram organizados e categorizados a partir do trabalho de OLIVEIRA, J. C. et al. The impact of COVID-19 on the physical and emotional health of health professionals in the municipality of Baixada Maranhense. <em>Research, Society and Development</em>, v. 10, n. 10, 2021. p. e163101018744.</p>}
              {exam.id === "prova2" && <p className="text-[11px] text-muted-foreground/70 leading-snug mt-2">Os resultados aqui apresentados foram organizados e categorizados a partir do trabalho de: PASCHOAL, T.; TAMAYO, A. Validação da escala de estresse no trabalho. <em>Estudos de Psicologia (Natal)</em>, v. 9, n. 1, p. 45-52, 2004.</p>}
            </div>
          );
        })}
      </div>

      {/* Disclaimer */}
      <div className="rounded-xl border border-border bg-secondary/30 p-6 mt-8">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-warning mt-0.5 shrink-0" />
          <p className="text-sm text-muted-foreground whitespace-pre-line">{disclaimer}</p>
        </div>
      </div>

      {/* Botões de ação */}
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

ResultsView.displayName = "ResultsView";
export default ResultsView;
```

---

### `src/components/AboutSection.tsx`

```tsx
// ══════════════════════════════════════════════════════════════
// ABOUTSECTION — Informações institucionais e perfis dos autores
// Carregado via lazy loading (React.lazy) na tela inicial
// ══════════════════════════════════════════════════════════════

import procisaLogo from "@/assets/procisa-logo.png";
import ufrrLogo from "@/assets/ufrr-logo.png";
import edilanePhoto from "@/assets/edilane-photo.gif";
import italoPhoto from "@/assets/italo-photo.gif";

const AboutSection = () => {
  return (
    <section className="max-w-3xl mx-auto mt-16 mb-10">
      <h2 className="text-2xl font-bold text-center mb-6">Sobre</h2>

      {/* Descrição institucional */}
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
          Programa de Pós-graduação em Ciências da Saúde PROCISA – UFRR. Esta aplicação foi desenvolvida em estrita consonância com as diretrizes da Coordenação de Aperfeiçoamento de Pessoal de Nível Superior (CAPES) para a produção de Produtos Técnicos e Tecnológicos (PTT). Seu desenvolvimento fundamenta-se nos critérios de avaliação estabelecidos pelo Relatório do Grupo de Trabalho (GT) de Produção Técnica da CAPES de 2019.
        </p>
      </div>

      {/* Perfis dos autores */}
      <div className="grid gap-8 md:grid-cols-2">
        {/* Orientadora */}
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex flex-col items-center mb-4">
            <img src={edilanePhoto} alt="Profa. Dra. Edilane Nunes Régis Bezerra" loading="lazy" className="w-28 h-28 rounded-full object-cover border-2 border-primary/30 mb-3" />
            <h3 className="font-bold text-sm text-center">Prof.ª Dr.ª Edilane Nunes Régis Bezerra</h3>
            <p className="text-xs text-muted-foreground">Orientadora</p>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed text-justify">Edilane Nunes Régis Bezerra é psicóloga, professora e pesquisadora com ampla experiência na área da Psicologia Social e da Saúde. Doutora em Psicologia Social pela Universidade Federal da Paraíba (2017) e mestre em Psicologia pela Universidade Federal do Rio Grande do Norte (2008), atua como professora adjunta da Universidade Federal de Roraima (UFRR), onde integra o corpo docente do curso de Psicologia e do Programa de Pós-graduação em Ciências da Saúde (PROCISA).</p>
          <p className="text-xs text-muted-foreground leading-relaxed mt-2 text-justify">Na UFRR, coordena o Grupo de Pesquisa em Saúde Mental e Atenção Psicossocial e Primária, desenvolvendo estudos voltados para promoção da saúde, vulnerabilidades e saúde mental. Suas linhas de pesquisa abrangem temas como redes de atenção psicossocial (RAPS), clínica ampliada, reforma psiquiátrica, saúde mental na atenção básica, inserção e prática do psicólogo em políticas públicas de saúde e programas de intervenção comunitária.</p>
          <p className="text-xs text-muted-foreground leading-relaxed mt-2 text-justify">Além de tudo, Edilane contribui diretamente para a formação de novos profissionais e pesquisadores, consolidando sua atuação como referência na interface entre psicologia, saúde mental e políticas públicas. Sua trajetória reflete um compromisso com a construção de práticas de cuidado ampliadas e integradas, voltadas para a promoção da saúde e o fortalecimento das redes de atenção psicossocial.</p>
        </div>
        {/* Autor */}
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex flex-col items-center mb-4">
            <img src={italoPhoto} alt="Me. Ítalo Ribeiro Kunzler Machado Marques" loading="lazy" className="w-28 h-28 rounded-full object-cover border-2 border-primary/30 mb-3" />
            <h3 className="font-bold text-sm text-center">Me. Ítalo Ribeiro Kunzler Machado Marques</h3>
            <p className="text-xs text-muted-foreground">Autor</p>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed text-justify">Ítalo Ribeiro Kunzler Machado Marques é psicólogo e pesquisador com atuação prática em saúde mental e psicologia organizacional. Graduado em Psicologia pela Universidade Federal de Roraima (2021), onde também desenvolveu seu mestrado em Ciências da Saúde (2025), Ítalo complementou sua trajetória com especializações em Psicologia Organizacional (2023) e Gestão de Pessoas (2023) além de Saúde Mental (2022).</p>
          <p className="text-xs text-muted-foreground leading-relaxed mt-2 text-justify">Atualmente, exerce atividades profissionais em saúde mental e gestão de pessoas, com experiência em projetos voltados à população em situação de rua e pesquisas sobre narratividade e produção de subjetividade. Sua atuação combina prática clínica, pesquisa acadêmica e vivência institucional, refletindo um compromisso em promover o bem-estar psicológico em diferentes contextos sociais e organizacionais.</p>
          <p className="text-xs text-muted-foreground leading-relaxed mt-2 text-justify">Além de sua prática como psicólogo, Ítalo também realiza atividades docentes, contribuindo para a formação de novos profissionais e compartilhando sua experiência em temas relacionados à saúde mental, psicologia organizacional e ciências da saúde.</p>
          <p className="text-xs text-muted-foreground leading-relaxed mt-2 text-justify">Sua trajetória revela um profissional que transita entre ensino, pesquisa e prática, sempre com o objetivo de ampliar o alcance da psicologia e fortalecer sua contribuição para a sociedade.</p>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
```

---

### Arquivos de Configuração

Os arquivos `tailwind.config.ts`, `vite.config.ts`, `vitest.config.ts`, `postcss.config.js`, `eslint.config.js`, `components.json` e `package.json` estão documentados no README.md com comentários detalhados.

---

### `src/lib/utils.ts`

```ts
// Combina classes CSS condicionalmente
// clsx: aceita strings, arrays e objetos condicionais
// twMerge: resolve conflitos entre classes Tailwind (ex: "p-2 p-4" → "p-4")
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

---

### `src/hooks/use-mobile.tsx`

```tsx
// Hook para detectar viewport mobile (< 768px)
// Usa matchMedia API para escutar mudanças reativas de tamanho
import * as React from "react";

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined);

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return !!isMobile;
}
```

---

## 12. Próximos Passos Sugeridos

1. **Tema escuro** — Toggle automático baseado em `prefers-color-scheme`
2. **Internacionalização (i18n)** — Suporte a inglês/espanhol
3. **Persistência** — Integrar Lovable Cloud para salvar resultados
4. **Gráficos** — Visualização comparativa dos escores
5. **PWA** — Suporte offline com Service Worker
6. **Acessibilidade** — Audit com axe-core e ajustes ARIA

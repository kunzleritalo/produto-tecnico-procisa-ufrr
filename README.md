# Estresse PROCISA – Escalas de Estresse (PSS-10 & EET)

Ferramenta digital para aplicação de escalas validadas de estresse, desenvolvida no âmbito do Programa de Pós-graduação em Ciências da Saúde (PROCISA) da Universidade Federal de Roraima (UFRR).

Esta ferramenta foi desenvolvida em estrita consonância com as diretrizes da CAPES para a produção de Produtos Técnicos e Tecnológicos (PTT), fundamentando-se nos critérios de avaliação do Relatório do Grupo de Trabalho (GT) de Produção Técnica.

---

## 📋 Sumário

- [Visão Geral](#visão-geral)
- [Arquitetura e Estrutura de Pastas](#arquitetura-e-estrutura-de-pastas)
- [Stack Tecnológica](#stack-tecnológica)
- [Design System](#design-system)
- [Princípios de Otimização](#princípios-de-otimização)
- [Componentes Reutilizáveis](#componentes-reutilizáveis)
- [Fluxo da Aplicação](#fluxo-da-aplicação)
- [Código-Fonte Completo Comentado](#código-fonte-completo-comentado)

---

## Visão Geral

A aplicação permite a realização das escalas **PSS-10** (Estresse Percebido) e **EET** (Estresse no Trabalho). Os dados **não são armazenados** — todo o cálculo ocorre localmente no navegador do usuário. Ao final, o resultado pode ser enviado por e-mail.

**Funcionalidades:**
- Realização individual ou conjunta das escalas PSS-10 e EET
- Barra de progresso em tempo real durante o preenchimento
- Cálculo automático de escores com classificação de nível
- Envio de relatório por e-mail com referências bibliográficas e aviso LGPD
- Interface responsiva e acessível
- Suporte a tema claro e escuro

---

## Arquitetura e Estrutura de Pastas

```
src/
├── assets/                  # Imagens (logos, fotos dos autores)
│   ├── procisa-logo.png     # Logo do PROCISA
│   ├── ufrr-logo.png        # Brasão da UFRR
│   ├── edilane-photo.gif     # Foto da orientadora
│   └── italo-photo.gif      # Foto do autor
├── components/
│   ├── ui/                  # Componentes shadcn/ui (Button, Card, Skeleton, etc.)
│   ├── AboutSection.tsx     # Seção "Sobre" com informações dos autores
│   ├── NavLink.tsx          # Wrapper reutilizável do NavLink do React Router
│   ├── QuestionCard.tsx     # Cartão individual de pergunta (memoizado com React.memo)
│   ├── QuizPlayer.tsx       # Controlador do fluxo de questões e progresso
│   └── ResultsView.tsx      # Exibição de resultados e envio por e-mail
├── data/
│   └── exams.ts             # Definição das escalas, questões e função de pontuação
├── hooks/                   # Hooks personalizados (use-mobile, use-toast)
├── lib/
│   └── utils.ts             # Utilitário cn() para classes Tailwind
├── pages/
│   ├── Index.tsx            # Página principal (orquestrador de fases)
│   └── NotFound.tsx         # Página 404
├── App.tsx                  # Roteamento e providers globais
├── main.tsx                 # Ponto de entrada (render)
└── index.css                # Design tokens e variáveis CSS
```

### Separação de Responsabilidades

| Camada          | Responsabilidade                              | Arquivos                        |
|-----------------|-----------------------------------------------|---------------------------------|
| **Dados**       | Definição de escalas, questões e pontuação    | `data/exams.ts`                 |
| **Apresentação**| Renderização de UI sem lógica de negócio      | `QuestionCard`, `AboutSection`  |
| **Controle**    | Fluxo de fases, estado e orquestração         | `Index.tsx`, `QuizPlayer`       |
| **Resultados**  | Cálculo de escores e geração de relatório     | `ResultsView`                   |
| **Design**      | Tokens visuais, tipografia e tema             | `index.css`, `tailwind.config`  |

---

## Stack Tecnológica

| Tecnologia          | Uso                                                  |
|---------------------|------------------------------------------------------|
| **React 18**        | Biblioteca de UI com hooks e Suspense                |
| **TypeScript**      | Tipagem estática para segurança e autocomplete       |
| **Vite**            | Bundler ultra-rápido com HMR                         |
| **Tailwind CSS**    | Estilização utilitária com tokens semânticos         |
| **shadcn/ui**       | Componentes acessíveis e customizáveis (Radix UI)    |
| **Lucide React**    | Ícones SVG consistentes                              |
| **TanStack Query**  | Gerenciamento de estado assíncrono e cache            |
| **React Router**    | Roteamento SPA com lazy loading                      |

---

## Design System

### Tokens de Cor (HSL)

Todas as cores são definidas como variáveis CSS HSL em `index.css` e mapeadas em `tailwind.config.ts`:

```css
/* Tema claro */
--primary: 161 93% 30%;           /* Verde esmeralda principal */
--primary-foreground: 151 80% 95%; /* Texto sobre primary */
--accent: 166 76% 96%;            /* Fundo de destaque suave */
--success: 152 60% 40%;           /* Indicadores positivos */
--warning: 38 90% 55%;            /* Alertas moderados */
--destructive: 0 72% 50%;        /* Indicadores críticos */
--muted-foreground: 160 5% 35%;  /* Texto secundário */
--border: 160 10% 86%;           /* Cor de bordas */
--card: 160 10% 99%;             /* Fundo de cartões */
```

### Tipografia

| Variável          | Fonte         | Uso                    |
|-------------------|---------------|------------------------|
| `--font-heading`  | Space Grotesk | Títulos e destaques    |
| `--font-body`     | Inter         | Corpo de texto         |
| `--font-sans`     | Work Sans     | Fallback sans-serif    |
| `--font-serif`    | Lora          | Citações acadêmicas    |
| `--font-mono`     | Inconsolata   | Dados numéricos        |

### Classes Utilitárias Customizadas

```css
.card-elevated       /* Sombra com hover animado e translateY(-2px) */
.gradient-hero       /* Gradiente sutil para seções hero */
.gradient-primary-subtle /* Gradiente leve primary → accent */
.text-gradient-primary   /* Texto com gradiente primary → glow */
```

### Regra Crítica

> **Nunca usar classes de cor direta** (`text-white`, `bg-black`, `bg-green-500`) nos componentes.
> Sempre usar tokens semânticos (`text-primary-foreground`, `bg-card`, `text-muted-foreground`).

---

## Princípios de Otimização

### 1. Lazy Loading (Carregamento Preguiçoso)

Componentes pesados são carregados sob demanda com `React.lazy` e `Suspense`:

```tsx
const ResultsView = lazy(() => import("@/components/ResultsView"));
const AboutSection = lazy(() => import("@/components/AboutSection"));
```

O fallback exibe um `<Skeleton>` enquanto o componente carrega.

### 2. Memoização

- **`React.memo`** em `QuestionCard` e `ResultsView` — evita re-renderizações desnecessárias
- **`useMemo`** para cálculos de escores derivados dos dados
- **`useCallback`** para funções de callback passadas como props

### 3. Estabilidade de Referências

Funções passadas como props são envolvidas em `useCallback` para manter referências estáveis e evitar que componentes filhos re-renderizem sem necessidade.

### 4. Otimização de Imagens

- Logos institucionais carregam normalmente (acima do fold)
- Fotos dos autores utilizam `loading="lazy"` (abaixo do fold, seção "Sobre")

### 5. Otimização de Consultas ao Banco de Dados

Quando houver integração com banco de dados (ex.: Supabase via Lovable Cloud), seguir a ordem:

```
1. Autenticação    → Verificar sessão do usuário (auth.uid())
2. RLS             → Políticas de Row Level Security no servidor
3. Seleção         → SELECT apenas colunas necessárias
4. Filtragem       → WHERE/filtros no servidor, NÃO no cliente
5. Ordenação       → ORDER BY no servidor
6. Paginação       → LIMIT/OFFSET para limitar dados transferidos
7. Cache           → TanStack Query com staleTime e gcTime
```

**Exemplo com TanStack Query:**

```tsx
const { data } = useQuery({
  queryKey: ['exams', examId],       // Chave única e granular para cache
  queryFn: () => fetchExam(examId),  // Função de busca
  staleTime: 5 * 60 * 1000,         // 5 min antes de considerar stale
  gcTime: 30 * 60 * 1000,           // 30 min no garbage collector
  select: (data) => data.questions,  // Transforma no cliente
});
```

**Anti-padrões a evitar:**
- ❌ Buscar todas as colunas (`SELECT *`)
- ❌ Filtrar dados no cliente após buscar tudo do servidor
- ❌ Fazer queries dentro de loops (N+1 problem)
- ❌ Não usar cache (refetch em toda navegação)

---

## Componentes Reutilizáveis

### Componentes de UI Base (shadcn/ui)

Mantidos em `src/components/ui/` — customizados via tokens do design system. Qualquer alteração visual reflete automaticamente em todos os usos.

| Componente   | Arquivo         | Uso                                      |
|-------------|-----------------|------------------------------------------|
| `Button`    | `button.tsx`    | Botões com variantes (default, outline, destructive, ghost, link) |
| `Card`      | `card.tsx`      | Container com borda e sombra             |
| `Skeleton`  | `skeleton.tsx`  | Placeholder de carregamento              |
| `Progress`  | `progress.tsx`  | Barra de progresso                       |
| `Badge`     | `badge.tsx`     | Labels e tags                            |
| `Toast`     | `toast.tsx`     | Notificações temporárias                 |
| `Tooltip`   | `tooltip.tsx`   | Dicas contextuais                        |

### Componentes de Domínio

| Componente       | Props Principais                              | Descrição                               |
|-----------------|-----------------------------------------------|-----------------------------------------|
| `QuestionCard`  | `question`, `selectedOption`, `onSelect`, `optionLabels`, `startFrom` | Cartão de pergunta memoizado |
| `QuizPlayer`    | `exam`, `onFinish`                            | Controlador do quiz com progresso       |
| `ResultsView`   | `results`, `mode`, `onRestart`                | Exibição de resultados + envio e-mail   |
| `AboutSection`  | (sem props)                                   | Seção institucional                     |
| `NavLink`       | `to`, `className`, `activeClassName`          | Wrapper NavLink reutilizável            |

### Utilitário `cn()`

```tsx
import { cn } from "@/lib/utils";
// Combina classes Tailwind com resolução automática de conflitos
cn("text-sm font-bold", isActive && "text-primary", className)
```

---

## Fluxo da Aplicação

```
welcome → exam1 (PSS-10) → exam2 (EET) → results   [modo: both]
welcome → exam1 (PSS-10) → results                  [modo: pss10]
welcome → exam2 (EET) → results                     [modo: eet]
```

O estado de fase (`Phase`) é gerenciado em `Index.tsx` via `useState`. As respostas são armazenadas em um objeto `ExamAnswers` e passadas para `ResultsView` ao final.

---

## Código-Fonte Completo Comentado

### `index.html`

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <!-- Título da aplicação exibido na aba do navegador -->
    <title>Estresse PROCISA</title>
    <!-- Meta descrição para SEO e compartilhamento -->
    <meta name="description" content="PROCISA - PSS-10 &amp; EET">
    <meta name="author" content="Lovable" />
    <!-- Open Graph — informações para compartilhamento em redes sociais -->
    <meta property="og:type" content="website" />
    <meta property="og:title" content="Estresse PROCISA">
    <meta property="og:description" content="PROCISA - PSS-10 &amp; EET">
    <!-- Twitter Card — formatação para compartilhamento no Twitter/X -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="Estresse PROCISA">
    <meta name="twitter:description" content="PROCISA - PSS-10 &amp; EET">
  </head>
  <body>
    <!-- Contêiner raiz onde o React monta toda a aplicação -->
    <div id="root"></div>
    <!-- Ponto de entrada do Vite — carrega o módulo principal via ESM -->
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

### `src/main.tsx`

```tsx
/* Ponto de entrada da aplicação React.
 * Importa o componente raiz e os estilos globais,
 * e monta a árvore de componentes no elemento #root do DOM. */
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css"; // Importa tokens CSS e estilos globais do Tailwind

/* createRoot é a API moderna do React 18 para renderização concurrent */
createRoot(document.getElementById("root")!).render(<App />);
```

### `src/App.tsx`

```tsx
/* Componente raiz da aplicação.
 * Configura todos os providers globais (cache, tooltips, notificações)
 * e define as rotas da SPA. */
import { Toaster } from "@/components/ui/toaster";       // Sistema de toast (radix)
import { Toaster as Sonner } from "@/components/ui/sonner"; // Sistema de toast alternativo (sonner)
import { TooltipProvider } from "@/components/ui/tooltip"; // Provider global de tooltips
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"; // Cache e estado assíncrono
import { BrowserRouter, Routes, Route } from "react-router-dom"; // Roteamento SPA
import Index from "./pages/Index";       // Página principal
import NotFound from "./pages/NotFound"; // Página 404

/* Instância do QueryClient — configuração global de cache.
 * staleTime e gcTime podem ser configurados aqui para todas as queries. */
const queryClient = new QueryClient();

const App = () => (
  /* QueryClientProvider disponibiliza o cache do TanStack Query para toda a árvore */
  <QueryClientProvider client={queryClient}>
    {/* TooltipProvider habilita tooltips acessíveis em qualquer componente */}
    <TooltipProvider>
      {/* Dois sistemas de notificação toast disponíveis globalmente */}
      <Toaster />
      <Sonner />
      {/* BrowserRouter habilita navegação SPA com History API */}
      <BrowserRouter>
        <Routes>
          {/* Rota principal — página do quiz de estresse */}
          <Route path="/" element={<Index />} />
          {/* Rota coringa — captura URLs inexistentes e exibe 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
```

### `src/index.css`

```css
/* ── Importações do Tailwind CSS ── */
@tailwind base;       /* Estilos de reset e base */
@tailwind components; /* Classes de componentes */
@tailwind utilities;  /* Classes utilitárias */

/* ── Importação de Fontes Google ──
 * Space Grotesk: usada para títulos (--font-heading)
 * Inter: usada para corpo de texto (--font-body)
 * Work Sans: fallback sans-serif (--font-sans)
 * Lora: citações acadêmicas (--font-serif)
 * Inconsolata: dados numéricos (--font-mono) */
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap');
@import url("https://fonts.googleapis.com/css2?family=Work+Sans:wght@400;500;600;700&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Lora:wght@400;500;600;700&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Inconsolata:wght@400;700&display=swap");

@layer base {
  :root {
    /* ══════════════════════════════════════════
     *  TOKENS DE COR — TEMA CLARO
     *  Formato: H S% L% (HSL sem prefixo hsl())
     *  Uso: hsl(var(--token)) no Tailwind
     * ══════════════════════════════════════════ */

    /* Fundo e texto principal */
    --background: 160 15% 96%;        /* Fundo geral da página — cinza esverdeado claro */
    --foreground: 160 10% 9%;         /* Texto principal — quase preto com matiz verde */

    /* Cartões (cards) */
    --card: 160 10% 99%;              /* Fundo de cartões — branco com leve matiz */
    --card-foreground: 160 10% 9%;    /* Texto dentro de cartões */

    /* Popovers e menus flutuantes */
    --popover: 160 8% 92%;            /* Fundo de popovers */
    --popover-foreground: 160 10% 9%; /* Texto em popovers */

    /* Cor principal (brand) — verde esmeralda */
    --primary: 161 93% 30%;           /* Verde escuro vibrante */
    --primary-foreground: 151 80% 95%; /* Texto sobre a cor principal — verde muito claro */

    /* Cor secundária — cinza esverdeado neutro */
    --secondary: 160 8% 90%;          /* Fundo de elementos secundários */
    --secondary-foreground: 160 10% 15%; /* Texto sobre secundário */

    /* Elementos discretos/atenuados */
    --muted: 160 5% 63%;              /* Cor atenuada para bordas e separadores */
    --muted-foreground: 160 5% 35%;   /* Texto discreto, legendas, descrições */

    /* Destaques e acentos */
    --accent: 166 76% 96%;            /* Fundo de destaque suave — verde água claro */
    --accent-foreground: 173 80% 30%; /* Texto sobre destaque */

    /* Erro e perigo */
    --destructive: 0 72% 50%;         /* Vermelho para indicadores críticos */
    --destructive-foreground: 0 85% 97%; /* Texto sobre vermelho */

    /* Bordas e inputs */
    --border: 160 10% 86%;            /* Cor padrão de bordas */
    --input: 160 10% 86%;             /* Cor de borda de inputs */
    --ring: 161 93% 30%;              /* Anel de foco (acessibilidade) */

    /* Arredondamento padrão de bordas */
    --radius: 0.75rem;                /* 12px — usado em cards e botões */

    /* ── Tokens de feedback semântico ── */
    --success: 152 60% 40%;           /* Verde de sucesso (estresse baixo) */
    --success-foreground: 0 0% 100%;  /* Texto sobre verde de sucesso */
    --warning: 38 90% 55%;            /* Amarelo de alerta (estresse moderado) */
    --warning-foreground: 0 0% 100%;  /* Texto sobre amarelo de alerta */

    /* ── Efeitos visuais ── */
    --primary-glow: 158 64% 51%;      /* Tom mais claro do primary para gradientes */
    --gradient-hero: linear-gradient(135deg, hsl(161 93% 30% / 0.08), hsl(166 76% 96% / 0.5));
    --shadow-card: 0 2px 12px -4px hsl(161 93% 30% / 0.1), 0 1px 4px -2px hsl(0 0% 0% / 0.06);
    --shadow-card-hover: 0 8px 24px -8px hsl(161 93% 30% / 0.15), 0 2px 8px -2px hsl(0 0% 0% / 0.08);

    /* ── Fontes tipográficas ── */
    --font-heading: 'Space Grotesk', sans-serif; /* Títulos */
    --font-body: 'Inter', sans-serif;            /* Corpo */
    --font-sans: 'Work Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif;
    --font-serif: 'Lora', ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif;
    --font-mono: 'Inconsolata', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;

    /* ── Cores para gráficos (recharts) ── */
    --chart-1: 158 64% 51%;
    --chart-2: 141 69% 58%;
    --chart-3: 172 66% 50%;
    --chart-4: 82 77% 55%;
    --chart-5: 0 0% 45%;

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

    /* ── Sombras padronizadas (usadas pelo Tailwind via tailwind.config.ts) ── */
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

  /* ══════════════════════════════════════════
   *  TOKENS DE COR — TEMA ESCURO
   *  Ativado via classe .dark no <html>
   * ══════════════════════════════════════════ */
  .dark {
    --background: 160 10% 7%;          /* Fundo escuro */
    --foreground: 160 5% 96%;          /* Texto claro */
    --card: 160 8% 11%;                /* Cartões escuros */
    --card-foreground: 160 5% 96%;
    --popover: 160 6% 18%;
    --popover-foreground: 160 5% 96%;
    --primary: 158 64% 51%;            /* Verde mais claro no tema escuro */
    --primary-foreground: 165 91% 9%;  /* Texto escuro sobre primary claro */
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

/* ── Estilos base globais ── */
@layer base {
  * {
    @apply border-border; /* Aplica cor de borda padrão a todos os elementos */
  }
  body {
    @apply bg-background text-foreground; /* Cores de fundo e texto padrão */
    font-family: var(--font-body);         /* Fonte do corpo do texto (Inter) */
  }
  /* Todos os títulos usam a fonte display (Space Grotesk) */
  h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-heading);
  }
}

/* ── Classes utilitárias customizadas ── */
@layer utilities {
  /* Cartão com sombra elevada e efeito hover (elevação + deslocamento vertical) */
  .card-elevated {
    box-shadow: var(--shadow-card);
    transition: box-shadow 0.3s ease, transform 0.3s ease;
  }
  .card-elevated:hover {
    box-shadow: var(--shadow-card-hover);
    transform: translateY(-2px);
  }

  /* Gradiente suave para seções hero — primary com baixa opacidade → accent */
  .gradient-hero {
    background: var(--gradient-hero);
  }

  /* Gradiente sutil primary → accent para fundos decorativos */
  .gradient-primary-subtle {
    background: linear-gradient(135deg, hsl(var(--primary) / 0.06), hsl(var(--accent) / 0.4));
  }

  /* Texto com gradiente de cor — efeito visual para destaques */
  .text-gradient-primary {
    background: linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary-glow)));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
}
```

### `src/lib/utils.ts`

```tsx
/* Utilitário para combinar classes Tailwind com resolução automática de conflitos.
 * Usa clsx para condicionais e tailwind-merge para resolver conflitos
 * (ex.: "text-sm text-lg" → "text-lg"). */
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combina classes CSS usando clsx e resolve conflitos com tailwind-merge.
 *
 * @param inputs - Classes CSS, condicionais ou arrays
 * @returns String com classes combinadas e sem conflitos
 *
 * @example
 * cn("text-sm font-bold", isActive && "text-primary")
 * // → "text-sm font-bold text-primary" (quando isActive é true)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

### `src/data/exams.ts`

```tsx
/* ══════════════════════════════════════════════════════════════
 *  DEFINIÇÃO DAS ESCALAS DE ESTRESSE
 *
 *  Este arquivo contém:
 *  1. Interfaces TypeScript para Question e Exam
 *  2. Função geradora de questões (generateQuestions)
 *  3. Textos completos das questões PSS-10 e EET
 *  4. Configuração das duas escalas
 *  5. Função de pontuação (getScore) com suporte a itens invertidos
 * ══════════════════════════════════════════════════════════════ */

/** Representa uma questão individual de uma escala.
 * Cada questão possui um identificador único, texto, número de alternativas
 * e um indicador se a pontuação deve ser invertida. */
export interface Question {
  id: string;         // Identificador único (ex.: "p1q1" para PSS-10 questão 1)
  text: string;       // Texto completo da questão exibido ao usuário
  numOptions: number; // Quantidade de alternativas disponíveis (5 para ambas as escalas)
  inverted: boolean;  // Se true, a pontuação é invertida (ex.: 0→4, 1→3, 2→2, 3→1, 4→0)
}

/** Representa uma escala completa (PSS-10 ou EET).
 * Contém metadados, instruções e a lista de questões. */
export interface Exam {
  id: string;              // Identificador único da escala ("prova1" ou "prova2")
  title: string;           // Título exibido na interface
  description: string;     // Descrição breve (quantidade de itens e range de alternativas)
  instructions?: string;   // Instruções detalhadas exibidas antes das questões (opcional)
  optionLabels?: string[]; // Rótulos textuais para cada alternativa (ex.: "Nunca", "Quase Nunca"...)
  startFrom?: number;      // Valor inicial das alternativas (0 para PSS-10, 1 para EET)
  questions: Question[];   // Lista de questões da escala
}

/**
 * Gera uma lista de questões programaticamente a partir de parâmetros.
 * Evita repetição de código ao criar questões com estrutura similar.
 *
 * @param prefix - Prefixo do ID (ex.: "p1" para PSS-10, "p2" para EET)
 * @param count - Quantidade de questões a gerar
 * @param numOptions - Número de alternativas por questão
 * @param invertedItems - Lista de itens com pontuação invertida (1-indexed)
 * @param texts - Array com os textos das questões (opcional)
 * @returns Array de objetos Question
 */
function generateQuestions(
  prefix: string,
  count: number,
  numOptions: number,
  invertedItems: number[] = [],
  texts?: string[]
): Question[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `${prefix}q${i + 1}`,                    // Ex.: "p1q1", "p1q2", etc.
    text: texts?.[i] ?? `Item ${i + 1}`,          // Usa texto fornecido ou fallback genérico
    numOptions,                                    // Número de alternativas
    inverted: invertedItems.includes(i + 1),       // Verifica se o item é invertido (1-indexed)
  }));
}

/* ── Textos das questões da PSS-10 (Escala de Estresse Percebido) ──
 * 10 itens que avaliam a percepção de estresse nos últimos 30 dias.
 * Escala de resposta: 0 (Nunca) a 4 (Muito Frequente).
 * Itens 4, 5, 7 e 8 possuem pontuação invertida (são positivos). */
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

/* ── Textos das questões da EET (Escala de Estresse no Trabalho) ──
 * 23 itens que avaliam situações estressoras no ambiente de trabalho.
 * Escala de resposta: 1 (Discordo Totalmente) a 5 (Concordo Totalmente).
 * Nenhum item possui pontuação invertida. */
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

/* ── Definição das duas escalas ── */
export const exams: Exam[] = [
  {
    id: "prova1",
    title: "PSS-10 – Escala de Estresse Percebido",
    description: "10 itens · Alternativas de 0 a 4.",
    instructions: "As questões nesta escala perguntam a respeito dos seus sentimentos e pensamentos durante os últimos 30 dias (último mês). Em cada questão, indique a frequência com que você se sentiu ou pensou a respeito da situação vivenciada, seguindo a escala abaixo:\n\n0 – Nunca | 1 – Quase Nunca | 2 – Às Vezes | 3 – Pouco Frequente | 4 – Muito Frequente",
    optionLabels: ["Nunca", "Quase Nunca", "Às Vezes", "Pouco Frequente", "Muito Frequente"],
    /* Itens 4, 5, 7 e 8 possuem pontuação invertida conforme o instrumento original.
     * Estes itens são formulados de forma positiva, então sua pontuação é espelhada:
     * Se o respondente marca 4 (Muito Frequente) em um item positivo, recebe 0 pontos.
     * Se marca 0 (Nunca) em um item positivo, recebe 4 pontos. */
    questions: generateQuestions("p1", 10, 5, [4, 5, 7, 8], pss10Texts),
  },
  {
    id: "prova2",
    title: "EET – Escala de Estresse no Trabalho",
    description: "23 itens · Alternativas de 1 a 5",
    instructions: "As questões nesta escala listam várias situações que podem ocorrer no dia a dia de seu trabalho. Leia com atenção cada afirmativa e utilize a escala apresentada a seguir para dar sua opinião sobre cada uma delas:\n\n1 – Discordo Totalmente | 2 – Discordo | 3 – Concordo em Parte | 4 – Concordo | 5 – Concordo Totalmente\n\nPara cada item, marque o número que melhor corresponde à sua resposta.\nAo marcar o número 1, você indica discordar totalmente da afirmativa.\nAssinalando o número 5, você indica concordar totalmente com a afirmativa.\nObserve que, quanto menor o número, mais você discorda da afirmativa e, quanto maior o número, mais você concorda com a afirmativa.",
    optionLabels: ["", "Discordo Totalmente", "Discordo", "Concordo em parte", "Concordo", "Concordo Totalmente"],
    startFrom: 1, /* EET começa em 1 (não em 0 como a PSS-10) */
    /* Nenhum item da EET possui pontuação invertida */
    questions: generateQuestions("p2", 23, 5, [], eetTexts),
  },
];

/**
 * Calcula a pontuação de uma questão com base na alternativa selecionada.
 *
 * Para itens normais: a pontuação é o próprio valor selecionado.
 * Para itens invertidos: a pontuação é espelhada.
 *   Fórmula: (numOptions - 1) - selectedValue
 *   Ex. (5 opções): 0→4, 1→3, 2→2, 3→1, 4→0
 *
 * @param question - A questão com seus metadados
 * @param selectedValue - O valor da alternativa selecionada pelo usuário
 * @returns A pontuação calculada
 */
export function getScore(question: Question, selectedValue: number): number {
  if (question.inverted) {
    return (question.numOptions - 1) - selectedValue;
  }
  return selectedValue;
}
```

### `src/pages/Index.tsx`

```tsx
/* ══════════════════════════════════════════════════════════════
 *  PÁGINA PRINCIPAL — ORQUESTRADOR DE FASES
 *
 *  Esta página gerencia o fluxo completo da aplicação:
 *  1. Tela de boas-vindas com informações e seleção de modo
 *  2. Realização da PSS-10 (quando aplicável)
 *  3. Realização da EET (quando aplicável)
 *  4. Exibição dos resultados
 *
 *  O estado é gerenciado localmente (sem backend).
 *  Componentes pesados são carregados via lazy loading.
 * ══════════════════════════════════════════════════════════════ */
import { useState, useCallback, useMemo, lazy, Suspense } from "react";
import { exams } from "@/data/exams";
import QuizPlayer from "@/components/QuizPlayer";
import { Button } from "@/components/ui/button";
import { ArrowRight, HeartPulse, Briefcase, Info, Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import procisaLogo from "@/assets/procisa-logo.png";  // Logo do PROCISA
import ufrrLogo from "@/assets/ufrr-logo.png";        // Brasão da UFRR

/* ── Lazy loading de componentes pesados ──
 * ResultsView e AboutSection são carregados apenas quando necessários,
 * reduzindo o tamanho do bundle inicial. */
const ResultsView = lazy(() => import("@/components/ResultsView"));
const AboutSection = lazy(() => import("@/components/AboutSection"));

/* ── Tipos de estado ── */

/** Fases do fluxo da aplicação */
type Phase = "welcome" | "exam1" | "exam2" | "results";

/** Modos de realização das escalas */
type Mode = "both" | "pss10" | "eet";

/** Estrutura para armazenar respostas de ambas as escalas.
 * Cada escala é um Record<string, number> onde:
 * - chave: ID da questão (ex.: "p1q1")
 * - valor: alternativa selecionada (ex.: 3) */
interface ExamAnswers {
  exam1: Record<string, number>; // Respostas da PSS-10
  exam2: Record<string, number>; // Respostas da EET
}

/** Utilitário para rolar suavemente ao topo da página após mudança de fase */
const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

const Index = () => {
  /* ── Estado da aplicação ── */
  const [phase, setPhase] = useState<Phase>("welcome");    // Fase atual do fluxo
  const [mode, setMode] = useState<Mode>("both");          // Modo selecionado pelo usuário
  const [answers, setAnswers] = useState<ExamAnswers>({     // Respostas coletadas
    exam1: {},
    exam2: {},
  });

  /* ══════════════════════════════════════════
   *  CALLBACKS ESTABILIZADOS COM useCallback
   *  Evitam re-renderizações desnecessárias nos componentes filhos.
   * ══════════════════════════════════════════ */

  /** Chamado quando o usuário finaliza a PSS-10.
   * Salva as respostas e avança para a próxima fase (EET ou resultados). */
  const handleFinishExam1 = useCallback((a: Record<string, number>) => {
    setAnswers((prev) => ({ ...prev, exam1: a }));
    setPhase((prev) => mode === "both" ? "exam2" : "results");
    scrollTop();
  }, [mode]); // Depende de 'mode' para decidir a próxima fase

  /** Chamado quando o usuário finaliza a EET.
   * Salva as respostas e avança para os resultados. */
  const handleFinishExam2 = useCallback((a: Record<string, number>) => {
    setAnswers((prev) => ({ ...prev, exam2: a }));
    setPhase("results");
    scrollTop();
  }, []); // Sem dependências — sempre avança para resultados

  /** Inicia as escalas no modo selecionado.
   * Limpa respostas anteriores e define a fase inicial. */
  const startExams = useCallback((selectedMode: Mode) => {
    setMode(selectedMode);
    setAnswers({ exam1: {}, exam2: {} }); // Limpa respostas anteriores
    setPhase(selectedMode === "eet" ? "exam2" : "exam1"); // EET pula para exam2
    scrollTop();
  }, []);

  /** Reinicia o fluxo completamente — volta à tela de boas-vindas. */
  const restart = useCallback(() => {
    setAnswers({ exam1: {}, exam2: {} });
    setPhase("welcome");
    scrollTop();
  }, []);

  /** Monta a lista de resultados com base no modo selecionado.
   * Memoizado com useMemo — só recalcula quando mode ou answers mudam. */
  const results = useMemo(() => {
    const r = [];
    if (mode === "both" || mode === "pss10") {
      r.push({ exam: exams[0], answers: answers.exam1 });
    }
    if (mode === "both" || mode === "eet") {
      r.push({ exam: exams[1], answers: answers.exam2 });
    }
    return r;
  }, [mode, answers]);

  return (
    <div className="min-h-screen bg-background">
      <main className="px-4 py-10">

        {/* ══════════════════════════════════════════
         *  FASE: TELA DE BOAS-VINDAS
         *  Exibe logos, instruções, cartões das escalas e botões de ação.
         * ══════════════════════════════════════════ */}
        {phase === "welcome" && (
          <>
            <div className="max-w-2xl mx-auto text-center">
              {/* Logos institucionais — PROCISA e UFRR */}
              <div className="flex items-center justify-center gap-6 mb-8">
                <img src={procisaLogo} alt="Logo PROCISA" className="h-16 object-contain" />
                <div className="w-px h-12 bg-border" /> {/* Separador vertical */}
                <img src={ufrrLogo} alt="Brasão UFRR" className="h-16 object-contain" />
              </div>

              {/* Seção hero com gradiente sutil */}
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

              {/* Cartão de instruções gerais — card-elevated para efeito hover */}
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

              {/* Cartões descritivos das escalas — grid responsivo */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-lg mx-auto mb-8">
                {/* Cartão PSS-10 */}
                <div className="rounded-xl border border-border bg-card p-5 text-left card-elevated group">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/15 transition-colors">
                      <HeartPulse className="w-4 h-4 text-primary" />
                    </div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Escala 01</p>
                  </div>
                  <p className="font-semibold text-sm mb-1.5">PSS-10 – Escala de Estresse Percebido</p>
                  <p className="text-muted-foreground text-left text-xs leading-relaxed">Busca conhecer informações acerca do construto de "Estresse autopercebido"</p>
                  <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1 bg-accent/50 px-2 py-0.5 rounded-full">{exams[0].questions.length} itens</span>
                    <span className="inline-flex items-center gap-1"><Clock className="w-3 h-3" />~3 min</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground/60 mt-3 leading-tight text-left">
                    Cohen, S., Kamarck, T., & Mermelstein, R. (1983); Siqueira Reis, R., Ferreira Hino, A. A., & Romélio Rodriguez Añez, C. (2010).
                  </p>
                </div>

                {/* Cartão EET */}
                <div className="rounded-xl border border-border bg-card p-5 text-left card-elevated group">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/15 transition-colors">
                      <Briefcase className="w-4 h-4 text-primary" />
                    </div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Escala 02</p>
                  </div>
                  <p className="font-semibold text-sm mb-1.5">EET – Escala de Estresse no Trabalho</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">Busca melhor compreender o construto de "Estresse ocupacional"</p>
                  <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1 bg-accent/50 px-2 py-0.5 rounded-full">{exams[1].questions.length} itens</span>
                    <span className="inline-flex items-center gap-1"><Clock className="w-3 h-3" />~7 min</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground/60 mt-3 leading-tight">
                    PASCHOAL, T.; TAMAYO, A. (2004).
                  </p>
                </div>
              </div>

              {/* Botões de ação — iniciar escalas */}
              <div className="flex flex-col gap-3 max-w-md mx-auto">
                {/* Botão principal — ambas as escalas.
                 * Possui gradiente, efeito shine no hover e subtítulo. */}
                <button
                  onClick={() => startExams("both")}
                  className="group relative w-full rounded-xl bg-gradient-to-r from-primary to-primary/80 text-primary-foreground px-6 py-4 font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 overflow-hidden"
                >
                  {/* Efeito shine — barra de luz que desliza no hover */}
                  <span className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary-foreground/10 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                  <span className="relative flex items-center justify-center gap-2">
                    Realizar ambas as escalas (PSS-10 e EET)
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <span className="relative block text-xs font-normal opacity-80 mt-1">Recomendado · ~10 min</span>
                </button>

                {/* Botões secundários — escalas individuais (lado a lado) */}
                <div className="grid grid-cols-2 gap-3">
                  {/* Botão PSS-10 */}
                  <button
                    onClick={() => startExams("pss10")}
                    className="group w-full rounded-xl border-2 border-border bg-card hover:border-primary/40 hover:bg-accent/30 px-4 py-3.5 transition-all duration-300 hover:-translate-y-0.5 card-elevated"
                  >
                    <span className="flex items-center justify-center gap-2 mb-1">
                      <HeartPulse className="w-4 h-4 text-primary" />
                      <span className="font-semibold text-sm">Escala PSS-10</span>
                    </span>
                    <span className="block text-[11px] text-muted-foreground">Estresse Percebido · ~3 min</span>
                  </button>

                  {/* Botão EET */}
                  <button
                    onClick={() => startExams("eet")}
                    className="group w-full rounded-xl border-2 border-border bg-card hover:border-primary/40 hover:bg-accent/30 px-4 py-3.5 transition-all duration-300 hover:-translate-y-0.5 card-elevated"
                  >
                    <span className="flex items-center justify-center gap-2 mb-1">
                      <Briefcase className="w-4 h-4 text-primary" />
                      <span className="font-semibold text-sm">Escala EET</span>
                    </span>
                    <span className="block text-[11px] text-muted-foreground">Estresse no Trabalho · ~7 min</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Seção "Sobre" — carregada sob demanda (lazy loading).
             * O Skeleton é exibido enquanto o componente carrega. */}
            <Suspense fallback={<Skeleton className="h-64 w-full max-w-3xl mx-auto mt-16 rounded-xl" />}>
              <AboutSection />
            </Suspense>
          </>
        )}

        {/* ══════════════════════════════════════════
         *  FASE: ESCALA PSS-10
         *  Exibe logos no topo e o QuizPlayer com a escala PSS-10.
         * ══════════════════════════════════════════ */}
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

        {/* ══════════════════════════════════════════
         *  FASE: ESCALA EET
         *  Exibe logos no topo e o QuizPlayer com a escala EET.
         * ══════════════════════════════════════════ */}
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

        {/* ══════════════════════════════════════════
         *  FASE: RESULTADOS
         *  Exibe escores, classificações e opção de envio por e-mail.
         *  Carregado via lazy loading com Suspense.
         * ══════════════════════════════════════════ */}
        {phase === "results" && (
          <Suspense fallback={<Skeleton className="h-64 w-full max-w-3xl mx-auto rounded-xl" />}>
            <ResultsView results={results} mode={mode} onRestart={restart} />
          </Suspense>
        )}
      </main>

      {/* ══════════════════════════════════════════
       *  RODAPÉ INSTITUCIONAL
       *  Exibe logos, aviso de finalidade e referências bibliográficas.
       * ══════════════════════════════════════════ */}
      <footer className="w-full border-t border-border bg-card mt-16 py-8 px-4">
        <div className="max-w-3xl mx-auto text-center text-[11px] text-muted-foreground/80 leading-relaxed space-y-4">
          <div className="flex items-center justify-center gap-4 mb-4">
            <img src={procisaLogo} alt="Logo PROCISA" className="h-8 opacity-60" />
            <div className="w-px h-6 bg-border" />
            <img src={ufrrLogo} alt="Brasão UFRR" className="h-8 opacity-60" />
          </div>
          <p className="font-semibold text-muted-foreground">Esta ferramenta tem finalidade exclusivamente pedagógica e/ou para fins de levantamento de informações acerca dos construtos de estresse.</p>
          <p>
            Todos os direitos sobre as escalas pertencem aos seus respectivos criadores. Qualquer uso com finalidade diferente da proposta por esse instrumento não é de responsabilidade dos criadores desta ferramenta.
          </p>
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

### `src/pages/NotFound.tsx`

```tsx
/* ── Página 404 — Exibida quando o usuário acessa uma rota inexistente ──
 * Registra o erro no console para depuração e oferece link de retorno. */
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  /* Registra erro 404 no console para depuração e monitoramento */
  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">404</h1>
        <p className="mb-4 text-xl text-muted-foreground">Oops! Page not found</p>
        <a href="/" className="text-primary underline hover:text-primary/90">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
```

### `src/components/QuestionCard.tsx`

```tsx
/* ══════════════════════════════════════════════════════════════
 *  CARTÃO DE QUESTÃO — Componente de apresentação memoizado
 *
 *  Renderiza uma questão individual com seus botões de alternativa.
 *  Envolvido em React.memo para evitar re-renderizações quando
 *  outras questões são respondidas (apenas re-renderiza quando
 *  suas próprias props mudam).
 *
 *  Props:
 *  - question: dados da questão (texto, numOptions, inverted)
 *  - selectedOption: alternativa atualmente selecionada (ou null)
 *  - onSelect: callback chamado quando uma alternativa é clicada
 *  - optionLabels: rótulos textuais opcionais para cada alternativa
 *  - startFrom: valor inicial das alternativas (0 ou 1)
 * ══════════════════════════════════════════════════════════════ */
import { memo } from "react";
import { Question } from "@/data/exams";
import { cn } from "@/lib/utils";

interface QuestionCardProps {
  question: Question;           // Dados da questão
  selectedOption: number | null; // Alternativa selecionada (null = nenhuma)
  onSelect: (value: number) => void; // Callback ao selecionar alternativa
  optionLabels?: string[];      // Rótulos textuais das alternativas (ex.: "Nunca", "Às Vezes")
  startFrom?: number;           // Valor inicial (0 para PSS-10, 1 para EET)
}

const QuestionCard = memo(({ question, selectedOption, onSelect, optionLabels, startFrom = 0 }: QuestionCardProps) => {
  /* Gera array de valores das alternativas.
   * PSS-10: [0, 1, 2, 3, 4]
   * EET:    [1, 2, 3, 4, 5] */
  const options = Array.from({ length: question.numOptions }, (_, i) => i + startFrom);

  return (
    <div className="rounded-xl bg-card border border-border p-6 card-elevated">
      {/* Texto da questão */}
      <h3 className="text-lg font-semibold mb-1 leading-relaxed">{question.text}</h3>

      {/* Espaçador invisível para itens invertidos — mantém alinhamento visual consistente */}
      {question.inverted && (
        <p className="text-xs text-muted-foreground mb-4 italic">​</p>
      )}

      {/* Grade de botões de alternativa.
       * Em mobile: grid de 5 colunas (compacto).
       * Em desktop: flex-wrap para layout mais natural. */}
      <div className="grid grid-cols-5 sm:flex sm:flex-wrap gap-2 sm:gap-3">
        {options.map((value) => {
          const isSelected = selectedOption === value;
          return (
            <button
              key={value}
              onClick={() => onSelect(value)}
              className={cn(
                /* Estilos base do botão de alternativa */
                "min-w-12 h-auto rounded-lg border-2 transition-all duration-200 flex flex-col items-center justify-center text-sm font-bold px-3 py-2 gap-1",
                isSelected
                  /* Estado selecionado — fundo primary com texto claro */
                  ? "border-primary bg-primary text-primary-foreground shadow-sm"
                  /* Estado não selecionado — borda neutra com hover para primary */
                  : "border-border hover:border-primary/40 hover:bg-secondary/60 text-muted-foreground"
              )}>
              {/* Valor numérico da alternativa */}
              <span>{value}</span>
              {/* Rótulo textual abaixo do número (quando disponível).
               * Ex.: "Nunca", "Às Vezes", "Muito Frequente" */}
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

### `src/components/QuizPlayer.tsx`

```tsx
/* ══════════════════════════════════════════════════════════════
 *  CONTROLADOR DO QUIZ — Gerencia estado das respostas e progresso
 *
 *  Responsabilidades:
 *  1. Exibir título, descrição e instruções da escala
 *  2. Renderizar barra de progresso em tempo real
 *  3. Listar todas as questões usando QuestionCard
 *  4. Gerenciar estado local das respostas
 *  5. Habilitar botão de finalização quando tudo estiver respondido
 *
 *  Props:
 *  - exam: objeto Exam com questões e configuração
 *  - onFinish: callback chamado com as respostas ao finalizar
 * ══════════════════════════════════════════════════════════════ */
import { useState } from "react";
import { Exam } from "@/data/exams";
import QuestionCard from "./QuestionCard";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

interface QuizPlayerProps {
  exam: Exam;                                      // Escala a ser aplicada
  onFinish: (answers: Record<string, number>) => void; // Callback ao finalizar
}

const QuizPlayer = ({ exam, onFinish }: QuizPlayerProps) => {
  /* Estado local — respostas do usuário.
   * Chave: ID da questão (ex.: "p1q1")
   * Valor: alternativa selecionada (ex.: 3) */
  const [answers, setAnswers] = useState<Record<string, number>>({});

  const total = exam.questions.length;          // Total de questões na escala
  const answered = Object.keys(answers).length; // Questões já respondidas
  const allAnswered = answered === total;       // Todas respondidas?

  /** Registra a resposta de uma questão no estado local.
   * Usa spread funcional para garantir atualização imutável. */
  const selectAnswer = (questionId: string, value: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* ── Cabeçalho — título, descrição e instruções ── */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-1">{exam.title}</h2>
        <p className="text-muted-foreground text-sm mb-3">{exam.description}</p>
        {/* Instruções detalhadas (quando fornecidas pela escala) */}
        {exam.instructions && (
          <div className="rounded-lg border border-border bg-secondary/40 p-4 text-sm text-foreground whitespace-pre-line">
            {exam.instructions}
          </div>
        )}
      </div>

      {/* ── Barra de progresso com gradiente ──
       * Largura calculada como porcentagem de questões respondidas.
       * Transição suave de 500ms para feedback visual fluido. */}
      <div className="w-full h-2.5 rounded-full bg-secondary/40 mb-2 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary to-primary/70 transition-all duration-500 ease-out"
          style={{ width: `${(answered / total) * 100}%` }}
        />
      </div>
      <p className="text-xs text-muted-foreground mb-8">{answered} de {total} respondidos</p>

      {/* ── Lista de questões ──
       * Cada questão é renderizada por um QuestionCard memoizado.
       * O estado selectedOption é controlado pelo QuizPlayer. */}
      <div className="space-y-6">
        {exam.questions.map((question, idx) => (
          <div key={question.id}>
            {/* Indicador de número da questão */}
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

      {/* ── Referências bibliográficas da escala ── */}
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

      {/* ── Botão de finalização ──
       * Desabilitado até que todas as questões sejam respondidas.
       * Ao clicar, chama onFinish com todas as respostas. */}
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

### `src/components/ResultsView.tsx`

```tsx
/* ══════════════════════════════════════════════════════════════
 *  VISUALIZAÇÃO DE RESULTADOS
 *
 *  Responsabilidades:
 *  1. Calcular escores totais (PSS-10) e médios (EET)
 *  2. Classificar nível de estresse com base nos escores
 *  3. Exibir resultados com indicadores visuais coloridos
 *  4. Gerar corpo de e-mail formatado com referências e LGPD
 *  5. Disponibilizar opção de envio por e-mail e reinício
 *
 *  Memoizado com React.memo para evitar re-renders desnecessários.
 * ══════════════════════════════════════════════════════════════ */
import { memo, useMemo, useCallback } from "react";
import { Exam, getScore } from "@/data/exams";
import { Home, AlertTriangle, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import procisaLogo from "@/assets/procisa-logo.png";
import ufrrLogo from "@/assets/ufrr-logo.png";

/** Resultado de uma escala individual */
interface ExamResult {
  exam: Exam;                       // Dados da escala
  answers: Record<string, number>;  // Respostas do usuário
}

interface ResultsViewProps {
  results: ExamResult[];            // Lista de resultados a exibir
  mode: "both" | "pss10" | "eet";  // Modo de realização
  onRestart: () => void;            // Callback para reiniciar o fluxo
}

/* ══════════════════════════════════════════
 *  FUNÇÕES PURAS DE CLASSIFICAÇÃO
 *  Retornam label e cor com base no escore.
 *  As cores usam tokens semânticos do design system.
 * ══════════════════════════════════════════ */

/** Classifica o nível de estresse pela PSS-10 (escore total: 0-40).
 * Referência: Oliveira et al. (2021). */
const getPSSLevel = (score: number) => {
  if (score <= 18) return { label: "Estresse Baixo", color: "text-success" };
  if (score <= 24) return { label: "Estresse Normal", color: "text-warning" };
  if (score <= 35) return { label: "Estresse Alto", color: "text-destructive/80" };
  return { label: "Estresse Muito Alto", color: "text-destructive" };
};

/** Classifica o nível de estresse pela EET (escore médio: 1-5).
 * Referência: Paschoal & Tamayo (2004). */
const getEETLevel = (avg: number) => {
  if (avg < 2.5) return { label: "Estresse Baixo ou Leve", color: "text-success" };
  if (avg === 2.5) return { label: "Estresse Médio/Considerável", color: "text-warning" };
  return { label: "Estresse Alto", color: "text-destructive" };
};

/** Versões texto-puro das classificações (para uso no corpo do e-mail) */
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

/* ── Textos de aviso (disclaimer) por modo de realização ── */
const DISCLAIMERS: Record<string, string> = {
  both: `Estas escalas são ferramentas úteis apenas para medir possíveis INDICATIVOS do Estresse Percebido e do Estresse No Trabalho, deste modo, NÃO DEVEM SER UTILIZADAS como ferramentas para o diagnóstico. Cabe lembrar que tais instrumentos não são de uso privativo.\n\nCaso você perceba que o estresse está sendo prejudicial e atrapalhando seu bem-estar procure ajuda qualificada.`,
  pss10: `Esta escala é uma ferramenta útil para medir possíveis INDICATIVOS de Estresse Percebido, deste modo, NÃO DEVE SER UTILIZADA como ferramenta para o diagnóstico. Cabe lembrar que tal instrumento não é de uso privativo.\n\nCaso você perceba que o estresse está sendo prejudicial e atrapalhando seu bem-estar procure ajuda qualificada.`,
  eet: `Esta escala é uma ferramenta útil para medir possíveis INDICATIVOS de Estresse No Trabalho, deste modo, NÃO DEVE SER UTILIZADA como ferramenta para o diagnóstico. Cabe lembrar que tal instrumento não é de uso privativo.\n\nCaso você perceba que o estresse está sendo prejudicial e atrapalhando seu bem-estar procure ajuda qualificada.`,
};

/* ══════════════════════════════════════════
 *  COMPONENTE PRINCIPAL
 * ══════════════════════════════════════════ */
const ResultsView = memo(({ results, mode, onRestart }: ResultsViewProps) => {
  const disclaimer = DISCLAIMERS[mode];

  /* ── Cálculo memoizado dos escores ──
   * Só recalcula quando os resultados mudam. */
  const computedResults = useMemo(() =>
    results.map(({ exam, answers }) => {
      /* Soma as pontuações de todas as questões, aplicando inversão quando necessário */
      const totalScore = exam.questions.reduce((sum, q) => {
        const selected = answers[q.id];
        return sum + (selected != null ? getScore(q, selected) : 0);
      }, 0);
      /* Para a EET, calcula-se a média (total dividido por 23 itens) */
      const eetAvg = exam.id === "prova2" ? parseFloat((totalScore / 23).toFixed(2)) : null;
      return { exam, totalScore, eetAvg };
    }),
    [results]
  );

  /** Constrói o corpo do e-mail com escores, classificações e referências.
   * Formato texto-puro para compatibilidade universal com clientes de e-mail. */
  const buildEmailBody = useCallback(() => {
    const now = new Date();
    const dataHora = now.toLocaleDateString("pt-BR", {
      day: "2-digit", month: "2-digit", year: "numeric",
    }) + " às " + now.toLocaleTimeString("pt-BR", {
      hour: "2-digit", minute: "2-digit",
    });

    let body = "RESULTADO FINAL - Escalas de Estresse (PROCISA/UFRR)\n";
    body += "Escores obtidos nas escalas aplicadas\n";
    body += `Data e hora da realização: ${dataHora}\n\n`;

    /* Adiciona resultado de cada escala realizada */
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

    /* Disclaimer e referências */
    body += "---\n\n";
    body += disclaimer;
    body += "\n\n---\n\n";

    /* Referências bibliográficas completas */
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

    /* Aviso LGPD */
    body += "---\n\n";
    body += "AVISO SOBRE PROTEÇÃO DE DADOS\n\n";
    body += "Os dados apresentados neste relatório foram produzidos e coletados em conformidade com a Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018 – LGPD). ";
    body += "As informações aqui contidas são de caráter pessoal e confidencial, destinando-se exclusivamente ao titular dos dados ou a profissional por ele autorizado. ";
    body += "O compartilhamento, a reprodução ou a divulgação deste conteúdo a terceiros sem o consentimento do titular é de inteira responsabilidade de quem o fizer. ";
    body += "Recomenda-se o armazenamento seguro deste documento e o descarte adequado quando não mais necessário.";

    return body;
  }, [computedResults, disclaimer, mode]);

  /** Abre o cliente de e-mail padrão com o relatório preenchido.
   * Usa protocolo mailto: com subject e body codificados em URI. */
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

      {/* ── Cartões de resultado por escala ── */}
      <div className="grid gap-8">
        {computedResults.map(({ exam, totalScore, eetAvg }) => {
          const stressLevel = exam.id === "prova1" ? getPSSLevel(totalScore) : null;
          const eetStressLevel = eetAvg != null ? getEETLevel(eetAvg) : null;

          return (
            <div key={exam.id} className="rounded-xl bg-card border border-border p-6 card-elevated">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-xl font-bold">{exam.title}</h3>
                <div className="text-right">
                  {/* PSS-10: exibe escore total */}
                  {exam.id === "prova1" && (
                    <>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">Escore Total</p>
                      <p className="text-3xl font-bold text-primary">{totalScore}</p>
                    </>
                  )}
                  {/* EET: exibe escore médio */}
                  {exam.id === "prova2" && eetAvg != null && (
                    <>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">Escore Médio</p>
                      <p className="text-3xl font-bold text-primary">{eetAvg.toFixed(2)}</p>
                    </>
                  )}
                  {/* Classificação colorida do nível de estresse */}
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
              {/* Referências bibliográficas da classificação utilizada */}
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

      {/* ── Aviso/disclaimer ── */}
      <div className="rounded-xl border border-border bg-secondary/30 p-6 mt-8">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-warning mt-0.5 shrink-0" />
          <p className="text-sm text-muted-foreground whitespace-pre-line">{disclaimer}</p>
        </div>
      </div>

      {/* ── Ações — enviar por e-mail e reiniciar ── */}
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

### `src/components/AboutSection.tsx`

```tsx
/* ══════════════════════════════════════════════════════════════
 *  SEÇÃO SOBRE — Informações institucionais e dos autores
 *
 *  Exibe:
 *  1. Cartão institucional com logos do PROCISA e UFRR
 *  2. Descrição do contexto acadêmico do projeto
 *  3. Perfis dos autores com foto e biografia
 *
 *  As fotos dos autores usam loading="lazy" pois estão abaixo do fold.
 * ══════════════════════════════════════════════════════════════ */
import procisaLogo from "@/assets/procisa-logo.png";
import ufrrLogo from "@/assets/ufrr-logo.png";
import edilanePhoto from "@/assets/edilane-photo.gif";
import italoPhoto from "@/assets/italo-photo.gif";

const AboutSection = () => {
  return (
    <section className="max-w-3xl mx-auto mt-16 mb-10">
      <h2 className="text-2xl font-bold text-center mb-6">Sobre</h2>

      {/* Cartão institucional — contexto acadêmico do projeto */}
      <div className="rounded-xl border border-border bg-card p-6 mb-8 text-center card-elevated">
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

      {/* Cartões dos autores — grid responsivo (1 coluna em mobile, 2 em desktop) */}
      <div className="grid gap-8 md:grid-cols-2">
        {/* ── Orientadora — Prof.ª Dr.ª Edilane ── */}
        <div className="rounded-xl border border-border bg-card p-6 card-elevated">
          <div className="flex flex-col items-center mb-4">
            <img
              src={edilanePhoto}
              alt="Profa. Dra. Edilane Nunes Régis Bezerra"
              loading="lazy" /* Carregamento preguiçoso — abaixo do fold */
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

        {/* ── Autor — Me. Ítalo ── */}
        <div className="rounded-xl border border-border bg-card p-6 card-elevated">
          <div className="flex flex-col items-center mb-4">
            <img
              src={italoPhoto}
              alt="Me. Ítalo Ribeiro Kunzler Machado Marques"
              loading="lazy" /* Carregamento preguiçoso — abaixo do fold */
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

### `src/components/NavLink.tsx`

```tsx
/* ══════════════════════════════════════════════════════════════
 *  NAVLINK REUTILIZÁVEL
 *
 *  Wrapper do NavLink do React Router que simplifica o uso
 *  de classes condicionais para estado ativo e pendente.
 *
 *  Em vez de usar uma função em className:
 *    className={({ isActive }) => cn("link", isActive && "active")}
 *
 *  Pode-se usar props declarativas:
 *    <NavLink className="link" activeClassName="active" to="/" />
 *
 *  Componente mantido em um único lugar e reutilizado em toda a app.
 * ══════════════════════════════════════════════════════════════ */
import { NavLink as RouterNavLink, NavLinkProps } from "react-router-dom";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface NavLinkCompatProps extends Omit<NavLinkProps, "className"> {
  className?: string;         // Classes CSS base (sempre aplicadas)
  activeClassName?: string;   // Classes CSS adicionais quando a rota está ativa
  pendingClassName?: string;  // Classes CSS adicionais quando a navegação está pendente
}

const NavLink = forwardRef<HTMLAnchorElement, NavLinkCompatProps>(
  ({ className, activeClassName, pendingClassName, to, ...props }, ref) => {
    return (
      <RouterNavLink
        ref={ref}
        to={to}
        className={({ isActive, isPending }) =>
          cn(className, isActive && activeClassName, isPending && pendingClassName)
        }
        {...props}
      />
    );
  },
);

NavLink.displayName = "NavLink";

export { NavLink };
```

### `tailwind.config.ts`

```tsx
/* ══════════════════════════════════════════════════════════════
 *  CONFIGURAÇÃO DO TAILWIND CSS
 *
 *  Define:
 *  1. Modo escuro via classe (.dark)
 *  2. Caminhos de conteúdo para purge de CSS
 *  3. Cores semânticas mapeadas dos tokens CSS (index.css)
 *  4. Arredondamento de bordas baseado em --radius
 *  5. Animações para accordion (Radix UI)
 *  6. Sombras padronizadas via variáveis CSS
 *  7. Famílias tipográficas
 * ══════════════════════════════════════════════════════════════ */
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"], // Ativa tema escuro via classe .dark no <html>
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,           // Container centralizado
      padding: "2rem",        // Padding interno de 2rem
      screens: { "2xl": "1400px" }, // Largura máxima em telas 2xl
    },
    extend: {
      /* ── Cores semânticas ──
       * Mapeiam variáveis CSS de index.css para classes Tailwind.
       * Uso: bg-primary, text-muted-foreground, border-border, etc. */
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        /* Cores de feedback semântico */
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
        },
        /* Sidebar (reservado para expansão futura) */
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      /* ── Arredondamento de bordas baseado no token --radius ── */
      borderRadius: {
        lg: "var(--radius)",                    // 12px
        md: "calc(var(--radius) - 2px)",        // 10px
        sm: "calc(var(--radius) - 4px)",        // 8px
      },
      /* ── Animações para accordion (Radix UI) ── */
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      /* ── Sombras padronizadas via variáveis CSS ── */
      boxShadow: {
        "2xs": "var(--shadow-2xs)",
        xs: "var(--shadow-xs)",
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
        xl: "var(--shadow-xl)",
        "2xl": "var(--shadow-2xl)",
      },
      /* ── Famílias tipográficas ── */
      fontFamily: {
        sans: ["Work Sans", "ui-sans-serif", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "Noto Sans", "sans-serif"],
        serif: ["Lora", "ui-serif", "Georgia", "Cambria", "Times New Roman", "Times", "serif"],
        mono: ["Inconsolata", "ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "Liberation Mono", "Courier New", "monospace"],
      },
    },
  },
  plugins: [require("tailwindcss-animate")], // Plugin para animações CSS do Tailwind
} satisfies Config;
```

### `vite.config.ts`

```tsx
/* ══════════════════════════════════════════════════════════════
 *  CONFIGURAÇÃO DO VITE
 *
 *  Define:
 *  1. Servidor de desenvolvimento (porta 8080, aceita todas as interfaces)
 *  2. Plugin React com SWC (mais rápido que Babel para transpilação)
 *  3. Plugin de tagging de componentes (apenas em desenvolvimento)
 *  4. Alias @ → src/ para imports limpos
 *  5. Desativação do overlay de erro do HMR
 * ══════════════════════════════════════════════════════════════ */
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc"; // Plugin React com SWC — mais rápido que Babel
import path from "path";
import { componentTagger } from "lovable-tagger"; // Plugin de identificação de componentes Lovable

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",       // Aceita conexões de qualquer interface de rede
    port: 8080,       // Porta do servidor de desenvolvimento
    hmr: {
      overlay: false, // Desativa overlay visual de erros do HMR (Hot Module Replacement)
    },
  },
  plugins: [
    react(),                                          // Transpilação JSX/TSX via SWC
    mode === "development" && componentTagger(),       // Tagging apenas em dev
  ].filter(Boolean), // Remove valores falsy (componentTagger em produção)
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // Alias @ aponta para src/
      // Permite imports como: import { cn } from "@/lib/utils"
    },
  },
}));
```

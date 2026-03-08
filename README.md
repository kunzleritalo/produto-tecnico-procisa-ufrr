# Escalas de Estresse – PROCISA

Aplicação web para aplicação e avaliação das escalas **PSS-10** (Estresse Percebido) e **EET** (Estresse no Trabalho), desenvolvida no âmbito do Programa de Pós-graduação em Ciências da Saúde (PROCISA) da Universidade Federal de Roraima (UFRR).

Esta ferramenta foi desenvolvida em estrita consonância com as diretrizes da CAPES para a produção de Produtos Técnicos e Tecnológicos (PTT), fundamentando-se nos critérios de avaliação do Relatório do Grupo de Trabalho (GT) de Produção Técnica.

---

## Sumário

1. [Visão Geral](#visão-geral)
2. [Tecnologias](#tecnologias)
3. [Estrutura de Pastas](#estrutura-de-pastas)
4. [Princípios de Arquitetura](#princípios-de-arquitetura)
5. [Design System](#design-system)
6. [Otimização de Banco de Dados e Performance](#otimização-de-banco-de-dados-e-performance)
7. [Componentes Reutilizáveis](#componentes-reutilizáveis)
8. [Como Executar](#como-executar)
9. [Deploy](#deploy)
10. [Referências Científicas](#referências-científicas)
11. [Código Completo Comentado](#código-completo-comentado)

---

## Visão Geral

O site permite que o usuário:

- Escolha realizar a PSS-10, a EET ou ambas em sequência.
- Leia instruções gerais antes de iniciar (sem respostas certas/erradas, responder espontaneamente, dados não armazenados).
- Responda aos itens de cada escala em uma interface responsiva e intuitiva.
- Visualize os escores (total ou médio) e a classificação de estresse.
- Envie os resultados por e-mail, incluindo referências bibliográficas, data/hora e aviso LGPD.

---

## Tecnologias

| Tecnologia         | Papel                                         |
| ------------------- | ---------------------------------------------- |
| **React 18**        | Biblioteca de interfaces reativas              |
| **TypeScript**      | Tipagem estática para segurança do código      |
| **Vite**            | Bundler ultrarrápido com HMR                   |
| **Tailwind CSS**    | Estilização utilitária com design tokens       |
| **shadcn/ui**       | Componentes acessíveis baseados em Radix UI    |
| **React Router v6** | Roteamento SPA                                 |
| **TanStack Query**  | Gerenciamento de estado assíncrono e cache      |
| **Lucide React**    | Ícones SVG consistentes                        |

---

## Estrutura de Pastas

```
src/
├── assets/               # Imagens e logos (importados como módulos ES6)
│   ├── procisa-logo.png
│   ├── edilane-photo.gif
│   └── italo-photo.gif
├── components/
│   ├── ui/               # Componentes primitivos (shadcn/ui) — NÃO EDITAR diretamente
│   ├── AboutSection.tsx   # Seção "Sobre" com informações dos autores e CAPES
│   ├── NavLink.tsx        # Wrapper de NavLink do React Router
│   ├── QuestionCard.tsx   # Cartão individual de pergunta com opções (memo)
│   ├── QuizPlayer.tsx     # Controlador do fluxo de cada escala
│   └── ResultsView.tsx    # Exibição de resultados, envio por e-mail (memo)
├── data/
│   └── exams.ts           # Definições das escalas (PSS-10 e EET)
├── hooks/                 # Hooks customizados (mobile, toast)
├── lib/
│   └── utils.ts           # Utilitários (função cn para classes Tailwind)
├── pages/
│   ├── Index.tsx           # Página principal (Welcome → Quiz → Resultados)
│   └── NotFound.tsx        # Página 404
├── index.css              # Variáveis CSS do design system (tokens)
├── App.tsx                # Configuração de rotas e providers globais
└── main.tsx               # Ponto de entrada da aplicação
```

---

## Princípios de Arquitetura

### 1. Separação de responsabilidades

- **Dados** (`data/exams.ts`): textos, opções, regras de inversão — isolados da UI.
- **Componentes de apresentação** (`QuestionCard`, `ResultsView`): recebem props, sem lógica de negócio.
- **Componentes controladores** (`QuizPlayer`, `Index`): gerenciam estado e fluxo.

### 2. Fluxo de estado unidirecional

```
Index (phase + answers)
  └── QuizPlayer (respostas parciais)
       └── QuestionCard (seleção individual)
```

O estado flui de cima para baixo; callbacks (`onFinish`, `onSelect`) sobem eventos.

### 3. Componentes pequenos e focados

Cada componente tem uma única responsabilidade. Isso facilita testes, reutilização e manutenção.

### 4. Design tokens semânticos

Cores nunca são usadas diretamente nos componentes (ex.: `bg-blue-500`). Sempre se usam tokens semânticos (`bg-primary`, `text-muted-foreground`) definidos em `index.css` e mapeados em `tailwind.config.ts`.

### 5. Performance

- `React.memo` em componentes de apresentação (`QuestionCard`, `ResultsView`) para evitar re-renders desnecessários.
- `useCallback` e `useMemo` em handlers e cálculos derivados.
- `lazy()` + `Suspense` para code-splitting de `ResultsView` e `AboutSection`.
- `loading="lazy"` em imagens fora do viewport inicial.

---

## Design System

### Tokens Semânticos (index.css)

Cores definidas em HSL, mapeadas em `tailwind.config.ts`:

| Token                   | Uso                                   |
| ----------------------- | ------------------------------------- |
| `bg-background`         | Fundo geral da página                 |
| `bg-card`               | Fundo de cartões                      |
| `text-foreground`       | Texto principal                       |
| `text-muted-foreground` | Texto secundário/atenuado             |
| `bg-primary`            | Botões primários, destaques           |
| `text-primary`          | Escores, ícones de destaque           |
| `border-border`         | Bordas de cards e separadores         |
| `bg-secondary`          | Fundos sutis, barras de progresso     |
| `text-success`          | Classificação positiva (estresse baixo) |
| `text-warning`          | Classificação intermediária           |
| `text-destructive`      | Classificação alta (estresse alto)    |

### Fontes

| Variável          | Fonte           | Uso               |
| ----------------- | --------------- | ------------------ |
| `--font-heading`  | Space Grotesk   | Títulos (h1–h6)   |
| `--font-body`     | Inter           | Corpo de texto     |
| `--font-sans`     | Work Sans       | Sans-serif geral   |
| `--font-serif`    | Lora            | Serif (se necessário) |
| `--font-mono`     | Inconsolata     | Código monospace   |

---

## Otimização de Banco de Dados e Performance

Embora a aplicação atual seja client-side (sem banco de dados), estes princípios devem ser seguidos ao integrar um backend (ex.: Lovable Cloud):

### Ordem correta de consultas

```
1. Autenticação → verificar sessão do usuário
2. Autorização  → verificar permissões (RLS)
3. Consulta     → buscar apenas os campos necessários (select parcial)
4. Filtragem    → aplicar filtros no servidor (.eq(), .gte(), .in())
5. Paginação    → limitar resultados (.range(0, 19))
6. Ordenação    → ordenar no servidor (.order())
```

### Caching com TanStack Query

```tsx
// Configuração recomendada por tipo de dado
const configuracoes = {
  estatico: { staleTime: 30 * 60 * 1000, gcTime: 60 * 60 * 1000 },
  usuario: { staleTime: 5 * 60 * 1000, gcTime: 10 * 60 * 1000, refetchOnWindowFocus: true },
  tempoReal: { staleTime: 0, refetchInterval: 30 * 1000 },
};
```

### Lazy Loading

```tsx
const ResultsView = lazy(() => import("@/components/ResultsView"));
<Suspense fallback={<Skeleton className="h-64" />}>
  <ResultsView ... />
</Suspense>
```

### Boas práticas adicionais

- **Paginação**: para listas longas, usar `range()`.
- **Índices**: criar índices nas colunas usadas em `WHERE` e `ORDER BY`.
- **Debounce em buscas**: `useDeferredValue` do React 18.
- **Prefetch**: carregar dados da próxima página antes do usuário navegar.

---

## Componentes Reutilizáveis

### Componentes primitivos (`src/components/ui/`)

| Componente  | Uso típico                                  |
| ----------- | -------------------------------------------- |
| `Button`    | Ações primárias, secundárias, outline, ghost |
| `Card`      | Containers visuais com borda e sombra        |
| `Progress`  | Barras de progresso                          |
| `Separator` | Divisores visuais                            |
| `Skeleton`  | Placeholders de carregamento (lazy loading)  |
| `Toast`     | Notificações temporárias                     |
| `Dialog`    | Modais de confirmação                        |

### Componentes de domínio (`src/components/`)

| Componente       | Responsabilidade                                       | Memo? |
| ---------------- | ------------------------------------------------------- | ----- |
| `QuestionCard`   | Renderiza uma pergunta com N opções selecionáveis       | ✅     |
| `QuizPlayer`     | Orquestra o fluxo de um exame qualquer                  | —     |
| `ResultsView`    | Exibe escores e classificações de múltiplas escalas     | ✅     |
| `AboutSection`   | Informações institucionais, autores e CAPES             | —     |
| `NavLink`        | Link de navegação com suporte a classe ativa            | —     |

---

## Como Executar

```sh
git clone <URL_DO_REPOSITORIO>
cd escalas-estresse-procisa
npm install
npm run dev
```

---

## Deploy

Abra o projeto em [Lovable](https://lovable.dev) e clique em **Share → Publish**.

---

## Referências Científicas

- **PSS-10**: Cohen, S., Kamarck, T., & Mermelstein, R. (1983). A global measure of perceived stress. *Journal of Health and Social Behavior*, 24(4), 385-396.
- **PSS-10 (validação brasileira)**: Siqueira Reis, R., Ferreira Hino, A. A., & Romélio Rodriguez Añez, C. (2010). Perceived Stress Scale: Reliability and validity study in Brazil. *Journal of Health Psychology*, 15(1), 107-114.
- **EET**: Paschoal, T., & Tamayo, A. (2004). Validação da Escala de Estresse no Trabalho. *Estudos de Psicologia*, 9(1), 45-52.
- **Classificação PSS-10**: Oliveira, J. C. et al. (2021). The impact of COVID-19 on the physical and emotional health of health professionals. *Research, Society and Development*, v. 10, n. 10, e163101018744.

---

## Código Completo Comentado

Abaixo está o código completo de todos os arquivos da aplicação, com comentários detalhados em português brasileiro.

---

### `src/main.tsx` — Ponto de entrada

```tsx
// Importa a função createRoot do React DOM para renderização moderna (React 18+)
import { createRoot } from "react-dom/client";

// Importa o componente raiz da aplicação
import App from "./App.tsx";

// Importa os estilos globais (design tokens, fontes, reset)
import "./index.css";

// Monta a aplicação React no elemento HTML com id "root"
// O operador "!" (non-null assertion) garante ao TypeScript que o elemento existe
createRoot(document.getElementById("root")!).render(<App />);
```

---

### `src/App.tsx` — Configuração de rotas e providers

```tsx
// Componente de notificações estilo toast (canto inferior)
import { Toaster } from "@/components/ui/toaster";

// Componente de notificações estilo sonner (topo, mais moderno)
import { Toaster as Sonner } from "@/components/ui/sonner";

// Provider que habilita tooltips em toda a aplicação
import { TooltipProvider } from "@/components/ui/tooltip";

// TanStack Query: gerenciamento de cache e estado assíncrono
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// React Router: roteamento SPA (Single Page Application)
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Páginas da aplicação
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Cria uma instância do QueryClient para cache de dados
const queryClient = new QueryClient();

// Componente raiz: envolve toda a aplicação com providers necessários
const App = () => (
  // Provider do TanStack Query — disponibiliza cache para toda a árvore
  <QueryClientProvider client={queryClient}>
    {/* Provider de tooltips — necessário para componentes shadcn */}
    <TooltipProvider>
      {/* Sistemas de notificação globais */}
      <Toaster />
      <Sonner />
      {/* Roteador da aplicação */}
      <BrowserRouter>
        <Routes>
          {/* Rota principal — página inicial com as escalas */}
          <Route path="/" element={<Index />} />
          {/* Rota coringa — qualquer URL não reconhecida vai para 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
```

---

### `src/lib/utils.ts` — Utilitário de classes CSS

```tsx
// clsx: combina classes condicionalmente (ex.: clsx("a", false && "b") → "a")
import { clsx, type ClassValue } from "clsx";

// twMerge: resolve conflitos de classes Tailwind (ex.: "p-4 p-2" → "p-2")
import { twMerge } from "tailwind-merge";

// Função utilitária usada em todos os componentes para mesclar classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

---

### `src/data/exams.ts` — Definições das escalas

```tsx
// === INTERFACES ===

// Cada questão possui: id único, texto, número de opções e flag de inversão
export interface Question {
  id: string;
  text: string;
  numOptions: number;
  inverted: boolean; // itens invertidos têm pontuação reversa
}

// Cada exame (escala) possui: id, título, descrição, instruções, rótulos e questões
export interface Exam {
  id: string;
  title: string;
  description: string;
  instructions?: string;       // instruções específicas da escala
  optionLabels?: string[];      // rótulos textuais para cada alternativa
  startFrom?: number;           // valor inicial das alternativas (0 para PSS, 1 para EET)
  questions: Question[];
}

// === GERADOR DE QUESTÕES ===

// Gera N questões a partir de um prefixo, quantidade, número de opções e itens invertidos
function generateQuestions(
  prefix: string,
  count: number,
  numOptions: number,
  invertedItems: number[] = [],
  texts?: string[]
): Question[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `${prefix}q${i + 1}`,
    text: texts?.[i] ?? `Item ${i + 1}`,
    numOptions,
    inverted: invertedItems.includes(i + 1),
  }));
}

// === TEXTOS DAS QUESTÕES ===

// PSS-10: 10 itens sobre estresse percebido nos últimos 30 dias
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

// EET: 23 itens sobre estresse no ambiente de trabalho
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

// === DEFINIÇÃO DAS ESCALAS ===

export const exams: Exam[] = [
  {
    id: "prova1",
    title: "PSS-10 – Escala de Estresse Percebido",
    description: "10 itens · Alternativas de 0 a 4.",
    instructions: "As questões nesta escala perguntam a respeito dos seus sentimentos e pensamentos durante os últimos 30 dias (último mês). Em cada questão, indique a frequência com que você se sentiu ou pensou a respeito da situação vivenciada, seguindo a escala abaixo:\n\n0 – Nunca | 1 – Quase Nunca | 2 – Às Vezes | 3 – Pouco Frequente | 4 – Muito Frequente",
    optionLabels: ["Nunca", "Quase Nunca", "Às Vezes", "Pouco Frequente", "Muito Frequente"],
    // Itens invertidos: 4, 5, 7 e 8 (pontuação reversa)
    questions: generateQuestions("p1", 10, 5, [4, 5, 7, 8], pss10Texts),
  },
  {
    id: "prova2",
    title: "EET – Escala de Estresse no Trabalho",
    description: "23 itens · Alternativas de 1 a 5",
    instructions: "As questões nesta escala listam várias situações que podem ocorrer no dia a dia de seu trabalho. Leia com atenção cada afirmativa e utilize a escala apresentada a seguir para dar sua opinião sobre cada uma delas:\n\n1 – Discordo Totalmente | 2 – Discordo | 3 – Concordo em Parte | 4 – Concordo | 5 – Concordo Totalmente\n\nPara cada item, marque o número que melhor corresponde à sua resposta.\nAo marcar o número 1, você indica discordar totalmente da afirmativa.\nAssinalando o número 5, você indica concordar totalmente com a afirmativa.\nObserve que, quanto menor o número, mais você discorda da afirmativa e, quanto maior o número, mais você concorda com a afirmativa.",
    optionLabels: ["", "Discordo Totalmente", "Discordo", "Concordo em parte", "Concordo", "Concordo Totalmente"],
    startFrom: 1, // alternativas começam em 1 (não em 0)
    // Sem itens invertidos na EET
    questions: generateQuestions("p2", 23, 5, [], eetTexts),
  },
];

// === FUNÇÃO DE PONTUAÇÃO ===

// Calcula o escore de um item conforme o valor selecionado
// Para itens invertidos: escore = (numOptions - 1) - valor
export function getScore(question: Question, selectedValue: number): number {
  if (question.inverted) {
    return (question.numOptions - 1) - selectedValue;
  }
  return selectedValue;
}
```

---

### `src/components/QuestionCard.tsx` — Cartão de pergunta (memo)

```tsx
import { memo } from "react";
import { Question } from "@/data/exams";
import { cn } from "@/lib/utils";

// Props do componente: questão, opção selecionada, callback de seleção,
// rótulos opcionais das alternativas e valor inicial
interface QuestionCardProps {
  question: Question;
  selectedOption: number | null;
  onSelect: (value: number) => void;
  optionLabels?: string[];
  startFrom?: number;
}

// React.memo evita re-renders quando as props não mudam
// (importante pois há muitos QuestionCards renderizados simultaneamente)
const QuestionCard = memo(({ question, selectedOption, onSelect, optionLabels, startFrom = 0 }: QuestionCardProps) => {
  // Gera array de valores das alternativas (ex.: [0,1,2,3,4] ou [1,2,3,4,5])
  const options = Array.from({ length: question.numOptions }, (_, i) => i + startFrom);

  return (
    <div className="rounded-xl bg-card border border-border p-6 shadow-sm">
      {/* Texto da questão */}
      <h3 className="text-lg font-semibold mb-1 leading-relaxed">{question.text}</h3>
      {/* Espaçador invisível para itens invertidos (mantém altura consistente) */}
      {question.inverted && (
        <p className="text-xs text-muted-foreground mb-4 italic">​</p>
      )}
      {/* Grid de botões de alternativas */}
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
              {/* Rótulo textual da alternativa (ex.: "Nunca", "Às Vezes") */}
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

### `src/components/QuizPlayer.tsx` — Controlador do fluxo de cada escala

```tsx
import { useState } from "react";
import { Exam } from "@/data/exams";
import QuestionCard from "./QuestionCard";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

// Props: exame a ser aplicado e callback ao finalizar
interface QuizPlayerProps {
  exam: Exam;
  onFinish: (answers: Record<string, number>) => void;
}

const QuizPlayer = ({ exam, onFinish }: QuizPlayerProps) => {
  // Estado local: respostas parciais durante a escala
  const [answers, setAnswers] = useState<Record<string, number>>({});

  const total = exam.questions.length;
  const answered = Object.keys(answers).length;
  const allAnswered = answered === total; // habilita botão "Finalizar"

  // Registra a resposta de uma questão
  const selectAnswer = (questionId: string, value: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Título e instruções da escala */}
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
      <div className="w-full h-2 rounded-full bg-secondary mb-2 overflow-hidden">
        <div
          className="h-full rounded-full bg-primary transition-all duration-500"
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

      {/* Referências bibliográficas da escala */}
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

      {/* Botão de finalização — só habilitado quando todas as questões forem respondidas */}
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

### `src/components/ResultsView.tsx` — Exibição de resultados (memo)

```tsx
import { memo, useMemo, useCallback } from "react";
import { Exam, getScore } from "@/data/exams";
import { Home, AlertTriangle, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import procisaLogo from "@/assets/procisa-logo.png";

// Interface de resultado: exame + respostas do usuário
interface ExamResult {
  exam: Exam;
  answers: Record<string, number>;
}

interface ResultsViewProps {
  results: ExamResult[];
  mode: "both" | "pss10" | "eet";
  onRestart: () => void;
}

// === Funções puras de classificação ===

// PSS-10: classifica pelo escore total (0–40)
const getPSSLevel = (score: number) => {
  if (score <= 18) return { label: "Estresse Baixo", color: "text-success" };
  if (score <= 24) return { label: "Estresse Normal", color: "text-warning" };
  if (score <= 35) return { label: "Estresse Alto", color: "text-destructive/80" };
  return { label: "Estresse Muito Alto", color: "text-destructive" };
};

// EET: classifica pelo escore médio (total / 23)
const getEETLevel = (avg: number) => {
  if (avg < 2.5) return { label: "Estresse Baixo ou Leve", color: "text-success" };
  if (avg === 2.5) return { label: "Estresse Médio/Considerável", color: "text-warning" };
  return { label: "Estresse Alto", color: "text-destructive" };
};

// Versões texto-puro para uso no corpo do e-mail
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

// === Disclaimers por modo ===
// "procure ajuda qualificada" em todos os modos

const DISCLAIMERS: Record<string, string> = {
  both: `Estas escalas são ferramentas úteis apenas para medir possíveis INDICATIVOS do Estresse Percebido e do Estresse No Trabalho, deste modo, NÃO DEVEM SER UTILIZADAS como ferramentas para o diagnóstico. Cabe lembrar que tais instrumentos não são de uso privativo.\n\nCaso você perceba que o estresse está sendo prejudicial e atrapalhando seu bem-estar procure ajuda qualificada.`,
  pss10: `Esta escala é uma ferramenta útil para medir possíveis INDICATIVOS de Estresse Percebido, deste modo, NÃO DEVE SER UTILIZADA como ferramenta para o diagnóstico. Cabe lembrar que tal instrumento não é de uso privativo.\n\nCaso você perceba que o estresse está sendo prejudicial e atrapalhando seu bem-estar procure ajuda qualificada.`,
  eet: `Esta escala é uma ferramenta útil para medir possíveis INDICATIVOS de Estresse No Trabalho, deste modo, NÃO DEVE SER UTILIZADA como ferramenta para o diagnóstico. Cabe lembrar que tal instrumento não é de uso privativo.\n\nCaso você perceba que o estresse está sendo prejudicial e atrapalhando seu bem-estar procure ajuda qualificada.`,
};

// === Componente principal ===

const ResultsView = memo(({ results, mode, onRestart }: ResultsViewProps) => {
  const disclaimer = DISCLAIMERS[mode];

  // Calcula escores uma única vez (useMemo)
  const computedResults = useMemo(() =>
    results.map(({ exam, answers }) => {
      const totalScore = exam.questions.reduce((sum, q) => {
        const selected = answers[q.id];
        return sum + (selected != null ? getScore(q, selected) : 0);
      }, 0);
      const eetAvg = exam.id === "prova2" ? parseFloat((totalScore / 23).toFixed(2)) : null;
      return { exam, totalScore, eetAvg };
    }),
    [results]
  );

  // Constrói o corpo do e-mail com resultados, referências e aviso LGPD
  const buildEmailBody = useCallback(() => {
    const now = new Date();
    const dataHora = now.toLocaleDateString("pt-BR", {
      day: "2-digit", month: "2-digit", year: "numeric",
    }) + " às " + now.toLocaleTimeString("pt-BR", {
      hour: "2-digit", minute: "2-digit",
    });

    let body = "RESULTADO - Escalas de Estresse (PROCISA)\n";
    body += `Data e hora da realização: ${dataHora}\n\n`;

    computedResults.forEach(({ exam, totalScore, eetAvg }) => {
      body += `--- ${exam.title} ---\n`;

      if (exam.id === "prova1") {
        body += `Escore Total: ${totalScore}\n`;
        body += `Classificação: ${getPSSLevelText(totalScore)}\n`;
        body += `Os resultados aqui apresentados foram organizados e categorizados a partir do trabalho de OLIVEIRA, J. C. et al. ...\n\n`;
      }

      if (exam.id === "prova2" && eetAvg != null) {
        body += `Escore Médio: ${eetAvg.toFixed(2)}\n`;
        body += `Classificação: ${getEETLevelText(eetAvg)}\n`;
        body += `Valores categorizados a partir de: PASCHOAL, T.; TAMAYO, A. ...\n\n`;
      }
    });

    body += "---\n\n" + disclaimer + "\n\n---\n\n";
    body += "REFERÊNCIAS\n\n";
    // ... referências e aviso LGPD
    return body;
  }, [computedResults, disclaimer, mode]);

  // Abre cliente de e-mail com mailto:
  const handleSendEmail = useCallback(() => {
    const subject = encodeURIComponent("Resultado - Escalas de Estresse (PROCISA)");
    const body = encodeURIComponent(buildEmailBody());
    window.open(`mailto:?subject=${subject}&body=${body}`, "_self");
  }, [buildEmailBody]);

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Cabeçalho com logo e título */}
      <div className="text-center mb-10">
        <img src={procisaLogo} alt="Logo PROCISA" className="h-14 mx-auto mb-4" />
        <h2 className="text-3xl font-bold mb-2">Resultado Final</h2>
        <p className="text-muted-foreground">Escores obtidos nas escalas aplicadas</p>
      </div>

      {/* Cards de resultado para cada escala */}
      <div className="grid gap-8">
        {computedResults.map(({ exam, totalScore, eetAvg }) => {
          const stressLevel = exam.id === "prova1" ? getPSSLevel(totalScore) : null;
          const eetStressLevel = eetAvg != null ? getEETLevel(eetAvg) : null;

          return (
            <div key={exam.id} className="rounded-xl bg-card border border-border p-6 shadow-sm">
              {/* Título e escore */}
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
                  {/* Classificação colorida */}
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
              {/* Referência da classificação PSS-10 */}
              {exam.id === "prova1" && (
                <p className="text-[11px] text-muted-foreground/70 leading-snug mt-2">
                  Os resultados aqui apresentados foram organizados e categorizados a partir do trabalho de OLIVEIRA, J. C. et al. ...
                </p>
              )}
              {/* Referência da classificação EET */}
              {exam.id === "prova2" && (
                <p className="text-[11px] text-muted-foreground/70 leading-snug mt-2">
                  Valores organizados e categorizados a partir de: PASCHOAL, T.; TAMAYO, A. ...
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Disclaimer com ícone de alerta */}
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

### `src/components/AboutSection.tsx` — Seção "Sobre" com informações CAPES

```tsx
import procisaLogo from "@/assets/procisa-logo.png";
import edilanePhoto from "@/assets/edilane-photo.gif";
import italoPhoto from "@/assets/italo-photo.gif";

const AboutSection = () => {
  return (
    <section className="max-w-3xl mx-auto mt-16 mb-10">
      <h2 className="text-2xl font-bold text-center mb-6">Sobre</h2>

      {/* Card institucional com logo e informações CAPES */}
      <div className="rounded-xl border border-border bg-card p-6 mb-8 text-center">
        <img src={procisaLogo} alt="Logo PROCISA" className="h-20 mx-auto mb-4" />
        <p className="text-sm text-muted-foreground text-center">
          Esta ferramenta digital foi criada pelo Mestre em Ciências da Saúde
          <strong> Ítalo Ribeiro Kunzler Machado Marques</strong> sob orientação da
          <strong> Professora Doutora Edilane Nunes Régis Bezerra</strong> dentro do
          Programa de Pós-graduação em Ciências da Saúde PROCISA – UFRR.
        </p>
        <p className="text-sm text-muted-foreground text-center mt-3">
          Esta ferramenta foi desenvolvida em estrita consonância com as diretrizes da
          Coordenação de Aperfeiçoamento de Pessoal de Nível Superior (CAPES) para a
          produção de Produtos Técnicos e Tecnológicos (PTT). Seu desenvolvimento
          fundamenta-se nos critérios de avaliação estabelecidos pelo Relatório do
          Grupo de Trabalho (GT) de Produção Técnica da CAPES.
        </p>
      </div>

      {/* Grid com perfis dos autores (fotos com lazy loading) */}
      <div className="grid gap-8 md:grid-cols-2">
        {/* Card da orientadora */}
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex flex-col items-center mb-4">
            <img
              src={edilanePhoto}
              alt="Profa. Dra. Edilane Nunes Régis Bezerra"
              loading="lazy"
              className="w-28 h-28 rounded-full object-cover border-2 border-primary/30 mb-3" />
            <h3 className="font-bold text-sm text-center">Prof.ª Dr.ª Edilane Nunes Régis Bezerra</h3>
            <p className="text-xs text-muted-foreground">Orientadora</p>
          </div>
          {/* Biografia completa */}
          <p className="text-xs text-muted-foreground leading-relaxed text-justify">...</p>
        </div>

        {/* Card do autor */}
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
          {/* Biografia completa */}
          <p className="text-xs text-muted-foreground leading-relaxed text-justify">...</p>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
```

---

### `src/pages/Index.tsx` — Página principal (com lazy loading e otimizações)

```tsx
import { useState, useCallback, useMemo, lazy, Suspense } from "react";
import { exams } from "@/data/exams";
import QuizPlayer from "@/components/QuizPlayer";
import { Button } from "@/components/ui/button";
import { ArrowRight, HeartPulse, Briefcase, Info } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import procisaLogo from "@/assets/procisa-logo.png";

// Lazy loading: componentes pesados carregados sob demanda (code-splitting)
const ResultsView = lazy(() => import("@/components/ResultsView"));
const AboutSection = lazy(() => import("@/components/AboutSection"));

// Tipos do fluxo
type Phase = "welcome" | "exam1" | "exam2" | "results";
type Mode = "both" | "pss10" | "eet";

interface ExamAnswers {
  exam1: Record<string, number>;
  exam2: Record<string, number>;
}

// Utilitário para scroll suave ao topo
const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

const Index = () => {
  const [phase, setPhase] = useState<Phase>("welcome");
  const [mode, setMode] = useState<Mode>("both");
  const [answers, setAnswers] = useState<ExamAnswers>({ exam1: {}, exam2: {} });

  // Callbacks estabilizados com useCallback (evita re-renders em filhos)
  const handleFinishExam1 = useCallback((a: Record<string, number>) => { ... }, [mode]);
  const handleFinishExam2 = useCallback((a: Record<string, number>) => { ... }, []);
  const startExams = useCallback((selectedMode: Mode) => { ... }, []);
  const restart = useCallback(() => { ... }, []);

  // Resultados memoizados (recalcula só quando mode ou answers mudam)
  const results = useMemo(() => { ... }, [mode, answers]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header fixo */}
      <header>...</header>

      <main className="px-4 py-10">
        {/* Fase: Boas-vindas — com instruções gerais e cartões das escalas */}
        {phase === "welcome" && (
          <>
            {/* Texto de boas-vindas, instruções gerais, cartões, botões */}
            <Suspense fallback={<Skeleton />}>
              <AboutSection />
            </Suspense>
          </>
        )}

        {/* Fases: Exame 1 (PSS-10) e Exame 2 (EET) */}
        {phase === "exam1" && <QuizPlayer exam={exams[0]} onFinish={handleFinishExam1} />}
        {phase === "exam2" && <QuizPlayer exam={exams[1]} onFinish={handleFinishExam2} />}

        {/* Fase: Resultados — com lazy loading */}
        {phase === "results" && (
          <Suspense fallback={<Skeleton />}>
            <ResultsView results={results} mode={mode} onRestart={restart} />
          </Suspense>
        )}
      </main>

      {/* Rodapé pedagógico com referências */}
      <footer>...</footer>
    </div>
  );
};

export default Index;
```

---

### `src/index.css` — Design tokens (variáveis CSS)

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Importação de fontes Google */
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap');
@import url("https://fonts.googleapis.com/css2?family=Work+Sans:wght@400;500;600;700&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Lora:wght@400;500;600;700&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Inconsolata:wght@400;700&display=swap");

@layer base {
  :root {
    /* Tokens de cor em HSL — usados via hsl(var(--token)) */
    --background: 0 0% 96%;
    --foreground: 0 0% 9%;
    --card: 0 0% 98%;
    --card-foreground: 0 0% 9%;
    --primary: 161 93% 30%;         /* Verde institucional */
    --primary-foreground: 151 80% 95%;
    --secondary: 0 0% 32%;
    --muted: 0 0% 63%;
    --muted-foreground: 0 0% 9%;
    --accent: 166 76% 96%;
    --destructive: 0 72% 50%;       /* Vermelho para alertas */
    --border: 0 0% 83%;
    --success: 152 60% 40%;         /* Verde para classificação baixa */
    --warning: 38 90% 55%;          /* Amarelo para classificação intermediária */

    /* Fontes */
    --font-heading: 'Space Grotesk', sans-serif;
    --font-body: 'Inter', sans-serif;
    --font-sans: 'Work Sans', ...;
    --font-serif: 'Lora', ...;
    --font-mono: 'Inconsolata', ...;

    /* Sombras e raio de borda */
    --radius: 0.75rem;
    --shadow-sm: ...;
    --shadow-md: ...;
  }

  /* Tema escuro — mesmos tokens com valores invertidos */
  .dark {
    --background: 0 0% 9%;
    --foreground: 0 0% 98%;
    --primary: 158 64% 51%;
    /* ... demais tokens escuros */
  }
}

@layer base {
  * { @apply border-border; }
  body {
    @apply bg-background text-foreground;
    font-family: var(--font-body);
  }
  h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-heading);
  }
}
```

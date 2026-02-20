# Documento de Conhecimento — Escalas de Estresse (PROCISA)

Este documento serve como referência técnica e conceitual para o desenvolvimento contínuo da aplicação. Ele descreve a estrutura do site, os princípios arquiteturais, padrões de componentes reutilizáveis e estratégias de otimização.

---

## 1. Visão Geral da Aplicação

### Propósito

Ferramenta digital para aplicação e avaliação de escalas psicométricas de estresse:

- **PSS-10** (Perceived Stress Scale): 10 itens, alternativas de 0–4, itens invertidos (4, 5, 7, 8).
- **EET** (Escala de Estresse no Trabalho): 23 itens, alternativas de 1–5, sem inversão.

### Fluxo do Usuário

```
Boas-vindas → Escolha do modo → Resposta às questões → Resultados → Envio por e-mail
```

### Modos de Aplicação

| Modo    | Comportamento                     |
| ------- | --------------------------------- |
| `both`  | PSS-10 seguida da EET             |
| `pss10` | Apenas PSS-10                     |
| `eet`   | Apenas EET                        |

---

## 2. Arquitetura e Estrutura

### Camadas

```
Dados (exams.ts)  →  Componentes de domínio  →  Página (Index.tsx)  →  App.tsx
```

- **Dados**: textos, regras de inversão, labels — separados da UI.
- **Componentes de apresentação**: `QuestionCard`, `ResultsView` — recebem props, sem efeitos colaterais.
- **Componentes controladores**: `QuizPlayer`, `Index` — gerenciam estado e fluxo.
- **Providers**: `App.tsx` — configura rotas, cache (TanStack Query), tooltips e notificações.

### Fluxo de Estado

```
Index
├── phase: "welcome" | "exam1" | "exam2" | "results"
├── mode: "both" | "pss10" | "eet"
└── answers: { exam1: {}, exam2: {} }
     │
     ├── QuizPlayer (estado local: respostas parciais)
     │    └── QuestionCard (sem estado — controlado via props)
     │
     └── ResultsView (cálculo de escores a partir das respostas)
```

Estado flui de cima para baixo. Eventos (callbacks) sobem via `onFinish`, `onSelect`, `onRestart`.

---

## 3. Design System

### Tokens Semânticos

Cores NUNCA são usadas diretamente (`bg-blue-500`). Sempre via tokens:

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
| `bg-destructive`        | Erros e ações destrutivas             |

### Fontes

| Variável          | Fonte           | Uso               |
| ----------------- | --------------- | ------------------ |
| `--font-heading`  | Space Grotesk   | Títulos (h1–h6)   |
| `--font-body`     | Inter           | Corpo de texto     |
| `--font-sans`     | Work Sans       | Sans-serif geral   |
| `--font-serif`    | Lora            | Serif (se necessário) |
| `--font-mono`     | Inconsolata     | Código monospace   |

### Temas

- Tema claro: `:root` em `index.css`
- Tema escuro: `.dark` em `index.css`
- Suporte via `next-themes` (instalado, pronto para uso)

---

## 4. Componentes Reutilizáveis

### Princípio Fundamental

> **Um componente, um local de manutenção, múltiplos usos.**

### Primitivos (shadcn/ui — `src/components/ui/`)

Estes componentes NÃO devem ser editados diretamente. Para customização, usar:
1. Variantes via `cva` (class-variance-authority)
2. Composição (wrapper components)
3. Props `className`

| Componente  | Quando usar                                     |
| ----------- | ------------------------------------------------ |
| `Button`    | Qualquer ação clicável                           |
| `Card`      | Container visual com borda e sombra              |
| `Dialog`    | Modais de confirmação ou entrada de dados        |
| `Toast`     | Feedback temporário de ações                     |
| `Skeleton`  | Placeholder durante carregamento                 |
| `Progress`  | Indicadores de progresso                         |
| `Separator` | Divisores visuais entre seções                   |
| `Tabs`      | Navegação entre conteúdos relacionados           |

### Componentes de Domínio

| Componente       | Props principais                            | Reutilizável |
| ---------------- | -------------------------------------------- | ------------ |
| `QuestionCard`   | `question`, `selectedOption`, `onSelect`, `optionLabels`, `startFrom` | ✅ Para qualquer escala |
| `QuizPlayer`     | `exam`, `onFinish`                           | ✅ Para qualquer exame |
| `ResultsView`    | `results[]`, `mode`, `onRestart`             | ✅ Multi-escala |
| `NavLink`        | `to`, `activeClassName`, `pendingClassName`  | ✅ Navegação geral |
| `AboutSection`   | (nenhuma)                                    | ⚠️ Específico |

### Criando Novos Componentes Reutilizáveis

```tsx
// Padrão recomendado:
// 1. Interface de props clara e documentada
interface MeuComponenteProps {
  titulo: string;
  children: React.ReactNode;
  variant?: "default" | "destaque";
}

// 2. Usar tokens semânticos, nunca cores diretas
// 3. Aceitar className para extensibilidade
// 4. Manter em src/components/ (domínio) ou src/components/ui/ (primitivo)
```

---

## 5. Otimização de Banco de Dados e Performance

### 5.1 Ordem Correta de Consultas (quando backend for integrado)

```
1. AUTENTICAÇÃO → Verificar sessão do usuário (auth.getSession())
2. AUTORIZAÇÃO  → RLS (Row Level Security) cuida disso automaticamente
3. SELEÇÃO      → Buscar apenas colunas necessárias (.select("id, nome, escore"))
4. FILTRAGEM    → Aplicar filtros no servidor (.eq(), .gte(), .in())
5. PAGINAÇÃO    → Limitar resultados (.range(0, 19))
6. ORDENAÇÃO    → Ordenar no servidor (.order("created_at", { ascending: false }))
```

**Evitar:**
- `SELECT *` (buscar todas as colunas)
- Filtrar/ordenar no frontend
- Múltiplas consultas quando uma JOIN resolve

### 5.2 Caching com TanStack Query

O TanStack Query já está instalado e configurado. Usar para qualquer dado assíncrono:

```tsx
// Configuração recomendada por tipo de dado
const configuracoes = {
  // Dados que mudam raramente (configurações, escalas)
  estatico: {
    staleTime: 30 * 60 * 1000,  // 30 minutos
    gcTime: 60 * 60 * 1000,     // 1 hora
  },
  // Dados do usuário (resultados, perfil)
  usuario: {
    staleTime: 5 * 60 * 1000,   // 5 minutos
    gcTime: 10 * 60 * 1000,     // 10 minutos
    refetchOnWindowFocus: true,
  },
  // Dados em tempo real (notificações)
  tempoReal: {
    staleTime: 0,
    refetchInterval: 30 * 1000, // a cada 30 segundos
  },
};

// Exemplo de uso:
const { data: resultados } = useQuery({
  queryKey: ["resultados", usuarioId],
  queryFn: () => buscarResultados(usuarioId),
  ...configuracoes.usuario,
});
```

### 5.3 Invalidação de Cache

```tsx
const queryClient = useQueryClient();

// Após salvar um resultado:
await salvarResultado(dados);
queryClient.invalidateQueries({ queryKey: ["resultados"] });

// Atualização otimista (UX mais fluida):
queryClient.setQueryData(["resultados", id], dadosAtualizados);
```

### 5.4 Lazy Loading de Componentes

```tsx
import { lazy, Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

// Componentes pesados carregados sob demanda
const ResultsView = lazy(() => import("@/components/ResultsView"));
const AboutSection = lazy(() => import("@/components/AboutSection"));

// Uso com fallback visual:
<Suspense fallback={<Skeleton className="h-64 w-full rounded-xl" />}>
  <ResultsView results={resultados} mode={modo} onRestart={reiniciar} />
</Suspense>
```

### 5.5 Lazy Loading de Imagens

```tsx
// Imagens devem usar loading="lazy" quando não estão no viewport inicial
<img src={foto} alt="Descrição" loading="lazy" className="..." />
```

### 5.6 Debounce em Buscas

```tsx
import { useState, useDeferredValue } from "react";

// React 18: useDeferredValue para inputs de busca
const [busca, setBusca] = useState("");
const buscaDeferida = useDeferredValue(busca);

// A query usa o valor deferido (não dispara a cada tecla)
const { data } = useQuery({
  queryKey: ["busca", buscaDeferida],
  queryFn: () => pesquisar(buscaDeferida),
  enabled: buscaDeferida.length > 2, // só busca com 3+ caracteres
});
```

### 5.7 Prefetch de Dados

```tsx
// Pré-carregar a próxima escala enquanto o usuário lê as instruções
const queryClient = useQueryClient();

const prefetchProximaEscala = () => {
  queryClient.prefetchQuery({
    queryKey: ["escala", "eet"],
    queryFn: () => buscarEscala("eet"),
  });
};
```

### 5.8 Índices de Banco de Dados

Ao criar tabelas no Lovable Cloud, garantir índices em:
- Colunas usadas em `WHERE` (ex.: `usuario_id`, `escala_id`)
- Colunas usadas em `ORDER BY` (ex.: `created_at`)
- Chaves estrangeiras (criadas automaticamente pelo sistema)

---

## 6. Regras de Negócio

### PSS-10 — Classificação

| Faixa de Escore | Classificação        |
| --------------- | --------------------- |
| 0–18            | Estresse Baixo        |
| 19–24           | Estresse Normal       |
| 25–35           | Estresse Alto         |
| 36–40           | Estresse Muito Alto   |

- Escore total: soma dos 10 itens (0–4 cada).
- Itens invertidos (4, 5, 7, 8): escore = (numOptions - 1) - valor.

### EET — Classificação

| Escore Médio | Classificação              |
| ------------ | --------------------------- |
| < 2,5        | Estresse Baixo ou Leve     |
| = 2,5        | Estresse Médio/Considerável |
| > 2,5        | Estresse Alto              |

- Escore médio: soma total / 23.
- Não há itens invertidos.

---

## 7. Conformidade Legal (LGPD)

Os resultados enviados por e-mail incluem aviso de conformidade com a Lei nº 13.709/2018 (LGPD), informando que:

- Os dados são pessoais e confidenciais.
- Destinam-se exclusivamente ao titular ou profissional autorizado.
- O compartilhamento sem consentimento é responsabilidade de quem o fizer.
- Recomenda-se armazenamento seguro e descarte adequado.

---

## 8. Referências Científicas

- **PSS-10**: Cohen, S., Kamarck, T., & Mermelstein, R. (1983). A global measure of perceived stress. *Journal of Health and Social Behavior*, 24(4), 385-396.
- **PSS-10 (Brasil)**: Siqueira Reis, R., Ferreira Hino, A. A., & Romélio Rodriguez Añez, C. (2010). Perceived Stress Scale: Reliability and validity study in Brazil. *Journal of Health Psychology*, 15(1), 107-114.
- **EET**: Paschoal, T., & Tamayo, A. (2004). Validação da Escala de Estresse no Trabalho. *Estudos de Psicologia*, 9(1), 45-52.

---

## 9. Código Completo Comentado

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

### `src/pages/Index.tsx` — Página principal

```tsx
import { useState } from "react";

// Dados das escalas (PSS-10 e EET) — textos, opções, regras
import { exams } from "@/data/exams";

// Componentes de domínio
import QuizPlayer from "@/components/QuizPlayer";
import ResultsView from "@/components/ResultsView";
import AboutSection from "@/components/AboutSection";

// Componentes de UI
import { Button } from "@/components/ui/button";
import { Brain, ArrowRight, HeartPulse, Briefcase } from "lucide-react";

// Logo importado como módulo ES6 (otimizado pelo Vite)
import procisaLogo from "@/assets/procisa-logo.png";

// === TIPOS ===

// Fases do fluxo da aplicação
type Phase = "welcome" | "exam1" | "exam2" | "results";

// Modos de aplicação: ambas as escalas, só PSS-10 ou só EET
type Mode = "both" | "pss10" | "eet";

// Estrutura que armazena as respostas de cada escala
interface ExamAnswers {
  exam1: Record<string, number>; // chave: id da questão, valor: opção selecionada
  exam2: Record<string, number>;
}

// === COMPONENTE PRINCIPAL ===

const Index = () => {
  // Estado da fase atual do fluxo (boas-vindas → exame1 → exame2 → resultados)
  const [phase, setPhase] = useState<Phase>("welcome");

  // Modo selecionado pelo usuário (ambas, só PSS-10, só EET)
  const [mode, setMode] = useState<Mode>("both");

  // Respostas coletadas em cada escala
  const [answers, setAnswers] = useState<ExamAnswers>({ exam1: {}, exam2: {} });

  // Callback executado ao finalizar a PSS-10
  const handleFinishExam1 = (a: Record<string, number>) => {
    setAnswers((prev) => ({ ...prev, exam1: a }));
    // Se o modo é "both", avança para a EET; caso contrário, vai direto aos resultados
    if (mode === "both") {
      setPhase("exam2");
    } else {
      setPhase("results");
    }
    window.scrollTo({ top: 0, behavior: "smooth" }); // volta ao topo
  };

  // Callback executado ao finalizar a EET
  const handleFinishExam2 = (a: Record<string, number>) => {
    setAnswers((prev) => ({ ...prev, exam2: a }));
    setPhase("results");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Inicia a aplicação das escalas conforme o modo escolhido
  const startExams = (selectedMode: Mode) => {
    setMode(selectedMode);
    setAnswers({ exam1: {}, exam2: {} }); // limpa respostas anteriores
    if (selectedMode === "eet") {
      setPhase("exam2"); // EET é o exame 2 nos dados
    } else {
      setPhase("exam1"); // PSS-10 ou ambos começam pelo exame 1
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Reinicia tudo para a tela de boas-vindas
  const restart = () => {
    setAnswers({ exam1: {}, exam2: {} });
    setPhase("welcome");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Monta o array de resultados conforme o modo (para o ResultsView)
  const getResults = () => {
    const results = [];
    if (mode === "both" || mode === "pss10") {
      results.push({ exam: exams[0], answers: answers.exam1 });
    }
    if (mode === "both" || mode === "eet") {
      results.push({ exam: exams[1], answers: answers.exam2 });
    }
    return results;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* === CABEÇALHO FIXO === */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-3">
          <h1 className="text-lg font-bold">Escalas de Estresse</h1>
        </div>
      </header>

      <main className="px-4 py-10">
        {/* === FASE: BOAS-VINDAS === */}
        {phase === "welcome" && (
          <>
            <div className="max-w-2xl mx-auto text-center">
              {/* Logo institucional */}
              <img src={procisaLogo} alt="Logo PROCISA" className="h-16 mx-auto mb-6" />

              <h2 className="text-4xl font-bold mb-4">Bem-vindo</h2>
              <p className="text-muted-foreground text-lg mb-3 max-w-md mx-auto">
                Você poderá realizar as escalas individualmente ou ambas em
                sequência. Ao final, serão apresentados os escores obtidos.
              </p>

              {/* Cartões informativos das escalas */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto mb-6">
                {/* Cartão PSS-10 */}
                <div className="rounded-xl border border-border bg-card p-5 text-left">
                  <div className="flex items-center gap-2 mb-2">
                    <HeartPulse className="w-5 h-5 text-primary" />
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">
                      Escala 01
                    </p>
                  </div>
                  <p className="font-semibold text-sm mb-1">
                    PSS-10 – Escala de Estresse Percebido
                  </p>
                  <p className="text-muted-foreground text-left text-xs">
                    Busca conhecer informações acerca do construto de "Estresse autopercebido"
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {exams[0].questions.length} itens
                  </p>
                  <p className="text-[10px] text-muted-foreground/70 mt-2 leading-tight text-left">
                    Cohen, S., Kamarck, T., & Mermelstein, R. (1983); Siqueira Reis, R.,
                    Ferreira Hino, A. A., & Romélio Rodriguez Añez, C. (2010).
                  </p>
                </div>
                {/* Cartão EET */}
                <div className="rounded-xl border border-border bg-card p-5 text-left">
                  <div className="flex items-center gap-2 mb-2">
                    <Briefcase className="w-5 h-5 text-primary" />
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">
                      Escala 02
                    </p>
                  </div>
                  <p className="font-semibold text-sm mb-1">
                    EET – Escala de Estresse no Trabalho
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Busca melhor compreender o construto de "Estresse ocupacional"
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {exams[1].questions.length} itens
                  </p>
                  <p className="text-[10px] text-muted-foreground/70 mt-2 leading-tight">
                    PASCHOAL, T.; TAMAYO, A. (2004).
                  </p>
                </div>
              </div>

              {/* Botões de ação */}
              <div className="flex flex-col gap-3 max-w-sm mx-auto">
                <Button size="lg" onClick={() => startExams("both")} className="w-full">
                  Realizar ambas as escalas (PSS-10 e EET){" "}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button size="lg" variant="outline" onClick={() => startExams("pss10")} className="w-full">
                  Realizar escala PSS-10
                </Button>
                <Button size="lg" variant="outline" onClick={() => startExams("eet")} className="w-full">
                  Realizar escala EET
                </Button>
              </div>
            </div>

            {/* Seção "Sobre" com informações dos autores */}
            <AboutSection />
          </>
        )}

        {/* === FASE: ESCALA PSS-10 === */}
        {phase === "exam1" && (
          <div className="max-w-2xl mx-auto">
            <img src={procisaLogo} alt="Logo PROCISA" className="h-12 mx-auto mb-6" />
            <QuizPlayer exam={exams[0]} onFinish={handleFinishExam1} />
          </div>
        )}

        {/* === FASE: ESCALA EET === */}
        {phase === "exam2" && (
          <div className="max-w-2xl mx-auto">
            <img src={procisaLogo} alt="Logo PROCISA" className="h-12 mx-auto mb-6" />
            <QuizPlayer exam={exams[1]} onFinish={handleFinishExam2} />
          </div>
        )}

        {/* === FASE: RESULTADOS === */}
        {phase === "results" && (
          <ResultsView results={getResults()} mode={mode} onRestart={restart} />
        )}
      </main>
    </div>
  );
};

export default Index;
```

---

### `src/data/exams.ts` — Definição das escalas

```ts
// === INTERFACES ===

// Representa uma pergunta individual de uma escala
export interface Question {
  id: string;        // Identificador único (ex.: "p1q1")
  text: string;      // Texto da pergunta exibido ao usuário
  numOptions: number; // Quantidade de alternativas disponíveis
  inverted: boolean;  // Se true, a pontuação é invertida no cálculo
}

// Representa uma escala completa (PSS-10 ou EET)
export interface Exam {
  id: string;            // Identificador da escala (ex.: "prova1")
  title: string;         // Título exibido na interface
  description: string;   // Descrição curta (ex.: "10 itens · 0 a 4")
  instructions?: string; // Instruções detalhadas mostradas antes das perguntas
  optionLabels?: string[]; // Rótulos das alternativas (ex.: "Nunca", "Sempre")
  startFrom?: number;    // Valor numérico da primeira alternativa (0 ou 1)
  questions: Question[]; // Lista de perguntas da escala
}

// === GERADOR DE PERGUNTAS ===

// Função utilitária que gera um array de perguntas a partir de parâmetros
function generateQuestions(
  prefix: string,          // Prefixo do id (ex.: "p1" para prova 1)
  count: number,           // Quantidade de perguntas
  numOptions: number,      // Alternativas por pergunta
  invertedItems: number[], // Números dos itens invertidos (1-indexed)
  texts?: string[]         // Textos das perguntas (opcional)
): Question[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `${prefix}q${i + 1}`,
    text: texts?.[i] ?? `Item ${i + 1}`,
    numOptions,
    inverted: invertedItems.includes(i + 1),
  }));
}

// === TEXTOS DAS PERGUNTAS ===

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

// EET: 23 itens sobre estresse ocupacional
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
    instructions:
      "As questões nesta escala perguntam a respeito dos seus sentimentos e pensamentos durante os últimos 30 dias (último mês). Em cada questão, indique a frequência com que você se sentiu ou pensou a respeito da situação vivenciada, seguindo a escala abaixo:\n\n0 – Nunca | 1 – Quase Nunca | 2 – Às Vezes | 3 – Pouco Frequente | 4 – Muito Frequente",
    optionLabels: ["Nunca", "Quase Nunca", "Às Vezes", "Pouco Frequente", "Muito Frequente"],
    // Itens 4, 5, 7 e 8 são invertidos (formulados positivamente)
    questions: generateQuestions("p1", 10, 5, [4, 5, 7, 8], pss10Texts),
  },
  {
    id: "prova2",
    title: "EET – Escala de Estresse no Trabalho",
    description: "23 itens · Alternativas de 1 a 5",
    instructions:
      "As questões nesta escala listam várias situações que podem ocorrer no dia a dia de seu trabalho. Leia com atenção cada afirmativa e utilize a escala apresentada a seguir para dar sua opinião sobre cada uma delas:\n\n1 – Discordo Totalmente | 2 – Discordo | 3 – Concordo em Parte | 4 – Concordo | 5 – Concordo Totalmente\n\nPara cada item, marque o número que melhor corresponde à sua resposta.\nAo marcar o número 1, você indica discordar totalmente da afirmativa.\nAssinalando o número 5, você indica concordar totalmente com a afirmativa.\nObserve que, quanto menor o número, mais você discorda da afirmativa e, quanto maior o número, mais você concorda com a afirmativa.",
    optionLabels: ["", "Discordo Totalmente", "Discordo", "Concordo em parte", "Concordo", "Concordo Totalmente"],
    startFrom: 1, // Alternativas começam em 1 (não em 0)
    questions: generateQuestions("p2", 23, 5, [], eetTexts),
  },
];

// === CÁLCULO DE PONTUAÇÃO ===

// Calcula o escore de uma questão individual
// Para itens invertidos: escore = (numOptions - 1) - valor selecionado
// Para itens normais: escore = valor selecionado
export function getScore(question: Question, selectedValue: number): number {
  if (question.inverted) {
    return (question.numOptions - 1) - selectedValue;
  }
  return selectedValue;
}
```

---

### `src/components/QuestionCard.tsx` — Cartão de pergunta

```tsx
// Importa o tipo Question para tipagem da prop
import { Question } from "@/data/exams";

// Utilitário para combinar classes Tailwind condicionalmente
import { cn } from "@/lib/utils";

// Props do componente: recebe a pergunta, estado atual e callbacks
interface QuestionCardProps {
  question: Question;           // Dados da pergunta
  selectedOption: number | null; // Opção atualmente selecionada (null = nenhuma)
  onSelect: (value: number) => void; // Callback ao selecionar uma opção
  optionLabels?: string[];       // Rótulos textuais das opções (ex.: "Nunca")
  startFrom?: number;            // Valor inicial das opções (0 ou 1)
}

const QuestionCard = ({
  question,
  selectedOption,
  onSelect,
  optionLabels,
  startFrom = 0,
}: QuestionCardProps) => {
  // Gera o array de valores das opções (ex.: [0,1,2,3,4] ou [1,2,3,4,5])
  const options = Array.from(
    { length: question.numOptions },
    (_, i) => i + startFrom
  );

  return (
    <div className="rounded-xl bg-card border border-border p-6 shadow-sm">
      {/* Texto da pergunta */}
      <h3 className="text-lg font-semibold mb-1 leading-relaxed">
        {question.text}
      </h3>

      {/* Espaçador para itens invertidos (mantém altura consistente) */}
      {question.inverted && (
        <p className="text-xs text-muted-foreground mb-4 italic">​</p>
      )}

      {/* Grid de opções: 5 colunas no mobile, flex no desktop */}
      <div className="grid grid-cols-5 sm:flex sm:flex-wrap gap-2 sm:gap-3">
        {options.map((value) => {
          const isSelected = selectedOption === value;
          return (
            <button
              key={value}
              onClick={() => onSelect(value)}
              className={cn(
                // Estilos base do botão
                "min-w-12 h-auto rounded-lg border-2 transition-all duration-200",
                "flex flex-col items-center justify-center text-sm font-bold px-3 py-2 gap-1",
                // Estilos condicionais: selecionado vs. não selecionado
                isSelected
                  ? "border-primary bg-primary text-primary-foreground shadow-sm"
                  : "border-border hover:border-primary/40 hover:bg-secondary/60 text-muted-foreground"
              )}
            >
              {/* Valor numérico da opção */}
              <span>{value}</span>
              {/* Rótulo textual (se disponível) */}
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
};

export default QuestionCard;
```

---

### `src/components/QuizPlayer.tsx` — Controlador do quiz

```tsx
import { useState } from "react";

// Tipo da escala
import { Exam } from "@/data/exams";

// Componente de pergunta individual
import QuestionCard from "./QuestionCard";

// Componentes de UI
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

// Props: recebe o exame e o callback ao finalizar
interface QuizPlayerProps {
  exam: Exam;
  onFinish: (answers: Record<string, number>) => void;
}

const QuizPlayer = ({ exam, onFinish }: QuizPlayerProps) => {
  // Estado local: mapa de respostas { idQuestão: valorSelecionado }
  const [answers, setAnswers] = useState<Record<string, number>>({});

  // Contadores para a barra de progresso
  const total = exam.questions.length;
  const answered = Object.keys(answers).length;
  const allAnswered = answered === total;

  // Registra a resposta de uma questão
  const selectAnswer = (questionId: string, value: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Cabeçalho do exame: título, descrição e instruções */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-1">{exam.title}</h2>
        <p className="text-muted-foreground text-sm mb-3">{exam.description}</p>
        {exam.instructions && (
          <div className="rounded-lg border border-border bg-secondary/40 p-4 text-sm text-foreground whitespace-pre-line">
            {exam.instructions}
          </div>
        )}
      </div>

      {/* Barra de progresso visual */}
      <div className="w-full h-2 rounded-full bg-secondary mb-2 overflow-hidden">
        <div
          className="h-full rounded-full bg-primary transition-all duration-500"
          style={{ width: `${(answered / total) * 100}%` }}
        />
      </div>
      <p className="text-xs text-muted-foreground mb-8">
        {answered} de {total} respondidos
      </p>

      {/* Lista de questões */}
      <div className="space-y-6">
        {exam.questions.map((question, idx) => (
          <div key={question.id}>
            {/* Número da questão */}
            <div className="mb-2 text-sm text-muted-foreground">
              <span>Questão {idx + 1}</span>
            </div>
            {/* Cartão da questão com opções */}
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

      {/* Referências bibliográficas (exibidas após as questões) */}
      {exam.id === "prova1" && (
        <div className="rounded-lg border border-border bg-secondary/30 p-4 mt-6 text-xs text-muted-foreground space-y-2">
          <p>
            COHEN, S., KAMARCK, T., & MERMELSTEIN, R. (1983). A global measure of perceived stress.
            <em>Journal of Health and Social Behavior</em>, 24, 385-396.
          </p>
          <p>
            SIQUEIRA REIS, R., FERREIRA HINO, A. A., & ROMÉLIO RODRIGUEZ AÑEZ, C. (2010).
            Perceived stress scale: Reliability and validity study in Brazil.
            <em>Journal of health psychology</em>, 15(1), 107-114.
          </p>
        </div>
      )}

      {exam.id === "prova2" && (
        <div className="rounded-lg border border-border bg-secondary/30 p-4 mt-6 text-xs text-muted-foreground">
          <p>
            PASCHOAL, T.; TAMAYO, A. Validação da escala de estresse no trabalho.
            <em>Estudos de Psicologia (Natal)</em>, v. 9, n. 1, p. 45-52, 2004.
          </p>
        </div>
      )}

      {/* Botão de finalização (habilitado apenas quando tudo foi respondido) */}
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

### `src/components/ResultsView.tsx` — Exibição de resultados

```tsx
// Importa tipos e função de cálculo de escore
import { Exam, getScore } from "@/data/exams";

// Ícones utilizados na interface
import { Brain, Home, AlertTriangle, Mail } from "lucide-react";

// Componentes de UI
import { Button } from "@/components/ui/button";

// Logo institucional
import procisaLogo from "@/assets/procisa-logo.png";

// === INTERFACES ===

// Resultado de uma escala: dados do exame + respostas coletadas
interface ExamResult {
  exam: Exam;
  answers: Record<string, number>;
}

// Props do componente
interface ResultsViewProps {
  results: ExamResult[];                    // Array de resultados (1 ou 2 escalas)
  mode: "both" | "pss10" | "eet";          // Modo de aplicação
  onRestart: () => void;                    // Callback para reiniciar
}

const ResultsView = ({ results, mode, onRestart }: ResultsViewProps) => {
  // === DISCLAIMERS (avisos legais) ===
  // Textos de aviso adaptados ao modo de aplicação
  const disclaimerBoth = `Estas escalas são ferramentas úteis apenas para medir possíveis INDICATIVOS...`;
  const disclaimerPSS = `Esta escala é uma ferramenta útil para medir possíveis INDICATIVOS de Estresse Percebido...`;
  const disclaimerEET = `Esta escala é uma ferramenta útil para medir possíveis INDICATIVOS de Estresse No Trabalho...`;

  // Seleciona o disclaimer correto com base no modo
  const disclaimer = mode === "both" ? disclaimerBoth : mode === "pss10" ? disclaimerPSS : disclaimerEET;

  // === CONSTRUÇÃO DO CORPO DO E-MAIL ===
  const buildEmailBody = () => {
    const now = new Date();
    // Formata data e hora no padrão brasileiro
    const dataHora = now.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" })
      + " às " + now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

    let body = "RESULTADO - Escalas de Estresse (PROCISA)\n";
    body += `Data e hora da realização: ${dataHora}\n\n`;

    // Itera sobre cada resultado para montar os escores
    results.forEach(({ exam, answers }) => {
      const totalScore = exam.questions.reduce((sum, q) => {
        const selected = answers[q.id];
        return sum + (selected != null ? getScore(q, selected) : 0);
      }, 0);

      body += `--- ${exam.title} ---\n`;

      // PSS-10: exibe escore total e classificação
      if (exam.id === "prova1") {
        const getStressLevel = (score: number) => {
          if (score <= 18) return "Estresse Baixo";
          if (score <= 24) return "Estresse Normal";
          if (score <= 35) return "Estresse Alto";
          return "Estresse Muito Alto";
        };
        body += `Escore Total: ${totalScore}\n`;
        body += `Classificação: ${getStressLevel(totalScore)}\n\n`;
      }

      // EET: exibe escore médio e classificação
      if (exam.id === "prova2") {
        const avg = parseFloat((totalScore / 23).toFixed(2));
        const getEETLevel = (a: number) => {
          if (a < 2.5) return "Estresse Baixo ou Leve";
          if (a === 2.5) return "Estresse Médio/Considerável";
          return "Estresse Alto";
        };
        body += `Escore Médio: ${avg.toFixed(2)}\n`;
        body += `Classificação: ${getEETLevel(avg)}\n\n`;
      }
    });

    // Adiciona disclaimer, referências e aviso LGPD
    body += "---\n\n" + disclaimer + "\n\n---\n\n";
    body += "REFERÊNCIAS\n\n";
    // ... referências condicionais por modo ...
    body += "---\n\nAVISO SOBRE PROTEÇÃO DE DADOS\n\n";
    body += "Os dados apresentados neste relatório foram produzidos e coletados em conformidade com a LGPD...";

    return body;
  };

  // Abre o cliente de e-mail com o resultado pré-preenchido
  const handleSendEmail = () => {
    const subject = encodeURIComponent("Resultado - Escalas de Estresse (PROCISA)");
    const body = encodeURIComponent(buildEmailBody());
    window.open(`mailto:?subject=${subject}&body=${body}`, "_self");
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Cabeçalho dos resultados */}
      <div className="text-center mb-10">
        <img src={procisaLogo} alt="Logo PROCISA" className="h-14 mx-auto mb-4" />
        <h2 className="text-3xl font-bold mb-2">Resultado Final</h2>
        <p className="text-muted-foreground">Escores obtidos nas escalas aplicadas</p>
      </div>

      {/* Cards de resultado para cada escala */}
      <div className="grid gap-8">
        {results.map(({ exam, answers }) => {
          // Cálculo do escore total
          const totalScore = exam.questions.reduce((sum, q) => {
            const selected = answers[q.id];
            return sum + (selected != null ? getScore(q, selected) : 0);
          }, 0);

          // Classificação PSS-10 por faixas / EET por escore médio
          // ... lógica de classificação ...

          return (
            <div key={exam.id} className="rounded-xl bg-card border border-border p-6 shadow-sm">
              {/* Título da escala + escore + classificação */}
            </div>
          );
        })}
      </div>

      {/* Aviso legal (disclaimer) */}
      <div className="rounded-xl border border-border bg-secondary/30 p-6 mt-8">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 shrink-0" />
          <p className="text-sm text-muted-foreground whitespace-pre-line">{disclaimer}</p>
        </div>
      </div>

      {/* Botões de ação: enviar por e-mail e retornar */}
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
};

export default ResultsView;
```

---

### `src/components/AboutSection.tsx` — Seção institucional

```tsx
// Imagens importadas como módulos ES6
import procisaLogo from "@/assets/procisa-logo.png";
import edilanePhoto from "@/assets/edilane-photo.gif";
import italoPhoto from "@/assets/italo-photo.gif";

const AboutSection = () => {
  return (
    <section className="max-w-3xl mx-auto mt-16 mb-10">
      <h2 className="text-2xl font-bold text-center mb-6">Sobre</h2>

      {/* Card institucional do PROCISA */}
      <div className="rounded-xl border border-border bg-card p-6 mb-8 text-center">
        <img src={procisaLogo} alt="Logo PROCISA" className="h-20 mx-auto mb-4" />
        <p className="text-sm text-muted-foreground text-center">
          Esta ferramenta digital foi criada pelo Mestre em Ciências da Saúde{" "}
          <strong>Ítalo Ribeiro Kunzler Machado Marques</strong> sob orientação da{" "}
          <strong>Professora Doutora Edilane Nunes Régis Bezerra</strong> dentro do
          Programa de Pós-graduação em Ciências da Saúde PROCISA – UFRR.
        </p>
      </div>

      {/* Grid com biografias dos autores (orientadora e autor) */}
      <div className="grid gap-8 md:grid-cols-2">
        {/* Card da orientadora com foto, nome e biografia completa */}
        {/* Card do autor com foto, nome e biografia completa */}
      </div>
    </section>
  );
};

export default AboutSection;
```

---

### `src/components/NavLink.tsx` — Link de navegação

```tsx
// Importa o NavLink nativo do React Router
import { NavLink as RouterNavLink, NavLinkProps } from "react-router-dom";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

// Extende as props do NavLink para aceitar classes customizáveis
interface NavLinkCompatProps extends Omit<NavLinkProps, "className"> {
  className?: string;       // Classe base (sempre aplicada)
  activeClassName?: string;  // Classe quando a rota está ativa
  pendingClassName?: string; // Classe durante navegação pendente
}

// Componente wrapper que simplifica o uso do NavLink com classes condicionais
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
  }
);

NavLink.displayName = "NavLink";
export { NavLink };
```

---

### `src/lib/utils.ts` — Utilitários

```ts
// clsx: combina classes condicionalmente
import { clsx, type ClassValue } from "clsx";

// twMerge: resolve conflitos entre classes Tailwind (ex.: "p-2 p-4" → "p-4")
import { twMerge } from "tailwind-merge";

// Função utilitária usada em toda a aplicação para compor classes CSS
// Permite combinar classes estáticas, condicionais e dinâmicas de forma segura
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

---

### `src/index.css` — Design tokens

```css
/* Importa as diretivas do Tailwind CSS */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Fontes tipográficas carregadas do Google Fonts */
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap');
@import url("https://fonts.googleapis.com/css2?family=Work+Sans:wght@400;500;600;700&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Lora:wght@400;500;600;700&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Inconsolata:wght@400;700&display=swap");

@layer base {
  :root {
    /* === Tokens de cor do tema claro (HSL sem "hsl()") === */
    --background: 0 0% 96%;           /* Fundo geral: cinza muito claro */
    --foreground: 0 0% 9%;            /* Texto principal: quase preto */
    --card: 0 0% 98%;                 /* Fundo de cartões: branco suave */
    --primary: 161 93% 30%;           /* Verde-esmeralda: cor de destaque */
    --primary-foreground: 151 80% 95%; /* Texto claro sobre primary */
    --secondary: 0 0% 32%;            /* Cinza escuro para elementos secundários */
    --muted-foreground: 0 0% 9%;      /* Texto atenuado */
    --accent: 166 76% 96%;            /* Verde muito claro para destaques suaves */
    --destructive: 0 72% 50%;         /* Vermelho para erros */
    --border: 0 0% 83%;               /* Cinza claro para bordas */
    --ring: 161 93% 30%;              /* Cor do anel de foco = primary */
    --radius: 0.75rem;                /* Raio de borda padrão (12px) */

    /* Fontes */
    --font-heading: 'Space Grotesk', sans-serif;
    --font-body: 'Inter', sans-serif;
    --font-sans: 'Work Sans', ...;
    --font-serif: 'Lora', ...;
    --font-mono: 'Inconsolata', ...;

    /* Sombras */
    --shadow-sm: 0 1px 3px 0px hsl(0 0% 0% / 0.1), ...;
    /* ... demais variáveis ... */
  }

  .dark {
    /* Sobrescreve tokens para o tema escuro */
    --background: 0 0% 9%;            /* Fundo escuro */
    --foreground: 0 0% 98%;           /* Texto claro */
    --primary: 158 64% 51%;           /* Verde mais claro para contraste */
    /* ... demais sobrescritas ... */
  }
}

@layer base {
  * { @apply border-border; }          /* Borda padrão em todos os elementos */
  body {
    @apply bg-background text-foreground; /* Aplica tokens de fundo e texto */
    font-family: var(--font-body);        /* Fonte do corpo */
  }
  h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-heading);     /* Fonte de destaque para títulos */
  }
}
```

---

*Documento gerado automaticamente. Última atualização: Fevereiro/2026.*

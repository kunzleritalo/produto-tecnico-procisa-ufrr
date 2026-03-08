# Documento de Conhecimento — Escalas de Estresse (PROCISA)

Este documento serve como referência técnica e conceitual para o desenvolvimento contínuo da aplicação. Ele descreve a estrutura do site, os princípios arquiteturais, padrões de componentes reutilizáveis e estratégias de otimização.

---

## 1. Visão Geral da Aplicação

### Propósito

Ferramenta digital para aplicação e avaliação de escalas psicométricas de estresse, desenvolvida em consonância com as diretrizes da CAPES para Produtos Técnicos e Tecnológicos (PTT):

- **PSS-10** (Perceived Stress Scale): 10 itens, alternativas de 0–4, itens invertidos (4, 5, 7, 8).
- **EET** (Escala de Estresse no Trabalho): 23 itens, alternativas de 1–5, sem inversão.

### Fluxo do Usuário

```
Boas-vindas (instruções gerais) → Escolha do modo → Resposta às questões → Resultados → Envio por e-mail
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
- **Componentes de apresentação**: `QuestionCard`, `ResultsView` — recebem props, sem efeitos colaterais. Usam `React.memo`.
- **Componentes controladores**: `QuizPlayer`, `Index` — gerenciam estado e fluxo. Usam `useCallback`, `useMemo`.
- **Providers**: `App.tsx` — configura rotas, cache (TanStack Query), tooltips e notificações.

### Fluxo de Estado

```
Index
├── phase: "welcome" | "exam1" | "exam2" | "results"
├── mode: "both" | "pss10" | "eet"
└── answers: { exam1: {}, exam2: {} }
     │
     ├── QuizPlayer (estado local: respostas parciais)
     │    └── QuestionCard (sem estado — controlado via props, memo)
     │
     └── ResultsView (cálculo de escores via useMemo, memo)
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
| `text-success`          | Classificação positiva                |
| `text-warning`          | Classificação intermediária           |
| `text-destructive`      | Classificação alta/alertas            |

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
| `Skeleton`  | Placeholder durante carregamento (lazy loading)  |
| `Progress`  | Indicadores de progresso                         |
| `Separator` | Divisores visuais entre seções                   |
| `Tabs`      | Navegação entre conteúdos relacionados           |

### Componentes de Domínio

| Componente       | Props principais                            | Memo | Reutilizável |
| ---------------- | -------------------------------------------- | ---- | ------------ |
| `QuestionCard`   | `question`, `selectedOption`, `onSelect`, `optionLabels`, `startFrom` | ✅ | ✅ Para qualquer escala |
| `QuizPlayer`     | `exam`, `onFinish`                           | — | ✅ Para qualquer exame |
| `ResultsView`    | `results[]`, `mode`, `onRestart`             | ✅ | ✅ Multi-escala |
| `NavLink`        | `to`, `activeClassName`, `pendingClassName`  | — | ✅ Navegação geral |
| `AboutSection`   | (nenhuma)                                    | — | ⚠️ Específico |

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
// 4. Usar React.memo para componentes de apresentação puros
// 5. Manter em src/components/ (domínio) ou src/components/ui/ (primitivo)
```

---

## 5. Otimização de Performance

### 5.1 React.memo e Hooks de Otimização

```tsx
// QuestionCard e ResultsView usam React.memo para evitar re-renders desnecessários
const QuestionCard = memo(({ question, ... }: Props) => { ... });

// Index usa useCallback para estabilizar callbacks passados a filhos
const handleFinish = useCallback((a) => { ... }, [mode]);

// ResultsView usa useMemo para calcular escores uma única vez
const computedResults = useMemo(() => results.map(...), [results]);
```

### 5.2 Code Splitting (Lazy Loading de Componentes)

```tsx
// Componentes pesados carregados sob demanda via React.lazy
const ResultsView = lazy(() => import("@/components/ResultsView"));
const AboutSection = lazy(() => import("@/components/AboutSection"));

// Uso com fallback visual (Skeleton do shadcn/ui)
<Suspense fallback={<Skeleton className="h-64 w-full rounded-xl" />}>
  <ResultsView results={results} mode={mode} onRestart={restart} />
</Suspense>
```

### 5.3 Lazy Loading de Imagens

```tsx
// Imagens fora do viewport inicial usam loading="lazy"
<img src={foto} alt="Descrição" loading="lazy" className="..." />
```

### 5.4 Ordem Correta de Consultas ao Backend

Ao integrar Lovable Cloud, seguir esta ordem:

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

### 5.5 Caching com TanStack Query

```tsx
const configuracoes = {
  // Dados que mudam raramente (configurações, escalas)
  estatico: { staleTime: 30 * 60 * 1000, gcTime: 60 * 60 * 1000 },
  // Dados do usuário (resultados, perfil)
  usuario: { staleTime: 5 * 60 * 1000, gcTime: 10 * 60 * 1000, refetchOnWindowFocus: true },
  // Dados em tempo real
  tempoReal: { staleTime: 0, refetchInterval: 30 * 1000 },
};
```

### 5.6 Invalidação de Cache

```tsx
const queryClient = useQueryClient();
await salvarResultado(dados);
queryClient.invalidateQueries({ queryKey: ["resultados"] });
```

### 5.7 Debounce em Buscas

```tsx
import { useState, useDeferredValue } from "react";
const [busca, setBusca] = useState("");
const buscaDeferida = useDeferredValue(busca);
```

### 5.8 Prefetch de Dados

```tsx
queryClient.prefetchQuery({
  queryKey: ["escala", "eet"],
  queryFn: () => buscarEscala("eet"),
});
```

### 5.9 Índices de Banco de Dados

Ao criar tabelas, garantir índices em:
- Colunas usadas em `WHERE` (ex.: `usuario_id`, `escala_id`)
- Colunas usadas em `ORDER BY` (ex.: `created_at`)
- Chaves estrangeiras (criadas automaticamente)

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
- Referência da classificação: Oliveira, J. C. et al. (2021).

### EET — Classificação

| Escore Médio | Classificação              |
| ------------ | --------------------------- |
| < 2,5        | Estresse Baixo ou Leve     |
| = 2,5        | Estresse Médio/Considerável |
| > 2,5        | Estresse Alto              |

- Escore médio: soma total / 23.
- Não há itens invertidos.
- Referência: Paschoal, T. & Tamayo, A. (2004).

---

## 7. Conformidade Legal (LGPD)

Os resultados enviados por e-mail incluem aviso de conformidade com a Lei nº 13.709/2018 (LGPD), informando que:

- Os dados são pessoais e confidenciais.
- Destinam-se exclusivamente ao titular ou profissional autorizado.
- O compartilhamento sem consentimento é responsabilidade de quem o fizer.
- Recomenda-se armazenamento seguro e descarte adequado.

---

## 8. Textos e Disclaimers

### Tela de Boas-vindas

- Instruções gerais comuns às escalas (não há respostas certas/erradas, responder espontaneamente, dados não armazenados).
- Descrição das possibilidades de uso (realizar escalas individualmente ou em sequência).

### Tela de Resultados

- PSS-10: "Os resultados aqui apresentados foram organizados e categorizados a partir do trabalho de..."
- EET: "Valores organizados e categorizados a partir de..."
- Disclaimer: "...procure ajuda qualificada."

### Rodapé Pedagógico

- Finalidade exclusivamente pedagógica.
- Direitos pertencem aos respectivos criadores.
- "Produzida por" (sem dois-pontos após nome da escala).

### Seção Sobre

- Informações dos autores (orientadora e autor).
- Texto sobre consonância com diretrizes CAPES/PTT.

---

## 9. Referências Científicas

- **PSS-10**: Cohen, S., Kamarck, T., & Mermelstein, R. (1983). A global measure of perceived stress. *Journal of Health and Social Behavior*, 24(4), 385-396.
- **PSS-10 (Brasil)**: Siqueira Reis, R., Ferreira Hino, A. A., & Romélio Rodriguez Añez, C. (2010). Perceived Stress Scale: Reliability and validity study in Brazil. *Journal of Health Psychology*, 15(1), 107-114.
- **EET**: Paschoal, T., & Tamayo, A. (2004). Validação da Escala de Estresse no Trabalho. *Estudos de Psicologia*, 9(1), 45-52.
- **Classificação PSS-10**: Oliveira, J. C. et al. (2021). The impact of COVID-19 on the physical and emotional health of health professionals. *Research, Society and Development*, v. 10, n. 10, e163101018744.

---

## 10. Código Completo Comentado

Todo o código-fonte está documentado com comentários detalhados em português brasileiro no arquivo README.md, seção "Código Completo Comentado". Os arquivos incluem:

- `src/main.tsx` — Ponto de entrada
- `src/App.tsx` — Rotas e providers
- `src/lib/utils.ts` — Utilitário cn()
- `src/data/exams.ts` — Definições das escalas (textos, inversão, labels)
- `src/components/QuestionCard.tsx` — Cartão de pergunta (memo)
- `src/components/QuizPlayer.tsx` — Controlador do fluxo
- `src/components/ResultsView.tsx` — Resultados e e-mail (memo)
- `src/components/AboutSection.tsx` — Seção sobre + CAPES
- `src/pages/Index.tsx` — Página principal (lazy loading)
- `src/index.css` — Design tokens HSL

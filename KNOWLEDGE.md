# Documento de Conhecimento — Estresse PROCISA

Este documento serve como referência técnica e conceitual para o desenvolvimento contínuo da aplicação. Ele descreve a estrutura do site, os princípios arquiteturais, padrões de componentes reutilizáveis e estratégias de otimização.

---

## 1. Visão Geral

Ferramenta digital para aplicação das escalas **PSS-10** (Estresse Percebido) e **EET** (Estresse no Trabalho), desenvolvida no Programa de Pós-graduação em Ciências da Saúde (PROCISA) da UFRR.

**Características fundamentais:**
- Processamento 100% local (nenhum dado é enviado a servidores)
- Interface responsiva e acessível
- Resultado com classificação de nível de estresse
- Envio de relatório por e-mail com referências e aviso LGPD

---

## 2. Arquitetura

### 2.1 Estrutura de Pastas

```
src/
├── assets/              # Imagens estáticas (logos, fotos)
├── components/
│   ├── ui/              # Componentes base shadcn/ui (Button, Card, Skeleton, etc.)
│   ├── AboutSection.tsx # Seção institucional "Sobre"
│   ├── NavLink.tsx      # Wrapper reutilizável do NavLink
│   ├── QuestionCard.tsx # Cartão de questão (memoizado com React.memo)
│   ├── QuizPlayer.tsx   # Controlador do fluxo de questões
│   └── ResultsView.tsx  # Exibição de resultados e e-mail
├── data/
│   └── exams.ts         # Definição das escalas e função de pontuação
├── hooks/               # Hooks personalizados
├── lib/
│   └── utils.ts         # Utilitário cn() para classes Tailwind
├── pages/
│   ├── Index.tsx        # Página principal (orquestrador de fases)
│   └── NotFound.tsx     # Página 404
├── App.tsx              # Roteamento e providers
├── main.tsx             # Ponto de entrada
└── index.css            # Design tokens CSS
```

### 2.2 Separação de Responsabilidades

| Camada           | Responsabilidade                          | Arquivos                       |
|------------------|-------------------------------------------|--------------------------------|
| **Dados**        | Escalas, questões, pontuação              | `data/exams.ts`                |
| **Apresentação** | UI sem lógica de negócio                  | `QuestionCard`, `AboutSection` |
| **Controle**     | Fluxo de fases, estado, orquestração      | `Index.tsx`, `QuizPlayer`      |
| **Resultados**   | Cálculo de escores, relatório             | `ResultsView`                  |
| **Design**       | Tokens visuais, tipografia, tema          | `index.css`, `tailwind.config` |

### 2.3 Fluxo de Fases

```
welcome → exam1 (PSS-10) → exam2 (EET) → results   [modo: both]
welcome → exam1 (PSS-10) → results                  [modo: pss10]
welcome → exam2 (EET) → results                     [modo: eet]
```

---

## 3. Design System

### 3.1 Tokens de Cor (HSL)

Todas as cores são definidas como variáveis CSS em `index.css` e mapeadas em `tailwind.config.ts`. **Nunca usar classes de cor direta** nos componentes.

| Token                  | Valor (claro)          | Uso                          |
|------------------------|------------------------|------------------------------|
| `--primary`            | `161 93% 30%`          | Verde esmeralda principal    |
| `--primary-foreground` | `151 80% 95%`          | Texto sobre primary          |
| `--accent`             | `166 76% 96%`          | Fundo de destaque suave      |
| `--success`            | `152 60% 40%`          | Indicadores positivos        |
| `--warning`            | `38 90% 55%`           | Alertas moderados            |
| `--destructive`        | `0 72% 50%`            | Indicadores críticos         |
| `--muted-foreground`   | `160 5% 35%`           | Texto secundário/discreto    |

### 3.2 Tipografia

| Variável           | Fonte          | Uso                   |
|--------------------|----------------|-----------------------|
| `--font-heading`   | Space Grotesk  | Títulos e destaques   |
| `--font-body`      | Inter          | Corpo de texto        |
| `--font-sans`      | Work Sans      | Fallback sans-serif   |
| `--font-serif`     | Lora           | Citações acadêmicas   |
| `--font-mono`      | Inconsolata    | Dados numéricos       |

### 3.3 Classes Utilitárias Customizadas

| Classe                    | Efeito                                                |
|---------------------------|-------------------------------------------------------|
| `.card-elevated`          | Sombra + hover com elevação e translateY(-2px)        |
| `.gradient-hero`          | Gradiente sutil primary → accent para seções hero     |
| `.gradient-primary-subtle`| Gradiente leve primary → accent                      |
| `.text-gradient-primary`  | Texto com gradiente primary → glow                   |

### 3.4 Regra Crítica

> **Nunca usar classes de cor direta** (`text-white`, `bg-black`, `bg-green-500`) nos componentes.
> Sempre usar tokens semânticos (`text-primary-foreground`, `bg-card`, `text-muted-foreground`).

---

## 4. Princípios de Otimização

### 4.1 Lazy Loading (Carregamento Sob Demanda)

Componentes pesados são carregados apenas quando necessários:

```tsx
const ResultsView = lazy(() => import("@/components/ResultsView"));
const AboutSection = lazy(() => import("@/components/AboutSection"));
```

Wrapped em `<Suspense>` com fallback `<Skeleton>`.

### 4.2 Memoização

| Técnica          | Onde                          | Por quê                                    |
|------------------|-------------------------------|---------------------------------------------|
| `React.memo`     | `QuestionCard`, `ResultsView` | Evita re-renders quando props não mudam     |
| `useMemo`        | Cálculo de escores            | Recalcula apenas quando dados mudam         |
| `useCallback`    | Handlers de evento            | Mantém referências estáveis entre renders   |

### 4.3 Imagens

- Logos carregam normalmente (acima do fold)
- Fotos dos autores usam `loading="lazy"` (abaixo do fold)

### 4.4 Otimização de Consultas ao Banco de Dados

Quando integrar com banco de dados (ex.: Supabase via Lovable Cloud), seguir a ordem:

```
1. Autenticação    → Verificar sessão do usuário (auth.uid())
2. RLS             → Políticas de segurança por linha no servidor
3. Seleção         → SELECT apenas colunas necessárias
4. Filtragem       → WHERE/filtros no servidor, NÃO no cliente
5. Ordenação       → ORDER BY no servidor
6. Paginação       → LIMIT/OFFSET para limitar dados transferidos
7. Cache           → TanStack Query com staleTime e gcTime
```

**Exemplo com TanStack Query:**

```tsx
const { data } = useQuery({
  queryKey: ['exams', examId],        // Chave única e granular
  queryFn: () => fetchExam(examId),   // Função de busca
  staleTime: 5 * 60 * 1000,          // 5 min antes de refetch
  gcTime: 30 * 60 * 1000,            // 30 min no garbage collector
  select: (data) => data.questions,   // Transforma no cliente (cache da resposta completa)
});
```

**Anti-padrões a evitar:**
- ❌ Buscar todas as colunas (`SELECT *`)
- ❌ Filtrar dados no cliente após buscar tudo
- ❌ Fazer queries dentro de loops (N+1 problem)
- ❌ Não usar cache (refetch em toda navegação)

---

## 5. Componentes Reutilizáveis

### 5.1 Componentes Base (shadcn/ui)

Mantidos em `src/components/ui/` — customizados via tokens do design system:

| Componente    | Uso                                       |
|--------------|-------------------------------------------|
| `Button`     | Botões com variantes (default, outline, destructive, ghost, link) |
| `Card`       | Container com borda e sombra              |
| `Skeleton`   | Placeholder de carregamento               |
| `Progress`   | Barra de progresso                        |
| `Badge`      | Labels e tags                             |
| `Toast`      | Notificações temporárias                  |
| `Tooltip`    | Dicas contextuais                         |

**Princípio:** Estes componentes são mantidos em um único local (`src/components/ui/`) e reutilizados em toda a aplicação. Qualquer alteração visual reflete automaticamente em todos os usos.

### 5.2 Componentes de Domínio

| Componente       | Props Principais                                 | Descrição                          |
|-----------------|--------------------------------------------------|------------------------------------|
| `QuestionCard`  | `question`, `selectedOption`, `onSelect`          | Cartão de pergunta memoizado       |
| `QuizPlayer`    | `exam`, `onFinish`                               | Controlador do quiz com progresso  |
| `ResultsView`   | `results`, `mode`, `onRestart`                   | Exibição de resultados + e-mail    |
| `AboutSection`  | (sem props)                                       | Seção institucional                |
| `NavLink`       | `to`, `className`, `activeClassName`              | Wrapper NavLink reutilizável       |

### 5.3 Utilitário `cn()`

```tsx
import { cn } from "@/lib/utils";
cn("text-sm font-bold", isActive && "text-primary", className)
```

---

## 6. Stack Tecnológica

| Tecnologia          | Versão   | Uso                                        |
|---------------------|----------|--------------------------------------------|
| React               | 18.x     | Biblioteca de UI com hooks e Suspense      |
| TypeScript          | —        | Tipagem estática                           |
| Vite                | —        | Bundler com HMR ultra-rápido               |
| Tailwind CSS        | —        | Estilização utilitária com tokens          |
| shadcn/ui           | —        | Componentes acessíveis (Radix UI)          |
| Lucide React        | —        | Ícones SVG                                |
| TanStack Query      | 5.x      | Cache e estado assíncrono                  |
| React Router        | 6.x      | Roteamento SPA                            |

---

## 7. Princípios para Desenvolvimento Futuro

### 7.1 Ao Adicionar Novos Componentes

1. Criar em `src/components/` (domínio) ou `src/components/ui/` (base)
2. Usar apenas tokens semânticos de cor
3. Aplicar `React.memo` se receber props que raramente mudam
4. Exportar como `export default` para lazy loading compatível

### 7.2 Ao Integrar Backend

1. Ativar Lovable Cloud antes de implementar
2. Criar tabelas com RLS habilitado
3. Usar funções `SECURITY DEFINER` para verificação de roles
4. Seguir a ordem de otimização de consultas (seção 4.4)
5. Configurar `staleTime` e `gcTime` no TanStack Query

### 7.3 Ao Adicionar Novas Escalas

1. Definir dados em `src/data/exams.ts` seguindo a interface `Exam`
2. Adicionar textos das questões como array separado
3. Especificar itens invertidos no `generateQuestions()`
4. Adicionar função de classificação em `ResultsView`
5. Atualizar o fluxo de fases em `Index.tsx`

### 7.4 Ao Modificar o Design

1. Alterar tokens em `index.css` (`:root` e `.dark`)
2. Verificar se `tailwind.config.ts` mapeia os tokens corretamente
3. Testar ambos os temas (claro e escuro)
4. Nunca usar cores hardcoded nos componentes

---

## 8. SEO e Metadados

- Título: `<title>Estresse PROCISA</title>` (< 60 caracteres)
- Meta description presente
- Open Graph e Twitter Cards configurados
- HTML semântico com `<main>`, `<footer>`, `<section>`
- Imagens com atributo `alt`
- Viewport responsivo configurado

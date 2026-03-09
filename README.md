# Escalas de Estresse — PROCISA / UFRR

Ferramenta digital para aplicação de escalas validadas de estresse (PSS-10 e EET), desenvolvida no âmbito do Programa de Pós-graduação em Ciências da Saúde (PROCISA) da Universidade Federal de Roraima (UFRR).

---

## Visão Geral

A aplicação permite que o usuário realize duas escalas psicométricas — individualmente ou em sequência — e receba os escores com classificações de nível de estresse. Os resultados podem ser enviados por e-mail. **Nenhum dado é armazenado**: todo o processamento acontece localmente no navegador.

## Stack Tecnológica

| Camada | Tecnologia |
|--------|-----------|
| Framework | React 18 + TypeScript |
| Build | Vite (SWC) |
| Estilização | Tailwind CSS + tokens HSL semânticos |
| Componentes UI | shadcn/ui (Button, Skeleton, Toast, Tooltip) |
| Ícones | Lucide React (tree-shakable) |
| Roteamento | React Router DOM v6 |

## Arquitetura

```
src/
├── main.tsx              # Ponto de entrada
├── App.tsx               # Provedores globais (Toaster, Router)
├── index.css             # Design tokens HSL, utilidades CSS
├── pages/Index.tsx       # Controlador de fluxo (welcome → exam → results)
├── components/
│   ├── QuizPlayer.tsx    # Renderiza escala completa com barra de progresso
│   ├── QuestionCard.tsx  # Card individual de questão (memo)
│   ├── ResultsView.tsx   # Resultados + envio por e-mail (lazy)
│   └── AboutSection.tsx  # Seção "Sobre" com perfis dos autores (lazy)
├── data/exams.ts         # Definições das escalas PSS-10 e EET
├── lib/utils.ts          # Utilitário cn() para classes condicionais
└── assets/               # Logos e fotos dos autores
```

## Design System

- **Cores**: tokens HSL em `index.css` — `--primary: 161 93% 30%` (verde esmeralda)
- **Fontes**: Space Grotesk (títulos) + Inter (corpo)
- **Regra**: NUNCA usar cores diretas. Sempre tokens: `text-primary`, `bg-card`, etc.
- **Utilidades**: `.card-elevated`, `.gradient-hero`, `.text-gradient-primary`

## Otimização

| Técnica | Onde | Impacto |
|---------|------|---------|
| `React.lazy()` | ResultsView, AboutSection | Reduz bundle inicial |
| `React.memo()` | QuestionCard | Evita re-render de 33 questões |
| `useCallback` | selectAnswer, handlers | Estabiliza referências |
| `useMemo` | results, computedResults | Evita recálculo |
| `loading="lazy"` | Imagens dos autores | Carrega sob demanda |
| Bundle mínimo | 6 componentes UI de 40+ | Redução massiva |

## Otimização de Banco de Dados (diretrizes futuras)

```
1. Autenticação → auth.uid()
2. RLS → Row Level Security
3. Seleção → SELECT apenas colunas necessárias
4. Filtragem → WHERE com índices
5. Paginação → LIMIT/OFFSET ou cursor-based
6. Cache → staleTime no TanStack Query
```

## Componentes Reutilizáveis

- **QuestionCard**: qualquer escala com N opções, labels, inversão de escore
- **QuizPlayer**: qualquer escala definida em `exams.ts`
- **Button (shadcn)**: variantes default, outline, ghost, destructive

## Referências

- **PSS-10**: Cohen, S., Kamarck, T., & Mermelstein, R. (1983). Adaptação: Siqueira Reis et al. (2010).
- **EET**: Paschoal, T., & Tamayo, A. (2004).

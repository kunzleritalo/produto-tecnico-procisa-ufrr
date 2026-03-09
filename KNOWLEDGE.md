# Documento de Conhecimento — Escalas de Estresse PROCISA/UFRR

Referência técnica para desenvolvimento contínuo.

---

## 1. Estrutura do Projeto

```
src/
├── main.tsx                    → Ponto de entrada
├── App.tsx                     → Provedores (Toaster, Router)
├── index.css                   → Tokens HSL, fontes, utilidades
├── pages/Index.tsx             → Controlador de fluxo
├── components/
│   ├── QuizPlayer.tsx          → Orquestra aplicação de escala
│   ├── QuestionCard.tsx        → Card de questão (memo)
│   ├── ResultsView.tsx         → Resultados + e-mail (lazy)
│   ├── AboutSection.tsx        → Seção "Sobre" (lazy)
│   └── ui/ (button, skeleton, toast, toaster, sonner, tooltip)
├── data/exams.ts               → Definições PSS-10 e EET
├── lib/utils.ts                → cn()
└── assets/                     → Logos e fotos
```

## 2. Fluxo

```
welcome → [Ambas] → exam1 → exam2 → results
        → [PSS-10] → exam1 → results
        → [EET] → exam2 → results
```

## 3. Design System

- Tokens HSL em `index.css` (`:root` e `.dark`)
- Fontes: Space Grotesk (títulos) + Inter (corpo)
- NUNCA cores diretas — sempre tokens semânticos
- Ícones lucide-react: HeartPulse, Briefcase, AlertTriangle, Clock, ArrowRight
- Mobile-first: grid 5 colunas para alternativas, `<br className="sm:hidden">` para quebra controlada

## 4. Otimização

- `React.lazy()` para ResultsView e AboutSection
- `React.memo()` no QuestionCard
- `useCallback` em selectAnswer e handlers do Index
- `useMemo` em results e computedResults
- Bundle mínimo: 6 componentes UI mantidos, 37+ removidos
- 13 dependências pesadas removidas + 24 pacotes Radix

## 5. Banco de Dados (diretrizes futuras)

Ordem: Autenticação → RLS → Seleção → Filtragem → Paginação → Cache

- Cache: `staleTime: Infinity` para escalas, `5min` para dados do usuário
- Prefetch durante navegação
- Batch com `Promise.all()` para consultas independentes

## 6. Componentes Reutilizáveis

- **QuestionCard**: aceita qualquer escala via props (optionLabels, startFrom, numOptions)
- **QuizPlayer**: renderiza qualquer Exam do `exams.ts`
- **Button**: variantes default, outline, ghost, destructive; tamanhos default, sm, lg, icon

## 7. Como adicionar nova escala

1. Adicionar textos em `exams.ts`
2. Criar objeto Exam com `generateQuestions()`
3. Adicionar ao array `exams[]`
4. Atualizar tipo `Mode` em `Index.tsx`
5. Adicionar botão na tela de boas-vindas
6. Adicionar classificação em `ResultsView.tsx`

## 8. Convenções

- Comentários: português brasileiro
- Variáveis/funções: inglês
- Textos de interface: português brasileiro
- CSS: sempre tokens semânticos
- Imports: alias `@/` para `src/`

## 9. Dependências ativas

React, React Router DOM, Radix (slot, toast, tooltip), CVA, clsx, tailwind-merge, lucide-react, sonner, tailwindcss-animate.

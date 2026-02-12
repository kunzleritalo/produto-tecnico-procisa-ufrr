export interface Option {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface Question {
  id: string;
  text: string;
  weight: number;
  maxScore: number;
  options: Option[];
}

export interface Exam {
  id: string;
  title: string;
  description: string;
  questions: Question[];
}

export const exams: Exam[] = [
  {
    id: "prova1",
    title: "Prova 1 — Conhecimentos Gerais",
    description: "Avalie seus conhecimentos em temas variados",
    questions: [
      {
        id: "p1q1",
        text: "Qual é o maior planeta do Sistema Solar?",
        weight: 3,
        maxScore: 10,
        options: [
          { id: "a", text: "Terra", isCorrect: false },
          { id: "b", text: "Júpiter", isCorrect: true },
          { id: "c", text: "Saturno", isCorrect: false },
          { id: "d", text: "Marte", isCorrect: false },
        ],
      },
      {
        id: "p1q2",
        text: "Quem escreveu 'Dom Casmurro'?",
        weight: 2,
        maxScore: 8,
        options: [
          { id: "a", text: "José de Alencar", isCorrect: false },
          { id: "b", text: "Machado de Assis", isCorrect: true },
          { id: "c", text: "Clarice Lispector", isCorrect: false },
          { id: "d", text: "Guimarães Rosa", isCorrect: false },
        ],
      },
      {
        id: "p1q3",
        text: "Qual a capital da Austrália?",
        weight: 1,
        maxScore: 6,
        options: [
          { id: "a", text: "Sydney", isCorrect: false },
          { id: "b", text: "Melbourne", isCorrect: false },
          { id: "c", text: "Canberra", isCorrect: true },
          { id: "d", text: "Brisbane", isCorrect: false },
        ],
      },
      {
        id: "p1q4",
        text: "Qual elemento químico tem o símbolo 'O'?",
        weight: 2,
        maxScore: 8,
        options: [
          { id: "a", text: "Ouro", isCorrect: false },
          { id: "b", text: "Oxigênio", isCorrect: true },
          { id: "c", text: "Ósmio", isCorrect: false },
          { id: "d", text: "Ozônio", isCorrect: false },
        ],
      },
      {
        id: "p1q5",
        text: "Em que ano o Brasil foi descoberto?",
        weight: 2,
        maxScore: 10,
        options: [
          { id: "a", text: "1492", isCorrect: false },
          { id: "b", text: "1500", isCorrect: true },
          { id: "c", text: "1530", isCorrect: false },
          { id: "d", text: "1510", isCorrect: false },
        ],
      },
    ],
  },
  {
    id: "prova2",
    title: "Prova 2 — Matemática e Lógica",
    description: "Teste suas habilidades em raciocínio lógico",
    questions: [
      {
        id: "p2q1",
        text: "Quanto é 15% de 200?",
        weight: 1,
        maxScore: 6,
        options: [
          { id: "a", text: "25", isCorrect: false },
          { id: "b", text: "30", isCorrect: true },
          { id: "c", text: "35", isCorrect: false },
          { id: "d", text: "20", isCorrect: false },
        ],
      },
      {
        id: "p2q2",
        text: "Qual é a raiz quadrada de 144?",
        weight: 2,
        maxScore: 8,
        options: [
          { id: "a", text: "11", isCorrect: false },
          { id: "b", text: "12", isCorrect: true },
          { id: "c", text: "13", isCorrect: false },
          { id: "d", text: "14", isCorrect: false },
        ],
      },
      {
        id: "p2q3",
        text: "Se x + 5 = 12, qual o valor de x?",
        weight: 3,
        maxScore: 10,
        options: [
          { id: "a", text: "5", isCorrect: false },
          { id: "b", text: "6", isCorrect: false },
          { id: "c", text: "7", isCorrect: true },
          { id: "d", text: "8", isCorrect: false },
        ],
      },
      {
        id: "p2q4",
        text: "Qual o próximo número da sequência: 2, 6, 18, 54, ...?",
        weight: 3,
        maxScore: 10,
        options: [
          { id: "a", text: "108", isCorrect: false },
          { id: "b", text: "162", isCorrect: true },
          { id: "c", text: "148", isCorrect: false },
          { id: "d", text: "180", isCorrect: false },
        ],
      },
      {
        id: "p2q5",
        text: "Quantos lados tem um hexágono?",
        weight: 1,
        maxScore: 6,
        options: [
          { id: "a", text: "5", isCorrect: false },
          { id: "b", text: "6", isCorrect: true },
          { id: "c", text: "7", isCorrect: false },
          { id: "d", text: "8", isCorrect: false },
        ],
      },
    ],
  },
];

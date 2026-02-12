export interface Question {
  id: string;
  text: string;
  numOptions: number; // 4 or 5
  inverted: boolean;
}

export interface Exam {
  id: string;
  title: string;
  description: string;
  questions: Question[];
}

function generateQuestions(
  prefix: string,
  count: number,
  numOptions: number,
  invertedItems: number[] = []
): Question[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `${prefix}q${i + 1}`,
    text: `Item ${i + 1}`,
    numOptions,
    inverted: invertedItems.includes(i + 1),
  }));
}

export const exams: Exam[] = [
  {
    id: "prova1",
    title: "Prova 1",
    description: "10 itens · Alternativas de 1 a 4 · Itens 4, 5, 7 e 8 com pontuação invertida",
    questions: generateQuestions("p1", 10, 4, [4, 5, 7, 8]),
  },
  {
    id: "prova2",
    title: "Prova 2",
    description: "23 itens · Alternativas de 1 a 5",
    questions: generateQuestions("p2", 23, 5),
  },
];

export function getScore(question: Question, selectedValue: number): number {
  if (question.inverted) {
    return question.numOptions + 1 - selectedValue;
  }
  return selectedValue;
}

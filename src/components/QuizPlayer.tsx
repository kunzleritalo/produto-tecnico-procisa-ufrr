import { useState } from "react";
import { Exam } from "@/data/exams";
import QuestionCard from "./QuestionCard";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Send } from "lucide-react";

interface QuizPlayerProps {
  exam: Exam;
  onFinish: (answers: Record<string, string>) => void;
}

const QuizPlayer = ({ exam, onFinish }: QuizPlayerProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const question = exam.questions[currentIndex];
  const total = exam.questions.length;
  const allAnswered = Object.keys(answers).length === total;

  const selectAnswer = (questionId: string, optionId: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-1">{exam.title}</h2>
        <p className="text-muted-foreground text-sm">{exam.description}</p>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2 rounded-full bg-secondary mb-8 overflow-hidden">
        <div
          className="h-full rounded-full bg-primary transition-all duration-500"
          style={{ width: `${((currentIndex + 1) / total) * 100}%` }}
        />
      </div>

      <div className="mb-2 text-sm text-muted-foreground flex justify-between">
        <span>Questão {currentIndex + 1} de {total}</span>
        <span className="font-medium">
          Peso: {question.weight} · Nota máx: {question.maxScore}
        </span>
      </div>

      <QuestionCard
        question={question}
        selectedOption={answers[question.id] || null}
        onSelect={(optionId) => selectAnswer(question.id, optionId)}
      />

      <div className="flex justify-between mt-8">
        <Button
          variant="outline"
          onClick={() => setCurrentIndex((i) => i - 1)}
          disabled={currentIndex === 0}
        >
          <ChevronLeft className="w-4 h-4 mr-1" /> Anterior
        </Button>

        {currentIndex < total - 1 ? (
          <Button onClick={() => setCurrentIndex((i) => i + 1)}>
            Próxima <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        ) : (
          <Button onClick={() => onFinish(answers)} disabled={!allAnswered}>
            Finalizar <Send className="w-4 h-4 ml-1" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default QuizPlayer;

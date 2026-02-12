import { Question } from "@/data/exams";
import { cn } from "@/lib/utils";

interface QuestionCardProps {
  question: Question;
  selectedOption: string | null;
  onSelect: (optionId: string) => void;
}

const QuestionCard = ({ question, selectedOption, onSelect }: QuestionCardProps) => {
  return (
    <div className="rounded-xl bg-card border border-border p-6 shadow-sm">
      <h3 className="text-lg font-semibold mb-5 leading-relaxed">{question.text}</h3>
      <div className="space-y-3">
        {question.options.map((option, idx) => {
          const letter = String.fromCharCode(65 + idx);
          const isSelected = selectedOption === option.id;
          return (
            <button
              key={option.id}
              onClick={() => onSelect(option.id)}
              className={cn(
                "w-full text-left px-4 py-3.5 rounded-lg border-2 transition-all duration-200 flex items-center gap-3 group",
                isSelected
                  ? "border-primary bg-primary/10 shadow-sm"
                  : "border-border hover:border-primary/40 hover:bg-secondary/60"
              )}
            >
              <span
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 transition-colors",
                  isSelected
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground group-hover:bg-primary/20"
                )}
              >
                {letter}
              </span>
              <span className="font-medium text-sm">{option.text}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuestionCard;

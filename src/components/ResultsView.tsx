import { Exam, getScore } from "@/data/exams";
import { Brain, Home, AlertTriangle, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import procisaLogo from "@/assets/procisa-logo.png";

interface ExamResult {
  exam: Exam;
  answers: Record<string, number>;
}

interface ResultsViewProps {
  results: ExamResult[];
  mode: "both" | "pss10" | "eet";
  onRestart: () => void;
}

const ResultsView = ({ results, mode, onRestart }: ResultsViewProps) => {
  const disclaimerBoth = `Estas escalas são ferramentas úteis apenas para medir possíveis INDICATIVOS do Estresse Percebido e do Estresse No Trabalho, deste modo, NÃO DEVEM SER UTILIZADAS como ferramentas para o diagnóstico. Cabe lembrar que tais instrumentos não são de uso privativo.\n\nCaso você perceba que o estresse está sendo prejudicial e atrapalhando seu bem-estar procure ajuda`;

  const disclaimerPSS = `Esta escala é uma ferramenta útil para medir possíveis INDICATIVOS de Estresse Percebido, deste modo, NÃO DEVE SER UTILIZADA como ferramenta para o diagnóstico. Cabe lembrar que tal instrumento não é de uso privativo.\n\nCaso você perceba que o estresse está sendo prejudicial e atrapalhando seu bem-estar procure ajuda.`;

  const disclaimerEET = `Esta escala é uma ferramenta útil para medir possíveis INDICATIVOS de Estresse No Trabalho, deste modo, NÃO DEVE SER UTILIZADA como ferramenta para o diagnóstico. Cabe lembrar que tal instrumento não é de uso privativo.\n\nCaso você perceba que o estresse está sendo prejudicial e atrapalhando seu bem-estar procure ajuda.`;

  const disclaimer = mode === "both" ? disclaimerBoth : mode === "pss10" ? disclaimerPSS : disclaimerEET;

  const buildEmailBody = () => {
    const now = new Date();
    const dataHora = now.toLocaleDateString("pt-BR", {
      day: "2-digit", month: "2-digit", year: "numeric",
    }) + " às " + now.toLocaleTimeString("pt-BR", {
      hour: "2-digit", minute: "2-digit",
    });

    let body = "RESULTADO - Escalas de Estresse (PROCISA)\n";
    body += `Data e hora da realização: ${dataHora}\n\n`;

    results.forEach(({ exam, answers }) => {
      const totalScore = exam.questions.reduce((sum, q) => {
        const selected = answers[q.id];
        return sum + (selected != null ? getScore(q, selected) : 0);
      }, 0);

      body += `--- ${exam.title} ---\n`;

      if (exam.id === "prova1") {
        const getStressLevel = (score: number) => {
          if (score <= 18) return "Estresse Baixo";
          if (score <= 24) return "Estresse Normal";
          if (score <= 35) return "Estresse Alto";
          return "Estresse Muito Alto";
        };
        body += `Escore Total: ${totalScore}\n`;
        body += `Classificação: ${getStressLevel(totalScore)}\n`;
        body += `Valores categorizados a partir de: PASCHOAL, T.; TAMAYO, A. Validação da escala de estresse no trabalho. Estudos de Psicologia (Natal), v. 9, n. 1, p. 45-52, 2004.\n\n`;
      }

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

    body += "---\n\n";
    body += disclaimer;
    body += "\n\n---\n\n";

    body += "REFERÊNCIAS\n\n";
    if (mode === "both" || mode === "pss10") {
      body += "PSS-10:\n";
      body += "Cohen, S., Kamarck, T., & Mermelstein, R. (1983). A global measure of perceived stress. Journal of Health and Social Behavior, 24(4), 385-396.\n";
      body += "Siqueira Reis, R., Ferreira Hino, A. A., & Romélio Rodriguez Añez, C. (2010). Perceived Stress Scale: Reliability and validity study in Brazil. Journal of Health Psychology, 15(1), 107-114.\n\n";
    }
    if (mode === "both" || mode === "eet") {
      body += "EET:\n";
      body += "Paschoal, T., & Tamayo, A. (2004). Validação da Escala de Estresse no Trabalho. Estudos de Psicologia, 9(1), 45-52.\n\n";
    }

    body += "---\n\n";
    body += "AVISO SOBRE PROTEÇÃO DE DADOS\n\n";
    body += "Os dados apresentados neste relatório foram produzidos e coletados em conformidade com a Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018 – LGPD). ";
    body += "As informações aqui contidas são de caráter pessoal e confidencial, destinando-se exclusivamente ao titular dos dados ou a profissional por ele autorizado. ";
    body += "O compartilhamento, a reprodução ou a divulgação deste conteúdo a terceiros sem o consentimento do titular é de inteira responsabilidade de quem o fizer. ";
    body += "Recomenda-se o armazenamento seguro deste documento e o descarte adequado quando não mais necessário.";

    return body;
  };

  const handleSendEmail = () => {
    const subject = encodeURIComponent("Resultado - Escalas de Estresse (PROCISA)");
    const body = encodeURIComponent(buildEmailBody());
    window.open(`mailto:?subject=${subject}&body=${body}`, "_self");
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="text-center mb-10">
        <img src={procisaLogo} alt="Logo PROCISA" className="h-14 mx-auto mb-4" />
        


        <h2 className="text-3xl font-bold mb-2">Resultado Final</h2>
        <p className="text-muted-foreground">Escores obtidos nas escalas aplicadas</p>
      </div>

      <div className="grid gap-8">
        {results.map(({ exam, answers }) => {
          const totalScore = exam.questions.reduce((sum, q) => {
            const selected = answers[q.id];
            return sum + (selected != null ? getScore(q, selected) : 0);
          }, 0);

          const getStressLevel = (score: number) => {
            if (score <= 18) return { label: "Estresse Baixo", color: "text-green-600" };
            if (score <= 24) return { label: "Estresse Normal", color: "text-yellow-600" };
            if (score <= 35) return { label: "Estresse Alto", color: "text-orange-600" };
            return { label: "Estresse Muito Alto", color: "text-red-600" };
          };

          const getEETStressLevel = (avg: number) => {
            if (avg < 2.5) return { label: "Estresse Baixo ou Leve", color: "text-green-600" };
            if (avg === 2.5) return { label: "Estresse Médio/Considerável", color: "text-yellow-600" };
            return { label: "Estresse Alto", color: "text-red-600" };
          };

          const stressLevel = exam.id === "prova1" ? getStressLevel(totalScore) : null;
          const eetAvg = exam.id === "prova2" ? parseFloat((totalScore / 23).toFixed(2)) : null;
          const eetStressLevel = eetAvg != null ? getEETStressLevel(eetAvg) : null;

          return (
            <div key={exam.id} className="rounded-xl bg-card border border-border p-6 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-xl font-bold">{exam.title}</h3>
                <div className="text-right">
                  {exam.id === "prova1" &&
                  <>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">Escore Total</p>
                      <p className="text-3xl font-bold text-primary">{totalScore}</p>
                    </>
                  }
                  {exam.id === "prova2" && eetAvg != null &&
                  <>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">Escore Médio</p>
                      <p className="text-3xl font-bold text-primary">{eetAvg.toFixed(2)}</p>
                    </>
                  }
                  {stressLevel &&
                  <p className={`text-sm font-semibold mt-1 ${stressLevel.color}`}>
                      {stressLevel.label}
                    </p>
                  }
                  {eetStressLevel &&
                  <p className={`text-sm font-semibold mt-1 ${eetStressLevel.color}`}>
                      {eetStressLevel.label}
                    </p>
                  }
                </div>
              </div>
              {exam.id === "prova1" &&
                <p className="text-[11px] text-muted-foreground/70 leading-snug mt-2">
                  Valores organizados e categorizados a partir de: PASCHOAL, T.; TAMAYO, A. Validação da escala de estresse no trabalho. <em>Estudos de Psicologia (Natal)</em>, v. 9, n. 1, p. 45-52, 2004.
                </p>
              }
            </div>);

        })}
      </div>

      <div className="rounded-xl border border-border bg-secondary/30 p-6 mt-8">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 shrink-0" />
          <p className="text-sm text-muted-foreground whitespace-pre-line">{disclaimer}</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-10">
        <Button onClick={handleSendEmail} size="lg" variant="outline">
          <Mail className="w-4 h-4 mr-2" /> Enviar por e-mail
        </Button>
        <Button onClick={onRestart} size="lg">
          <Home className="w-4 h-4 mr-2" /> Retornar à tela inicial
        </Button>
      </div>
    </div>);

};

export default ResultsView;
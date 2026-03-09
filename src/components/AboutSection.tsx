import procisaLogo from "@/assets/procisa-logo.png";
import ufrrLogo from "@/assets/ufrr-logo.png";
import edilanePhoto from "@/assets/edilane-photo.gif";
import italoPhoto from "@/assets/italo-photo.gif";

const AboutSection = () => {
  return (
    <section className="max-w-3xl mx-auto mt-16 mb-10">
      <h2 className="text-2xl font-bold text-center mb-6">Sobre</h2>

      <div className="rounded-xl border border-border bg-card p-6 mb-8 text-center card-elevated">
        <div className="flex items-center justify-center gap-5 mb-5">
          <img src={procisaLogo} alt="Logo PROCISA" className="h-20 object-contain" />
          <div className="w-px h-14 bg-border" />
          <img src={ufrrLogo} alt="Brasão UFRR" className="h-20 object-contain" />
        </div>
        <p className="text-sm text-muted-foreground text-justify">
          Esta ferramenta digital foi criada pelo Mestre em Ciências da Saúde{" "}
          <strong>Ítalo Ribeiro Kunzler Machado Marques</strong> sob orientação da{" "}
          Professora Doutora <strong>Edilane Nunes Régis Bezerra</strong> dentro do
          Programa de Pós-graduação em Ciências da Saúde PROCISA – UFRR. Esta aplicação foi desenvolvida em estrita consonância com as diretrizes da Coordenação de Aperfeiçoamento de Pessoal de Nível Superior (CAPES) para a produção de Produtos Técnicos e Tecnológicos (PTT). Seu desenvolvimento fundamenta-se nos critérios de avaliação estabelecidos pelo Relatório do Grupo de Trabalho (GT) de Produção Técnica da CAPES de 2019.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Edilane */}
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex flex-col items-center mb-4">
            <img
              src={edilanePhoto}
              alt="Profa. Dra. Edilane Nunes Régis Bezerra"
              loading="lazy"
              className="w-28 h-28 rounded-full object-cover border-2 border-primary/30 mb-3" />
            <h3 className="font-bold text-sm text-center">Prof.ª Dr.ª Edilane Nunes Régis Bezerra</h3>
            <p className="text-xs text-muted-foreground">Orientadora</p>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed text-justify">
            Edilane Nunes Régis Bezerra é psicóloga, professora e pesquisadora com ampla experiência na área da Psicologia Social e da Saúde. Doutora em Psicologia Social pela Universidade Federal da Paraíba (2017) e mestre em Psicologia pela Universidade Federal do Rio Grande do Norte (2008), atua como professora adjunta da Universidade Federal de Roraima (UFRR), onde integra o corpo docente do curso de Psicologia e do Programa de Pós-graduação em Ciências da Saúde (PROCISA).
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed mt-2 text-justify">
            Na UFRR, coordena o Grupo de Pesquisa em Saúde Mental e Atenção Psicossocial e Primária, desenvolvendo estudos voltados para promoção da saúde, vulnerabilidades e saúde mental. Suas linhas de pesquisa abrangem temas como redes de atenção psicossocial (RAPS), clínica ampliada, reforma psiquiátrica, saúde mental na atenção básica, inserção e prática do psicólogo em políticas públicas de saúde e programas de intervenção comunitária.
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed mt-2 text-justify">
            Além de tudo, Edilane contribui diretamente para a formação de novos profissionais e pesquisadores, consolidando sua atuação como referência na interface entre psicologia, saúde mental e políticas públicas. Sua trajetória reflete um compromisso com a construção de práticas de cuidado ampliadas e integradas, voltadas para a promoção da saúde e o fortalecimento das redes de atenção psicossocial.
          </p>
        </div>

        {/* Ítalo */}
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex flex-col items-center mb-4">
            <img
              src={italoPhoto}
              alt="Me. Ítalo Ribeiro Kunzler Machado Marques"
              loading="lazy"
              className="w-28 h-28 rounded-full object-cover border-2 border-primary/30 mb-3" />
            <h3 className="font-bold text-sm text-center">Me. Ítalo Ribeiro Kunzler Machado Marques</h3>
            <p className="text-xs text-muted-foreground">Autor</p>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed text-justify">
            Ítalo Ribeiro Kunzler Machado Marques é psicólogo e pesquisador com atuação prática em saúde mental e psicologia organizacional. Graduado em Psicologia pela Universidade Federal de Roraima (2021), onde também desenvolveu seu mestrado em Ciências da Saúde (2025), Ítalo complementou sua trajetória com especializações em Psicologia Organizacional (2023) e Gestão de Pessoas (2023) além de Saúde Mental (2022).
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed mt-2 text-justify">
            Atualmente, exerce atividades profissionais em saúde mental e gestão de pessoas, com experiência em projetos voltados à população em situação de rua e pesquisas sobre narratividade e produção de subjetividade. Sua atuação combina prática clínica, pesquisa acadêmica e vivência institucional, refletindo um compromisso em promover o bem-estar psicológico em diferentes contextos sociais e organizacionais.
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed mt-2 text-justify">
            Além de sua prática como psicólogo, Ítalo também realiza atividades docentes, contribuindo para a formação de novos profissionais e compartilhando sua experiência em temas relacionados à saúde mental, psicologia organizacional e ciências da saúde. 
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed mt-2 text-justify">
            Sua trajetória revela um profissional que transita entre ensino, pesquisa e prática, sempre com o objetivo de ampliar o alcance da psicologia e fortalecer sua contribuição para a sociedade.
          </p>
        </div>
      </div>
    </section>);

};

export default AboutSection;
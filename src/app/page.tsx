import { anosDeAtuacao } from "@/content/institucional";
import { Hero } from "@/components/secoes/hero";
import { Manifesto } from "@/components/secoes/manifesto";
import { Perfis } from "@/components/secoes/perfis";
import { Video } from "@/components/secoes/video";
import { Numeros } from "@/components/secoes/numeros";
import { Atuacao } from "@/components/secoes/atuacao";
import { ComoFunciona } from "@/components/secoes/como-funciona";
import { MunicipiosFaixa } from "@/components/secoes/municipios-faixa";
import { TransparenciaDestaque } from "@/components/secoes/transparencia-destaque";
import { NoticiasDestaque } from "@/components/secoes/noticias-destaque";
import { ChamadaFinal } from "@/components/secoes/chamada-final";

export default function Inicio() {
  const anos = anosDeAtuacao();
  return (
    <>
      <Hero anos={anos} />
      <Perfis />
      <Manifesto />
      <Numeros anos={anos} />
      <Video />
      <Atuacao />
      <ComoFunciona />
      <MunicipiosFaixa />
      <TransparenciaDestaque />
      <NoticiasDestaque />
      <ChamadaFinal />
    </>
  );
}

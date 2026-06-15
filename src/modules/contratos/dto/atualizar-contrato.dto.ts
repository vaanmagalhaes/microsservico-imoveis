import { OmitType, PartialType } from "@nestjs/swagger";
import { CriarContratoDto } from "./criar-contrato.dto";

//Herdando as validações, tornei tudo opcional, mas proibi a alteração do
// idImovel com o OmitType
export class AtualizarContratoDto extends PartialType(
    OmitType(CriarContratoDto, ['idImovel'] as const)
) {}
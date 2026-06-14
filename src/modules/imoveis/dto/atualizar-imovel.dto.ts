import { PartialType } from '@nestjs/swagger';
import { CriarImovelDto } from './criar-imovel.dto';

//O PartialType pega todas as regras do CriarImovelDto e aplica o @IsOptional() em tudo
export class AtualizarImovelDto extends PartialType(CriarImovelDto) {}
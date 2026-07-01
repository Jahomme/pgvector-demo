import { ApiProperty } from '@nestjs/swagger';

export class IngestDto {
  @ApiProperty({
    example: 'iPhone 15 Pro Max',
    description: 'Título ou nome do item.',
  })
  title: string;

  @ApiProperty({
    example: 'O iPhone 15 Pro Max é um dos melhores celulares para fotografia.',
    description: 'Texto que será convertido em vetor e salvo no banco.',
  })
  content: string;
}

export class SearchDto {
  @ApiProperty({
    example: 'Quero um celular bom para fotos.',
    description: 'Pergunta para buscar no banco via distância de cosseno (busca semântica).',
  })
  query: string;
}

export class FtsSearchDto {
  @ApiProperty({
    example: 'celular fotografia',
    description: 'Palavras-chave para buscar via Full Text Search nativo do PostgreSQL (ts_vector).',
  })
  query: string;
}

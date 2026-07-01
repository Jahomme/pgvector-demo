import { Controller, Post, Body, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { DocumentsService } from './documents.service';
import { IngestDto, SearchDto, FtsSearchDto } from './dto/documents.dto';

@ApiTags('documents')
@Controller('api/documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Get()
  @ApiOperation({ summary: 'Lista todos os documentos do banco (sem os embeddings)' })
  @ApiResponse({ status: 200, description: 'Retorna a lista contendo id, título e conteúdo.' })
  async findAll() {
    return this.documentsService.findAll();
  }

  @Post()
  @ApiOperation({ summary: 'Gera embedding de um texto e salva no banco' })
  @ApiResponse({ status: 201, description: 'Texto e vetor inseridos com sucesso.' })
  async ingest(@Body() body: IngestDto) {
    return this.documentsService.ingest(body);
  }

  @Post('search')
  @ApiOperation({ summary: 'Busca Semântica — usa pgvector + distância de cosseno para encontrar textos similares por significado' })
  @ApiResponse({ status: 200, description: 'Retorna os textos mais similares semanticamente.' })
  async search(@Body() body: SearchDto) {
    return this.documentsService.search(body.query);
  }

  @Post('fts')
  @ApiOperation({ summary: 'Full Text Search — usa tsvector/tsquery nativo do PostgreSQL para buscar por palavras-chave' })
  @ApiResponse({ status: 200, description: 'Retorna os textos que contêm as palavras-chave.' })
  async ftsSearch(@Body() body: FtsSearchDto) {
    return this.documentsService.ftsSearch(body.query);
  }
}

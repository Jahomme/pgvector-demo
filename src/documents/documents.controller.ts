import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { DocumentsService } from './documents.service';
import { IngestDto, SearchDto } from './dto/documents.dto';

@ApiTags('documents')
@Controller('api/documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post()
  @ApiOperation({ summary: 'Gera embedding de um texto e salva no banco' })
  @ApiResponse({ status: 201, description: 'Texto e vetor inseridos com sucesso.' })
  async ingest(@Body() body: IngestDto) {
    return this.documentsService.ingest(body);
  }

  @Post('search')
  @ApiOperation({ summary: 'Realiza busca semântica por similaridade' })
  @ApiResponse({ status: 200, description: 'Retorna os textos mais similares.' })
  async search(@Body() body: SearchDto) {
    return this.documentsService.search(body.query);
  }
}

import { Injectable, NotImplementedException } from '@nestjs/common';
import { db } from '../db';
import { documents } from '../db/schema';
import { GoogleGenerativeAI } from '@google/generative-ai';
// import { cosineDistance, desc, sql } from 'drizzle-orm';

@Injectable()
export class DocumentsService {
  private genAI: GoogleGenerativeAI;

  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
  }

  async ingest(title: string, content: string) {
    if (!title || !content) {
      throw new Error('Título e conteúdo são obrigatórios');
    }
    
    // TODO: Implementar a lógica de geração de embeddings e inserção no banco
    // Siga as instruções no arquivo tasks/02_geracao_embeddings.md
    
    throw new NotImplementedException('A ingestão ainda não foi implementada pela dupla!');
  }

  async search(query: string) {
    if (!query) {
      throw new Error('Query é obrigatória');
    }

    // TODO: Implementar a lógica de conversão da query em embedding e a busca por similaridade
    // Siga as instruções no arquivo tasks/03_busca_vetorial.md
    
    throw new NotImplementedException('A busca ainda não foi implementada pela dupla!');
  }
}

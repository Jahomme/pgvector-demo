import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotImplementedException,
} from "@nestjs/common";
import { GoogleGenAI } from "@google/genai";
import { IngestDto } from "./dto/documents.dto";
import { DB_CONNECTION } from "../db/db.module";
import { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import * as schema from "../db/schema";
import { cosineDistance, desc, sql } from "drizzle-orm";

@Injectable()
export class DocumentsService {
  private genAI: GoogleGenAI;
  private readonly logger = new Logger(DocumentsService.name);

  constructor(
    @Inject(DB_CONNECTION)
    private readonly db: PostgresJsDatabase<typeof schema>,
  ) {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      throw new InternalServerErrorException(
        "GEMINI_API_KEY não foi encontrada no .env",
      );
    }

    this.genAI = new GoogleGenAI({ apiKey });
  }

  async ingest(body: IngestDto) {
    const { title, content } = body;

    if (!title || !content) {
      throw new BadRequestException("Título e conteúdo são obrigatórios");
    }

    try {
      const result = await this.genAI.models.embedContent({
        model: "gemini-embedding-2",
        contents: content,
        config: { outputDimensionality: 768 },
      });

      const embedding = result.embeddings[0].values;

      // Insere o documento com embedding E gera o tsvector automaticamente usando to_tsvector
      await this.db
        .insert(schema.documents)
        .values({
          title,
          content,
          embedding,
          searchVector: sql`setweight(to_tsvector('portuguese_unaccent', ${title}), 'A') || setweight(to_tsvector('portuguese_unaccent', ${content}), 'B')`,
        });

      return { message: "Embedding inserido com sucesso!" };
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(
          `Falha ao ingerir documento '${title}': ${error.message}`,
          error.stack,
        );
      } else {
        this.logger.error(
          `Falha ao ingerir documento '${title}': ${String(error)}`,
        );
      }

      throw new InternalServerErrorException(
        "Não foi possível processar e salvar o documento no momento. Tente novamente mais tarde.",
      );
    }
  }

  async search(query: string) {
    if (!query) {
      throw new Error("Query é obrigatória");
    }

    const result = await this.genAI.models.embedContent({
      model: "gemini-embedding-2",
      contents: query,
      config: { outputDimensionality: 768 },
    });

    const queryEmbedding = result.embeddings[0].values;
    const similarity = sql<number>`1 - (${cosineDistance(schema.documents.embedding, queryEmbedding)})`;

    const documents = await this.db
      .select({
        id: schema.documents.id,
        title: schema.documents.title,
        content: schema.documents.content,
        similarity,
      })
      .from(schema.documents)
      .orderBy(desc(similarity))
      .limit(5);

    return documents;
  }

  async ftsSearch(query: string) {
    if (!query) {
      throw new BadRequestException("Query é obrigatória");
    }

    try {
      const tsQuery = sql`plainto_tsquery('portuguese_unaccent', ${query})`;

      const results = await this.db
        .select({
          id: schema.documents.id,
          title: schema.documents.title,
          content: schema.documents.content,
          rank: sql<number>`ts_rank(${schema.documents.searchVector}, ${tsQuery})`,
        })
        .from(schema.documents)
        .where(sql`${schema.documents.searchVector} @@ ${tsQuery}`)
        .orderBy(sql`ts_rank(${schema.documents.searchVector}, ${tsQuery}) DESC`)
        .limit(5);

      return results;
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(
          `Falha na busca Full Text Search: ${error.message}`,
          error.stack,
        );
      }

      throw new InternalServerErrorException(
        "Não foi possível realizar a busca Full Text Search.",
      );
    }
  }

  async findAll() {
    try {
      const results = await this.db
        .select({
          id: schema.documents.id,
          title: schema.documents.title,
          content: schema.documents.content,
        })
        .from(schema.documents);

      return results;
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(
          `Falha ao listar documentos: ${error.message}`,
          error.stack,
        );
      }
      throw new InternalServerErrorException(
        "Não foi possível buscar os registros no banco.",
      );
    }
  }
}

// src/db/db.module.ts
import { Global, Module, OnModuleInit, Inject } from "@nestjs/common";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import { sql } from "drizzle-orm";
import { PostgresJsDatabase } from "drizzle-orm/postgres-js";

export const DB_CONNECTION = "DB_CONNECTION";

@Global()
@Module({
  providers: [
    {
      provide: DB_CONNECTION,
      useFactory: () => {
        const connectionString = process.env.DATABASE_URL;

        if (!connectionString) {
          throw new Error("DATABASE_URL não configurada no .env");
        }

        const queryClient = postgres(connectionString);
        return drizzle(queryClient, { schema });
      },
    },
  ],
  exports: [DB_CONNECTION], 
})
export class DatabaseModule implements OnModuleInit {
  constructor(
    @Inject(DB_CONNECTION)
    private readonly db: PostgresJsDatabase<typeof schema>,
  ) {}

  async onModuleInit() {
    try {
      console.log("🔧 Inicializando extensões e configurações do banco de dados...");
      
      // Habilita a extensão de remoção de acentos
      await this.db.execute(sql`CREATE EXTENSION IF NOT EXISTS unaccent;`);
      
      // Cria a configuração de busca sem acentos em português se não existir
      await this.db.execute(sql`
        DO $$
        BEGIN
          IF NOT EXISTS (SELECT 1 FROM pg_ts_config WHERE cfgname = 'portuguese_unaccent') THEN
            CREATE TEXT SEARCH CONFIGURATION portuguese_unaccent (COPY = portuguese);
            ALTER TEXT SEARCH CONFIGURATION portuguese_unaccent ALTER MAPPING FOR hword, hword_part, word WITH unaccent, portuguese_stem;
          END IF;
        END
        $$;
      `);
      
      console.log("✅ Extensões e configurações de busca do PostgreSQL prontas!");
    } catch (error) {
      console.error("❌ Falha ao inicializar configurações do banco de dados:", error);
    }
  }
}

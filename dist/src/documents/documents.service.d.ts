import { IngestDto } from "./dto/documents.dto";
import { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import * as schema from "../db/schema";
export declare class DocumentsService {
    private readonly db;
    private genAI;
    constructor(db: PostgresJsDatabase<typeof schema>);
    ingest(body: IngestDto): Promise<{
        message: string;
    }>;
    search(query: string): Promise<void>;
}

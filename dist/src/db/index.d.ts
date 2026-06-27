import postgres from 'postgres';
import * as schema from './schema';
import 'dotenv/config';
export declare const db: import("drizzle-orm/postgres-js").PostgresJsDatabase<typeof schema> & {
    $client: postgres.Sql<{}>;
};

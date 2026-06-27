import { Module } from "@nestjs/common";
import { DocumentsModule } from "./documents/documents.module";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [DocumentsModule, ConfigModule.forRoot()],
})
export class AppModule {}

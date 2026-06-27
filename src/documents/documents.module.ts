import { Module } from "@nestjs/common";
import { DocumentsController } from "./documents.controller";
import { DocumentsService } from "./documents.service";
import { DatabaseModule } from "../db/db.module";

@Module({
  controllers: [DocumentsController],
  providers: [DocumentsService],
  imports: [DatabaseModule],
})
export class DocumentsModule {}

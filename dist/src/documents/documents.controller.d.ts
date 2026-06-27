import { DocumentsService } from './documents.service';
import { IngestDto, SearchDto } from './dto/documents.dto';
export declare class DocumentsController {
    private readonly documentsService;
    constructor(documentsService: DocumentsService);
    ingest(body: IngestDto): Promise<{
        message: string;
    }>;
    search(body: SearchDto): Promise<void>;
}

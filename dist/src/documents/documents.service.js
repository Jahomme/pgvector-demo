"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentsService = void 0;
const common_1 = require("@nestjs/common");
const genai_1 = require("@google/genai");
const db_module_1 = require("../db/db.module");
const postgres_js_1 = require("drizzle-orm/postgres-js");
const schema = __importStar(require("../db/schema"));
let DocumentsService = class DocumentsService {
    constructor(db) {
        this.db = db;
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            throw new common_1.InternalServerErrorException("GEMINI_API_KEY não foi encontrada no .env");
        }
        this.genAI = new genai_1.GoogleGenAI({ apiKey });
    }
    async ingest(body) {
        const { title, content } = body;
        if (!title || !content) {
            throw new Error("Título e conteúdo são obrigatórios");
        }
        const result = await this.genAI.models.embedContent({
            model: "gemini-embedding-2",
            contents: content,
            config: { outputDimensionality: 768 },
        });
        const embedding = result.embeddings[0].values;
        await this.db
            .insert(schema.documents)
            .values({ title, content, embedding });
        return { message: "Embedding inserido com sucesso!" };
    }
    async search(query) {
        if (!query) {
            throw new Error("Query é obrigatória");
        }
        throw new common_1.NotImplementedException("A busca ainda não foi implementada pela dupla!");
    }
};
exports.DocumentsService = DocumentsService;
exports.DocumentsService = DocumentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(db_module_1.DB_CONNECTION)),
    __metadata("design:paramtypes", [postgres_js_1.PostgresJsDatabase])
], DocumentsService);
//# sourceMappingURL=documents.service.js.map
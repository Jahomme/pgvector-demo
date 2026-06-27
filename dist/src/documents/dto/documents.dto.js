"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchDto = exports.IngestDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class IngestDto {
}
exports.IngestDto = IngestDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'iPhone 15 Pro Max',
        description: 'Título ou nome do item.',
    }),
    __metadata("design:type", String)
], IngestDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'O iPhone 15 Pro Max é um dos melhores celulares para fotografia.',
        description: 'Texto que será convertido em vetor e salvo no banco.',
    }),
    __metadata("design:type", String)
], IngestDto.prototype, "content", void 0);
class SearchDto {
}
exports.SearchDto = SearchDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Quero um celular bom para fotos.',
        description: 'Pergunta para buscar no banco via distância de cosseno.',
    }),
    __metadata("design:type", String)
], SearchDto.prototype, "query", void 0);
//# sourceMappingURL=documents.dto.js.map
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
exports.MintNftDto = exports.TransferNftDto = exports.MigrateNftDto = exports.CreateNftDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateNftDto {
}
__decorate([
    swagger_1.ApiProperty({ type: 'string', format: 'binary' }),
    __metadata("design:type", Object)
], CreateNftDto.prototype, "file", void 0);
__decorate([
    swagger_1.ApiProperty({ required: false }),
    __metadata("design:type", String)
], CreateNftDto.prototype, "network", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", String)
], CreateNftDto.prototype, "name", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", String)
], CreateNftDto.prototype, "author", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], CreateNftDto.prototype, "type", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", String)
], CreateNftDto.prototype, "about", void 0);
__decorate([
    swagger_1.ApiProperty({ required: false }),
    __metadata("design:type", Number)
], CreateNftDto.prototype, "editions", void 0);
__decorate([
    swagger_1.ApiProperty({ required: false }),
    __metadata("design:type", Number)
], CreateNftDto.prototype, "price", void 0);
__decorate([
    swagger_1.ApiProperty({ required: false }),
    __metadata("design:type", Object)
], CreateNftDto.prototype, "properties", void 0);
__decorate([
    swagger_1.ApiProperty(({ required: false })),
    __metadata("design:type", Object)
], CreateNftDto.prototype, "statement", void 0);
exports.CreateNftDto = CreateNftDto;
class MigrateNftDto {
}
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", String)
], MigrateNftDto.prototype, "fromNetwork", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", String)
], MigrateNftDto.prototype, "toNetwork", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", Number)
], MigrateNftDto.prototype, "tokenid", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", String)
], MigrateNftDto.prototype, "owner", void 0);
exports.MigrateNftDto = MigrateNftDto;
class TransferNftDto {
}
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", String)
], TransferNftDto.prototype, "network", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Number)
], TransferNftDto.prototype, "fee", void 0);
exports.TransferNftDto = TransferNftDto;
class MintNftDto {
}
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", String)
], MintNftDto.prototype, "network", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", String)
], MintNftDto.prototype, "fee", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", String)
], MintNftDto.prototype, "toAddress", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", Number)
], MintNftDto.prototype, "amount", void 0);
exports.MintNftDto = MintNftDto;
//# sourceMappingURL=nft.dto.js.map
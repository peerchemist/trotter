import { ApiProperty } from "@nestjs/swagger";

export class CreateNftDto {
    @ApiProperty()
    readonly owner: string;

    @ApiProperty()
    readonly name: string;

    @ApiProperty()
    readonly description: string;

    @ApiProperty()
    readonly totalSupply: string;
}
import { ApiProperty } from "@nestjs/swagger";

export class CreateNftDto {
    @ApiProperty()
    readonly network: string;

    @ApiProperty()
    readonly owner: string;

    @ApiProperty()
    readonly name: string;

    @ApiProperty()
    readonly author: string;

    @ApiProperty()
    readonly type: string;

    @ApiProperty()
    readonly about: string;

    @ApiProperty()
    readonly editions: number;

    @ApiProperty()
    readonly price: number;

    @ApiProperty()
    readonly properties: object;

    @ApiProperty()
    readonly statement: object;
}
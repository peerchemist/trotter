import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateNftDto {
    @ApiProperty({ type: 'string', format: 'binary' })
    file: any;
    
    @ApiProperty()
    @IsNotEmpty()
    readonly network: string;

    @ApiProperty()
    @IsNotEmpty()
    readonly name: string;

    @ApiProperty()
    @IsNotEmpty()
    readonly author: string;

    @ApiProperty()
    readonly type: string;

    @ApiProperty()
    @IsNotEmpty()
    readonly about: string;

    @ApiProperty()
    readonly editions: number;

    @ApiProperty()
    @IsNotEmpty()
    readonly price: number;

    @ApiProperty()
    readonly properties: object;

    @ApiProperty()
    readonly statement: object;
}


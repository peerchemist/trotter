import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateNftDto {
    @ApiProperty({ type: 'string', format: 'binary' })
    file: any;

    @ApiProperty({ required: false })
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

    @ApiProperty({ required: false })
    readonly editions: number;

    @ApiProperty({ required: false })
    readonly price: number;

    @ApiProperty({ required: false })
    readonly properties: object;

    @ApiProperty(({ required: false }))
    readonly statement: object;
}

export class MigrateNftDto {
    @ApiProperty()
    @IsNotEmpty()
    readonly fromNetwork: string;

    @ApiProperty()
    @IsNotEmpty()
    readonly toNetwork: string;

    @ApiProperty()
    @IsNotEmpty()
    readonly tokenid: number;

    @ApiProperty()
    @IsNotEmpty()
    readonly owner: string;
}

export class TransferNftDto {
    @ApiProperty()
    @IsNotEmpty()
    readonly network: string;

    @ApiProperty()
    readonly fee?: number;
}


export class MintNftDto {
    @ApiProperty()
    @IsNotEmpty()
    readonly network: string;

    @ApiProperty()
    @IsNotEmpty()
    readonly fee?: string;

    @ApiProperty()
    @IsNotEmpty()
    readonly toAddress: string;

    @ApiProperty()
    @IsNotEmpty()
    readonly amount: number;
}
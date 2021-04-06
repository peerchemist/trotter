import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class TransferNftDto {
    @ApiProperty()
    @IsNotEmpty()
    readonly network: string;

    @ApiProperty()
    @IsNotEmpty()
    readonly tokenid: number;

    @ApiProperty()
    @IsNotEmpty()
    readonly fee: number;

    @ApiProperty()
    @IsNotEmpty()
    readonly from: string;

    @ApiProperty()
    @IsNotEmpty()
    readonly destination: string;
}
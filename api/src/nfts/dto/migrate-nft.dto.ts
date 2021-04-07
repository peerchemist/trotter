import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

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

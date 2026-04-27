import { IsArray, IsNumber } from "class-validator";
import { ReadUserDto } from "./read-user.dto";

export class ListUserDto {
    @IsArray()
    data: ReadUserDto[];

    @IsNumber()
    total: number;
}
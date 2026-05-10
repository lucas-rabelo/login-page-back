import { Type } from "class-transformer";
import { IsArray, IsInt, IsNumber, IsOptional, IsString, Min } from "class-validator";
import { ReadUserDto } from "./read-user.dto";

export class ListUserResponseDto {
    @IsArray()
    data: ReadUserDto[];

    @IsNumber()
    total: number;
}

export class ListUserRequestDto {
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page: number = 1;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    itemsPerPage: number = 20;

    @IsOptional()
    @IsString()
    search?: string;
}
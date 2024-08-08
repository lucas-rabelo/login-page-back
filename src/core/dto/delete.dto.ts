import { IsBoolean } from "class-validator";

export class DeleteDto {
    @IsBoolean()
    sucess: boolean;
}
  
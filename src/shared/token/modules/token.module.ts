import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { TokenService } from "../services/token.service";

@Module({
  imports: [
    JwtModule.register({
      secret: `${process.env.SECRET_ENV}`
    })
  ],
  providers: [TokenService],
  exports: [TokenService]
})
export class TokenModule { };
import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/modules/auth.module";
import { UserModule } from "./user/modules/user.module";

const modules = [
  AuthModule,
  UserModule,
]

@Module({
  imports: modules,
  exports: modules,
})
export class ApplicationModule { };
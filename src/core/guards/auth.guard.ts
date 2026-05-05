import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import type { User } from "@prisma/client";
import { UserService } from "../../user/services/user.service";
import { TokenService } from "../../shared/token/services/token.service";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private readonly tokenService: TokenService,
        private readonly userService: UserService
    ) { }

    async canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();
        const { authorization } = request.headers;

        try {
            const token = (authorization ?? "").split(" ")[1];

            const data = this.tokenService.checkToken<User>(token);

            request.token = token;
            request.user = await this.userService.getUserByUuid(data.uuid);

            return true;
        } catch (e) {
            return false;
        }
    }
}
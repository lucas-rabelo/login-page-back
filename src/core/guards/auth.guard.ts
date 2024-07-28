import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";

import { AuthService } from "src/auth/services/auth.service";
import { UserService } from "src/user/services/user.service";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService
    ) {}

    async canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();
        const { authorization } = request.headers;

        try {
            const token = (authorization ?? "").split(" ")[1];

            const data = await this.authService.checkToken(token);

            request.token = token;
            request.user = await this.userService.getUserByUuid(data.uuid);

            return true;
        } catch(e) {
            return false;
        }
    }
}
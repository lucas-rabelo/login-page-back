import { createParamDecorator, ExecutionContext, NotFoundException } from "@nestjs/common";

export const User = createParamDecorator((_: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();

    if(request.user) {
        return {
            user: request.user,
            token: request.token
        };
    } else {
        throw new NotFoundException("Usuário não encontrado no Request. Use o AutGuard para obter o usuário.")
    }
});
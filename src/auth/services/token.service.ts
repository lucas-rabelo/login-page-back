import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService, type JwtSignOptions, type JwtVerifyOptions } from "@nestjs/jwt";
import { User } from "@prisma/client";

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
  ) { }

  createToken(user: User, options: JwtSignOptions = { expiresIn: '7 days', subject: user.uuid }) {
    const token = this.jwtService.sign({
      uuid: user.uuid,
      name: user.name,
      email: user.email
    }, options);

    return {
      access_token: token
    }
  }

  checkToken<T extends object>(token: string, options?: JwtVerifyOptions) {
    try {
      const data = this.jwtService.verify<T>(token, options);

      return data;
    } catch (e) {
      throw new UnauthorizedException('Usuário não autorizado');
    }
  }

  validateToken<T extends object>(token: string, options?: JwtVerifyOptions) {
    const validated = this.checkToken<T>(token, options);
    return validated ? true : false;
  }
}
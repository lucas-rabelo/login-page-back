import { Body, Controller, Get, HttpCode, Post, Req, Res, UseGuards } from "@nestjs/common";
import { AuthGuard as AuthPassportGuard } from '@nestjs/passport';
import type { Request, Response } from "express";
import { CommandBus } from "@nestjs/cqrs";

import { ForgetAuthDto } from "../domain/dto/forget-auth.dto";
import { LoginAuthDto } from "../domain/dto/login-auth.dto";
import { RegisterAuthDto } from "../domain/dto/register-auth.dto";
import { ResetAuthDto } from "../domain/dto/reset-auth.dto";
import { ValidateAuthDto } from "../domain/dto/validate-auth.dto";

import { AuthGuard } from "../../core/guards/auth.guard";

import { ForgetAuthCommand } from "../domain/command/forget-auth.command";
import { LoginAuthCommand } from "../domain/command/login-auth.command";
import { RegisterAuthCommand } from "../domain/command/register-auth.command";
import { ResetPasswordAuthCommand } from "../domain/command/reset-password-auth.command";
import { ValidateAuthCommand } from "../domain/command/validate-auth.command";
import { VerifyUserGoogleCommand } from "../domain/command/verify-user-google.command";
import { ConfigService } from "@nestjs/config";

@Controller({ path: 'auth', version: '1' })
export class AuthController {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly configService: ConfigService,
    ) { }

    @Get('google')
    @HttpCode(200)
    @UseGuards(AuthPassportGuard('google'))
    async googleAuth(@Res() res: Response) {
        res.redirect('/auth/google/callback');
    }
    
    @Get('google/callback')
    @HttpCode(200)
    @UseGuards(AuthPassportGuard('google'))
    async googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
        const { access_token } = await this.commandBus.execute<any, { access_token: string }>(
            new VerifyUserGoogleCommand(req.user)
        );
        const baseUrlCallback = this.configService.get('URL_FRONT_GOOGLE_CALLBACK')
        
        res.redirect(`${baseUrlCallback}${access_token}`)
    }
    
    @Post('login')
    @HttpCode(201)
    async login(@Body() loginAuthDto: LoginAuthDto) {
        return await this.commandBus.execute(
            new LoginAuthCommand(loginAuthDto)
        );
    }
    
    @Post('register')
    @HttpCode(201)
    async register(@Body() registerAuthDto: RegisterAuthDto) {
        return await this.commandBus.execute(
            new RegisterAuthCommand(registerAuthDto)
        );
    }
    
    @Post('forget')
    @HttpCode(201)
    async forgetPassword(@Body() forgetAuthDto: ForgetAuthDto) {
        return await this.commandBus.execute(
            new ForgetAuthCommand(forgetAuthDto)
        );
    }
    
    @Post('validate')
    @HttpCode(201)
    async validate(@Body() validateAuthDto: ValidateAuthDto) {
        return await this.commandBus.execute(
            new ValidateAuthCommand(validateAuthDto)
        );
    }
    
    @UseGuards(AuthGuard)
    @HttpCode(201)
    @Post('reset')
    async reset(@Body() resetAuthDto: ResetAuthDto) {
        return await this.commandBus.execute(
            new ResetPasswordAuthCommand(resetAuthDto)
        );
    }
}
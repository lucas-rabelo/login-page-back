import { BadRequestException, Body, Controller, FileTypeValidator, Get, MaxFileSizeValidator, ParseFilePipe, Post, Req, Res, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from "@nestjs/common";
import { AuthGuard as AuthPassportGuard } from '@nestjs/passport';
import { FileFieldsInterceptor, FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";

import { AuthService } from "../services/auth.service";

import { ForgetAuthDto } from "../domain/dto/forget-auth.dto";
import { LoginAuthDto } from "../domain/dto/login-auth.dto";


import { CommandBus } from "@nestjs/cqrs";
import { join } from "path";
import { User } from "../../core/decorators/user.decorator";
import { AuthGuard } from "../../core/guards/auth.guard";
import type { StorageService } from "../../storage/services/storage.service";
import type { CreateUserDto } from "../../user/domain/dto/create-user.dto";
import { VerifyUserGoogleCommand } from "../domain/command/verify-user-google.command";
import { ResetAuthDto } from "../domain/dto/reset-auth.dto";
import type { TokenService } from "../services/token.service";

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly tokenService: TokenService,
        private readonly commandBus: CommandBus,
        private readonly storageService: StorageService
    ) { }

    @Get('google')
    @UseGuards(AuthPassportGuard('google'))
    async googleAuth(@Res() res) {
        res.redirect('/auth/google/callback');
    }

    @Get('google/callback')
    @UseGuards(AuthPassportGuard('google'))
    async googleAuthRedirect(@Req() req, @Res() res) {
        const { access_token } = await this.commandBus.execute<any, { access_token: string }>(
            new VerifyUserGoogleCommand(req.user)
        );

        res.redirect(`http://localhost:5173/auth/google/callback?token=${access_token}`)
    }

    @Post('login')
    async login(@Body() data: LoginAuthDto) {
        return this.authService.login(data);
    }

    @Post('register')
    async register(@Body() data: CreateUserDto) {
        return this.authService.register(data);
    }

    @Post('forget')
    async forgetPassword(@Body() data: ForgetAuthDto) {
        return this.authService.forget(data.email);
    }

    @Post('validate')
    async validate(@Body('token') token: string) {
        return this.tokenService.validateToken(token);
    }

    @UseGuards(AuthGuard)
    @Post('reset')
    async reset(@Body() data: ResetAuthDto) {
        return this.authService.resetPassword(data.password, data.token);
    }

    @UseInterceptors(FileInterceptor('file'))
    @UseGuards(AuthGuard)
    @Post('photo')
    async photo(
        @User() user,
        @UploadedFile(new ParseFilePipe({
            validators: [
                new FileTypeValidator({ fileType: 'image/*' }),
                new MaxFileSizeValidator({ maxSize: 1024 * 50 })
            ]
        })) photo: Express.Multer.File
    ) {
        const extension = photo.mimetype.split("/")[1];
        const path = join(__dirname, '..', '..', '..', 'public', 'profilePhotos', `photo-${user.user.uuid}.${extension}`)

        try {
            await this.storageService.upload(photo, path);
        } catch (e) {
            throw new BadRequestException(e);
        }

        return { success: true };
    }

    @UseInterceptors(FilesInterceptor('files'))
    @UseGuards(AuthGuard)
    @Post('files')
    async files(@User() user, @UploadedFiles() photo: Express.Multer.File[]) {
        return { user, photo };
    }

    @UseInterceptors(FileFieldsInterceptor([
        {
            name: 'photo',
            maxCount: 1
        },
        {
            name: 'documents',
            maxCount: 10
        }
    ]))
    @UseGuards(AuthGuard)
    @Post('files-fields')
    async filesFields(@User() user, @UploadedFiles() files: { photo: Express.Multer.File, documents: Express.Multer.File[] }) {
        return { user, files };
    }
}
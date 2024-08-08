import { Controller, Body, Post, UseGuards, UseInterceptors, UploadedFile, BadRequestException, UploadedFiles, ParseFilePipe, FileTypeValidator, MaxFileSizeValidator } from "@nestjs/common";
import { FileFieldsInterceptor, FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";

import { AuthService } from "../services/auth.service";
import { StorageService } from "src/storage/services/storage.service";

import { CreateUserDto } from "src/user/domain/dto/create-user.dto";
import { LoginAuthDto } from "../dto/login-auth.dto";
import { ForgetAuthDto } from "../dto/forget-auth.dto";

import { AuthGuard } from "src/core/guards/auth.guard";

import { User } from "src/core/decorators/user.decorator";
import { join } from "path";
import { ResetAuthDto } from "../dto/reset-auth.dto";

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly storageService: StorageService
    ) {}

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
        return this.authService.validateToken(token);
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
        } catch(e) {
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
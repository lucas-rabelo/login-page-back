import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BadRequestException } from '@nestjs/common';

import { DeleteUserCommand } from './delete-user.command';

import { UserService } from 'src/user/services/user.service';

import { DeleteDto } from 'src/core/dto/delete.dto';

@CommandHandler(DeleteUserCommand)
export class DeleteUserHandler implements ICommandHandler<DeleteUserCommand>
{
  constructor(private readonly userService: UserService) { }

  async execute(command: DeleteUserCommand): Promise<DeleteDto> {
    const { uuid } = command;

    const user = await this.userService.deleteUser(uuid);

    if (!user) {
        throw new BadRequestException("There was a problem deleting the user")
    }

    return user ? { sucess: true } : { sucess: false };
  }
}

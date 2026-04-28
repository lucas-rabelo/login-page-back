import { BadRequestException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import type { DeleteDto } from '../../../core/dto/delete.dto';
import { UserService } from '../../services/user.service';
import { DeleteUserCommand } from './delete-user.command';

@CommandHandler(DeleteUserCommand)
export class DeleteUserHandler implements ICommandHandler<DeleteUserCommand> {
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

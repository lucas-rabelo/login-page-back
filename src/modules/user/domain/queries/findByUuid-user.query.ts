import { IQuery } from "@nestjs/cqrs";

export class FindByUuidUserQuery implements IQuery {
    constructor(public readonly uuid: string) {}
}
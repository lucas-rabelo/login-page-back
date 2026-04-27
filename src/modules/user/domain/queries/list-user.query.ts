import { IQuery } from "@nestjs/cqrs";

export class ListUserQuery implements IQuery {
    constructor(
        public readonly page: number,
        public readonly itemsPerPage: number,
        public readonly search?: string,
    ) {}
}
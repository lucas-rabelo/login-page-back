import { Module } from '@nestjs/common';

import { InfraModule } from './infra/infra.module';
import { ApplicationModule } from './modules/application.module';

@Module({
  imports: [
    InfraModule,
    ApplicationModule,
  ],
})
export class AppModule { }

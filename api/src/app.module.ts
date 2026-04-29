import { Module } from '@nestjs/common';
import { UrlModule } from './module/url/url.module';
import { PrismaModule } from './prisma/prisma.module';
import { UrlController } from './module/url/url.controller';

@Module({
	imports: [PrismaModule, UrlModule],
	controllers: [],
	providers: [],
})
export class AppModule { }

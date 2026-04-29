import { Module } from '@nestjs/common';
import { UrlModule } from './module/url/url.module';
import { PrismaModule } from './prisma/prisma.module';
import { AppController } from './app.controller';
import { UrlService } from './module/url/url.service';
import { UrlController } from './module/url/url.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true
		}),
		PrismaModule, UrlModule],
	controllers: [UrlController, AppController],
	providers: [UrlService],
})
export class AppModule { }

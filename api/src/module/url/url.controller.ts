import { Body, Controller, Delete, Get, HttpCode, Post } from '@nestjs/common';
import { UrlService } from './url.service';
import { CreateUrlDto } from './dto/create-url.dto';
import { UrlResponse } from './url.interfaces';
import { DeleteUrlDto } from './dto/delete-url.dto';

@Controller('url')
export class UrlController {
	constructor(private readonly urlService: UrlService) { }

	@Get()
	async getAllUrls(): Promise<UrlResponse[]> {
		return await this.urlService.getUrls();
	}

	@HttpCode(201)
	@Post()
	async createUrl(@Body() createUrlDto: CreateUrlDto): Promise<UrlResponse> {
		return await this.urlService.createShortUrl(createUrlDto.originalUrl);
	}

	@Delete()
	async deleteUrl(@Body() deleteUrlDto: DeleteUrlDto): Promise<void> {
		return await this.urlService.deleteUrl(deleteUrlDto.originalUrl);
	}
}

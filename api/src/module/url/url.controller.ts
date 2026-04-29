import { Body, Controller, Delete, Get, HttpCode, Param, Post, Redirect } from '@nestjs/common';
import { UrlService } from './url.service';
import { CreateUrlDto } from './dto/create-url.dto';
import { UrlResponse } from './url.interfaces';
import { DeleteUrlDto } from './dto/delete-url.dto';

@Controller('url')
export class UrlController {
	constructor(private readonly urlService: UrlService) { }


	@Get()
	async getAllUrls(): Promise<UrlResponse[]> {
		return await this.urlService.getOriginalUrls();
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

	@Get(':shortCode')
	@Redirect()
	async redirectToOriginalUrl(@Param('shortCode') shortCode: string): Promise<{ url: string }> {
		const originalUrl = await this.urlService.getOriginalUrlFromShortCode(shortCode);
		return { url: originalUrl };
	}

}

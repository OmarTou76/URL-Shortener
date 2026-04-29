import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Prisma, Url } from 'generated/prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UrlResponse } from './url.interfaces';

@Injectable()
export class UrlService {
	constructor(private prisma: PrismaService) { }

	async getOriginalUrls(): Promise<UrlResponse[]> {
		return await this.prisma.url.findMany({ select: { originalUrl: true, shortCode: true } });
	}

	async getOriginalUrlFromShortCode(shortCode: string): Promise<string> {
		console.log({ shortCode })
		const target = await this.prisma.url.findFirst({
			where: { shortCode },
			select: { originalUrl: true }
		});
		if (target === null) {
			throw new NotFoundException(`The short code (${shortCode}) was not found.`);
		}
		return target.originalUrl;
	}

	async createShortUrl(originalUrl: string): Promise<UrlResponse> {
		const shortCode = Math.random().toString(36).substring(2, 8);
		try {
			await this.prisma.url.create({
				data: {
					originalUrl,
					shortCode,
				},
			});
			return { originalUrl, shortCode };
		} catch (e) {
			if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
				throw new ConflictException(`The original URL (${originalUrl}) already exists.`);
			}
			throw new InternalServerErrorException('An error occurred while creating the short URL.');
		}
	}

	async deleteUrl(originalUrl: string): Promise<void> {
		console.log({ originalUrl })
		try {
			await this.prisma.url.delete({
				where: { originalUrl },
			});
		} catch (e) {
			if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2025') {
				throw new NotFoundException(`The original URL (${originalUrl}) was not found.`);
			}
			throw new InternalServerErrorException('An error occurred during deletion.');
		}
	}
}

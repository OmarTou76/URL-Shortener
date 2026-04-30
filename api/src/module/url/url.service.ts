import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, Url } from 'generated/prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UrlResponse } from './url.interfaces';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UrlService {
  baseUrl: string = '';
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    this.baseUrl = this.configService.get<string>('API_URL');
    if (!this.baseUrl) {
      throw new Error('API_URL not defined');
    } else {
      console.log('API_URL -> ', this.baseUrl);
    }
  }

  async getUrls(): Promise<UrlResponse[]> {
    const urls = await this.prisma.url.findMany({
      select: { originalUrl: true, shortCode: true },
      orderBy: { createdAt: 'asc' }
    });

    return urls.map((url) => ({
      ...url,
      shortCode: this.normalizeUrl(url.shortCode),
    }));
  }

  async getOriginalUrlFromShortCode(shortCode: string): Promise<string> {
    const target = await this.prisma.url.findFirst({
      where: { shortCode },
      select: { originalUrl: true },
    });
    if (target === null) {
      throw new NotFoundException(
        `The short code (${shortCode}) was not found.`,
      );
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
      return { originalUrl, shortCode: this.normalizeUrl(shortCode) };
    } catch (e: unknown) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2002'
      ) {
        const response = await this.getUrl(originalUrl)
        if (!response)
          throw new InternalServerErrorException(
            'An error occurred while creating the short URL.',
          );
        return response
      }
      throw new InternalServerErrorException(
        'An error occurred while creating the short URL.',
      );
    }
  }

  async deleteUrl(originalUrl: string): Promise<void> {
    try {
      await this.prisma.url.delete({
        where: { originalUrl },
      });
    } catch (e: unknown) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2025'
      ) {
        throw new NotFoundException(
          `The original URL (${originalUrl}) was not found.`,
        );
      }
      throw new InternalServerErrorException(
        'An error occurred during deletion.',
      );
    }
  }

  private async getUrl(url: string): Promise<UrlResponse | null> {
    const result: Url = await this.prisma.url.findFirst({
      where: { originalUrl: url },
    });
    if (!result) return null
    return {
      originalUrl: result.originalUrl,
      shortCode: this.normalizeUrl(result.shortCode)
    }
  }

  private normalizeUrl(shortCode: string): string {
    return `${this.baseUrl}${shortCode}`;
  }
}

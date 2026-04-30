import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { NotFoundException } from '@nestjs/common';
import { UrlService } from './url.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from 'generated/prisma/client';

describe('UrlService', () => {
  let service: UrlService;
  let prisma: any;

  const baseUrl = 'http://localhost:3000/';

  beforeEach(async () => {
    prisma = {
      url: {
        findMany: jest.fn(),
        findFirst: jest.fn(),
        create: jest.fn(),
        delete: jest.fn(),
      },
    };

    const configService = {
      get: jest.fn().mockReturnValue(baseUrl),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UrlService,
        { provide: PrismaService, useValue: prisma },
        { provide: ConfigService, useValue: configService },
      ],
    }).compile();

    service = module.get<UrlService>(UrlService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getUrls', () => {
    it('should return urls with the shortCode prefixed by the base url', async () => {
      prisma.url.findMany.mockResolvedValue([
        { originalUrl: 'https://test42.com', shortCode: 'abc123' },
      ]);

      const result = await service.getUrls();

      expect(result).toEqual([
        { originalUrl: 'https://test42.com', shortCode: 'http://localhost:3000/abc123' },
      ]);
    });

    it('should return an empty array when there are no urls', async () => {
      prisma.url.findMany.mockResolvedValue([]);

      const result = await service.getUrls();

      expect(result).toEqual([]);
    });
  });

  describe('getOriginalUrlFromShortCode', () => {
    it('should return the original url when the short code exists', async () => {
      prisma.url.findFirst.mockResolvedValue({ originalUrl: 'https://seconde.com' });

      const result = await service.getOriginalUrlFromShortCode('abc123');

      expect(result).toBe('https://seconde.com');
    });

    it('should throw NotFoundException when the short code does not exist', async () => {
      prisma.url.findFirst.mockResolvedValue(null);

      await expect(service.getOriginalUrlFromShortCode('nope')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('createShortUrl', () => {
    it('should create a new short url and return it', async () => {
      prisma.url.create.mockResolvedValue({});

      const result = await service.createShortUrl('https://google.com');

      expect(prisma.url.create).toHaveBeenCalled();
      expect(result.originalUrl).toBe('https://google.com');
      expect(result.shortCode).toContain(baseUrl);
    });
  });

  describe('deleteUrl', () => {
    it('should call prisma.url.delete with the original url', async () => {
      prisma.url.delete.mockResolvedValue({});

      await service.deleteUrl('https://google.com');

      expect(prisma.url.delete).toHaveBeenCalledWith({
        where: { originalUrl: 'https://google.com' },
      });
    });

    it('should throw NotFoundException when the url does not exist', async () => {
      const error = new Prisma.PrismaClientKnownRequestError('not found', {
        code: 'P2025',
        clientVersion: 'test',
      });
      prisma.url.delete.mockRejectedValue(error);

      await expect(service.deleteUrl('https://nothingg.com')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});

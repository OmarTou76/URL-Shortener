import { Test, TestingModule } from '@nestjs/testing';
import { UrlController } from './url.controller';
import { UrlService } from './url.service';

describe('UrlController', () => {
  let controller: UrlController;
  let urlService: any;

  beforeEach(async () => {
    urlService = {
      getUrls: jest.fn(),
      createShortUrl: jest.fn(),
      deleteUrl: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UrlController],
      providers: [{ provide: UrlService, useValue: urlService }],
    }).compile();

    controller = module.get<UrlController>(UrlController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllUrls', () => {
    it('should return the list of urls from the service', async () => {
      const fakeUrls = [
        { originalUrl: 'https://google.com', shortCode: 'http://localhost:3000/abc123' },
      ];
      urlService.getUrls.mockResolvedValue(fakeUrls);

      const result = await controller.getAllUrls();

      expect(result).toEqual(fakeUrls);
      expect(urlService.getUrls).toHaveBeenCalled();
    });
  });

  describe('createUrl', () => {
    it('should call createShortUrl with the original url and return the result', async () => {
      const fakeResponse = {
        originalUrl: 'https://google.com',
        shortCode: 'http://localhost:3000/abc123',
      };
      urlService.createShortUrl.mockResolvedValue(fakeResponse);

      const result = await controller.createUrl({ originalUrl: 'https://google.com' });

      expect(urlService.createShortUrl).toHaveBeenCalledWith('https://google.com');
      expect(result).toEqual(fakeResponse);
    });
  });

  describe('deleteUrl', () => {
    it('should call deleteUrl with the original url', async () => {
      urlService.deleteUrl.mockResolvedValue(undefined);

      await controller.deleteUrl({ originalUrl: 'https://google.com' });

      expect(urlService.deleteUrl).toHaveBeenCalledWith('https://google.com');
    });
  });
});


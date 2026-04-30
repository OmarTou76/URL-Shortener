import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { UrlService } from './module/url/url.service';

describe('AppController', () => {
  let controller: AppController;
  let urlService: any;

  beforeEach(async () => {
    urlService = {
      getOriginalUrlFromShortCode: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [{ provide: UrlService, useValue: urlService }],
    }).compile();

    controller = module.get<AppController>(AppController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('redirectToOriginalUrl', () => {
    it('should return an object with the original url for redirection', async () => {
      urlService
        .getOriginalUrlFromShortCode
        .mockResolvedValue('https://google.com');

      const result = await controller.redirectToOriginalUrl('abc123');

      expect(urlService.getOriginalUrlFromShortCode)
        .toHaveBeenCalledWith('abc123');
      expect(result).toEqual({ url: 'https://google.com' });
    });
  });
});

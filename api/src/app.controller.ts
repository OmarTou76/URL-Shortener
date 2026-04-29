import { Controller, Get, Param, Redirect } from '@nestjs/common';
import { UrlService } from './module/url/url.service';

@Controller()
export class AppController {
  constructor(private readonly urlService: UrlService) { }

  @Get(':shortCode')
  @Redirect()
  async redirectToOriginalUrl(
    @Param('shortCode') shortCode: string,
  ): Promise<{ url: string }> {
    const originalUrl =
      await this.urlService.getOriginalUrlFromShortCode(shortCode);
    return { url: originalUrl };
  }
}

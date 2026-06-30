import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { I18nService } from './i18n.service';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('i18n')
@Controller('i18n')
export class I18nController {
  constructor(private readonly i18nService: I18nService) {}

  @Public()
  @Get('locales')
  @ApiOperation({ summary: 'Get list of supported locales' })
  getSupportedLocales() {
    return { locales: this.i18nService.getSupportedLocales() };
  }

  @Public()
  @Get(':locale')
  @ApiOperation({ summary: 'Get all translations for a locale (en or am)' })
  getTranslations(@Param('locale') locale: string) {
    const supported = this.i18nService.getSupportedLocales();
    const validLocale = supported.includes(locale as any) ? (locale as 'en' | 'am') : 'en';
    return this.i18nService.getAll(validLocale);
  }
}

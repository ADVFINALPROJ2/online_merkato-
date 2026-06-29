import { Controller, Get, Query, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { BrowseService } from './browse.service';
import { SearchService } from './search.service';
import { RecommendationService } from './recommendation.service';
import { BrowseQueryDto } from './dto/browse-query.dto';
import { SearchQueryDto } from './dto/search-query.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { Public } from '../common/decorators/public.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Buyer')
@Controller('buyer')
export class BuyerController {
  constructor(
    private readonly browseService: BrowseService,
    private readonly searchService: SearchService,
    private readonly recommendationService: RecommendationService,
  ) {}

  

  @Public()
  @Get('products')
  @ApiOperation({ summary: '#18 Browse all products' })
  browseProducts(@Query() query: BrowseQueryDto) {
    return this.browseService.browseProducts(query);
  }

  @Public()
  @Get('products/:id')
  @ApiOperation({ summary: '#20 View product detail' })
  getProductDetail(@Param('id') id: string) {
    return this.browseService.getProductDetail(id);
  }

  @Public()
  @Get('categories')
  @ApiOperation({ summary: 'List all categories' })
  getCategories() {
    return this.browseService.getCategories();
  }

  @Public()
  @Get('categories/:categoryId/products')
  @ApiOperation({ summary: 'Browse products by category' })
  browseByCategory(
    @Param('categoryId') categoryId: string,
    @Query() query: BrowseQueryDto,
  ) {
    return this.browseService.browseByCategory(categoryId, query);
  }

  @Public()
  @Get('shops/:shopId')
  @ApiOperation({ summary: '#21 View seller/shop info' })
  getShopInfo(@Param('shopId') shopId: string) {
    return this.browseService.getShopInfo(shopId);
  }

  @Public()
  @Get('shops/:shopId/products')
  @ApiOperation({ summary: 'Browse products by shop' })
  browseByShop(
    @Param('shopId') shopId: string,
    @Query() query: BrowseQueryDto,
  ) {
    return this.browseService.browseByShop(shopId, query);
  }

 

  @Public()
  @Get('search')
  @ApiOperation({ summary: '#19 Search products' })
  search(@Query() query: SearchQueryDto) {
    return this.searchService.search(query);
  }

  @Public()
  @Get('search/suggestions')
  @ApiOperation({ summary: 'Autocomplete suggestions' })
  getSuggestions(@Query('q') q: string) {
    return this.searchService.getSuggestions(q);
  }

  

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('recommendations')
  @ApiOperation({ summary: 'Personalized recommendations (login required)' })
  getRecommendations(@CurrentUser() user: any) {
    return this.recommendationService.getForUser(user.id);
  }

  @Public()
  @Get('products/:id/related')
  @ApiOperation({ summary: '#22 Related product suggestions' })
  getRelated(@Param('id') id: string) {
    return this.recommendationService.getRelatedProducts(id);
  }

  @Public()
  @Get('trending')
  @ApiOperation({ summary: 'Trending products' })
  getTrending() {
    return this.recommendationService.getTrending();
  }
}
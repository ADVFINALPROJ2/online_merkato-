import { Module } from '@nestjs/common';
import { BrowseService } from './browse.service';
import { SearchService } from './search.service';
import { RecommendationService } from './recommendation.service';
import { BuyerController } from './buyer.controller';

@Module({
  controllers: [BuyerController],
  providers: [BrowseService, SearchService, RecommendationService],
  exports: [BrowseService, SearchService, RecommendationService],
})
export class BuyerModule {}

import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewService {
  constructor(private prisma: PrismaService) {}

  // #38 #39 Review & Rate a Product
  async reviewProduct(buyerId: string, productId: string, dto: CreateReviewDto) {
    const purchased = await this.prisma.orderItem.findFirst({
      where: {
        productId,
        order: { buyerId, status: 'DELIVERED' },
      },
    });

    if (!purchased) {
      throw new ForbiddenException('You can only review products you have purchased');
    }

    return this.prisma.review.create({
      data: { buyerId, productId, ...dto },
    });
  }

  // #40 Rate a Seller
  async reviewSeller(buyerId: string, sellerId: string, dto: CreateReviewDto) {
    return this.prisma.review.create({
      data: { buyerId, sellerId, ...dto },
    });
  }

  // #42 Get Product Reviews + Average Rating
  async getProductReviews(productId: string) {
    const reviews = await this.prisma.review.findMany({
      where: { productId },
      include: { buyer: { select: { firstName: true, lastName: true } } },
    });

    const avg = reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / (reviews.length || 1);

    return {
      averageRating: parseFloat(avg.toFixed(1)),
      total: reviews.length,
      reviews,
    };
  }

  // #41 Edit Own Review
  async editReview(buyerId: string, reviewId: string, dto: CreateReviewDto) {
    const review = await this.prisma.review.findUnique({ where: { id: reviewId } });

    if (!review || review.buyerId !== buyerId) {
      throw new ForbiddenException('You can only edit your own reviews');
    }

    return this.prisma.review.update({
      where: { id: reviewId },
      data: dto,
    });
  }
}
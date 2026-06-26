import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) {}

  // ─── Helper ───────────────────────────────────────────────────────────────

  private async getOrCreateCart(userId: string) {
    let cart = await this.prisma.cart.findUnique({ where: { userId } });
    if (!cart) {
      cart = await this.prisma.cart.create({ data: { userId } });
    }
    return cart;
  }

  // ─── #26 View cart + #27 Calculate total ──────────────────────────────────

  async getCart(userId: string) {
    const cart = await this.getOrCreateCart(userId);

    const items = await this.prisma.cartItem.findMany({
      where: { cartId: cart.id },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            isActive: true,
            images: { take: 1 },
            shop: { select: { id: true, name: true } },
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    return this.buildCartSummary(items);
  }

  // ─── #23 Add item ──────────────────────────────────────────────────────────

  async addItem(userId: string, dto: AddToCartDto) {
    const product = await this.prisma.product.findUnique({
      where: { id: dto.productId },
    });

    if (!product || !product.isActive) {
      throw new NotFoundException('Product not found or unavailable');
    }

    const cart = await this.getOrCreateCart(userId);

    const existingItem = await this.prisma.cartItem.findUnique({
      where: {
        cartId_productId: { cartId: cart.id, productId: dto.productId },
      },
    });

    if (existingItem) {
      // Product already in cart — just increase quantity
      await this.prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + dto.quantity },
      });
    } else {
      await this.prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: dto.productId,
          quantity: dto.quantity,
        },
      });
    }

    return this.getCart(userId);
  }

  // ─── #25 Update quantity ───────────────────────────────────────────────────

  async updateItem(userId: string, itemId: string, dto: UpdateCartItemDto) {
    const cart = await this.getOrCreateCart(userId);

    const item = await this.prisma.cartItem.findFirst({
      where: { id: itemId, cartId: cart.id },
    });

    if (!item) throw new NotFoundException('Cart item not found');

    await this.prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity: dto.quantity },
    });

    return this.getCart(userId);
  }

  // ─── #24 Remove item ───────────────────────────────────────────────────────

  async removeItem(userId: string, itemId: string) {
    const cart = await this.getOrCreateCart(userId);

    const item = await this.prisma.cartItem.findFirst({
      where: { id: itemId, cartId: cart.id },
    });

    if (!item) throw new NotFoundException('Cart item not found');

    await this.prisma.cartItem.delete({ where: { id: itemId } });

    return this.getCart(userId);
  }

  // ─── Clear cart (called after checkout) ───────────────────────────────────

  async clearCart(userId: string) {
    const cart = await this.getOrCreateCart(userId);
    await this.prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    return this.getCart(userId);
  }

  // ─── #27 Total price calculation ──────────────────────────────────────────

  private buildCartSummary(items: any[]) {
    let total = 0;
    let itemCount = 0;
    const unavailableItems: string[] = [];

    const formattedItems = items.map((item) => {
      const isAvailable = item.product.isActive;
      const subtotal = isAvailable ? item.product.price * item.quantity : 0;

      if (!isAvailable) {
        unavailableItems.push(item.id);
      } else {
        total += subtotal;
        itemCount += item.quantity;
      }

      return {
        id: item.id,
        productId: item.productId,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        subtotal,
        isAvailable,
        image: item.product.images?.[0] ?? null,
        shop: item.product.shop,
      };
    });

    return {
      items: formattedItems,
      itemCount,
      total,
      hasUnavailableItems: unavailableItems.length > 0,
      unavailableItemIds: unavailableItems,
    };
  }
}
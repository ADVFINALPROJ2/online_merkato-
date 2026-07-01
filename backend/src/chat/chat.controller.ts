import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('chat')
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('messages/:orderId')
  async getMessages(@Param('orderId') orderId: string) {
    return this.chatService.getMessages(orderId);
  }

  @Post('messages/:orderId')
  async sendMessage(
    @Param('orderId') orderId: string,
    @Body() body: { text: string; receiverId: string },
    @CurrentUser() user: any,
  ) {
    return this.chatService.createMessage({
      orderId,
      senderId: user.id,
      receiverId: body.receiverId,
      body: body.text,
    });
  }
}

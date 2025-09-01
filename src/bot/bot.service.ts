// bot.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { Telegraf } from 'telegraf';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class BotService implements OnModuleInit {
  private bot: Telegraf;

  onModuleInit() {
    const token = process.env.BOT_TOKEN;
    if (!token) throw new Error('BOT_TOKEN is not defined');

    this.bot = new Telegraf(token);

    // Webhook o‘rnatilgan bo‘lsa, uni o‘chirib tashlaymiz
    this.bot.telegram.deleteWebhook().then(() => {
      console.log('Webhook deleted');
      this.bot.launch();
      console.log('Bot launched');
    });
  }

  getBot() {
    return this.bot;
  }
}

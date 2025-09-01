// bot.update.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { BotService } from './bot.service';
import { Markup } from 'telegraf';
import { CallbackQuery } from 'telegraf/typings/core/types/typegram';
import { UserService } from 'src/api/user/user.service';
import { CourseService } from 'src/api/course/course.service';
import { PurchasedCourseService } from 'src/api/purchased-course/purchased-course.service';
import { UserStatus } from 'src/core/user.entity';
import { PaymentStatus } from 'src/common/database/Enum';

interface SessionData {
  step?: 'waiting_for_name' | 'waiting_for_receipt';
  fullName?: string;
}

const userSessions = new Map<number, SessionData>();

@Injectable()
export class BotUpdate implements OnModuleInit {
  private readonly adminId = Number(process.env.ADMIN_ID);
  private readonly courseId: string = 'd813c63a-29bf-43c8-87e6-0d3d11ba06b2';

  constructor(
    private readonly botService: BotService,
    private readonly userService: UserService,
    private readonly courseService: CourseService,
    private readonly purchasedCourseService: PurchasedCourseService,
  ) {}

  onModuleInit() {
    const bot = this.botService.getBot();

    const escapeMarkdownV2 = (text: string): string => {
      return text.replace(/[_*\[\]()~`>#+=|{}.!-]/g, (match) => `\\${match}`);
    };

    bot.start((ctx) => {
      (async () => {
        const user = ctx.from;

        await this.userService.createIfNotExists({
          telegramId: String(user.id),
          name: `${user.first_name} ${user.last_name ?? ''}`.trim(),
          username: user.username ?? '',
          status: UserStatus.NON_CUSTOMER,
        });

        await ctx.reply(
          "Assalomu alaykum! Katta o‘zgarishga tayyorligingizdan xursandmiz.\n\ud83c\udfc6 Bizning maqsadimiz — O‘zbekistonda kuchli sotuvchilarni ko‘paytirib Uzumda savdoni yangi darajaga olib chiqish.\nBu video-kurs esa maqsadingizga erishishda 1-QADAM bo‘lishiga ishonamiz."
        );

        await new Promise((r) => setTimeout(r, 4000));

        await ctx.reply(
          '"UZUM ORQALI MILLON 1.0" video-kursi.\n\nAsl narxi: 697.000 so\'m \nChegirma narxi: 368.000 so\'m \n\n1-qadam: Quydagi karta raqamga to\'lov qiling. \n\n\ud83d\udcb3 9860190109372747 \nOtabek Lapasov \n\n2-qadam: “To\'lov qildim” tugmasini bosing va chek skrinshotni yuboring.',
          {
            reply_markup: {
              inline_keyboard: [[{ text: '💸 To‘lov qilish', callback_data: 'start_payment' }]],
            },
          }
        );

        setTimeout(async () => {
          await ctx.reply(
            "✅ Aytishni unitibman, 800.000 so’mlik “Xitoydan Zakaz” mini kursi faqat 60 daqiqa ichida harid qilganlar uchun 100% bepulga beriladi\n\n⌛ Sizda esa 57 daqiqa qoldi..."
          );
        }, 60000);
      })();
    });

    bot.action('start_payment', async (ctx) => {
      const userId = ctx.from.id;
      userSessions.set(userId, { step: 'waiting_for_name' });
      await ctx.reply('👤 Iltimos, ism va familiyangizni to‘liq kiriting:');
    });

    bot.on('text', async (ctx) => {
      const userId = ctx.from.id;
      const session = userSessions.get(userId);
      if (!session || session.step !== 'waiting_for_name') return;

      const fullName = ctx.message.text.trim();
      if (fullName.length < 3) {
        return ctx.reply('❗ Iltimos, to‘liq ism va familiyangizni kiriting.');
      }

      await this.userService.updateNameWithTelegramId(String(userId), fullName);
      userSessions.set(userId, { step: 'waiting_for_receipt', fullName });

      await ctx.reply('✅ Rahmat! Endi to‘lov chekini rasm (screenshot) ko‘rinishida yuboring.');
    });

    bot.on(['photo', 'document'], async (ctx) => {
      const userId = ctx.from.id;
      const session = userSessions.get(userId);
      if (!session || session.step !== 'waiting_for_receipt') {
        return ctx.reply('❗ Iltimos, avval ism-familiyangizni kiriting.');
      }

      const file = 'photo' in ctx.message
        ? ctx.message.photo[ctx.message.photo.length - 1]
        : ctx.message.document;

      const fileId = file.file_id;
      const userData = await this.userService.findByTelegramId(String(userId));
      const dbUserId = userData.data!.id;

      await this.purchasedCourseService.create({
        userId: dbUserId,
        courseId: this.courseId,
        status: PaymentStatus.PENDING,
        fileId
      });

      await ctx.reply('✅ To‘lovingiz qabul qilindi. 24 soat ichida tekshiriladi.');

      const caption = `📜 Chek qabul qilindi\n👤 ${session.fullName}\n👤 @${ctx.from.username ?? ctx.from.first_name}\n🇩🇿 Telegram ID: ${userId}`;

      const buttons = Markup.inlineKeyboard([
        Markup.button.callback('✅ Tasdiqlash', `approve_${userId}`),
        Markup.button.callback('❌ Rad etish', `reject_${userId}`),
      ]);

      if ('photo' in ctx.message) {
        await ctx.telegram.sendPhoto(this.adminId, fileId, {
          caption,
          reply_markup: buttons.reply_markup,
        });
      } else {
        await ctx.telegram.sendDocument(this.adminId, fileId, {
          caption,
          reply_markup: buttons.reply_markup,
        });
      }

      userSessions.delete(userId);
    });

    bot.on('callback_query', async (ctx) => {
      const callback = ctx.callbackQuery as CallbackQuery.DataQuery;
      const data = callback.data;
      const msg = callback.message;

      let userId: number;
      let statusText: string;
      let notifyText: string;

      if (data.startsWith('approve_')) {
        userId = Number(data.replace('approve_', ''));
        statusText = '\n\n✅ *To‘lov tasdiqlandi*';
        notifyText = '✅ To‘lovingiz tasdiqlandi!';
        await ctx.telegram.sendMessage(userId, notifyText);
        await ctx.answerCbQuery('Tasdiqlandi ✅');
      } else if (data.startsWith('reject_')) {
        userId = Number(data.replace('reject_', ''));
        statusText = '\n\n❌ *To‘lov rad etildi*';
        notifyText = '❌ To‘lovingiz rad etildi. Iltimos, qaytadan urinib ko‘ring.';
        await ctx.telegram.sendMessage(userId, notifyText);
        await ctx.answerCbQuery('Rad etildi ❌');
      } else return;

      if (msg?.message_id && msg.chat?.id) {
        const oldCaption = (msg as any).caption || '';
        const cleaned = oldCaption.replace(/\n\n✅ \*.*\*|\n\n❌ \*.*\*/g, '');

        try {
          await ctx.telegram.editMessageReplyMarkup(msg.chat.id, msg.message_id, undefined, undefined);
          await ctx.telegram.editMessageCaption(
            msg.chat.id,
            msg.message_id,
            undefined,
            escapeMarkdownV2(`${cleaned}${statusText}`),
            { parse_mode: 'MarkdownV2' },
          );
        } catch (err) {
          console.error('Xatolik captionni yangilashda:', err);
        }
      }
    });
  }
}

import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import { config } from 'src/config';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TelegramFileService {
    private readonly telegramToken = config.BOT_TOKEN;

    async downloadTelegramFile(fileId: string): Promise<string> {
        // 1. Telegramdan file_path olish
        const fileInfo = await axios.get(
            `https://api.telegram.org/bot${this.telegramToken}/getFile?file_id=${fileId}`,
        );
        const filePath = fileInfo.data.result.file_path;

        // 2. Fayl URL
        const fileUrl = `https://api.telegram.org/file/bot${this.telegramToken}/${filePath}`;

        // 3. Fayl nomi va to‘liq saqlash yo‘li
        const fileName = uuidv4() + path.extname(filePath);
        const uploadDir = path.join(process.cwd(), 'uploads');
        const fullFilePath = path.join(uploadDir, fileName);

        // Agar uploads papkasi mavjud bo‘lmasa, uni yaratamiz
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        // 4. Faylni yozish uchun oqim ochamiz
        const writer = fs.createWriteStream(fullFilePath);
        const response = await axios.get(fileUrl, { responseType: 'stream' });
        response.data.pipe(writer);

        // 5. Yozish tugaguncha kutamiz
        await new Promise((resolve, reject) => {

            writer.on('finish', () => resolve(true));
            writer.on('error', reject);
        });

        return fileName;
    }
}

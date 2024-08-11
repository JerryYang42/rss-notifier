import axios from 'axios';
import * as xml2js from 'xml2js';
import * as nodemailer from 'nodemailer';
import { db } from './db';

interface FeedItem {
  title: string;
  link: string;
  pubDate: string;
}

export class RSSNotifier {
  private emailConfig: any;

  constructor() {
    // Load email config from environment variables or config file
    this.emailConfig = {
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_TO,
      smtp: {
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      },
    };
  }

  async checkFeeds(): Promise<void> {
    const sources = await db.query('SELECT * FROM sources');
    for (const source of sources.rows) {
      const newItems = await this.fetchNewItems(source);
      if (newItems.length > 0) {
        await this.notifyUser(source.url, newItems);
        await this.updateLastChecked(source.id);
      }
    }
  }

  private async fetchNewItems(source: any): Promise<FeedItem[]> {
    const response = await axios.get(source.url);
    const result = await xml2js.parseStringPromise(response.data);
    const items: FeedItem[] = result.rss.channel[0].item.map((item: any) => ({
      title: item.title[0],
      link: item.link[0],
      pubDate: item.pubDate[0],
    }));

    return items.filter(item => new Date(item.pubDate) > new Date(source.last_checked));
  }

  private async notifyUser(sourceUrl: string, items: FeedItem[]): Promise<void> {
    const transporter = nodemailer.createTransport(this.emailConfig.smtp);
    const mailOptions = {
      from: this.emailConfig.from,
      to: this.emailConfig.to,
      subject: `New RSS items from ${sourceUrl}`,
      text: items.map(item => `${item.title}\n${item.link}\n\n`).join(''),
    };

    await transporter.sendMail(mailOptions);
  }

  private async updateLastChecked(sourceId: number): Promise<void> {
    await db.query('UPDATE sources SET last_checked = NOW() WHERE id = $1', [sourceId]);
  }
}
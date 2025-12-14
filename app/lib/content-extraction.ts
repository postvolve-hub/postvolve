/**
 * URL Content Extraction Service
 * Extracts and cleans content from URLs for content generation
 */

import * as cheerio from 'cheerio';
import { Readability } from '@mozilla/readability';
import { JSDOM } from 'jsdom';

interface ExtractedContent {
  title: string;
  content: string;
  description: string;
  imageUrl?: string;
  author?: string;
  publishedDate?: string;
  url: string;
}

/**
 * Extract content from a URL
 */
export async function extractUrlContent(url: string): Promise<ExtractedContent> {
  try {
    // Validate URL format first
    let validUrl: URL;
    try {
      validUrl = new URL(url);
    } catch {
      throw new Error('Invalid URL format');
    }

    // Ensure URL has protocol
    if (!validUrl.protocol || (!validUrl.protocol.startsWith('http') && !validUrl.protocol.startsWith('https'))) {
      throw new Error('URL must use http or https protocol');
    }

    // Fetch the URL with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    let response: Response;
    try {
      response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
    } catch (fetchError: any) {
      clearTimeout(timeoutId);
      if (fetchError.name === 'AbortError') {
        throw new Error('Request timeout: URL took too long to respond');
      }
      throw new Error(`Failed to fetch URL: ${fetchError.message}`);
    }

    if (!response.ok) {
      throw new Error(`Failed to fetch URL: ${response.status} ${response.statusText}`);
    }

    const html = await response.text();
    
    if (!html || html.length === 0) {
      throw new Error('URL returned empty content');
    }

    const dom = new JSDOM(html, { url });
    const document = dom.window.document;

    // Use Readability to extract main content
    const reader = new Readability(document);
    const article = reader.parse();

    // Also parse with Cheerio for metadata
    const $ = cheerio.load(html);

    // Extract metadata
    const title =
      article?.title ||
      $('meta[property="og:title"]').attr('content') ||
      $('title').text() ||
      'Untitled';

    const description =
      article?.excerpt ||
      $('meta[property="og:description"]').attr('content') ||
      $('meta[name="description"]').attr('content') ||
      '';

    const imageUrl =
      $('meta[property="og:image"]').attr('content') ||
      $('meta[name="twitter:image"]').attr('content') ||
      $('article img').first().attr('src') ||
      undefined;

    const author =
      $('meta[property="article:author"]').attr('content') ||
      $('meta[name="author"]').attr('content') ||
      $('[rel="author"]').text() ||
      undefined;

    const publishedDate =
      $('meta[property="article:published_time"]').attr('content') ||
      $('meta[name="published"]').attr('content') ||
      undefined;

    // Clean the content
    const content = article?.textContent || article?.content || '';

    return {
      title: title.trim(),
      content: content.trim(),
      description: description.trim(),
      imageUrl,
      author,
      publishedDate,
      url,
    };
  } catch (error: any) {
    console.error('[Content Extraction] Error:', error);
    throw new Error(`Failed to extract content from URL: ${error.message}`);
  }
}

/**
 * Clean and prepare extracted content for AI processing
 */
export function prepareContentForAI(extracted: ExtractedContent): string {
  let prepared = `Title: ${extracted.title}\n\n`;

  if (extracted.description) {
    prepared += `Description: ${extracted.description}\n\n`;
  }

  if (extracted.author) {
    prepared += `Author: ${extracted.author}\n\n`;
  }

  prepared += `Content:\n${extracted.content}`;

  // Limit content length to avoid token limits (keep first 8000 characters)
  if (prepared.length > 8000) {
    prepared = prepared.substring(0, 8000) + '...';
  }

  return prepared;
}

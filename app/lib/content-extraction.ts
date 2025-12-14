/**
 * URL Content Extraction Service
 * Extracts and cleans content from URLs for content generation
 * Uses cheerio only (no jsdom) for serverless compatibility
 */

import * as cheerio from 'cheerio';

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
 * Uses cheerio for parsing (serverless-compatible)
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

    // Parse with Cheerio (serverless-compatible)
    const $ = cheerio.load(html);

    // Extract title
    const title =
      $('meta[property="og:title"]').attr('content') ||
      $('meta[name="twitter:title"]').attr('content') ||
      $('title').text() ||
      $('h1').first().text() ||
      'Untitled';

    // Extract description
    const description =
      $('meta[property="og:description"]').attr('content') ||
      $('meta[name="description"]').attr('content') ||
      $('meta[name="twitter:description"]').attr('content') ||
      '';

    // Extract main content
    // Try to find article content using common selectors
    let content = '';
    
    // Try article tag first
    const article = $('article').first();
    if (article.length > 0) {
      // Remove script and style tags
      article.find('script, style, nav, aside, footer, header').remove();
      content = article.text().trim();
    }
    
    // If no article, try main content areas
    if (!content) {
      const mainContent = $('main, [role="main"], .content, .post-content, .article-content, .entry-content').first();
      if (mainContent.length > 0) {
        mainContent.find('script, style, nav, aside, footer, header').remove();
        content = mainContent.text().trim();
      }
    }
    
    // Fallback: get body text, excluding common non-content elements
    if (!content) {
      const body = $('body');
      body.find('script, style, nav, aside, footer, header, .sidebar, .menu, .navigation').remove();
      // Get paragraphs and headings
      content = body.find('p, h1, h2, h3, h4, h5, h6').map((_, el) => $(el).text()).get().join('\n\n').trim();
    }

    // Clean up content: remove extra whitespace
    content = content.replace(/\s+/g, ' ').trim();

    // Extract image
    const imageUrl =
      $('meta[property="og:image"]').attr('content') ||
      $('meta[name="twitter:image"]').attr('content') ||
      $('article img').first().attr('src') ||
      $('main img').first().attr('src') ||
      undefined;

    // Make image URL absolute if it's relative
    let absoluteImageUrl = imageUrl;
    if (imageUrl && !imageUrl.startsWith('http')) {
      try {
        absoluteImageUrl = new URL(imageUrl, url).toString();
      } catch {
        absoluteImageUrl = undefined;
      }
    }

    // Extract author
    const author =
      $('meta[property="article:author"]').attr('content') ||
      $('meta[name="author"]').attr('content') ||
      $('[rel="author"]').text() ||
      $('.author, .byline').first().text() ||
      undefined;

    // Extract published date
    const publishedDate =
      $('meta[property="article:published_time"]').attr('content') ||
      $('meta[name="published"]').attr('content') ||
      $('time[datetime]').first().attr('datetime') ||
      undefined;

    // If no content was extracted, use description as fallback
    if (!content && description) {
      content = description;
    }

    // Final fallback: use title if still no content
    if (!content) {
      content = title;
    }

    return {
      title: title.trim(),
      content: content.trim(),
      description: description.trim(),
      imageUrl: absoluteImageUrl,
      author: author?.trim(),
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

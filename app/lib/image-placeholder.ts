/**
 * Image Placeholder Utility
 * Provides a proper fallback image instead of using external placeholder services
 */

/**
 * Generate a data URI for a simple placeholder image
 * Returns a 1:1 square image with a gray background and text
 */
export function getPlaceholderImage(text: string = "No Image", size: number = 400): string {
  // Create a simple SVG placeholder as data URI
  // Escape text for XML
  const escapedText = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
  
  const svg = `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f3f4f6"/>
      <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="16" fill="#9ca3af" text-anchor="middle" dy=".3em">${escapedText}</text>
    </svg>`;
  
  // Use encodeURIComponent for proper encoding (works in browser)
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

/**
 * Get a placeholder image URL for different scenarios
 */
export const PLACEHOLDER_IMAGES = {
  noImage: getPlaceholderImage("No Image", 400),
  generationFailed: getPlaceholderImage("Image Generation Failed", 400),
  loading: getPlaceholderImage("Loading...", 400),
};


/**
 * GET /api/platforms/validate
 * Validates if user has connected accounts for the specified platforms
 */

import { NextRequest, NextResponse } from 'next/server';
import { validatePlatformConnections } from '@/lib/platform-validation';

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');
    const platformsParam = request.nextUrl.searchParams.get('platforms');

    if (!userId) {
      return NextResponse.json(
        { error: 'missing_params', message: 'userId is required' },
        { status: 400 }
      );
    }

    if (!platformsParam) {
      return NextResponse.json(
        { error: 'missing_params', message: 'platforms is required' },
        { status: 400 }
      );
    }

    // Parse platforms (comma-separated)
    const platforms = platformsParam.split(',').map(p => p.trim()).filter(Boolean);

    if (platforms.length === 0) {
      return NextResponse.json({
        valid: false,
        message: 'No platforms specified',
        summary: {
          allConnected: false,
          connectedPlatforms: [],
          missingPlatforms: [],
          expiredPlatforms: [],
          results: [],
        },
      });
    }

    // Validate platform connections
    const summary = await validatePlatformConnections(userId, platforms);

    return NextResponse.json({
      valid: summary.allConnected,
      message: summary.allConnected
        ? 'All platforms are connected and ready'
        : 'Some platforms are not connected',
      summary,
    });
  } catch (error: any) {
    console.error('[Validate Platforms] Error:', error);
    return NextResponse.json(
      { error: 'server_error', message: error.message },
      { status: 500 }
    );
  }
}


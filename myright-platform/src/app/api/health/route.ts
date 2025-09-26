import { NextResponse } from 'next/server';

/**
 * Health check endpoint for monitoring and deployment validation
 * Returns system status and basic metrics
 */
export async function GET() {
  try {
    // Basic health checks
    const healthData = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      uptime: process.uptime(),
      services: {
        search: 'operational',
        content: 'operational',
        api: 'operational'
      },
      build: {
        buildId: process.env.BUILD_ID || 'development',
        nextVersion: process.env.npm_package_dependencies_next || 'unknown'
      }
    };

    // Additional checks could be added here:
    // - Database connectivity
    // - External service availability
    // - Cache status
    // - File system checks

    return NextResponse.json(healthData, {
      status: 200,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Content-Type': 'application/json'
      }
    });

  } catch (error) {
    // Log error in production
    if (process.env.NODE_ENV === 'production') {
      console.error('Health check failed:', error);
    }

    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
        version: process.env.npm_package_version || '1.0.0'
      },
      {
        status: 503,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Content-Type': 'application/json'
        }
      }
    );
  }
}

// Support HEAD requests for simple health checks
export async function HEAD() {
  try {
    return new NextResponse(null, { status: 200 });
  } catch {
    return new NextResponse(null, { status: 503 });
  }
}
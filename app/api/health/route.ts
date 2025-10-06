import { NextResponse } from 'next/server';
import { env } from '@/lib/env';

export async function GET() {
  try {
    // Check database connection
    const dbStatus = await checkDatabaseConnection();
    
    // Check external services
    const services = {
      database: dbStatus,
      n8n: env.hasN8N,
      upload: env.hasUpload,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      version: process.env.npm_package_version || '1.0.0'
    };

    const isHealthy = dbStatus === 'connected';

    return NextResponse.json(services, {
      status: isHealthy ? 200 : 503,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  } catch (error) {
    console.error('Health check failed:', error);
    return NextResponse.json(
      { 
        error: 'Health check failed', 
        timestamp: new Date().toISOString(),
        status: 'unhealthy'
      },
      { status: 503 }
    );
  }
}

async function checkDatabaseConnection(): Promise<string> {
  try {
    // Import Prisma client dynamically to avoid issues during build
    const { PrismaClient } = await import('@/lib/generated/prisma');
    const prisma = new PrismaClient();
    
    // Simple query to test connection
    await prisma.$queryRaw`SELECT 1`;
    await prisma.$disconnect();
    
    return 'connected';
  } catch (error) {
    console.error('Database connection failed:', error);
    return 'disconnected';
  }
}

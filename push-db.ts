import { execSync } from 'child_process';

const rawUrl = process.env.DATABASE_URL || '';
let cleanUrl = rawUrl;

if (rawUrl.startsWith('DATABASE_URL=')) {
  cleanUrl = rawUrl.substring('DATABASE_URL='.length);
}

// Remove surrounding quotes if they exist
if (cleanUrl.startsWith('"') && cleanUrl.endsWith('"')) {
  cleanUrl = cleanUrl.substring(1, cleanUrl.length - 1);
}

process.env.DATABASE_URL = cleanUrl;
console.log('[Prisma Script] Sanitized URL:', cleanUrl);

if (!cleanUrl || (!cleanUrl.startsWith('postgresql://') && !cleanUrl.startsWith('postgres://'))) {
  console.warn('[Prisma Script] No valid PostgreSQL DATABASE_URL found in environment. Bypassing schema push and exiting gracefully for local JSON fallback database.');
  process.exit(0);
}

try {
  console.log('[Prisma Script] Running: npx prisma db push');
  execSync('npx prisma db push', {
    stdio: 'inherit',
    env: { ...process.env, DATABASE_URL: cleanUrl }
  });
  console.log('[Prisma Script] Push completed successfully.');
} catch (error: any) {
  console.error('[Prisma Script] Error pushing schema:', error.message);
  process.exit(1);
}

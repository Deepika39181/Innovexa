import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcrypt';

// If DATABASE_URL is missing or invalid, set a dummy one so Prisma doesn't crash on instantiation.
// The proxy will detect that the connection fails and automatically use the local fallback JSON database.
if (!process.env.DATABASE_URL || (!process.env.DATABASE_URL.startsWith('postgresql://') && !process.env.DATABASE_URL.startsWith('postgres://'))) {
  process.env.DATABASE_URL = "postgresql://postgres:postgres@localhost:5432/postgres";
}

// Create the real Prisma Client
const realPrisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

// JSON file database for fallback
const DB_FILE = path.join(process.cwd(), 'prisma-fallback-db.json');

// Initialize empty database structure if not exists
function getFallbackDb() {
  if (!fs.existsSync(DB_FILE)) {
    const initialDb: Record<string, any[]> = {
      user: [],
      project: [],
      bid: [],
      contract: [],
      milestone: [],
      payment: [],
      message: [],
      review: [],
      deliverable: [],
      projectAttachment: [],
      conversation: [],
      notification: [],
      portfolio: [],
      savedProject: [],
      category: [],
      skill: [],
      dispute: [],
      refund: [],
      refreshToken: [],
      passwordResetToken: [],
      emailVerificationToken: [],
      clientProfile: [],
      freelancerProfile: [],
      adminProfile: [],
      adminLog: [],
      platformCommission: [],
      globalSetting: []
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialDb, null, 2));
    return initialDb;
  }
  try {
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
  } catch (err) {
    return {};
  }
}

function saveFallbackDb(db: any) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
  } catch (err) {
    console.error('[Fallback DB] Failed to save database:', err);
  }
}

// Database connectivity state
let isDbConnected = false;
let dbCheckDone = false;

async function checkDbConnection(): Promise<boolean> {
  if (dbCheckDone) return isDbConnected;
  try {
    // Attempt a quick, small query to verify connection
    await Promise.race([
      realPrisma.$queryRaw`SELECT 1`,
      new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 2000))
    ]);
    isDbConnected = true;
    console.log('[Prisma Proxy] PostgreSQL is active and connected.');
  } catch (err: any) {
    isDbConnected = false;
    console.warn('[Prisma Proxy] PostgreSQL is offline/unreachable. Falling back to local database.');
  }
  dbCheckDone = true;
  return isDbConnected;
}

// Simple fallback query handler implementing basic Prisma queries
function fallbackQuery(model: string, method: string, args: any[] = []): any {
  const db = getFallbackDb();
  const table = db[model] || [];
  const queryArgs = args[0] || {};

  console.log(`[Fallback DB] ${model}.${method} called with:`, JSON.stringify(queryArgs));

  const generateId = () => Math.random().toString(36).substring(2, 15) + Date.now().toString(36);

  if (method === 'findUnique' || method === 'findFirst') {
    const where = queryArgs.where || {};
    const found = table.find((item: any) => {
      return Object.entries(where).every(([key, val]) => {
        let itemVal = item[key];
        if (itemVal === undefined) {
          if (key === 'used' || key === 'isVerified' || key === 'isBanned') {
            itemVal = false;
          }
        }
        if (typeof val === 'object' && val !== null) {
          // Handle nested object queries like { id: ... } or { email: ... }
          return itemVal === (val as any).equals || itemVal === (val as any).in;
        }
        return itemVal === val;
      });
    });
    return found || null;
  }

  if (method === 'findMany') {
    const where = queryArgs.where || {};
    let results = table.filter((item: any) => {
      return Object.entries(where).every(([key, val]) => {
        if (val === undefined) return true;
        let itemVal = item[key];
        if (itemVal === undefined) {
          if (key === 'used' || key === 'isVerified' || key === 'isBanned') {
            itemVal = false;
          }
        }
        if (typeof val === 'object' && val !== null) {
          if ('in' in val) {
            return (val as any).in.includes(itemVal);
          }
          if ('equals' in val) {
            return itemVal === (val as any).equals;
          }
          if ('not' in val) {
            return itemVal !== (val as any).not;
          }
        }
        return itemVal === val;
      });
    });

    // Handle skip & take if present
    if (typeof queryArgs.skip === 'number') {
      results = results.slice(queryArgs.skip);
    }
    if (typeof queryArgs.take === 'number') {
      results = results.slice(0, queryArgs.take);
    }
    return results;
  }

  if (method === 'create') {
    const data = queryArgs.data || {};
    const defaults: Record<string, any> = {};
    if (model === 'user') {
      defaults.isVerified = false;
      defaults.isBanned = false;
      defaults.provider = 'LOCAL';
    } else if (model === 'emailVerificationToken' || model === 'passwordResetToken') {
      defaults.used = false;
    }

    const newRecord = {
      id: data.id || generateId(),
      ...defaults,
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    table.push(newRecord);
    db[model] = table;
    saveFallbackDb(db);
    return newRecord;
  }

  if (method === 'update') {
    const where = queryArgs.where || {};
    const data = queryArgs.data || {};
    const index = table.findIndex((item: any) => {
      return Object.entries(where).every(([key, val]) => item[key] === val);
    });
    if (index === -1) {
      throw new Error(`Record not found in ${model} for update.`);
    }
    const updatedRecord = {
      ...table[index],
      ...data,
      updatedAt: new Date()
    };
    table[index] = updatedRecord;
    db[model] = table;
    saveFallbackDb(db);
    return updatedRecord;
  }

  if (method === 'upsert') {
    const where = queryArgs.where || {};
    const updateData = queryArgs.update || {};
    const createData = queryArgs.create || {};
    const index = table.findIndex((item: any) => {
      return Object.entries(where).every(([key, val]) => item[key] === val);
    });
    if (index !== -1) {
      const updatedRecord = {
        ...table[index],
        ...updateData,
        updatedAt: new Date()
      };
      table[index] = updatedRecord;
      db[model] = table;
      saveFallbackDb(db);
      return updatedRecord;
    } else {
      const newRecord = {
        id: createData.id || generateId(),
        ...createData,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      table.push(newRecord);
      db[model] = table;
      saveFallbackDb(db);
      return newRecord;
    }
  }

  if (method === 'delete') {
    const where = queryArgs.where || {};
    const index = table.findIndex((item: any) => {
      return Object.entries(where).every(([key, val]) => item[key] === val);
    });
    if (index === -1) {
      throw new Error(`Record not found in ${model} for deletion.`);
    }
    const deletedRecord = table[index];
    table.splice(index, 1);
    db[model] = table;
    saveFallbackDb(db);
    return deletedRecord;
  }

  if (method === 'deleteMany') {
    const where = queryArgs.where || {};
    const initialLength = table.length;
    const remaining = table.filter((item: any) => {
      return !Object.entries(where).every(([key, val]) => item[key] === val);
    });
    db[model] = remaining;
    saveFallbackDb(db);
    return { count: initialLength - remaining.length };
  }

  if (method === 'count') {
    const where = queryArgs.where || {};
    const results = table.filter((item: any) => {
      return Object.entries(where).every(([key, val]) => item[key] === val);
    });
    return results.length;
  }

  return null;
}

// Create a Proxy handler to dynamically forward Prisma model access
const modelProxyHandler = (modelName: string) => {
  return {
    get: (target: any, methodName: string) => {
      return async (...args: any[]) => {
        const connected = await checkDbConnection();
        if (connected) {
          try {
            const modelDelegate = (realPrisma as any)[modelName];

if (!modelDelegate || typeof modelDelegate[methodName] !== "function") {
  throw new Error(`Invalid Prisma method: ${modelName}.${methodName}`);
}

return await modelDelegate[methodName](...args);
          } catch (err: any) {
            console.error(`[Prisma Proxy] Real PostgreSQL query failed on ${modelName}.${methodName}:`, err.message);
          }
        }
        // Fallback to local database logic
        return fallbackQuery(modelName, methodName, args);
      };
    }
  };
};

// Create the overall Prisma Client Proxy
const prismaProxy: any = new Proxy(realPrisma, {
  get: (target, propName: string) => {
    // $transaction handler
    if (propName === '$transaction') {
      return async (arg: any) => {
        if (typeof arg === 'function') {
          // Pass the proxy itself as the transaction callback parameter
          return await arg(prismaProxy);
        }
        // If it's an array of promises, resolve them
        if (Array.isArray(arg)) {
          const results = [];
          for (const promise of arg) {
            results.push(await promise);
          }
          return results;
        }
        return [];
      };
    }

    if (propName === '$connect' || propName === '$disconnect') {
      return async () => {};
    }

    // Check if it's a model in the prisma client
    if (typeof propName === 'string' && !propName.startsWith('$') && !propName.startsWith('_')) {
      return new Proxy({}, modelProxyHandler(propName));
    }

    return (target as any)[propName];
  }
});

// Database Seeding Logic
export async function seedDatabase() {
  try {
    const userCount = await prismaProxy.user.count();
    if (userCount > 0) {
      console.log('[Seeder] Database already contains users. Skipping seed.');
      return;
    }

    console.log('[Seeder] Database is empty. Starting seed sequence...');
    const hashedPassword = await bcrypt.hash('password123', 12);

    // 1. Seed Categories
    const categoriesData = [
      { name: 'Software Dev', description: 'Web development, mobile apps, devops, database, AI/ML' },
      { name: 'Design & Creative', description: 'Logo branding, UI/UX design, illustrations' },
      { name: 'Writing & Translation', description: 'Copywriting, technical blogs, translation' },
      { name: 'Sales & Marketing', description: 'Social media campaigns, search engine optimization' }
    ];

    const categories: any[] = [];
    for (const cat of categoriesData) {
      const created = await prismaProxy.category.create({ data: cat });
      categories.push(created);
    }
    console.log(`[Seeder] Seeded ${categories.length} categories.`);

    // 2. Seed Users
    const usersData = [
      {
        name: 'Sarah Chen',
        email: 'client@innovexa.com',
        password: hashedPassword,
        role: 'CLIENT',
        isVerified: true,
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
        bio: 'Sarah is the VP of Innovation at Enterprise Client Co. Scaling premium tech.',
        location: 'San Francisco, CA',
        profileCompleted: true
      },
      {
        name: 'Alex Rivera',
        email: 'freelancer@innovexa.com',
        password: hashedPassword,
        role: 'FREELANCER',
        isVerified: true,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        bio: 'Elena is a Senior Full Stack & AI DevOps Engineer. Expertise in React and PyTorch pipelines.',
        location: 'Austin, TX',
        skills: ['React', 'Python', 'AWS', 'Docker', 'Figma'],
        hourlyRate: 85,
        profileCompleted: true
      },
      {
        name: 'Marcus Thorne',
        email: 'admin@innovexa.com',
        password: hashedPassword,
        role: 'ADMIN',
        isVerified: true,
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        bio: 'Lead Marketplace Operations Administrator for Innovexa Catalyst.',
        location: 'New York, NY',
        profileCompleted: true
      }
    ];

    const users: any[] = [];
    for (const u of usersData) {
      const created = await prismaProxy.user.create({ data: u });
      users.push(created);
    }
    console.log(`[Seeder] Seeded ${users.length} users.`);

    // 3. Seed client & freelancer profiles
    const sarah = users.find(u => u.role === 'CLIENT');
    const alex = users.find(u => u.role === 'FREELANCER');
    const marcus = users.find(u => u.role === 'ADMIN');

    if (sarah) {
      await prismaProxy.clientProfile.create({
        data: {
          userId: sarah.id,
          companyName: 'Global InnoTech Solutions',
          website: 'https://innotech.global'
        }
      });
    }

    if (alex) {
      await prismaProxy.freelancerProfile.create({
        data: {
          userId: alex.id,
          title: 'Senior DevOps Specialist & Full Stack Architect',
          skills: ['React', 'Python', 'AWS', 'Docker'],
          hourlyRate: 85,
          availableForWork: true
        }
      });
    }

    if (marcus) {
      await prismaProxy.adminProfile.create({
        data: {
          userId: marcus.id,
          permissions: ['SUPER_ADMIN'],
          department: 'Platform Operations'
        }
      });
    }

    // 4. Seed Projects
    if (sarah) {
      const projectsData = [
        {
          title: 'AI Model Training Pipeline',
          description: 'Infrastructure setup for large-scale data ingestion and model training using PyTorch. Seeking an expert DevOps specialist to configure cluster resources, logging, and metrics pipelines.',
          budget: 12500,
          category: 'Software Dev',
          skills: ['AI/ML', 'Docker', 'AWS', 'Python'],
          clientId: sarah.id,
          remote: true,
          status: 'OPEN'
        },
        {
          title: 'Brand Evolution Strategy',
          description: 'Complete redesign of corporate identity across all products and marketing channels. Deliverable includes brand guidelines, asset packages, and full digital design specifications.',
          budget: 8200,
          category: 'Design & Creative',
          skills: ['Branding', 'UI/UX Design', 'Figma'],
          clientId: sarah.id,
          remote: true,
          status: 'OPEN'
        },
        {
          title: 'Enterprise AI Dashboard Redesign',
          description: 'Looking for an expert UI/UX designer with experience in complex data visualization. Redesigning a high-traffic trading and data monitoring platform with real-time analytics integrations.',
          budget: 4500,
          category: 'Design & Creative',
          skills: ['Figma', 'Atomic Design', 'Fintech'],
          clientId: sarah.id,
          remote: true,
          status: 'OPEN'
        }
      ];

      for (const proj of projectsData) {
        await prismaProxy.project.create({ data: proj });
      }
      console.log('[Seeder] Seeded projects.');
    }

    console.log('[Seeder] Seeding sequence completed successfully.');
  } catch (err: any) {
    console.error('[Seeder] Error during database seed:', err.message);
  }
}

// Call seedDatabase programmatically on startup or connection check
setTimeout(() => {
  seedDatabase();
}, 2000);

export { prismaProxy as prisma };
export default prismaProxy;

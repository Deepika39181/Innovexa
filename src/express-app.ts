import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Routes imports
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import projectRoutes from './routes/project.routes';
import bidRoutes from './routes/bid.routes';
import contractRoutes from './routes/contract.routes';
import milestoneRoutes from './routes/milestone.routes';
import paymentRoutes from './routes/payment.routes';
import messageRoutes from './routes/message.routes';
import reviewRoutes from './routes/review.routes';
import portfolioRoutes from './routes/portfolio.routes';
import categorySkillsRoutes from './routes/category.routes';
import disputeRoutes from './routes/dispute.routes';
import adminRoutes from './routes/admin.routes';
import notificationRoutes from './routes/notification.routes';
import clientRoutes from './routes/client.routes';

// Middleware imports
import { globalErrorHandler } from './middlewares/error';
import { apiLimiter } from './middlewares/rateLimiter';
import { protect } from './middlewares/auth';
import { sendSuccess } from './utils/apiResponse';

const app = express();

// Trust the proxy (necessary when behind Cloud Run / Nginx to get correct client IP)
app.set('trust proxy', 1);

// Security and middleware configuration
app.use(helmet({
  contentSecurityPolicy: false, // Turn off CSP during development/preview to allow style loads etc.
}));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limit application
app.use('/api', apiLimiter);

// Configure Multer for File Uploads
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.png', '.jpg', '.jpeg', '.pdf', '.docx', '.zip', '.rar'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Only images, PDFs, word docs, and archives are allowed.'));
    }
  },
});

// Serve uploaded files statically
app.use('/uploads', express.static(uploadDir));

// Health check and root check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'Innovexa Catalyst API', uptime: process.uptime() });
});

// File upload endpoint
app.post('/api/upload', protect, upload.single('file'), (req, res) => {
  if (!req.file) {
    throw new Error('Please select a file to upload.');
  }

  const fileUrl = `/uploads/${req.file.filename}`;
  return sendSuccess(res, {
    fileName: req.file.originalname,
    filenameOnServer: req.file.filename,
    fileUrl,
    fileSize: req.file.size,
    mimeType: req.file.mimetype,
  }, 'File uploaded successfully.');
});

// API Routes mount mapping
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/bids', bidRoutes); // Handles bid operations
app.use('/api/contracts', contractRoutes);
app.use('/api/milestones', milestoneRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/conversations', messageRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/disputes', disputeRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/client', clientRoutes);

// Generic Categories/Skills mounts directly under /api
app.use('/api', categorySkillsRoutes);

// Fallback operational router error
app.all('/api/*', (req, res, next) => {
  res.status(404).json({
    status: 'fail',
    message: `Can't find ${req.originalUrl} on this platform!`,
  });
});

// Global Error Handler Mount
app.use(globalErrorHandler);

export default app;

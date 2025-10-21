import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer for sound files
const soundStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, 'public/uploads/soundfiles');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

// Configure multer for documents
const docStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isImage = file.mimetype.startsWith('image/');
    const destDir = isImage 
      ? path.join(__dirname, 'public/uploads/images')
      : path.join(__dirname, 'public/uploads/documents');
    
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }
    cb(null, destDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const soundUpload = multer({ 
  storage: soundStorage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /wav|mp3|ogg|m4a|aac/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only audio files are allowed'));
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 }
});

const docUpload = multer({ 
  storage: docStorage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only images (JPEG, JPG, PNG) and PDF files are allowed'));
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 }
});

export default function uploadPlugin() {
  return {
    name: 'upload-plugin',
    configureServer(server) {
      // Add CORS headers
      server.middlewares.use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
        if (req.method === 'OPTIONS') {
          res.statusCode = 200;
          res.end();
          return;
        }
        next();
      });

      // Sound upload endpoint
      server.middlewares.use('/api/upload-sound', (req, res, next) => {
        if (req.method !== 'POST') return next();
        
        soundUpload.single('file')(req, res, (err) => {
          if (err) {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: err.message }));
            return;
          }
          if (!req.file) {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'No file uploaded' }));
            return;
          }
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ fileName: req.file.filename }));
        });
      });

      // Sound delete endpoint
      server.middlewares.use('/api/delete-sound', (req, res, next) => {
        if (req.method !== 'DELETE') return next();
        
        const filename = req.url.split('/').pop();
        const filePath = path.join(__dirname, 'public/uploads/soundfiles', filename);
        
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error('Error deleting file:', err);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Failed to delete file' }));
            return;
          }
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ message: 'File deleted successfully' }));
        });
      });

      // Document upload endpoint
      server.middlewares.use('/upload-document', (req, res, next) => {
        if (req.method !== 'POST') return next();
        
        docUpload.single('document')(req, res, (err) => {
          if (err) {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: err.message }));
            return;
          }
          if (!req.file) {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'No file uploaded' }));
            return;
          }

          const isImage = req.file.mimetype.startsWith('image/');
          const filePath = isImage ? `/uploads/images/${req.file.filename}` : `/uploads/documents/${req.file.filename}`;
          
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({
            success: true,
            filename: req.file.filename,
            originalName: req.file.originalname,
            path: filePath,
            size: req.file.size
          }));
        });
      });

      // Delete image files
      server.middlewares.use('/uploads/images', (req, res, next) => {
        if (req.method !== 'DELETE') return next();
        
        const filename = req.url.split('/').pop();
        const filePath = path.join(__dirname, 'public/uploads/images', filename);
        
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error('Error deleting image file:', err);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Failed to delete file' }));
            return;
          }
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ message: 'File deleted successfully' }));
        });
      });

      // Delete document files
      server.middlewares.use('/uploads/documents', (req, res, next) => {
        if (req.method !== 'DELETE') return next();
        
        const filename = req.url.split('/').pop();
        const filePath = path.join(__dirname, 'public/uploads/documents', filename);
        
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error('Error deleting document file:', err);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Failed to delete file' }));
            return;
          }
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ message: 'File deleted successfully' }));
        });
      });
    }
  };
}
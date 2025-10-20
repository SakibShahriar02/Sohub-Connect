import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Enable CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../public/uploads/soundfiles');
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

const upload = multer({ 
  storage,
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

app.post('/api/upload-sound', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  res.json({ fileName: req.file.filename });
});

app.delete('/api/delete-sound/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, '../public/uploads/soundfiles', filename);
  
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error('Error deleting file:', err);
      return res.status(500).json({ error: 'Failed to delete file' });
    }
    res.json({ message: 'File deleted successfully' });
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`\x1b[32m✓ Upload server running on http://localhost:${PORT}\x1b[0m`);
});

export default app;
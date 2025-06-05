import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

export const upload = multer({
  storage,
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    if (!['.pdf', '.txt', '.docx'].includes(ext)) {
      return cb(new Error('Only PDF, TXT, and DOCX allowed'));
    }
    cb(null, true);
  }
});

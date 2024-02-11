const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

// Multer configuration for handling image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname))
  }
});

app.get('/', (req, res) => {
    res.send('Welcome to the Image Upload API');
  });
const upload = multer({ storage: storage });

// POST endpoint for uploading images
app.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  res.json({ imageUrl: req.file.path });
});

// GET endpoint for retrieving all uploaded images
app.get('/images', (req, res) => {
  fs.readdir('uploads/', (err, files) => {
    if (err) {
      return res.status(500).json({ error: 'Unable to read directory' });
    }
    const imageUrls = files.map(file => `uploads/${file}`);
    res.json({ images: imageUrls });
  });
});

app.listen(port, () => {
  console.log(`Image upload API running on port ${port}`);
});

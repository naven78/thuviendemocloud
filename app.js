const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Kiem tra va tao thu muc uploads neu chua co
if (!fs.existsSync('./uploads')) {
  fs.mkdirSync('./uploads');
}

// Cau hinh multer de luu file
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Su dung thu muc tich hop de phuc vu anh va video
app.use(express.static('public'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.urlencoded({ extended: true }));

// API lay danh sach cac file da upload
app.get('/api/gallery', (req, res) => {
  fs.readdir('./uploads', (err, files) => {
    if (err) {
      console.error('Loi doc thu muc uploads:', err);
      return res.status(500).json({ error: 'Khong the doc thu muc uploads' });
    }
    res.json(files);
  });
});

// Route upload file
app.post('/upload', upload.single('media'), (req, res) => {
  if (!req.file) {
    console.error('Khong co file duoc nhan');
    return res.status(400).send('Khong co file duoc upload.');
  }
  console.log('File da upload:', req.file.filename);
  res.redirect('/'); // Sau khi upload xong, chuyen huong ve trang chinh
});

// Route xoa file
app.post('/delete', (req, res) => {
  const filename = req.body.filename;
  const filePath = path.join(__dirname, 'uploads', filename);
  fs.unlink(filePath, err => {
    if (err) console.error(err);
    res.redirect('/'); // Sau khi xoa, chuyen huong ve trang chinh
  });
});

app.listen(PORT, () => {
  console.log(`Server dang chay o http://localhost:${PORT}`);
});

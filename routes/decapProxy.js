// 📁 routes/decapProxy.js
const { Router } = require('express');
const multer = require('multer');

const { verifyJWT } = require('../middlewares/authMiddleware');
const githubService = require('../utils/githubService');

const router = Router();
const upload = multer();

// Получить контент по пути
router.get('/entry', verifyJWT, async (req, res) => {
  const { path } = req.query;
  try {
    const file = await githubService.getFile(path);
    res.json({ content: file });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Сохранить/обновить файл
router.post('/entry', verifyJWT, async (req, res) => {
  const { path, content, message } = req.body;
  try {
    await githubService.saveFile(path, content, message);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Удалить файл
router.delete('/entry', verifyJWT, async (req, res) => {
  const { path, message } = req.body;
  try {
    await githubService.deleteFile(path, message);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Загрузка медиа (multipart/form-data)
router.post('/media', verifyJWT, upload.single('file'), async (req, res) => {
  try {
    const { buffer } = req.file;
    const filename = req.file.originalname;
    const path = `public/images/uploads/${filename}`;

    await githubService.saveFile(
      path,
      buffer.toString('base64'),
      `Upload ${filename}`,
      true,
    );
    res.json({ url: `/images/uploads/${filename}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

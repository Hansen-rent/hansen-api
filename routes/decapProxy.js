const express = require('express');

const router = express.Router();
const multer = require('multer');
const { verifyJWT } = require('../middlewares/authMiddleware');
const githubService = require('../utils/githubService');

const upload = multer();

// Основной роут для всех действий Decap CMS
router.post('/', verifyJWT, async (req, res) => {
  const { action, params } = req.body;

  try {
    switch (action) {
      case 'getMedia': {
        const folder = params.mediaFolder || 'public/images/uploads';
        const listing = await githubService.listFiles(folder);
        const files = listing.map(file => ({
          key: file.name,
          name: file.name,
          size: file.size,
          url: `/images/uploads/${file.name}`,
        }));
        return res.json({ files });
      }

      case 'entriesByFiles': {
        const files = await Promise.all(
          params.files.map(async ({ path }) => {
            const raw = await githubService.getFile(path);
            return { path, raw }; // можно дополнить: data: JSON.parse(raw)
          }),
        );
        return res.json({ entries: files });
      }

      default:
        return res.status(400).json({ error: `Unknown action: ${action}` });
    }
  } catch (err) {
    console.error('❌ Ошибка CMS:', err);
    res.status(500).json({ error: err.message });
  }
});

// Старый getFile
router.get('/entry', verifyJWT, async (req, res) => {
  const { path } = req.query;
  try {
    const file = await githubService.getFile(path);
    res.json({ content: file });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Старый saveFile
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

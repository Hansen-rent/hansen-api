const axios = require('axios');

const OWNER = 'Hansen-rent';
const REPO = 'hansen-api';
const BRANCH = 'main';
const api = axios.create({
  baseURL: 'https://api.github.com',
  headers: {
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    'User-Agent': 'Decap-Custom-Proxy',
    Accept: 'application/vnd.github+json',
  },
});

function getContentPath(path) {
  return `repos/${OWNER}/${REPO}/contents/${path}`;
}

async function getFile(path) {
  const res = await api.get(getContentPath(path), { params: { ref: BRANCH } });
  return Buffer.from(res.data.content, 'base64').toString();
}

async function saveFile(path, content, message, isRaw = false) {
  const fullPath = getContentPath(path);
  let sha;

  try {
    const existing = await api.get(fullPath);
    sha = existing.data.sha;
  } catch (_) {
    // файл не существует, sha не нужен
  }

  await api.put(fullPath, {
    message: message || 'Update via CMS',
    content: isRaw ? content : Buffer.from(content).toString('base64'),
    branch: BRANCH,
    sha,
  });
}

async function deleteFile(path, message) {
  const fullPath = getContentPath(path);
  const file = await api.get(fullPath);

  await api.delete(fullPath, {
    data: {
      message: message || `Delete ${path}`,
      sha: file.data.sha,
      branch: BRANCH,
    },
  });
}

async function listFiles(path) {
  try {
    const res = await api.get(getContentPath(path));
    if (!Array.isArray(res.data)) {
      throw new Error('Expected an array of files');
    }
    return res.data.filter(file => file.type === 'file');
  } catch (err) {
    console.error('❌ Ошибка listFiles:', err.response?.data || err.message);
    throw err;
  }
}

module.exports = {
  getFile,
  saveFile,
  deleteFile,
  listFiles,
};

const fs    = require('fs');
const os    = require('os');
const path  = require('path');
const axios = require('axios');
const { GoogleGenAI, createUserContent, createPartFromUri } = require('@google/genai');

// initialize once at top‑level
const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

/**
 * Downloads an image URL to a temporary file.
 * @param {string} url
 * @returns {Promise<string>} path to temporary file
 */
async function downloadToTempFile(url) {
  const resp = await axios.get(url, { responseType: 'arraybuffer' });
  const ext  = path.extname(new URL(url).pathname) || '.jpg';
  const tmp  = path.join(os.tmpdir(), `img-${Date.now()}${ext}`);
  await fs.promises.writeFile(tmp, resp.data);
  return tmp;
}

/**
 * Analyze an image for health/nutrition info via Gemini.
 * @param {string} imageUrl  Publicly accessible URL of the image.
 * @returns {Promise<string>}  A brief summary of any health issues found.
 */
async function analyzeHealthFromImage(imageUrl) {
  // 1) download
  const tmpPath = await downloadToTempFile(imageUrl);

  try {
    // 2) upload to Gemini Files
    const file = await ai.files.upload({
      file: tmpPath,
      config: { mimeType: 'image/jpeg' }
    });

    // 3) build prompt
    const contents = createUserContent([
      createPartFromUri(file.uri, file.mimeType),
      `You are an expert dietitian and nutritionist. Analyze this image and detect any health or nutritional issues it reveals (e.g. poor portion size, high sugar content, unbalanced meal, unsafe contaminants, etc.). Provide a concise summary in one or two sentences.`
    ]);

    // 4) generate
    const resp = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents
    });

    // 5) return summary
    return resp.text.trim();

  } finally {
    // 6) cleanup
    fs.unlink(tmpPath, () => {});
  }
}

// Example usage:
// (async () => {
//   const url = 'https://example.com/path/to/meal-photo.jpg';
//   try {
//     const summary = await analyzeHealthFromImage(url);
//     console.log('Health summary:', summary);
//   } catch (err) {
//     console.error('Analysis failed:', err);
//   }
// })();

module.exports={analyzeHealthFromImage};
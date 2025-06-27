const { GoogleGenAI, createUserContent, createPartFromUri } = require('@google/genai');
const fs = require('fs'); // Import fs module
const path = require('path'); // Import path module
const os = require('os'); // Import os module for temporary directory

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

// Ensure uploads directory exists (optional, can be done manually)
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const handleChat = async (req, res) => {
  const { message, sessionId } = req.body;
  const file = req.file; // file object from multer

  console.log('Request payload:', { message, file: file?.originalname, sessionId });

  let tempFilePath = null; // Variable to store temporary file path

  try {
    let fileMetadata = null;

    // If a file is uploaded, save it temporarily and upload via path
    if (file) {
      // Create a unique temporary file path
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      tempFilePath = path.join(uploadsDir, uniqueSuffix + '-' + file.originalname);

      console.log(`Saving temporary file to: ${tempFilePath}`);
      // Write the buffer to the temporary file
      fs.writeFileSync(tempFilePath, file.buffer);

      console.log(`Uploading file from path: ${tempFilePath}`);

      // Upload the file using the file path
      const uploadedFile = await ai.files.upload({
        file: tempFilePath,
      });

      fileMetadata = {
        uri: uploadedFile.uri,
        mimeType: uploadedFile.mimeType || file.mimetype,
        name: file.originalname,
        size: file.size,
      };

      console.log('Uploaded file metadata:', fileMetadata);
    }

    // Prepare the request payload
    const contents = fileMetadata
      ? createUserContent([createPartFromUri(fileMetadata.uri, fileMetadata.mimeType), message])
      : message;

    // Send the request to the Gemini API
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents,
    });

    console.log('Response from Gemini API:', response.text);

    const reply = response.text || 'No response from Gemini API';
    res.json({ reply });

  } catch (error) {
    console.error('Error communicating with Gemini API:', error.message);
    if (error.response && error.response.data) {
      console.error('Gemini API Error Details:', error.response.data);
    }
    res.status(500).json({ reply: 'Error: Unable to process your request. Please try again later.' });
  } finally {
    // Clean up the temporary file if it was created
    if (tempFilePath && fs.existsSync(tempFilePath)) {
      try {
        fs.unlinkSync(tempFilePath);
        console.log(`Deleted temporary file: ${tempFilePath}`);
      } catch (cleanupError) {
        console.error(`Error deleting temporary file ${tempFilePath}:`, cleanupError);
      }
    }
  }
};

module.exports = { handleChat };

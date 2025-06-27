const path = require('path');
const fs   = require('fs');
const {
  GoogleGenAI,
  createUserContent,
  createPartFromUri
} = require('@google/genai');
const {
  fetchTopAmazonProduct,
  fetchTopYouTubeRecipe
} = require('./alternatives.js'); // adjust path as needed

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

/**
 * Strip markdown fences, grab the first {...} or [...] block, remove trailing commas.
 */
function extractJSONBlock(text, isArray = false) {
  let t = text.replace(/```(?:json)?/g, '').trim();
  const re = isArray ? /\[[\s\S]*\]/ : /\{[\s\S]*\}/;
  const m  = t.match(re);
  return m ? m[0].replace(/,(\s*[}\]])/g, '$1') : null;
}

/** POST /api/identify */
// async function identifyImage(req, res) {
//   if (!req.file) {
//     return res.status(400).json({ error: 'Image file is required' });
//   }

//   try {
//     // 1) Upload to Gemini Files
//     const myFile = await ai.files.upload({
//       file: path.resolve(req.file.path),
//       config: { mimeType: req.file.mimetype }
//     });

//     // 2) Check for nutrition label
//     const check = await ai.models.generateContent({
//       model: 'gemini-2.0-flash',
//       contents: createUserContent([
//         createPartFromUri(myFile.uri, myFile.mimeType),
//         `Does this image contain a nutrition facts label + ingredient list? Answer "yes" or "no".`
//       ])
//     });
//     const hasLabel = check.text.trim().toLowerCase() === 'yes';

//     if (hasLabel) {
//       // 3a) OCR the label
//       const ocr = await ai.models.generateContent({
//         model: 'gemini-2.0-flash',
//         contents: createUserContent([
//           createPartFromUri(myFile.uri, myFile.mimeType),
//           `Extract only the plain text of the nutrition table and ingredient list.`
//         ]),
//         generationConfig: { responseMimeType: 'text/plain' }
//       });
//       const rawLabelText = ocr.text.trim();

//       // 3b) Analyze the label
//       const analysisResp = await ai.models.generateContent({
//         model: 'gemini-2.0-flash',
//         contents: createUserContent([
//           { text: `You are an expert dietitian & nutritionist.` },
//           { text:
//             `Here is the extracted label text:\n"""${rawLabelText}"""\n\n` +
//             `1) Identify the product name.\n` +
//             `2) Summarize productDescription.\n` +
//             `3) Provide basicNutrients: calories, protein_g, fat_g, carbs_g.\n` +
//             `4) Provide basicUse (how to consume).\n` +
//             `5) Give positives, negatives, verdict.\n` +
//             `6) Suggest 2–3 user groups to use or avoid.\n` +
//             `7) Suggest 4 alternative products.\n` +
//             `Return ONLY this JSON:\n` +
//             `{\n` +
//             `  "product":"",\n` +
//             `  "productDescription":"",\n` +
//             `  "basicNutrients":{ "calories":0, "protein_g":0, "fat_g":0, "carbs_g":0 },\n` +
//             `  "basicUse":"",\n` +
//             `  "positives":[],\n` +
//             `  "negatives":[],\n` +
//             `  "verdict":"healthy|neutral|unhealthy",\n` +
//             `  "recommendedFor":[],\n` +
//             `  "avoidFor":[],\n` +
//             `  "alternatives":[]\n` +
//             `}`
//           }
//         ]),
//         generationConfig: { responseMimeType: 'application/json' }
//       });

//       const block = extractJSONBlock(analysisResp.text, false) || '{}';
//       let analysis;
//       try {
//         analysis = JSON.parse(block);
//       } catch {
//         return res.status(500).json({ error: 'Failed to parse nutrition analysis' });
//       }

//       // 3c) Enrich alternatives
//       const alts = Array.isArray(analysis.alternatives) ? analysis.alternatives : [];
//       const [amazonProducts, youtubeRecipes] = await Promise.all([
//         Promise.all(alts.map(fetchTopAmazonProduct)),
//         Promise.all(alts.map(fetchTopYouTubeRecipe))
//       ]);
//       analysis.amazonProducts  = amazonProducts.filter(Boolean);
//       analysis.youtubeRecipes  = youtubeRecipes.filter(Boolean);

//       return res.json({ rawLabelText, analysis });
//     }

//     // 4) Perform object detection
//     const detResp = await ai.models.generateContent({
//       model: 'gemini-2.0-flash',
//       contents: createUserContent([
//         createPartFromUri(myFile.uri, myFile.mimeType),
//         `Detect only physical food/drink/medicine items. Return ONLY a JSON array:\n` +
//         `[{"box_2d":[x,y,width,height],"label":"name"}]`
//       ]),
//       generationConfig: { responseMimeType: 'application/json' }
//     });

//     const detBlock = extractJSONBlock(detResp.text, true) || '[]';
//     let detections = [];
//     try {
//       detections = JSON.parse(detBlock);
//     } catch {
//       detections = [];
//     }

//     if (!detections.length) {
//       return res.json({ detections, analysis: null });
//     }

//     // 5) Analyze the first detected item
//     const label = detections[0].label;
//     const analysisResp = await ai.models.generateContent({
//       model: 'gemini-2.0-flash',
//       contents: createUserContent([
//         { text: `You are a senior dietitian & nutritionist.` },
//         { text:
//           `Product: "${label}"\n\n` +
//           `1) productDescription\n` +
//           `2) basicNutrients: calories, protein_g, fat_g, carbs_g\n` +
//           `3) basicUse\n` +
//           `4) If food/drink → positives, negatives, verdict\n` +
//           `5) If medicine → uses, isBeneficialForUser, medicalAlternatives\n` +
//           `6) recommendedFor, avoidFor\n` +
//           `7) alternatives (4 items)\n\n` +
//           `Return ONLY this JSON:\n` +
//           `{\n` +
//           `  "product":"${label}",\n` +
//           `  "productDescription":"",\n` +
//           `  "basicNutrients":{ "calories":0, "protein_g":0, "fat_g":0, "carbs_g":0 },\n` +
//           `  "basicUse":"",\n` +
//           `  "type":"food|drink|medicine",\n` +
//           `  "positives":[],\n` +
//           `  "negatives":[],\n` +
//           `  "verdict":"healthy|neutral|unhealthy",\n` +
//           `  "uses":[],\n` +
//           `  "isBeneficialForUser":false,\n` +
//           `  "medicalAlternatives":[],\n` +
//           `  "recommendedFor":[],\n` +
//           `  "avoidFor":[],\n` +
//           `  "alternatives":[]\n` +
//           `}`
//         }
//       ]),
//       generationConfig: { responseMimeType: 'application/json' }
//     });

//     const analysisBlock = extractJSONBlock(analysisResp.text, false) || '{}';
//     let analysis = {};
//     try {
//       analysis = JSON.parse(analysisBlock);
//     } catch {
//       analysis = { error: 'Invalid JSON', raw: analysisBlock };
//     }

//     // 6) Enrich alternatives
//     const alts = Array.isArray(analysis.alternatives) ? analysis.alternatives : [];
//     const [amazonProducts, youtubeRecipes] = await Promise.all([
//       Promise.all(alts.map(fetchTopAmazonProduct)),
//       Promise.all(alts.map(fetchTopYouTubeRecipe))
//     ]);
//     analysis.amazonProducts = amazonProducts.filter(Boolean);
//     analysis.youtubeRecipes = youtubeRecipes.filter(Boolean);

//     return res.json({ detections, analysis });
//   }
//   catch (err) {
//     console.error('[POST /api/identify] Error:', err);
//     return res.status(500).json({ error: 'Server error' });
//   }
//   finally {
//     if (req.file) fs.unlink(req.file.path, () => {});
//   }
// }


const Information = require('../models/UserInformation.js')
async function identifyImage(req, res){
  console.log("Hello ")
  console.log(req.user)
  if (req.user) {
      const u = await Information.findOne({ authId: req.user }).lean();
      if (!u) return res.status(404).json({ error: 'User not found' });
      console.log('[Middleware] User profile loaded:', u);
      req.userInfo = {
        fullName:       u.fullName,
        dob:            u.dateOfBirth,
        gender:         u.gender,
        height:         u.heightCm,
        weight:         u.weightKg,
        purpose:        u.purposes,
        allergies:      u.allergies,
        diseases:       u.diseases,
        dietPreference: u.dietPreference,
        documents:      u.documents,
      };
    }
  if (!req.file) {
    console.error('[POST /api/identify] No image file provided.');
    return res.status(400).json({ error: 'Image file is required' });
  }

  try {
    console.log('[POST /api/identify] Uploading image to Gemini Files...');
    const myFile = await ai.files.upload({
      file: path.resolve(req.file.path),
      config: { mimeType: req.file.mimetype }
    });
    console.log('[POST /api/identify] Image uploaded successfully:', myFile.uri);

    console.log('[POST /api/identify] Checking for nutrition label...');
    const checkResp = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: createUserContent([
        createPartFromUri(myFile.uri, myFile.mimeType),
        `Does this image contain a nutrition facts label + ingredient list? Answer "yes" or "no".`
      ])
    });
    const hasLabel = checkResp.text.trim().toLowerCase() === 'yes';
    console.log('[POST /api/identify] Nutrition label detected:', hasLabel);

    if (hasLabel) {
      console.log('[POST /api/identify] Extracting raw text from nutrition label...');
      const ocrResp = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: createUserContent([
          createPartFromUri(myFile.uri, myFile.mimeType),
          `Extract only the plain text of the nutrition table and ingredient list.`
        ]),
        generationConfig: { responseMimeType: 'text/plain' }
      });
      const rawLabelText = ocrResp.text.trim();
      console.log('[POST /api/identify] Raw label text extracted:', rawLabelText);

      console.log('[POST /api/identify] Analyzing nutrition label...');
      const analysisResp = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: createUserContent([
          { text: `You are an expert dietitian & nutritionist.` },
          { text:
            `User profile:\n` +
            `Name=${req.userInfo.fullName}; DOB=${req.userInfo.dob}; Gender=${req.userInfo.gender}; ` +
            `Height=${req.userInfo.height}cm; Weight=${req.userInfo.weight}kg; Goal=${req.userInfo.purpose}; ` +
            `Allergies=${req.userInfo.allergies}; Diseases=${req.userInfo.diseases}; DietPref=${req.userInfo.dietPreference}\n\n` +
            `Here is the extracted label text:\n"""${rawLabelText}"""\n\n` +
            `1) Identify the product name.\n` +
            `2) Summarize productDescription.\n` +
            `3) Provide basicNutrients: calories, protein_g, fat_g, carbs_g.\n` +
            `4) Provide basicUse (how to consume).\n` +
            `5) Give positives, negatives, verdict.\n` +
            `6) Suggest 2-3 user groups to use or avoid.\n` +
            `7) Suggest 4 alternative products.\n` +
            `Return _only_ this JSON schema:\n` +
            `{\n` +
            `  "product":"string",\n` +
            `  "productDescription":"string",\n` +
            `  "basicNutrients":{ "calories":0, "protein_g":0, "fat_g":0, "carbs_g":0 },\n` +
            `  "basicUse":"string",\n` +
            `  "positives":["..."],\n` +
            `  "negatives":["..."],\n` +
            `  "verdict":"healthy|neutral|unhealthy",\n` +
            `  "recommendedFor":["..."],\n` +
            `  "avoidFor":["..."],\n` +
            `  "alternatives":["Alt1","Alt2","Alt3","Alt4"]\n` +
            `}`
          }
        ]),
        generationConfig: { responseMimeType: 'application/json' }
      });

      const block = extractJSONBlock(analysisResp.text, false) || '{}';
      let analysis = {};
      try {
        analysis = JSON.parse(block);
        console.log('[POST /api/identify] Nutrition label analysis completed:', analysis);
      } catch (err) {
        console.error('[POST /api/identify] Failed to parse analysis JSON:', err);
        analysis = { error: 'Invalid JSON', raw: block };
      }

      // Enrich with Amazon/YouTube
      const alts = analysis.alternatives || [];
      const [amazonProducts, youtubeRecipes] = await Promise.all([
        Promise.all(alts.map(fetchTopAmazonProduct)),
        Promise.all(alts.map(fetchTopYouTubeRecipe))
      ]);
      analysis.amazonProducts = amazonProducts.filter(Boolean);
      analysis.youtubeRecipes = youtubeRecipes.filter(Boolean);

      return res.json({ rawLabelText, analysis });
    }

    console.log('[POST /api/identify] Performing object detection...');
    const detectResp = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: createUserContent([
        createPartFromUri(myFile.uri, myFile.mimeType),
        `Detect only physical food/drink/medicine items in this photo. Return _only_ a JSON array: ` +
        `[{"box_2d":[x,y,width,height],"label":"object name"}]`
      ]),
      generationConfig: { responseMimeType: 'application/json' }
    });

    const detBlock = extractJSONBlock(detectResp.text, true) || '[]';
    let detections = [];
    try {
      detections = JSON.parse(detBlock);
      console.log('[POST /api/identify] Object detection completed:', detections);
    } catch (err) {
      console.error('[POST /api/identify] Failed to parse detections JSON:', err);
      detections = [];
    }

    if (!detections.length) {
      console.warn('[POST /api/identify] No objects detected.');
      return res.status(200).json({ detections, analysis: null });
    }

    console.log('[POST /api/identify] Analyzing detected object:', detections[0].label);
    const label = detections[0].label;

    const analysisResp = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: createUserContent([
        { text: `You are a senior dietitian & nutritionist.` },
        { text:
          `User profile:\n` +
          `Name=${req.userInfo.fullName}; DOB=${req.userInfo.dob}; Gender=${req.userInfo.gender}; ` +
          `Height=${req.userInfo.height}cm; Weight=${req.userInfo.weight}kg; Goal=${req.userInfo.purpose}; ` +
          `Allergies=${req.userInfo.allergies}; Diseases=${req.userInfo.diseases}; DietPref=${req.userInfo.dietPreference}\n\n` +
          `Here is the product: "${label}"\n\n` +
          `1) Provide productDescription.\n` +
          `2) basicNutrients: calories, protein_g, fat_g, carbs_g.\n` +
          `3) basicUse (how to consume/use).\n` +
          `4) If food/drink → positives, negatives, verdict.\n` +
          `5) If medicine → uses, isBeneficialForUser, medicalAlternatives.\n` +
          `6) recommendedFor, avoidFor.\n` +
          `7) alternatives (4 items).\n` +
          `Return _only_ this JSON:\n` +
          `{\n` +
          `  "product":"${label}",\n` +
          `  "productDescription":"string",\n` +
          `  "basicNutrients":{ "calories":0, "protein_g":0, "fat_g":0, "carbs_g":0 },\n` +
          `  "basicUse":"string",\n` +
          `  "type":"food|drink|medicine",\n` +
          `  "positives":["..."],\n` +
          `  "negatives":["..."],\n` +
          `  "verdict":"healthy|neutral|unhealthy",\n` +
          `  "uses":["..."],\n` +
          `  "isBeneficialForUser":true|false,\n` +
          `  "medicalAlternatives":["..."],\n` +
          `  "recommendedFor":["..."],\n` +
          `  "avoidFor":["..."],\n` +
          `  "alternatives":["Alt1","Alt2","Alt3","Alt4"]\n` +
          `}`
        }
      ]),
      generationConfig: { responseMimeType: 'application/json' }
    });

    const analysisBlock = extractJSONBlock(analysisResp.text, false) || '{}';
    let analysis = {};
    try {
      analysis = JSON.parse(analysisBlock);
      console.log('[POST /api/identify] Object analysis completed:', analysis);
    } catch (err) {
      console.error('[POST /api/identify] Failed to parse analysis JSON:', err);
      analysis = { error: 'Invalid JSON', raw: analysisBlock };
    }

    // Enrich with Amazon/YouTube for the final alternatives
    const alts = analysis.alternatives || [];
    const [amazonProducts, youtubeRecipes] = await Promise.all([
      Promise.all(alts.map(fetchTopAmazonProduct)),
      Promise.all(alts.map(fetchTopYouTubeRecipe))
    ]);
    analysis.amazonProducts = amazonProducts.filter(Boolean);
    analysis.youtubeRecipes = youtubeRecipes.filter(Boolean);

    return res.json({ detections, analysis });
  } catch (err) {
    console.error('[POST /api/identify] Uncaught error:', err);
    return res.status(500).json({ error: 'Server error', details: err.message });
  } finally {
    if (req.file) {
      console.log('[POST /api/identify] Cleaning up uploaded file...');
      fs.unlink(req.file.path, () => {});
    }
  }
};

module.exports = { identifyImage };

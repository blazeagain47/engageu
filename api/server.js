const express = require('express');
const { OpenAI } = require('openai');
const app = express();
const port = process.env.PORT || 3000;

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.static('.'));

// Helper function to sanitize and format input
function sanitizeInput(text) {
  if (!text) return '';
  
  // Fix common typos and spelling errors
  let cleaned = text
    .trim()
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .replace(/prooceed/gi, 'proceed')
    .replace(/frorm/gi, 'from')
    .replace(/missioono/gi, 'mission')
    .replace(/comobine/gi, 'combine')
    .replace(/theirr/gi, 'their')
    .replace(/caan/gi, 'can')
    .replace(/lgoo/gi, 'logo')
    .replace(/entreprenuers/gi, 'entrepreneurs')
    .replace(/ownerrs/gi, 'owners')
    .replace(/prooducts/gi, 'products')
    .replace(/whaat/gi, 'what')
    .replace(/maakes/gi, 'makes')
    .replace(/\bi\b/g, 'I') // Capitalize standalone 'i'
    .replace(/\bai\b/gi, 'AI') // Correct 'ai' to 'AI'
    .replace(/\bsaas\b/gi, 'SaaS') // Correct 'saas' to 'SaaS'
    .replace(/\b(notion|canva)\b/gi, (match) => match.charAt(0).toUpperCase() + match.slice(1).toLowerCase()); // Capitalize product names
  
  return cleaned;
}

// Helper function to clean and structure input data
function cleanBusinessData(data) {
  const cleaned = {};
  
  // Clean and structure business type
  cleaned.businessType = sanitizeInput(data.businessType || 'Software-as-a-Service')
    .replace(/saas/i, 'Software-as-a-Service');
    
  // Clean and structure brand name  
  cleaned.brandName = sanitizeInput(data.brandName || '');
  
  // Format the target audience properly
  cleaned.targetAudience = sanitizeInput(data.targetAudience || '')
    .replace(/,/g, ' and')
    .replace(/\//g, ' and ');
    
  // Extract core concepts from mission
  cleaned.missionConcepts = data.missionStatement ? [sanitizeInput(data.missionStatement)] : [];
  
  // Extract core concepts from offerings
  cleaned.offeringConcepts = data.productsServices ? [sanitizeInput(data.productsServices)] : [];
  
  // Extract core concepts from unique value
  cleaned.uniqueConcepts = data.uniqueSelling ? [sanitizeInput(data.uniqueSelling)] : [];
  
  // Preserved for context but will be used differently
  cleaned.colorScheme = sanitizeInput(data.colorScheme || '');
  cleaned.brandStyle = sanitizeInput(data.brandStyle || 'professional');
  
  return cleaned;
}

// API endpoint to generate business kit
app.post('/api/generate-business-kit', async (req, res) => {
  try {
    const businessData = req.body;
    
    // Clean and validate input
    const cleanedData = cleanBusinessData(businessData);
    
    // Generate mission statement
    const missionResponse = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are an expert business consultant who crafts exceptional mission statements. 
          
CRITICAL RULES:
1. NEVER copy any phrases from the input
2. NEVER use the input text directly
3. NEVER start with "At [Company]" or "Our mission"
4. ALWAYS write original content
5. ALWAYS use perfect grammar and spelling
6. ALWAYS maintain professional tone

FORMAT:
- First sentence: Core value proposition
- Second sentence: How you deliver that value
- Optional third sentence: Long-term impact

FORBIDDEN PHRASES:
- "We aim to..."
- "Our mission is..."
- "We are dedicated to..."
- "We offer..."
- "We provide..."
- Any text copied from input

REQUIRED ELEMENTS:
1. Start with a powerful action verb or company name
2. Focus on transformation and impact
3. Use sophisticated business language
4. Be concise (2-3 sentences)
5. Include measurable outcomes`
        },
        {
          role: "user",
          content: `Create a powerful mission statement for a business with these attributes:

Company: ${cleanedData.brandName}
Industry: ${cleanedData.businessType}
Core Service: ${cleanedData.offerings}
Target Market: ${cleanedData.audience}

Key Points (DO NOT COPY, use only as context):
${cleanedData.missionConcepts.join('\n')}`
        }
      ],
      temperature: 0.7,
      max_tokens: 150
    });

    // Generate about us content
    const aboutUsResponse = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are an expert business writer crafting compelling "About Us" content.
          
CRITICAL RULES:
1. NEVER copy phrases from input
2. ALWAYS write original content
3. ALWAYS use perfect grammar
4. ALWAYS maintain professional tone
5. Focus on value and impact
6. Be engaging and authentic`
        },
        {
          role: "user",
          content: `Create engaging "About Us" content for:

Company: ${cleanedData.brandName}
Industry: ${cleanedData.businessType}
Target Market: ${cleanedData.audience}
Unique Value: ${cleanedData.uniqueConcepts.join(', ')}

Key Points (DO NOT COPY, use only as context):
${cleanedData.missionConcepts.join('\n')}`
        }
      ],
      temperature: 0.7,
      max_tokens: 250
    });

    // Generate Instagram post ideas
    const instagramResponse = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are a social media expert creating engaging Instagram post ideas.
          
CRITICAL RULES:
1. Create 5 unique post ideas
2. Each post must include:
   - Visual concept description
   - Engaging caption
   - Relevant hashtags
3. ALWAYS use perfect grammar
4. ALWAYS maintain brand voice
5. Focus on value and engagement`
        },
        {
          role: "user",
          content: `Create 5 Instagram post ideas for:

Company: ${cleanedData.brandName}
Industry: ${cleanedData.businessType}
Target Market: ${cleanedData.audience}
Brand Style: ${cleanedData.brandStyle}
Color Scheme: ${cleanedData.colorScheme}

Key Points (DO NOT COPY, use only as context):
${cleanedData.uniqueConcepts.join('\n')}`
        }
      ],
      temperature: 0.8,
      max_tokens: 500
    });

    // Send response
    res.json({
      missionStatement: missionResponse.choices[0].message.content,
      aboutUs: aboutUsResponse.choices[0].message.content,
      instagramPosts: instagramResponse.choices[0].message.content
    });
  } catch (error) {
    console.error('Error generating business kit:', error);
    res.status(500).json({ error: 'Failed to generate business kit' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 
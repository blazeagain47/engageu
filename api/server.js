// Generate mission statement
const missionResponse = await openai.chat.completions.create({
  model: "gpt-4",
  messages: [
    {
      role: "system",
      content: "You are an expert business consultant who crafts exceptional mission statements for Fortune 500 companies.\n\n" +
        "Essential Requirements:\n" +
        "1. Write in clear, impeccable business English\n" +
        "2. Use sophisticated, professional language\n" +
        "3. Focus on impact and value proposition\n" +
        "4. Be concise and powerful (max 2-3 sentences)\n" +
        "5. Never use generic phrases like 'we aim to' or 'we are dedicated to'\n" +
        "6. Transform all technical terms into reader-friendly language\n" +
        "7. Avoid repeating any exact phrases from the input\n" +
        "8. Create an inspiring, forward-looking statement\n\n" +
        "Structure:\n" +
        "- First sentence: Core purpose and value proposition\n" +
        "- Second sentence: How you deliver value\n" +
        "- (Optional) Third sentence: Long-term vision or impact\n\n" +
        "Tone:\n" +
        "- Confident and authoritative\n" +
        "- Professional and polished\n" +
        "- Forward-thinking and innovative\n" +
        "- Clear and direct\n\n" +
        "Bad Example (Do Not Use):\n" +
        "'We aim to provide solutions to help businesses grow...'\n\n" +
        "Good Example (Do Not Copy Directly):\n" +
        "'[Company] transforms [industry] through innovative [solution], empowering [audience] to achieve [outcome].'\n\n" +
        "Remember: Create an original, powerful statement that captures the essence of the business without using generic language."
    },
    {
      role: "user",
      content: `Create a powerful mission statement for ${cleanedData.brandName}.\n\n` +
        `Context:\n` +
        `${cleanedData.brandName} is a ${cleanedData.businessType} company that provides ${cleanedData.offerings} to ${cleanedData.targetAudience}.\n\n` +
        `Unique Value: ${cleanedData.uniqueSelling}\n\n` +
        `Additional Guidelines:\n` +
        `1. Focus on the transformative impact of the business\n` +
        `2. Emphasize innovation and technology without using technical jargon\n` +
        `3. Highlight the end benefit to customers\n` +
        `4. Keep the language sophisticated yet accessible\n` +
        `5. Avoid any grammatical errors or awkward phrasing\n\n` +
        `Key Phrases to Avoid:\n` +
        `- "We aim to..."\n` +
        `- "We are dedicated to..."\n` +
        `- "Our mission is..."\n` +
        `- "We strive to..."\n` +
        `- Any direct repetition of the input text\n\n` +
        `Instead, use powerful action verbs and focus on impact:\n` +
        `- Transforms\n` +
        `- Empowers\n` +
        `- Revolutionizes\n` +
        `- Accelerates\n` +
        `- Enables`
    }
  ],
  max_tokens: 300,
  temperature: 0.6
});

// Generate about us content
const aboutUsResponse = await openai.chat.completions.create({
  model: "gpt-4",
  messages: [
    {
      role: "system",
      content: "You are a master storyteller and brand narrative expert. Create compelling About Us content that weaves together a business's purpose, values, and unique attributes into an engaging narrative. Focus on authentic storytelling that builds emotional connections while maintaining professionalism."
    },
    {
      role: "user",
      content: `Create an engaging About Us story for a ${businessType} business. Use these elements to craft the narrative:
      Business Name: ${brandName}
      Mission: ${missionStatement}
      Target Audience: ${targetAudience}
      Offerings: ${productsServices}
      Unique Value: ${uniqueSelling}
      Brand Style: ${brandStyle}
      
      Write a compelling narrative that:
      1. Tells an authentic origin story
      2. Highlights core values and beliefs
      3. Demonstrates understanding of customer needs
      4. Showcases expertise and credibility
      5. Creates emotional resonance
      6. Maintains a ${brandStyle} tone throughout`
    }
  ],
  max_tokens: 800,
  temperature: 0.7
});

// Generate Instagram post ideas
const instagramResponse = await openai.chat.completions.create({
  model: "gpt-4",
  messages: [
    {
      role: "system",
      content: "You are a creative social media strategist specializing in Instagram content. Create engaging, platform-optimized content ideas that drive engagement and conversions. Focus on current trends, best practices, and authentic brand storytelling."
    },
    {
      role: "user",
      content: `Design 10 creative Instagram post ideas for a ${businessType} business. Consider these elements:
      Business Name: ${brandName}
      Mission: ${missionStatement}
      Target Audience: ${targetAudience}
      Offerings: ${productsServices}
      Brand Style: ${brandStyle}
      
      For each post idea:
      1. Create an attention-grabbing visual concept
      2. Write an engaging caption that encourages interaction
      3. Include relevant hashtag suggestions (mix of popular and niche)
      4. Suggest optimal posting time based on audience
      5. Add call-to-action that aligns with business goals
      
      Ensure all content:
      - Matches the ${brandStyle} brand style
      - Appeals to ${targetAudience}
      - Showcases unique value propositions
      - Encourages engagement and sharing
      - Maintains consistent brand voice`
    }
  ],
  max_tokens: 1000,
  temperature: 0.8
});

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

// Helper function to extract core concepts without exact phrasing
function extractCoreInfo(text) {
  // Clean the text first
  const cleaned = sanitizeInput(text);
  
  // Extract key phrases by breaking sentences and extracting noun phrases
  const sentences = cleaned.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const keywords = [];
  
  // Identify key business concepts, not exact phrasing
  sentences.forEach(sentence => {
    const words = sentence.split(' ').filter(w => w.length > 3);
    const significantWords = words.filter(word => 
      !['this', 'that', 'then', 'than', 'with', 'would', 'could', 'from', 'have', 'what', 'where', 'when', 'your'].includes(word.toLowerCase())
    );
    keywords.push(...significantWords);
  });
  
  // Return only unique keywords to prevent exact repetition
  return [...new Set(keywords)].slice(0, 15).join(', ');
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
    
  // Extract core concepts, not exact phrasing from mission
  cleaned.missionConcepts = extractCoreInfo(data.missionStatement || '');
  
  // Extract core concepts from offerings
  cleaned.offeringConcepts = extractCoreInfo(data.productsServices || '');
  
  // Extract core concepts from unique value
  cleaned.uniqueConcepts = extractCoreInfo(data.uniqueSelling || '');
  
  // Preserved for context but will be used differently
  cleaned.colorScheme = sanitizeInput(data.colorScheme || '');
  cleaned.brandStyle = sanitizeInput(data.brandStyle || 'professional');
  
  return cleaned;
}

app.post('/api/generate-business-kit', async (req, res) => {
  try {
    // Clean and structure the input data
    const cleanedData = cleanBusinessData(req.body);
    
    // Generate mission statement with enhanced prompt
    const missionResponse = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert business consultant who crafts exceptional mission statements for Fortune 500 companies.\n\n" +
            "Essential Requirements:\n" +
            "1. Write in clear, impeccable business English\n" +
            "2. Use sophisticated, professional language\n" +
            "3. Focus on impact and value proposition\n" +
            "4. Be concise and powerful (max 2-3 sentences)\n" +
            "5. Never use generic phrases like 'we aim to' or 'we are dedicated to'\n" +
            "6. Never repeat any keywords from the input verbatim\n" +
            "7. Use synonyms and alternative phrasing\n" +
            "8. Create an inspiring, forward-looking statement\n\n" +
            "Forbidden patterns:\n" +
            "- 'We aim to...'\n" +
            "- 'We are dedicated to...'\n" +
            "- 'Our mission is...'\n" +
            "- 'Our goal is...'\n" +
            "- 'We strive to...'\n" +
            "- 'We offer...'\n" +
            "Instead, use direct, action-oriented language focused on value and transformation."
        },
        {
          role: "user",
          content: "Create a powerful mission statement for a business with these attributes:\n\n" +
            `Company Name: ${cleanedData.brandName}\n` +
            `Industry: ${cleanedData.businessType}\n` +
            `Target Audience: ${cleanedData.targetAudience}\n\n` +
            "Key concepts (use as inspiration but DO NOT repeat verbatim):\n" +
            `${cleanedData.missionConcepts}\n\n` +
            "Type of offerings (use as inspiration but DO NOT repeat verbatim):\n" +
            `${cleanedData.offeringConcepts}\n\n` +
            "Unique aspects (use as inspiration but DO NOT repeat verbatim):\n" +
            `${cleanedData.uniqueConcepts}\n\n` +
            "Requirements:\n" +
            "1. Start with a powerful action verb or the company name\n" +
            "2. Focus on transformation and results, not features\n" +
            "3. Use completely different wording than provided\n" +
            "4. Be concise and powerful (max 2-3 sentences)\n" +
            "5. Avoid all generic business phrases"
        }
      ],
      max_tokens: 300,
      temperature: 0.6
    });

    // Validate and clean the generated mission statement
    let missionStatement = missionResponse.choices[0].message.content.trim();
    
    // Additional validation and cleaning
    const commonPhrases = [
      /we aim to/i,
      /we are dedicated/i,
      /our mission is/i,
      /our goal is/i,
      /we strive/i,
      /dedicated to providing/i,
      /we offer/i
    ];

    // If the mission statement contains any of the forbidden phrases, regenerate it
    if (commonPhrases.some(phrase => phrase.test(missionStatement))) {
      // Retry with more explicit instructions
      const retryResponse = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are rewriting a mission statement that contained forbidden generic phrases. Create a powerful, direct statement without using any passive or generic business language. Focus on impact and transformation. Your mission is to completely rewrite it using different wording."
          },
          {
            role: "user",
            content: "This mission statement uses generic phrases or repeats input text verbatim. Rewrite it completely using different wording:\n\n" +
              `Original (DO NOT copy any words from this):\n${missionStatement}\n\n` +
              "Company: " + cleanedData.brandName + "\n\n" +
              "Requirements:\n" +
              "1. Start with a strong verb or the company name\n" +
              "2. Focus on transformation and impact\n" +
              "3. Use 100% different wording than the original\n" +
              "4. Be concise (2-3 sentences)\n" +
              "5. Use sophisticated, professional language"
          }
        ],
        max_tokens: 300,
        temperature: 0.7
      });
      
      missionStatement = retryResponse.choices[0].message.content.trim();
    }

    // Final cleaning
    missionStatement = missionStatement
      .replace(/[#*`]/g, '')
      .replace(/([.!?])(\w)/g, '$1 $2')
      .replace(/\bi\b/g, 'I')
      .replace(/(^\w|[.!?]\s+\w)/g, letter => letter.toUpperCase())
      .replace(/\s+/g, ' ')
      .trim();

    // Generate about us content with improved prompt
    const aboutUsResponse = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a professional business writer creating compelling company narratives. Your writing must be grammatically perfect, use sophisticated business language, and NEVER repeat any exact wording from the input. Create original content that captures the essence without using the same phrases."
        },
        {
          role: "user",
          content: "Create a professional 'About Us' narrative for a business with these attributes:\n\n" +
            `Company Name: ${cleanedData.brandName}\n` +
            `Industry: ${cleanedData.businessType}\n` +
            `Target Audience: ${cleanedData.targetAudience}\n` +
            `Mission Statement: ${missionStatement}\n\n` +
            "Key concepts (use as inspiration but DO NOT repeat verbatim):\n" +
            `${cleanedData.missionConcepts}\n\n` +
            "Type of offerings (use as inspiration but DO NOT repeat verbatim):\n" +
            `${cleanedData.offeringConcepts}\n\n` +
            "Unique aspects (use as inspiration but DO NOT repeat verbatim):\n" +
            `${cleanedData.uniqueConcepts}\n\n` +
            "Required Sections:\n" +
            "1. Company Overview\n" +
            "2. Our Mission & Values\n" +
            "3. What Sets Us Apart\n" +
            "4. Our Commitment to Customers\n\n" +
            "Guidelines:\n" +
            "- Use completely different wording than provided\n" +
            "- Write in a professional, engaging tone\n" +
            "- Don't repeat any phrases from the input verbatim\n" +
            "- Use proper business terminology\n" +
            "- Keep paragraphs concise and well-structured"
        }
      ],
      max_tokens: 800,
      temperature: 0.7
    });

    // Generate Instagram post ideas with improved prompt
    const instagramIdeasResponse = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a professional social media strategist creating high-quality content plans. Your content must use perfect grammar, sophisticated language, and NEVER repeat any exact wording from the input. Create fresh, original content that captures the essence without copying phrases."
        },
        {
          role: "user",
          content: "Create a professional Instagram content strategy for a business with these attributes:\n\n" +
            `Company Name: ${cleanedData.brandName}\n` +
            `Industry: ${cleanedData.businessType}\n` +
            `Target Audience: ${cleanedData.targetAudience}\n` +
            `Mission Statement: ${missionStatement}\n\n` +
            "Key concepts (use as inspiration but DO NOT repeat verbatim):\n" +
            `${cleanedData.missionConcepts}\n\n` +
            "Type of offerings (use as inspiration but DO NOT repeat verbatim):\n" +
            `${cleanedData.offeringConcepts}\n\n` +
            "Unique aspects (use as inspiration but DO NOT repeat verbatim):\n" +
            `${cleanedData.uniqueConcepts}\n\n` +
            "For each post concept:\n" +
            "1. Write a professional, error-free caption\n" +
            "2. Include strategic hashtag suggestions\n" +
            "3. Suggest optimal posting time\n" +
            "4. Add a clear call-to-action\n\n" +
            "Guidelines:\n" +
            "- Use completely different wording than provided\n" +
            "- Maintain professional language throughout\n" +
            "- Don't repeat any phrases from the input verbatim\n" +
            "- Create engaging yet polished content\n" +
            "- Focus on value-driven messaging"
        }
      ],
      max_tokens: 1000,
      temperature: 0.7
    });

    // Return all generated content
    res.json({
      success: true,
      data: {
        missionStatement: missionStatement,
        aboutUs: aboutUsResponse.choices[0].message.content,
        instagramIdeas: instagramIdeasResponse.choices[0].message.content
      }
    });

  } catch (error) {
    console.error('Error generating business kit:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate business kit',
      error: error.message
    });
  }
}); 
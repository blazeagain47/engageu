// ======== ENGAGEAI.JS ========

document.addEventListener('DOMContentLoaded', function() {
    // Initialize step navigation
    initStepNavigation();
    
    // Initialize name generator
    initNameGenerator();
    
    // Initialize business type selection
    initBusinessTypeSelection();
    
    // Initialize generate button
    initGenerateButton();
    
    // Initialize copy buttons
    initCopyButtons();
    
    // Initialize download buttons
    initDownloadButtons();
    
    // Initialize pricing buttons
    initPricingButtons();
  });
  
  // Step Navigation Function
  function initStepNavigation() {
    const nextButtons = document.querySelectorAll('.next-step');
    const prevButtons = document.querySelectorAll('.prev-step');
    const stepIndicators = document.querySelectorAll('.step');
    
    // Next button click handler
    nextButtons.forEach(button => {
      button.addEventListener('click', function() {
        const currentStep = document.querySelector('.step-panel.active');
        const currentStepNum = parseInt(currentStep.id.replace('step', ''));
        const nextStepNum = parseInt(this.getAttribute('data-next'));
        
        // Validate current step before proceeding
        if (validateStep(currentStepNum)) {
          // Hide current step
          currentStep.classList.remove('active');
          
          // Show next step
          document.getElementById(`step${nextStepNum}`).classList.add('active');
          
          // Update step indicators
          updateStepIndicators(nextStepNum);
        }
      });
    });
    
    // Previous button click handler
    prevButtons.forEach(button => {
      button.addEventListener('click', function() {
        const currentStep = document.querySelector('.step-panel.active');
        const currentStepNum = parseInt(currentStep.id.replace('step', ''));
        const prevStepNum = parseInt(this.getAttribute('data-prev'));
        
        // Hide current step
        currentStep.classList.remove('active');
        
        // Show previous step
        document.getElementById(`step${prevStepNum}`).classList.add('active');
        
        // Update step indicators
        updateStepIndicators(prevStepNum);
      });
    });
    
    // Function to update step indicators
    function updateStepIndicators(activeStep) {
      stepIndicators.forEach(indicator => {
        const stepNum = parseInt(indicator.getAttribute('data-step'));
        
        // Remove existing classes
        indicator.classList.remove('active', 'completed');
        
        // Add appropriate class
        if (stepNum === activeStep) {
          indicator.classList.add('active');
        } else if (stepNum < activeStep) {
          indicator.classList.add('completed');
        }
      });
    }
  }
  
  // Validate step inputs
  function validateStep(stepNum) {
    switch(stepNum) {
      case 1:
        const brandName = document.getElementById('brandName').value.trim();
        if (!brandName) {
          alert('Please enter a brand name');
          return false;
        }
        return true;
        
      case 2:
        const businessType = document.getElementById('businessType').value;
        if (!businessType) {
          alert('Please select a business type');
          return false;
        }
        if (businessType === 'other') {
          const otherType = document.getElementById('otherType').value.trim();
          if (!otherType) {
            alert('Please specify your business type');
            return false;
          }
        }
        return true;
        
      case 3:
        const missionStatement = document.getElementById('missionStatement').value.trim();
        const targetAudience = document.getElementById('targetAudience').value.trim();
        if (!missionStatement) {
          alert('Please enter your business mission or goal');
          return false;
        }
        if (!targetAudience) {
          alert('Please describe your target audience');
          return false;
        }
        return true;
        
      case 4:
        const productsServices = document.getElementById('productsServices').value.trim();
        if (!productsServices) {
          alert('Please enter your products or services');
          return false;
        }
        return true;
        
      default:
        return true;
    }
  }
  
  // Initialize name generator
  function initNameGenerator() {
    const generateNameBtn = document.getElementById('generateNameBtn');
    const brandNameInput = document.getElementById('brandName');
    const nameContainer = document.getElementById('generatedNames');
    
    generateNameBtn.addEventListener('click', function() {
      // Show loading state
      generateNameBtn.disabled = true;
      nameContainer.innerHTML = '<p>Generating names...</p>';
      
      // In a real implementation, this would call OpenAI API
      // For now, we'll simulate with a timeout and sample names
      setTimeout(() => {
        // Sample business name generator (replace with API call)
        const industries = [
          'Tech', 'Health', 'Eco', 'Smart', 'Next', 'Peak', 'Vital', 
          'Epic', 'Zen', 'Pure', 'Flow', 'Bold', 'Nova', 'Wave', 'Bright'
        ];
        
        const suffixes = [
          'Hub', 'Labs', 'Link', 'Spark', 'Mind', 'Core', 'Shift', 
          'Pulse', 'Edge', 'Path', 'Force', 'Logic', 'Boost', 'Craft', 'Zone'
        ];
        
        // Generate 6 random name combinations
        const names = [];
        for (let i = 0; i < 6; i++) {
          const prefix = industries[Math.floor(Math.random() * industries.length)];
          const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
          names.push(prefix + suffix);
        }
        
        // Display the generated names
        nameContainer.innerHTML = '';
        names.forEach(name => {
          const nameDiv = document.createElement('div');
          nameDiv.className = 'name-suggestion';
          nameDiv.textContent = name;
          nameDiv.addEventListener('click', function() {
            brandNameInput.value = name;
          });
          nameContainer.appendChild(nameDiv);
        });
        
        generateNameBtn.disabled = false;
      }, 1000);
    });
  }
  
  // Initialize business type selection
  function initBusinessTypeSelection() {
    const businessTypeSelect = document.getElementById('businessType');
    const otherTypeGroup = document.getElementById('otherTypeGroup');
    
    businessTypeSelect.addEventListener('change', function() {
      if (this.value === 'other') {
        otherTypeGroup.style.display = 'block';
      } else {
        otherTypeGroup.style.display = 'none';
      }
    });
  }
  
  // Initialize generate button
  function initGenerateButton() {
    const generateBtn = document.getElementById('generateBtn');
    const resultsSection = document.getElementById('results');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const resultsContent = document.getElementById('resultsContent');
    
    generateBtn.addEventListener('click', function() {
      // Validate final step
      if (!validateStep(5)) return;
      
      // Collect all form data
      const businessData = {
        name: document.getElementById('brandName').value.trim(),
        type: document.getElementById('businessType').value,
        mission: document.getElementById('missionStatement').value.trim(),
        audience: document.getElementById('targetAudience').value.trim(),
        offerings: document.getElementById('productsServices').value.trim(),
        uniqueSelling: document.getElementById('uniqueSelling').value.trim(),
        colorScheme: document.getElementById('colorScheme').value,
        brandStyle: document.getElementById('brandStyle').value,
        additionalInfo: document.getElementById('additionalInfo').value.trim()
      };
      
      // If business type is "other", use the specified value
      if (businessData.type === 'other') {
        businessData.type = document.getElementById('otherType').value.trim();
      }
      
      // Show results section with loading spinner
      resultsSection.style.display = 'block';
      loadingSpinner.style.display = 'flex';
      resultsContent.style.display = 'none';
      
      // Scroll to results section
      resultsSection.scrollIntoView({ behavior: 'smooth' });
      
      // In a real implementation, this would call your backend API
      // For now, we'll simulate with a timeout
      setTimeout(() => {
        // Generate placeholder results
        generatePlaceholderResults(businessData);
        
        // Hide loading spinner and show results
        loadingSpinner.style.display = 'none';
        resultsContent.style.display = 'block';
      }, 3000);
    });
  }
  
// ✅ NEW: Helper function to format mission statement
function formatMissionStatement(data) {
  // The mission statement will now come directly from the AI response
  // Just ensure proper display with some light formatting
  const missionText = data.missionStatement || 'Mission statement not available';
  return missionText.trim().replace(/\n{3,}/g, '\n\n');
}

// ✅ NEW: Helper function to format About Us content
function formatAboutUs(data) {
  // The about us content will now come directly from the AI response
  // Add section headers and format for readability
  const aboutText = data.aboutUs || 'About Us content not available';
  return aboutText.trim()
    .replace(/\n{3,}/g, '\n\n')
    .replace(/##\s/g, '### ') // Ensure consistent header hierarchy
    .replace(/\*\*/g, ''); // Remove bold markdown as we'll style with CSS
}

// ✅ NEW: Helper function to format Instagram ideas
function formatInstagramIdeas(data) {
  // The Instagram ideas will now come directly from the AI response
  // Just ensure proper display formatting and emoji consistency
  const ideasText = data.instagramIdeas || 'Instagram content ideas not available';
  return ideasText.trim()
    .replace(/\n{3,}/g, '\n\n')
    .replace(/##\s/g, '### ') // Ensure consistent header hierarchy
    .replace(/(\d+\.\s)/g, '📱 $1'); // Add emoji to numbered lists
}

function generatePlaceholderResults(businessData) {
  // Generate logo
  generatePlaceholderLogo(businessData);
  
  // Make API call to generate content
  fetch('/api/generate-business-kit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(businessData)
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      // Format and display AI-generated content
      document.getElementById('missionResult').innerHTML = formatMissionStatement({
        missionStatement: data.data.missionStatement
      });
      document.getElementById('aboutUsResult').innerHTML = formatAboutUs({
        aboutUs: data.data.aboutUs
      });
      document.getElementById('instagramIdeasResult').innerHTML = formatInstagramIdeas({
        instagramIdeas: data.data.instagramIdeas
      });
      
      // Generate website code template
      document.getElementById('websiteCodeResult').querySelector('code').textContent = generatePlaceholderWebsiteCode(businessData);
    } else {
      throw new Error('Failed to generate content');
    }
  })
  .catch(error => {
    console.error('Error:', error);
    // Show fallback content if API call fails
    document.getElementById('missionResult').innerHTML = generatePlaceholderMission(businessData);
    document.getElementById('aboutUsResult').innerHTML = generatePlaceholderAboutUs(businessData);
    document.getElementById('instagramIdeasResult').innerHTML = generatePlaceholderInstagramIdeas(businessData);
    document.getElementById('websiteCodeResult').querySelector('code').textContent = generatePlaceholderWebsiteCode(businessData);
  });
}

// Update CSS styles for better content presentation
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  .content-box {
    background: #ffffff;
    border-radius: 8px;
    padding: 20px;
    margin: 15px 0;
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    color: #333333;
  }
  
  .content-box h2, .content-box h3 {
    color: #2c3e50;
    margin-bottom: 15px;
    font-size: 1.25rem;
  }
  
  .content-box p {
    color: #34495e;
    line-height: 1.6;
    margin-bottom: 10px;
  }
  
  .content-box ul, .content-box ol {
    padding-left: 20px;
    margin: 10px 0;
    color: #34495e;
  }
  
  .content-box li {
    margin-bottom: 8px;
    line-height: 1.5;
  }
  
  .instagram-post {
    border-left: 4px solid #00b4d8;
    padding-left: 15px;
    margin: 15px 0;
  }
  
  .hashtags {
    color: #00b4d8;
    font-size: 0.9em;
    margin-top: 5px;
  }
  
  .post-time {
    color: #6c757d;
    font-size: 0.85em;
    font-style: italic;
  }
  
  #missionResult, #aboutUsResult, #instagramIdeasResult {
    color: #333333;
    background: #ffffff;
    padding: 15px;
    border-radius: 6px;
    min-height: 50px;
  }
  
  .copy-btn {
    margin-top: 10px;
    padding: 8px 16px;
    background-color: #00b4d8;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  
  .copy-btn:hover {
    background-color: #0077b6;
  }
`;
document.head.appendChild(styleSheet);
  
  // Generate placeholder logo (to be replaced with DALL-E API)
  function generatePlaceholderLogo(businessData) {
    // Get color scheme and style preferences
    const colorScheme = businessData.colorScheme;
    const style = businessData.brandStyle;
    
    // Create a placeholder SVG logo
    const logoColors = {
      blue: ['#0077B6', '#00B4D8'],
      green: ['#2D6A4F', '#40916C'],
      red: ['#D00000', '#E85D04'],
      purple: ['#7209B7', '#B5179E'],
      orange: ['#FF9500', '#FF6000'],
      neutral: ['#463F3A', '#8A817C'],
      colorful: ['#FF9500', '#3A86FF']
    };
    
    const colors = logoColors[colorScheme] || logoColors.blue;
    
    // Generate a simple SVG based on business name initial
    const initial = businessData.name.charAt(0).toUpperCase();
    
    const logoSvg = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
        <defs>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="${colors[0]}" />
            <stop offset="100%" stop-color="${colors[1]}" />
          </linearGradient>
        </defs>
        <circle cx="100" cy="100" r="90" fill="url(#logoGradient)" />
        <text x="100" y="100" fill="white" font-family="Arial, sans-serif" font-size="100"
          font-weight="bold" text-anchor="middle" dominant-baseline="central">${initial}</text>
        <text x="100" y="150" fill="white" font-family="Arial, sans-serif" font-size="25"
          font-weight="bold" text-anchor="middle">${businessData.name}</text>
      </svg>
    `;
    
    // Insert the SVG into the logo container
    const logoContainer = document.getElementById('logoContainer');
    logoContainer.innerHTML = logoSvg;
  }
  
  // Generate placeholder mission statement
  function generatePlaceholderMission(businessData) {
    return `At ${businessData.name}, our mission is to ${businessData.mission.toLowerCase()}. 
    
  We are dedicated to providing exceptional ${businessData.type} solutions that address the unique needs of ${businessData.audience}. Our commitment to quality, innovation, and customer satisfaction drives everything we do.
  
  Our vision is to become the leading provider of ${businessData.offerings.toLowerCase()} in the industry, setting new standards for excellence and creating lasting value for our customers and stakeholders.`;
  }
  
  // Generate placeholder about us
  function generatePlaceholderAboutUs(businessData) {
    return `# About ${businessData.name}
  
  Founded with a passion for ${businessData.mission.toLowerCase()}, ${businessData.name} is a ${businessData.type} business dedicated to serving ${businessData.audience}.
  
  ## Our Story
  
  ${businessData.name} was born from a simple idea: ${businessData.mission}. We recognized a gap in the market and set out to create solutions that would truly make a difference for our customers.
  
  ## What We Offer
  
  We specialize in providing ${businessData.offerings}. What sets us apart is our ${businessData.uniqueSelling}.
  
  ## Our Approach
  
  We believe in building lasting relationships with our customers through transparency, integrity, and exceptional service. Every product and service we offer is designed with our customers' needs in mind.
  
  ## Join Us
  
  We invite you to experience the ${businessData.name} difference and see how we can help you achieve your goals.`;
  }
  
  // Generate placeholder Instagram ideas
  function generatePlaceholderInstagramIdeas(businessData) {
    return `# Instagram Content Ideas for ${businessData.name}
  
  ## Product Showcases
  1. Close-up shots of your ${businessData.offerings.split(',')[0] || 'products'} with detailed captions about features and benefits
  2. "How It's Made" series showing behind-the-scenes of your creation process
  3. Customer testimonials paired with product images
  
  ## Educational Content
  1. "Did You Know?" posts about interesting facts in your industry
  2. Tutorial videos showing how to use your products
  3. Infographics about trends in the ${businessData.type} industry
  
  ## Brand Story Content
  1. Founder's journey post sharing why you started ${businessData.name}
  2. Team spotlights introducing the people behind your brand
  3. "Our Values" post highlighting ${businessData.mission}
  
  ## Engagement Posts
  1. Questions about what your ${businessData.audience} struggle with
  2. Polls about preferences related to your offerings
  3. "Caption this" contests with your product images
  
  ## Seasonal/Timely Content
  1. Holiday gift guides featuring your products
  2. Special occasion promotions (birthdays, anniversaries, holidays)
  3. Industry event coverage or participation posts`;
  }
  
  // Generate placeholder website code
  function generatePlaceholderWebsiteCode(businessData) {
    return `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${businessData.name} - ${businessData.type}</title>
    <style>
      /* Basic styles for ${businessData.name} */
      :root {
        /* Color scheme based on ${businessData.colorScheme} preference */
        --primary-color: #0077B6;
        --secondary-color: #00B4D8;
        --text-color: #333;
        --background-color: #fff;
        --accent-color: #90E0EF;
      }
      
      body {
        font-family: 'Arial', sans-serif;
        line-height: 1.6;
        color: var(--text-color);
        margin: 0;
        padding: 0;
      }
      
      header {
        background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
        color: white;
        padding: 2rem 0;
        text-align: center;
      }
      
      .logo {
        font-size: 2.5rem;
        font-weight: bold;
        margin-bottom: 1rem;
      }
      
      nav {
        background-color: rgba(255, 255, 255, 0.1);
        padding: 1rem 0;
      }
      
      nav ul {
        list-style: none;
        display: flex;
        justify-content: center;
        gap: 2rem;
        margin: 0;
        padding: 0;
      }
      
      nav a {
        color: white;
        text-decoration: none;
        font-weight: bold;
      }
      
      section {
        padding: 4rem 2rem;
        max-width: 1200px;
        margin: 0 auto;
      }
      
      .hero {
        text-align: center;
      }
      
      .hero h1 {
        font-size: 2.5rem;
        margin-bottom: 1rem;
      }
      
      .btn {
        display: inline-block;
        background-color: var(--primary-color);
        color: white;
        padding: 0.75rem 1.5rem;
        border-radius: 30px;
        text-decoration: none;
        font-weight: bold;
        transition: all 0.3s ease;
      }
      
      .btn:hover {
        background-color: var(--secondary-color);
        transform: translateY(-3px);
      }
      
      .features {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 2rem;
        margin-top: 3rem;
      }
      
      .feature-card {
        background-color: rgba(144, 224, 239, 0.1);
        border-radius: 8px;
        padding: 2rem;
        text-align: center;
      }
      
      .feature-icon {
        font-size: 2.5rem;
        color: var(--primary-color);
        margin-bottom: 1rem;
      }
      
      footer {
        background-color: #333;
        color: white;
        text-align: center;
        padding: 2rem;
        margin-top: 4rem;
      }
    </style>
  </head>
  <body>
    <!-- Header -->
    <header>
      <div class="logo">${businessData.name}</div>
      <nav>
        <ul>
          <li><a href="#home">Home</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#services">Services</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
      </nav>
    </header>
    
    <!-- Hero Section -->
    <section id="home" class="hero">
      <h1>Welcome to ${businessData.name}</h1>
      <p>${businessData.mission}</p>
      <a href="#contact" class="btn">Get Started</a>
    </section>
    
    <!-- About Section -->
    <section id="about">
      <h2>About Us</h2>
      <p>${businessData.name} is a ${businessData.type} business dedicated to ${businessData.mission.toLowerCase()}.</p>
      <p>We focus on serving ${businessData.audience} with innovative solutions that address their specific needs.</p>
      <p>What makes us unique: ${businessData.uniqueSelling}</p>
    </section>
    
    <!-- Services Section -->
    <section id="services">
      <h2>Our Offerings</h2>
      <p>We provide exceptional solutions tailored to your needs.</p>
      
      <div class="features">
        <!-- Feature cards would be dynamically generated based on offerings -->
        <div class="feature-card">
          <div class="feature-icon">★</div>
          <h3>Quality Service</h3>
          <p>We are committed to delivering the highest quality in everything we do.</p>
        </div>
        
        <div class="feature-card">
          <div class="feature-icon">♦</div>
          <h3>Innovation</h3>
          <p>We constantly seek new ways to improve and innovate in our field.</p>
        </div>
        
        <div class="feature-card">
          <div class="feature-icon">♥</div>
          <h3>Customer Focus</h3>
          <p>Your satisfaction is our top priority. We're here to serve you.</p>
        </div>
      </div>
    </section>
    
    <!-- Contact Section -->
    <section id="contact">
      <h2>Contact Us</h2>
      <p>Ready to get started? Reach out to us today!</p>
      
      <form>
        <div>
          <label for="name">Name</label>
          <input type="text" id="name" required>
        </div>
        
        <div>
          <label for="email">Email</label>
          <input type="email" id="email" required>
        </div>
        
        <div>
          <label for="message">Message</label>
          <textarea id="message" rows="5" required></textarea>
        </div>
        
        <button type="submit" class="btn">Send Message</button>
      </form>
    </section>
    
    <!-- Footer -->
    <footer>
      <p>&copy; 2025 ${businessData.name}. All rights reserved.</p>
    </footer>
  </body>
  </html>`;
  }
  
  // Initialize copy buttons
  function initCopyButtons() {
    const copyButtons = document.querySelectorAll('.copy-btn');
    
    copyButtons.forEach(button => {
      button.addEventListener('click', function() {
        const targetId = this.getAttribute('data-copy');
        const content = document.getElementById(targetId).textContent;
        
        // Copy to clipboard
        navigator.clipboard.writeText(content)
          .then(() => {
            // Temporarily change button text to indicate success
            const originalText = this.textContent;
            this.textContent = 'Copied!';
            
            setTimeout(() => {
              this.textContent = originalText;
            }, 2000);
          })
          .catch(err => {
            console.error('Failed to copy: ', err);
            alert('Failed to copy content to clipboard');
          });
      });
    });
  }
  
  // Initialize download buttons
  function initDownloadButtons() {
    // Logo download button
    const downloadLogoBtn = document.getElementById('downloadLogoBtn');
    if (downloadLogoBtn) {
      downloadLogoBtn.addEventListener('click', function() {
        // Get the SVG content
        const svgContent = document.getElementById('logoContainer').innerHTML;
        
        // Create a Blob from the SVG
        const blob = new Blob([svgContent], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        
        // Create a link and trigger download
        const a = document.createElement('a');
        a.href = url;
        a.download = 'logo.svg';
        document.body.appendChild(a);
        a.click();
        
        // Clean up
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      });
    }
    
    // Code download button
    const downloadCodeBtn = document.getElementById('downloadCodeBtn');
    if (downloadCodeBtn) {
      downloadCodeBtn.addEventListener('click', function() {
        // Get the HTML content
        const htmlContent = document.getElementById('websiteCodeResult').querySelector('code').textContent;
        
        // Create a Blob from the HTML
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        
        // Create a link and trigger download
        const a = document.createElement('a');
        a.href = url;
        a.download = 'website.html';
        document.body.appendChild(a);
        a.click();
        
        // Clean up
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      });
    }
  }
  
  // Initialize pricing buttons
  function initPricingButtons() {
    const pricingButtons = document.querySelectorAll('.pricing-btn');
    
    pricingButtons.forEach(button => {
      button.addEventListener('click', function() {
        const packageType = this.getAttribute('data-package');
        
        // In a real implementation, this would redirect to checkout
        // For now, we'll show an alert
        alert(`Thank you for selecting the ${packageType} package! In the final implementation, this would take you to a checkout page to complete your purchase.`);
      });
    });
  }
  
  // Function to be used when integrating with OpenAI API
  // Note: This requires a backend service to handle API keys securely
  async function callOpenAI(prompt, endpoint) {
    try {
      // This would be a call to your backend service, which would then call OpenAI
      const response = await fetch('/api/openai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt, endpoint }),
      });
      
      if (!response.ok) {
        throw new Error('API request failed');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error calling OpenAI:', error);
      return null;
    }
  }

// Add input validation and confirmation modal functionality
function validateAndCleanInput(businessData) {
  // Helper function to clean text
  function cleanText(text) {
    if (!text) return '';
    
    return text
      .trim()
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .replace(/prooceed|poroceed/gi, 'proceed')
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
      .replace(/ifnromation/gi, 'information')
      .replace(/displaayaed/gi, 'displayed')
      .replace(/taaken/gi, 'taken')
      .replace(/wwith/gi, 'with')
      .replace(/thaat/gi, 'that')
      .replace(/aaddition/gi, 'addition')
      .replace(/arae/gi, 'are')
      .replace(/\bi\b/g, 'I')
      .replace(/\bai\b/gi, 'AI')
      .replace(/\bsaas\b/gi, 'SaaS')
      .replace(/([.!?])\s*(\w)/g, (_, p1, p2) => `${p1} ${p2.toUpperCase()}`) // Capitalize after periods
      .replace(/\b(notion|canva)\b/gi, (match) => match.charAt(0).toUpperCase() + match.slice(1).toLowerCase()); // Capitalize product names
  }
  
  // Fix grammar in business mission
  function fixGrammar(text) {
    if (!text) return '';
    
    return text
      // Fix common grammar issues
      .replace(/\s+([,.!?;:])/g, '$1') // Remove space before punctuation
      .replace(/([,.!?;:])(?=[a-zA-Z])/g, '$1 ') // Add space after punctuation
      .replace(/\s+/g, ' ') // Normalize spaces
      .replace(/\bi\s/g, 'I ') // Capitalize standalone I
      .replace(/\ba\s+([aeiou])/gi, 'an $1') // Fix a/an usage
      .replace(/(?:^|[.!?]\s+)([a-z])/g, match => match.toUpperCase()) // Capitalize sentences
      .trim();
  }
  
  // Create a cleaned version of the business data
  const cleanedData = {};
  
  // Clean each field
  cleanedData.name = cleanText(businessData.name);
  cleanedData.type = cleanText(businessData.type);
  cleanedData.mission = fixGrammar(cleanText(businessData.mission));
  cleanedData.audience = cleanText(businessData.audience);
  cleanedData.offerings = fixGrammar(cleanText(businessData.offerings));
  cleanedData.uniqueSelling = fixGrammar(cleanText(businessData.uniqueSelling));
  cleanedData.colorScheme = cleanText(businessData.colorScheme);
  cleanedData.brandStyle = cleanText(businessData.brandStyle);
  
  return cleanedData;
}

// Create the confirmation modal with the cleaned input
function showInputConfirmation(originalData, cleanedData) {
  // Create modal container if it doesn't exist
  let modal = document.getElementById('confirmationModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'confirmationModal';
    modal.className = 'modal';
    document.body.appendChild(modal);
  }
  
  // Populate the modal with comparison content
  modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h2>Confirm Your Information</h2>
        <p>We've cleaned up your input for better results. Please review the changes and confirm.</p>
      </div>
      <div class="modal-body">
        <div class="comparison-table">
          <div class="comparison-row header">
            <div class="field-name">Field</div>
            <div class="original-value">Your Input</div>
            <div class="cleaned-value">Cleaned Version</div>
          </div>
          <div class="comparison-row">
            <div class="field-name">Brand Name</div>
            <div class="original-value">${originalData.name}</div>
            <div class="cleaned-value">${cleanedData.name}</div>
          </div>
          <div class="comparison-row">
            <div class="field-name">Business Type</div>
            <div class="original-value">${originalData.type}</div>
            <div class="cleaned-value">${cleanedData.type}</div>
          </div>
          <div class="comparison-row">
            <div class="field-name">Mission/Goals</div>
            <div class="original-value">${originalData.mission}</div>
            <div class="cleaned-value">${cleanedData.mission}</div>
          </div>
          <div class="comparison-row">
            <div class="field-name">Target Audience</div>
            <div class="original-value">${originalData.audience}</div>
            <div class="cleaned-value">${cleanedData.audience}</div>
          </div>
          <div class="comparison-row">
            <div class="field-name">Products/Services</div>
            <div class="original-value">${originalData.offerings}</div>
            <div class="cleaned-value">${cleanedData.offerings}</div>
          </div>
          <div class="comparison-row">
            <div class="field-name">Unique Selling Points</div>
            <div class="original-value">${originalData.uniqueSelling}</div>
            <div class="cleaned-value">${cleanedData.uniqueSelling}</div>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button id="editAgainBtn" class="btn-secondary">Edit Again</button>
        <button id="confirmBtn" class="btn-cta">Proceed with Cleaned Version</button>
      </div>
    </div>
  `;
  
  // Add styles for the modal
  const modalStyles = document.createElement('style');
  modalStyles.textContent = `
    .modal {
      display: block;
      position: fixed;
      z-index: 1000;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.7);
      overflow: auto;
    }
    
    .modal-content {
      background-color: #232323;
      margin: 5% auto;
      padding: 20px;
      border-radius: 10px;
      width: 80%;
      max-width: 900px;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
      color: #f8f9fa;
    }
    
    .modal-header {
      padding-bottom: 15px;
      border-bottom: 1px solid #444;
    }
    
    .modal-header h2 {
      color: #00b4d8;
      margin-bottom: 10px;
    }
    
    .modal-body {
      padding: 20px 0;
      max-height: 60vh;
      overflow-y: auto;
    }
    
    .comparison-table {
      width: 100%;
      border-collapse: collapse;
    }
    
    .comparison-row {
      display: grid;
      grid-template-columns: 1fr 2fr 2fr;
      padding: 10px 0;
      border-bottom: 1px solid #444;
    }
    
    .comparison-row.header {
      font-weight: bold;
      background-color: #333;
      padding: 15px 0;
      border-radius: 5px 5px 0 0;
    }
    
    .field-name {
      padding: 0 10px;
      font-weight: bold;
      color: #00b4d8;
    }
    
    .original-value {
      padding: 0 10px;
      color: #aaa;
      max-height: 150px;
      overflow-y: auto;
    }
    
    .cleaned-value {
      padding: 0 10px;
      color: #fff;
      background-color: #2c3e50;
      border-radius: 4px;
      max-height: 150px;
      overflow-y: auto;
    }
    
    .modal-footer {
      padding-top: 20px;
      display: flex;
      justify-content: flex-end;
      gap: 15px;
    }
    
    .btn-secondary {
      padding: 10px 20px;
      background-color: #6c757d;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
    }
    
    .btn-secondary:hover {
      background-color: #5a6268;
    }
  `;
  document.head.appendChild(modalStyles);
  
  // Show the modal
  modal.style.display = 'block';
  
  // Add event listeners
  document.getElementById('editAgainBtn').addEventListener('click', function() {
    modal.style.display = 'none';
  });
  
  document.getElementById('confirmBtn').addEventListener('click', function() {
    modal.style.display = 'none';
    // Use the cleaned data to generate results
    generateResults(cleanedData);
  });
}

// Modify the submission process to include validation
function submitBusinessForm() {
  // Get all the business data from the form
  const businessData = {
    name: document.getElementById('brandName').value,
    type: document.getElementById('businessType').value,
    mission: document.getElementById('missionStatement').value,
    audience: document.getElementById('targetAudience').value,
    offerings: document.getElementById('productsServices').value,
    uniqueSelling: document.getElementById('uniqueSelling').value,
    colorScheme: document.getElementById('colorScheme').value,
    brandStyle: document.getElementById('brandStyle').value
  };
  
  // Save original data and create cleaned version
  const cleanedData = validateAndCleanInput(businessData);
  
  // Show confirmation modal with both versions
  showInputConfirmation(businessData, cleanedData);
}

// This function will be called after user confirms the cleaned data
function generateResults(businessData) {
  // Show loading indicator
  const loadingIndicator = document.createElement('div');
  loadingIndicator.id = 'loadingIndicator';
  loadingIndicator.innerHTML = `
    <div class="loading-spinner"></div>
    <p>Generating your business starter kit...</p>
  `;
  document.getElementById('resultsContainer').appendChild(loadingIndicator);
  
  // Generate logo
  generatePlaceholderLogo(businessData);
  
  // Make API call to generate content
  fetch('/api/generate-business-kit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      brandName: businessData.name,
      businessType: businessData.type,
      missionStatement: businessData.mission,
      targetAudience: businessData.audience,
      productsServices: businessData.offerings,
      uniqueSelling: businessData.uniqueSelling,
      colorScheme: businessData.colorScheme,
      brandStyle: businessData.brandStyle
    })
  })
  .then(response => response.json())
  .then(data => {
    // Remove loading indicator
    document.getElementById('loadingIndicator').remove();
    
    if (data.success) {
      // Format and display AI-generated content
      document.getElementById('missionResult').innerHTML = formatMissionStatement({
        missionStatement: data.data.missionStatement
      });
      document.getElementById('aboutUsResult').innerHTML = formatAboutUs({
        aboutUs: data.data.aboutUs
      });
      document.getElementById('instagramIdeasResult').innerHTML = formatInstagramIdeas({
        instagramIdeas: data.data.instagramIdeas
      });
      
      // Generate website code template
      document.getElementById('websiteCodeResult').querySelector('code').textContent = generatePlaceholderWebsiteCode(businessData);
    } else {
      throw new Error('Failed to generate content');
    }
  })
  .catch(error => {
    console.error('Error:', error);
    // Remove loading indicator
    if (document.getElementById('loadingIndicator')) {
      document.getElementById('loadingIndicator').remove();
    }
    
    // Show error message
    const errorMsg = document.createElement('div');
    errorMsg.className = 'error-message';
    errorMsg.textContent = 'Failed to generate content. Please try again.';
    document.getElementById('resultsContainer').appendChild(errorMsg);
    
    // Show fallback content
    document.getElementById('missionResult').innerHTML = generatePlaceholderMission(businessData);
    document.getElementById('aboutUsResult').innerHTML = generatePlaceholderAboutUs(businessData);
    document.getElementById('instagramIdeasResult').innerHTML = generatePlaceholderInstagramIdeas(businessData);
    document.getElementById('websiteCodeResult').querySelector('code').textContent = generatePlaceholderWebsiteCode(businessData);
  });
  
  // Show results section
  document.querySelector('.results-section').style.display = 'block';
  document.getElementById('resultsContainer').scrollIntoView({ behavior: 'smooth' });
}

// Add loading spinner styles
const spinnerStyles = document.createElement('style');
spinnerStyles.textContent = `
  #loadingIndicator {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 30px;
    background-color: #2c3e50;
    border-radius: 10px;
    margin: 20px 0;
  }
  
  .loading-spinner {
    width: 50px;
    height: 50px;
    border: 5px solid rgba(0, 180, 216, 0.2);
    border-top: 5px solid #00b4d8;
    border-radius: 50%;
    animation: spin 1.5s linear infinite;
    margin-bottom: 15px;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  .error-message {
    background-color: rgba(220, 53, 69, 0.2);
    color: #dc3545;
    padding: 15px;
    border-radius: 5px;
    margin: 20px 0;
    text-align: center;
  }
`;
document.head.appendChild(spinnerStyles);

// Update event listeners for the final step button
document.addEventListener('DOMContentLoaded', function() {
  // Set up existing event listeners
  
  // Replace form submission logic to use validation
  const finalStepButton = document.querySelector('.generate-btn');
  if (finalStepButton) {
    finalStepButton.addEventListener('click', function(e) {
      e.preventDefault();
      submitBusinessForm();
    });
  }
});
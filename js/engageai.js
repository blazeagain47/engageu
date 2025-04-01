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
  
  // Generate placeholder results (to be replaced with actual API calls)
  function generatePlaceholderResults(businessData) {
    // 1. Generate logo placeholder
    generatePlaceholderLogo(businessData);
    
    // 2. Generate mission statement
    document.getElementById('missionResult').textContent = generatePlaceholderMission(businessData);
    
    // 3. Generate about us
    document.getElementById('aboutUsResult').textContent = generatePlaceholderAboutUs(businessData);
    
    // 4. Generate Instagram ideas
    document.getElementById('instagramIdeasResult').textContent = generatePlaceholderInstagramIdeas(businessData);
    
    // 5. Generate website code
    document.getElementById('websiteCodeResult').querySelector('code').textContent = generatePlaceholderWebsiteCode(businessData);
  }
  
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
// Enhanced Lost & Found Client-side JavaScript
console.log('🚀 Lost & Found JavaScript loaded successfully!');

// Smooth scroll behavior
document.documentElement.style.scrollBehavior = 'smooth';

// Theme Management
function initThemeToggle() {
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');
  const body = document.body;
  
  if (!themeToggle || !themeIcon) {
    console.log('Theme toggle elements not found');
    return;
  }

  // Load saved theme or default to dark
  const savedTheme = localStorage.getItem('theme') || 'dark';
  body.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  console.log('✅ Theme system initialized with:', savedTheme);

  // Theme toggle event listener
  themeToggle.addEventListener('click', function() {
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
    
    console.log('🎨 Theme changed to:', newTheme);
    
    // Add a nice animation effect
    themeToggle.style.transform = 'scale(0.8)';
    setTimeout(() => {
      themeToggle.style.transform = 'scale(1)';
    }, 150);
  });

  function updateThemeIcon(theme) {
    if (theme === 'dark') {
      themeIcon.textContent = '☀️'; // Sun for switching to light
    } else {
      themeIcon.textContent = '🌙'; // Moon for switching to dark
    }
  }
}

// Simple search functionality (legacy support)
function initBasicSearch() {
  const q = document.getElementById('q');
  const grid = document.getElementById('itemsGrid');
  
  if (!q || !grid) {
    console.log('Search elements not found on this page');
    return;
  }

  console.log('✅ Search functionality initialized');

  q.addEventListener('input', function() {
    const needle = this.value.trim().toLowerCase();
    const cards = grid.querySelectorAll('.filterable');
    
    console.log(`🔍 Searching for: "${needle}"`);
    
    cards.forEach(card => {
      const hay = card.getAttribute('data-text') || '';
      const isVisible = hay.includes(needle);
      card.style.display = isVisible ? '' : 'none';
    });
  });
}

// Add loading states to forms
function addLoadingStates() {
  const forms = document.querySelectorAll('form');
  
  forms.forEach(form => {
    form.addEventListener('submit', function(e) {
      const submitBtn = form.querySelector('button[type="submit"], input[type="submit"]');
      if (submitBtn) {
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
        console.log('⏳ Form submitted, showing loading state');
      }
    });
  });
}

// Enhanced card hover effects
function enhanceCardInteractions() {
  const cards = document.querySelectorAll('.card');
  
  cards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-8px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0) scale(1)';
    });
  });
}

// Email functionality - mailto links are handled natively by the browser
// No additional JavaScript needed as we're using mailto links directly

// Basic form validation
function enhanceFormValidation() {
  const requiredInputs = document.querySelectorAll('input[required], textarea[required], select[required]');
  
  requiredInputs.forEach(input => {
    input.addEventListener('blur', function() {
      if (!this.value.trim()) {
        this.style.borderColor = 'var(--danger)';
      } else {
        this.style.borderColor = 'var(--success)';
        setTimeout(() => {
          this.style.borderColor = '';
        }, 2000);
      }
    });
  });
}

// Image preview functionality
function previewImage(input, previewContainerId) {
  const previewContainer = document.getElementById(previewContainerId);
  const previewImg = document.getElementById(previewContainerId === 'previewLost' ? 'previewImgLost' : 'previewImgFound');
  
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    
    reader.onload = function(e) {
      previewImg.src = e.target.result;
      previewContainer.style.display = 'block';
    };
    
    reader.readAsDataURL(input.files[0]);
  } else {
    previewContainer.style.display = 'none';
  }
}

function clearPreview(inputId, previewContainerId) {
  const input = document.getElementById(inputId);
  const previewContainer = document.getElementById(previewContainerId);
  
  if (input) {
    input.value = '';
  }
  if (previewContainer) {
    previewContainer.style.display = 'none';
  }
}

// Make functions globally available
window.previewImage = previewImage;
window.clearPreview = clearPreview;

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  console.log('🎯 Initializing Lost & Found features...');
  
  try {
    initThemeToggle();
    initBasicSearch();
    addLoadingStates();
    enhanceCardInteractions();
    enhanceFormValidation();
    
    console.log('✅ All features initialized successfully!');
  } catch (error) {
    console.error('❌ Error initializing features:', error);
  }
});

// Legacy support - keep the original search function working
(function(){
  const q = document.getElementById('q');
  const grid = document.getElementById('itemsGrid');
  if (!q || !grid) return;

  q.addEventListener('input', () => {
    const needle = q.value.trim().toLowerCase();
    const cards = grid.querySelectorAll('.filterable');
    cards.forEach(c => {
      const hay = c.getAttribute('data-text') || '';
      c.style.display = hay.includes(needle) ? '' : 'none';
    });
  });
})();

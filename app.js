// AgriPredict JavaScript Application

// Application data
const appData = {
  developer: {
    name: "Suresh Bishnoi",
    title: "Full-Stack Data Scientist & Web Engineer",
    email: "gyanshri68@gmail.com",
    github: "SURESHBISHNOI09",
    linkedin: "sureshbishnoi09",
    description: "Passionate about leveraging AI and machine learning to solve real-world agricultural challenges. Specialized in building intelligent web applications that empower farmers with data-driven insights."
  },
  yield_data: [
    {"id": 1, "crop": "Wheat", "region": "Iowa, USA", "predicted_yield": 4.2, "temperature": 22.5, "rainfall": 45.2, "soil_ph": 6.8},
    {"id": 2, "crop": "Corn", "region": "Illinois, USA", "predicted_yield": 9.8, "temperature": 24.1, "rainfall": 52.3, "soil_ph": 6.5},
    {"id": 3, "crop": "Soybeans", "region": "Nebraska, USA", "predicted_yield": 3.1, "temperature": 23.2, "rainfall": 38.7, "soil_ph": 7.1},
    {"id": 4, "crop": "Rice", "region": "Punjab, India", "predicted_yield": 4.5, "temperature": 28.3, "rainfall": 125.4, "soil_ph": 6.2}
  ],
  pest_data: [
    {"id": 1, "crop": "Corn", "pest": "Corn Borer", "risk_level": "Medium", "risk_score": 45, "region": "Iowa, USA"},
    {"id": 2, "crop": "Wheat", "pest": "Aphids", "risk_level": "High", "risk_score": 78, "region": "Kansas, USA"},
    {"id": 3, "crop": "Soybeans", "pest": "Armyworm", "risk_level": "Low", "risk_score": 22, "region": "Illinois, USA"},
    {"id": 4, "crop": "Rice", "pest": "Brown Plant Hopper", "risk_level": "High", "risk_score": 85, "region": "Punjab, India"}
  ],
  weather_data: [
    {"date": "2025-08-24", "temp_max": 28.5, "temp_min": 18.2, "humidity": 65, "precipitation": 2.5, "wind_speed": 12},
    {"date": "2025-08-25", "temp_max": 30.1, "temp_min": 19.8, "humidity": 58, "precipitation": 0, "wind_speed": 8},
    {"date": "2025-08-26", "temp_max": 26.7, "temp_min": 16.5, "humidity": 72, "precipitation": 8.2, "wind_speed": 15},
    {"date": "2025-08-27", "temp_max": 25.3, "temp_min": 15.1, "humidity": 68, "precipitation": 12.7, "wind_speed": 18}
  ],
  recommendations: [
    {"id": 1, "type": "irrigation", "title": "Optimal Irrigation Schedule", "description": "Based on soil moisture and weather forecast, irrigate corn fields on Tuesday and Friday.", "priority": "High", "crop": "Corn"},
    {"id": 2, "type": "fertilizer", "title": "Nitrogen Application", "description": "Soil analysis indicates low nitrogen levels. Apply 40 kg/ha nitrogen fertilizer.", "priority": "Medium", "crop": "Wheat"},
    {"id": 3, "type": "pest_control", "title": "Aphid Treatment", "description": "High aphid risk detected for soybeans. Consider organic pesticide application.", "priority": "High", "crop": "Soybeans"}
  ],
  crops: ["Wheat", "Corn", "Soybeans", "Rice", "Cotton", "Barley"],
  regions: ["Iowa, USA", "Illinois, USA", "Nebraska, USA", "Kansas, USA", "Punjab, India", "Uttar Pradesh, India"],
  statistics: {
    yield_increase: "25%",
    cost_reduction: "18%", 
    farmers_served: "50,000+",
    accuracy_rate: "94%"
  }
};

// Chart colors
const chartColors = ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F', '#DB4545', '#D2BA4C', '#964325', '#944454', '#13343B'];

// Chart instances
let yieldChart = null;
let pestChart = null;
let weatherChart = null;

// DOM ready
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Initialize application
function initializeApp() {
    setupNavigation();
    setupAnimations();
    initializeCharts();
    setupEventListeners();
    setupButtonInteractions();
    
    // Show default tab content
    switchTab('yield');
}

// Navigation functionality
function setupNavigation() {
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            scrollToSection(targetId);
        });
    });

    // Navbar background on scroll
    window.addEventListener('scroll', optimizedScrollHandler);
}

// Mobile menu toggle
function toggleMenu() {
    const navLinks = document.querySelector('.nav-links');
    const navToggle = document.querySelector('.nav-toggle');
    
    if (navLinks && navToggle) {
        const isActive = navLinks.classList.contains('active');
        
        if (isActive) {
            navLinks.classList.remove('active');
            navToggle.classList.remove('active');
            document.body.style.overflow = '';
        } else {
            navLinks.classList.add('active');
            navToggle.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }
}

// Smooth scroll to section
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        const offsetTop = element.offsetTop - 80; // Account for fixed navbar
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
        
        // Close mobile menu if open
        const navLinks = document.querySelector('.nav-links');
        const navToggle = document.querySelector('.nav-toggle');
        if (navLinks && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            navToggle.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
}

// Setup scroll animations
function setupAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Animate elements on scroll
    const animateElements = document.querySelectorAll('.feature-card, .impact-card, .highlight-item, .dashboard-card, .about-card');
    animateElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
}

// Initialize charts
function initializeCharts() {
    initializeYieldChart();
    initializePestChart();
    initializeWeatherChart();
}

// Initialize yield prediction chart
function initializeYieldChart() {
    const ctx = document.getElementById('yieldChart');
    if (!ctx) return;

    const yieldData = appData.yield_data;
    
    yieldChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: yieldData.map(item => item.crop),
            datasets: [{
                label: 'Predicted Yield (tons/hectare)',
                data: yieldData.map(item => item.predicted_yield),
                backgroundColor: chartColors.slice(0, yieldData.length),
                borderColor: chartColors.slice(0, yieldData.length),
                borderWidth: 2,
                borderRadius: 8,
                borderSkipped: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#ffffff',
                    bodyColor: '#ffffff',
                    borderColor: '#1FB8CD',
                    borderWidth: 1,
                    callbacks: {
                        afterLabel: function(context) {
                            const dataIndex = context.dataIndex;
                            const item = yieldData[dataIndex];
                            return [
                                `Region: ${item.region}`,
                                `Temperature: ${item.temperature}°C`,
                                `Rainfall: ${item.rainfall}mm`,
                                `Soil pH: ${item.soil_ph}`
                            ];
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    },
                    title: {
                        display: true,
                        text: 'Yield (tons/hectare)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

// Initialize pest risk chart
function initializePestChart() {
    const ctx = document.getElementById('pestChart');
    if (!ctx) return;

    const pestData = appData.pest_data;
    
    pestChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: pestData.map(item => `${item.pest} (${item.crop})`),
            datasets: [{
                data: pestData.map(item => item.risk_score),
                backgroundColor: pestData.map(item => {
                    switch(item.risk_level) {
                        case 'High': return '#DB4545';
                        case 'Medium': return '#FFC185';
                        case 'Low': return '#1FB8CD';
                        default: return '#5D878F';
                    }
                }),
                borderWidth: 0,
                cutout: '60%'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        usePointStyle: true,
                        font: {
                            size: 12
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#ffffff',
                    bodyColor: '#ffffff',
                    borderColor: '#1FB8CD',
                    borderWidth: 1,
                    callbacks: {
                        label: function(context) {
                            const item = pestData[context.dataIndex];
                            return [
                                `Risk Score: ${item.risk_score}`,
                                `Risk Level: ${item.risk_level}`,
                                `Region: ${item.region}`
                            ];
                        }
                    }
                }
            }
        }
    });
}

// Initialize weather chart
function initializeWeatherChart() {
    const ctx = document.getElementById('weatherChart');
    if (!ctx) return;

    const weatherData = appData.weather_data;
    
    weatherChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: weatherData.map(item => {
                const date = new Date(item.date);
                return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            }),
            datasets: [{
                label: 'Max Temperature (°C)',
                data: weatherData.map(item => item.temp_max),
                borderColor: '#DB4545',
                backgroundColor: 'rgba(219, 69, 69, 0.1)',
                tension: 0.4,
                fill: false
            }, {
                label: 'Min Temperature (°C)',
                data: weatherData.map(item => item.temp_min),
                borderColor: '#1FB8CD',
                backgroundColor: 'rgba(31, 184, 205, 0.1)',
                tension: 0.4,
                fill: false
            }, {
                label: 'Precipitation (mm)',
                data: weatherData.map(item => item.precipitation),
                borderColor: '#5D878F',
                backgroundColor: 'rgba(93, 135, 143, 0.1)',
                tension: 0.4,
                fill: false,
                yAxisID: 'y1'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#ffffff',
                    bodyColor: '#ffffff',
                    borderColor: '#1FB8CD',
                    borderWidth: 1
                }
            },
            scales: {
                x: {
                    display: true,
                    grid: {
                        display: false
                    }
                },
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    title: {
                        display: true,
                        text: 'Temperature (°C)'
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    title: {
                        display: true,
                        text: 'Precipitation (mm)'
                    },
                    grid: {
                        drawOnChartArea: false
                    }
                }
            }
        }
    });
}

// Setup event listeners
function setupEventListeners() {
    // Handle all buttons with onclick handlers
    document.addEventListener('click', function(e) {
        const target = e.target;
        
        // Handle hero action buttons
        if (target.textContent.includes('Get Your Forecast') || target.onclick && target.onclick.toString().includes('dashboard')) {
            e.preventDefault();
            scrollToSection('dashboard');
            return;
        }
        
        if (target.textContent.includes('How It Works') || target.onclick && target.onclick.toString().includes('how-it-works')) {
            e.preventDefault();
            scrollToSection('how-it-works');
            return;
        }
        
        // Handle feature buttons that should show coming soon
        if (target.classList.contains('btn') && (
            target.textContent.includes('Explore AI Features') ||
            target.textContent.includes('Learn More') ||
            target.textContent.includes('Get Started')
        )) {
            e.preventDefault();
            showComingSoon();
            return;
        }
        
        // Handle footer links that should show coming soon
        if (target.getAttribute('href') === '#' || 
            (target.onclick && target.onclick.toString().includes('showComingSoon'))) {
            e.preventDefault();
            showComingSoon();
            return;
        }
        
        // Handle tab buttons
        if (target.classList.contains('tab-button')) {
            e.preventDefault();
            const tabText = target.textContent.trim();
            if (tabText.includes('Yield')) switchTab('yield');
            else if (tabText.includes('Pest')) switchTab('pest');
            else if (tabText.includes('Weather')) switchTab('weather');
            else if (tabText.includes('Recommendations')) switchTab('recommendations');
            return;
        }
    });

    // Setup contact links
    setupContactLinks();
    
    // Setup modal event listeners
    setupModalEventListeners();
    
    // Fix form elements
    fixFormElements();
}

// Setup contact links
function setupContactLinks() {
    // Email links
    const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
    emailLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Let the default mailto behavior work
            showFeedback('Opening email client...', 'info');
        });
    });

    // External links
    const externalLinks = document.querySelectorAll('a[target="_blank"]');
    externalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Let the default behavior work for external links
            showFeedback('Opening link in new tab...', 'info');
        });
    });
}

// Fix form elements
function fixFormElements() {
    // Ensure select elements work properly
    const selects = document.querySelectorAll('select.form-control');
    selects.forEach(select => {
        // Remove any conflicting event listeners
        select.addEventListener('click', function(e) {
            e.stopPropagation();
        });
        
        select.addEventListener('change', function() {
            this.style.color = 'var(--color-text)';
        });
    });
    
    // Ensure input elements work properly
    const inputs = document.querySelectorAll('input.form-control');
    inputs.forEach(input => {
        input.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    });
}

// Setup modal event listeners
function setupModalEventListeners() {
    const modal = document.getElementById('comingSoonModal');
    if (modal) {
        // Close modal when clicking overlay
        const overlay = modal.querySelector('.modal-overlay');
        if (overlay) {
            overlay.addEventListener('click', closeComingSoon);
        }

        // Close modal with Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
                closeComingSoon();
            }
        });
    }
}

// Setup button interactions
function setupButtonInteractions() {
    // Add hover effects to feature cards
    const featureCards = document.querySelectorAll('.feature-card, .impact-card');
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
            this.style.boxShadow = 'var(--shadow-lg)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'var(--shadow-sm)';
        });
    });
}

// Dashboard tab switching
function switchTab(tabName) {
    // Hide all tab contents
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => {
        content.classList.remove('active');
    });

    // Remove active class from all tab buttons
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => {
        button.classList.remove('active');
    });

    // Show selected tab content
    const selectedTab = document.getElementById(`${tabName}-tab`);
    if (selectedTab) {
        selectedTab.classList.add('active');
    }

    // Add active class to selected tab button
    const tabButtons2 = document.querySelectorAll('.tab-button');
    tabButtons2.forEach(button => {
        const tabText = button.textContent.trim();
        if ((tabName === 'yield' && tabText.includes('Yield')) ||
            (tabName === 'pest' && tabText.includes('Pest')) ||
            (tabName === 'weather' && tabText.includes('Weather')) ||
            (tabName === 'recommendations' && tabText.includes('Recommendations'))) {
            button.classList.add('active');
        }
    });

    // Refresh charts when switching to them
    setTimeout(() => {
        switch(tabName) {
            case 'yield':
                if (yieldChart) yieldChart.resize();
                break;
            case 'pest':
                if (pestChart) pestChart.resize();
                break;
            case 'weather':
                if (weatherChart) weatherChart.resize();
                break;
        }
    }, 100);
}

// Yield calculation function
function calculateYield(event) {
    event.preventDefault();
    
    const button = event.target.querySelector('button[type="submit"]');
    
    const cropSelect = document.getElementById('cropSelect');
    const regionSelect = document.getElementById('regionSelect');
    const soilPhInput = document.getElementById('soilPh');
    const resultDiv = document.getElementById('yieldResult');
    
    if (!cropSelect || !regionSelect || !soilPhInput || !resultDiv) {
        showFeedback('Form elements not found', 'error');
        return;
    }
    
    const selectedCrop = cropSelect.value;
    const selectedRegion = regionSelect.value;
    const soilPh = parseFloat(soilPhInput.value);
    
    // Find matching data or calculate prediction
    let prediction = appData.yield_data.find(item => 
        item.crop === selectedCrop && item.region === selectedRegion
    );
    
    if (!prediction) {
        // Generate a prediction based on crop type and soil pH
        const baseYields = {
            'Wheat': 4.2,
            'Corn': 9.8,
            'Soybeans': 3.1,
            'Rice': 4.5,
            'Cotton': 2.8,
            'Barley': 3.9
        };
        
        let baseYield = baseYields[selectedCrop] || 4.0;
        
        // Adjust based on soil pH (optimal pH ranges)
        const optimalPh = {
            'Wheat': 6.5,
            'Corn': 6.2,
            'Soybeans': 6.8,
            'Rice': 6.0,
            'Cotton': 6.2,
            'Barley': 6.8
        };
        
        const optimal = optimalPh[selectedCrop] || 6.5;
        const phDiff = Math.abs(soilPh - optimal);
        const phAdjustment = Math.max(0.8, 1 - (phDiff * 0.1));
        
        const predictedYield = (baseYield * phAdjustment * (0.9 + Math.random() * 0.2)).toFixed(1);
        
        prediction = {
            crop: selectedCrop,
            region: selectedRegion,
            predicted_yield: parseFloat(predictedYield),
            soil_ph: soilPh
        };
    }
    
    // Display result
    resultDiv.innerHTML = `
        <h4>Yield Prediction Result</h4>
        <div class="prediction-details">
            <p><strong>Crop:</strong> ${prediction.crop}</p>
            <p><strong>Region:</strong> ${prediction.region}</p>
            <p><strong>Predicted Yield:</strong> ${prediction.predicted_yield} tons/hectare</p>
            <p><strong>Soil pH:</strong> ${prediction.soil_ph}</p>
            <div class="prediction-confidence">
                <small>Confidence Level: ${Math.floor(88 + Math.random() * 8)}%</small>
            </div>
        </div>
    `;
    
    resultDiv.classList.remove('hidden');
    
    // Add animation
    resultDiv.style.opacity = '0';
    resultDiv.style.transform = 'translateY(20px)';
    setTimeout(() => {
        resultDiv.style.transition = 'all 0.3s ease';
        resultDiv.style.opacity = '1';
        resultDiv.style.transform = 'translateY(0)';
    }, 100);
    
    showFeedback('Yield prediction calculated successfully!', 'success');
}

// Show coming soon modal
function showComingSoon() {
    const modal = document.getElementById('comingSoonModal');
    if (modal) {
        modal.classList.remove('hidden');
        // Add focus trap
        const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (focusableElements.length > 0) {
            focusableElements[0].focus();
        }
    }
}

// Close coming soon modal
function closeComingSoon() {
    const modal = document.getElementById('comingSoonModal');
    if (modal) {
        modal.classList.add('hidden');
    }
}

// Show notify modal (placeholder)
function showNotifyModal() {
    closeComingSoon();
    showFeedback('Thanks for your interest! We\'ll notify you when this feature is ready.', 'info');
}

// Show feedback message
function showFeedback(message, type = 'info') {
    // Remove existing feedback
    const existingFeedback = document.querySelector('.feedback-message');
    if (existingFeedback) {
        existingFeedback.remove();
    }

    const feedback = document.createElement('div');
    feedback.className = `feedback-message feedback-${type}`;
    feedback.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 12px 20px;
        background: var(--color-surface);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-base);
        box-shadow: var(--shadow-lg);
        color: var(--color-text);
        font-size: var(--font-size-sm);
        z-index: 1500;
        max-width: 300px;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
    `;
    
    // Set color based on type
    switch(type) {
        case 'success':
            feedback.style.borderLeftColor = 'var(--color-success)';
            feedback.style.borderLeftWidth = '4px';
            break;
        case 'error':
            feedback.style.borderLeftColor = 'var(--color-error)';
            feedback.style.borderLeftWidth = '4px';
            break;
        case 'warning':
            feedback.style.borderLeftColor = 'var(--color-warning)';
            feedback.style.borderLeftWidth = '4px';
            break;
        default:
            feedback.style.borderLeftColor = 'var(--color-info)';
            feedback.style.borderLeftWidth = '4px';
    }
    
    feedback.textContent = message;
    document.body.appendChild(feedback);
    
    // Animate in
    setTimeout(() => {
        feedback.style.opacity = '1';
        feedback.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after delay
    setTimeout(() => {
        feedback.style.opacity = '0';
        feedback.style.transform = 'translateX(100%)';
        setTimeout(() => {
            feedback.remove();
        }, 300);
    }, 3000);
}

// Performance optimization
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Optimized scroll handler
const optimizedScrollHandler = debounce(() => {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.backdropFilter = 'blur(15px)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.backdropFilter = 'blur(10px)';
        }
    }
}, 10);

// Handle window resize for charts
window.addEventListener('resize', debounce(() => {
    if (yieldChart) yieldChart.resize();
    if (pestChart) pestChart.resize();
    if (weatherChart) weatherChart.resize();
}, 250));

// Accessibility improvements
function setupAccessibility() {
    // Add keyboard navigation for modals
    document.addEventListener('keydown', function(e) {
        const modal = document.querySelector('.modal:not(.hidden)');
        if (modal && e.key === 'Tab') {
            const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                    lastElement.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastElement) {
                    firstElement.focus();
                    e.preventDefault();
                }
            }
        }
    });
}

// Initialize enhanced features
document.addEventListener('DOMContentLoaded', function() {
    setupAccessibility();
});

// Make functions available globally
window.switchTab = switchTab;
window.calculateYield = calculateYield;
window.toggleMenu = toggleMenu;
window.scrollToSection = scrollToSection;
window.showComingSoon = showComingSoon;
window.closeComingSoon = closeComingSoon;
window.showNotifyModal = showNotifyModal;

// Error handling
window.addEventListener('error', function(e) {
    console.error('Application error:', e.error);
    showFeedback('An unexpected error occurred. Please refresh the page.', 'error');
});
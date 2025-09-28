// API Calls Demo - RSS to JSON
// Using rsstojson.com service (no API key required)

/**
 * Theme Management Functions
 */

/**
 * Initialize theme from localStorage or default to dark
 */
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    applyTheme(savedTheme);
}

/**
 * Toggle between light and dark themes
 */
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
    localStorage.setItem('theme', newTheme);
}

/**
 * Apply the theme to the document
 */
function applyTheme(theme) {
    const themeToggle = document.getElementById('themeToggle');
    
    if (theme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
        if (themeToggle) {
            themeToggle.innerHTML = '🌙 Dark Mode';
            themeToggle.setAttribute('title', 'Switch to dark mode');
        }
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        if (themeToggle) {
            themeToggle.innerHTML = '☀️ Light Mode';
            themeToggle.setAttribute('title', 'Switch to light mode');
        }
    }
}

/**
 * RSS Feed Functions
 */

/**
 * Use an example URL by clicking on it
 */
function useExampleUrl(url) {
    const urlInput = document.getElementById('rssUrl');
    urlInput.value = url;
    urlInput.focus();
}

/**
 * Main function to fetch RSS feed and convert to JSON
 */
async function fetchRSSFeed() {
    const urlInput = document.getElementById('rssUrl');
    const fetchButton = document.getElementById('fetchButton');
    const loadingMessage = document.getElementById('loadingMessage');
    const errorMessage = document.getElementById('errorMessage');
    const resultSection = document.getElementById('resultSection');
    
    const rssUrl = urlInput.value.trim();
    
    // Validate URL
    if (!rssUrl) {
        showError('Please enter a valid RSS URL');
        return;
    }
    
    if (!isValidUrl(rssUrl)) {
        showError('Please enter a valid URL (must start with http:// or https://)');
        return;
    }
    
    // Reset UI
    hideError();
    hideResults();
    showLoading();
    disableButton();
    
    try {
        // In a real environment, try multiple RSS to JSON services with CORS support
        // For demo purposes, we'll show mock data since API calls are blocked in this environment
        
        let data;
        let successfulService = '';
        
        // Check if we're in a restricted environment (like GitHub Codespaces)
        const isRestrictedEnv = window.location.hostname === 'localhost' && 
                               window.location.port === '8000';
        
        if (isRestrictedEnv) {
            // Use mock data for demonstration
            console.log('🔄 Using mock data for demonstration (API calls blocked in this environment)');
            data = getMockRSSData(rssUrl);
            successfulService = 'Mock Data (Demo Mode)';
        } else {
            // Option 1: Try rss2json.com (supports CORS)
            try {
                const rss2jsonUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;
                console.log('🚀 Trying rss2json.com API:', rss2jsonUrl);
                
                const response1 = await fetch(rss2jsonUrl, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                    }
                });
                
                if (response1.ok) {
                    data = await response1.json();
                    successfulService = 'rss2json.com';
                    console.log('✅ rss2json.com API Response received:', data);
                } else {
                    throw new Error(`HTTP ${response1.status}`);
                }
            } catch (error1) {
                console.log('⚠️ rss2json.com failed, trying alternative...', error1.message);
                
                // Option 2: Try allorigins.win as CORS proxy
                const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent('https://api.rsstojson.com/v1/parser?rss_url=' + encodeURIComponent(rssUrl))}`;
                console.log('🚀 Trying CORS proxy with rsstojson:', proxyUrl);
                
                const response2 = await fetch(proxyUrl, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                    }
                });
                
                if (!response2.ok) {
                    throw new Error(`HTTP error! status: ${response2.status} - ${response2.statusText}`);
                }
                
                const proxyData = await response2.json();
                data = JSON.parse(proxyData.contents);
                successfulService = 'rsstojson.com (via proxy)';
                console.log('✅ Proxy API Response received:', data);
            }
        }
        
        // Display results with service info
        displayResults(data, successfulService);
        
    } catch (error) {
        console.error('❌ Error fetching RSS feed:', error);
        showError(`Failed to fetch RSS feed: ${error.message}`);
    } finally {
        hideLoading();
        enableButton();
    }
}

/**
 * Display the formatted results
 */
function displayResults(data, serviceName = 'API Service') {
    const resultSection = document.getElementById('resultSection');
    const feedInfo = document.getElementById('feedInfo');
    const feedItems = document.getElementById('feedItems');
    const jsonDisplay = document.getElementById('jsonDisplay');
    
    // Normalize data structure (different APIs return different formats)
    let normalizedData = normalizeApiResponse(data);
    
    // Show feed information
    if (normalizedData.title || normalizedData.description) {
        feedInfo.innerHTML = `
            <strong>📰 ${normalizedData.title || 'RSS Feed'}</strong><br>
            ${normalizedData.description || 'No description available'}
            ${normalizedData.link ? `<br>🔗 <a href="${normalizedData.link}" target="_blank" style="color: #1a1a2e;">${normalizedData.link}</a>` : ''}
            <div style="margin-top: 8px; font-size: 14px; opacity: 0.8;">
                ✅ Successfully fetched via ${serviceName}
            </div>
        `;
        feedInfo.style.display = 'block';
    }
    
    // Show feed items
    if (normalizedData.items && normalizedData.items.length > 0) {
        feedItems.innerHTML = '<h3 style="color: #16db93; font-size: 22px; margin-bottom: 15px;">📋 Latest Articles (' + normalizedData.items.length + ' items)</h3>';
        
        // Display first 10 items to keep it manageable
        const itemsToShow = normalizedData.items.slice(0, 10);
        
        itemsToShow.forEach((item, index) => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'feed-item';
            
            const title = item.title || 'No Title';
            const pubDate = item.pubDate || item.published || item.date || '';
            const formattedDate = pubDate ? new Date(pubDate).toLocaleString() : 'No Date';
            const description = item.description || item.content || item.summary || 'No description available';
            
            // Clean up description (remove HTML tags and limit length)
            const cleanDescription = stripHtml(description).substring(0, 300) + 
                                   (description.length > 300 ? '...' : '');
            
            itemDiv.innerHTML = `
                <div class="item-title">${escapeHtml(title)}</div>
                <div class="item-date">📅 ${formattedDate}</div>
                <div class="item-description">${escapeHtml(cleanDescription)}</div>
                ${item.link || item.url ? `<div style="margin-top: 10px;"><a href="${item.link || item.url}" target="_blank" style="color: #16db93; text-decoration: none;">🔗 Read more →</a></div>` : ''}
            `;
            
            feedItems.appendChild(itemDiv);
        });
        
        if (normalizedData.items.length > 10) {
            const moreInfo = document.createElement('div');
            moreInfo.style.textAlign = 'center';
            moreInfo.style.padding = '15px';
            moreInfo.style.color = '#f39c12';
            moreInfo.style.fontStyle = 'italic';
            moreInfo.innerHTML = `... and ${normalizedData.items.length - 10} more items (showing first 10)`;
            feedItems.appendChild(moreInfo);
        }
    } else {
        feedItems.innerHTML = '<p style="color: #f39c12; font-style: italic;">No feed items found.</p>';
    }
    
    // Show raw JSON (formatted)
    jsonDisplay.textContent = JSON.stringify(data, null, 2);
    
    // Show results section
    resultSection.style.display = 'block';
    
    // Scroll to results
    resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/**
 * Normalize different API response formats
 */
function normalizeApiResponse(data) {
    // Handle rss2json.com format
    if (data.feed && data.items) {
        return {
            title: data.feed.title,
            description: data.feed.description,
            link: data.feed.link,
            items: data.items
        };
    }
    
    // Handle rsstojson.com format
    if (data.title && data.items) {
        return data;
    }
    
    // Handle other formats - try to extract what we can
    return {
        title: data.title || data.name || 'RSS Feed',
        description: data.description || data.subtitle || '',
        link: data.link || data.url || '',
        items: data.items || data.entries || []
    };
}

/**
 * Generate mock RSS data for demonstration when APIs are blocked
 */
function getMockRSSData(rssUrl) {
    const feedName = rssUrl.includes('bbc') ? 'BBC News' :
                     rssUrl.includes('cnn') ? 'CNN News' :
                     rssUrl.includes('techcrunch') ? 'TechCrunch' :
                     'Sample RSS Feed';
    
    return {
        status: "ok",
        feed: {
            title: feedName,
            description: `Latest news and updates from ${feedName} - This is mock data for demonstration purposes`,
            link: rssUrl.replace('/rss.xml', '').replace('/feed/', ''),
            image: "https://via.placeholder.com/100x100?text=" + feedName.charAt(0)
        },
        items: [
            {
                title: "Breaking: Major Technology Breakthrough Announced",
                pubDate: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
                description: "Scientists have made a significant breakthrough in quantum computing technology that could revolutionize how we process information. This development promises to accelerate computational speeds by orders of magnitude.",
                link: "https://example.com/article1"
            },
            {
                title: "Global Climate Summit Reaches Historic Agreement",
                pubDate: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
                description: "World leaders have reached a groundbreaking consensus on climate action during the latest international summit. The agreement includes ambitious targets for carbon reduction and renewable energy adoption.",
                link: "https://example.com/article2"
            },
            {
                title: "New Study Reveals Surprising Health Benefits",
                pubDate: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), // 4 hours ago
                description: "Researchers have discovered unexpected health benefits from a common daily activity. The long-term study involving thousands of participants shows promising results for overall wellbeing.",
                link: "https://example.com/article3"
            },
            {
                title: "Space Exploration Mission Launches Successfully",
                pubDate: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(), // 6 hours ago
                description: "The latest space mission has launched successfully, carrying advanced scientific instruments to explore distant planets. The mission aims to gather crucial data about potential life beyond Earth.",
                link: "https://example.com/article4"
            },
            {
                title: "Economic Markets Show Strong Recovery Signs",
                pubDate: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(), // 8 hours ago
                description: "Financial markets are displaying robust recovery indicators following recent global events. Analysts are optimistic about sustained growth in key sectors throughout the coming quarter.",
                link: "https://example.com/article5"
            }
        ]
    };
}

/**
 * Utility functions
 */
function isValidUrl(string) {
    try {
        const url = new URL(string);
        return url.protocol === 'http:' || url.protocol === 'https:';
    } catch (_) {
        return false;
    }
}

function showError(message) {
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.textContent = '❌ Error: ' + message;
    errorMessage.style.display = 'block';
}

function hideError() {
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.style.display = 'none';
}

function showLoading() {
    const loadingMessage = document.getElementById('loadingMessage');
    loadingMessage.style.display = 'block';
}

function hideLoading() {
    const loadingMessage = document.getElementById('loadingMessage');
    loadingMessage.style.display = 'none';
}

function hideResults() {
    const resultSection = document.getElementById('resultSection');
    resultSection.style.display = 'none';
}

function disableButton() {
    const fetchButton = document.getElementById('fetchButton');
    fetchButton.disabled = true;
    fetchButton.textContent = '⏳ Loading...';
}

function enableButton() {
    const fetchButton = document.getElementById('fetchButton');
    fetchButton.disabled = false;
    fetchButton.textContent = '🔄 Fetch RSS Feed';
}

function stripHtml(html) {
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Allow Enter key to trigger fetch
document.addEventListener('DOMContentLoaded', function() {
    // Initialize theme on page load
    initializeTheme();
    
    // Setup enter key event listener
    document.getElementById('rssUrl').addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            fetchRSSFeed();
        }
    });
});

// Welcome message
console.log('🌐 RSS to JSON API Demo loaded successfully!');
console.log('📡 Ready to make API calls to rsstojson.com');
console.log('🎨 Theme toggle available in the top-right corner');
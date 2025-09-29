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
    
    // Track API call metadata
    const apiCallMetadata = {
        requestUrl: rssUrl,
        startTime: Date.now(),
        apiEndpoint: null,
        httpStatus: null,
        responseTime: null,
        serviceName: null,
        requestHeaders: {
            'Accept': 'application/json'
        }
    };
    
    try {
        // In a real environment, try multiple RSS to JSON services with CORS support
        // For demo purposes, we'll show mock data since API calls are blocked in this environment
        
        let data;
        let originalRssXml = null;
        let successfulService = '';
        
        // Check if we're in a restricted environment (like GitHub Codespaces)
        const isRestrictedEnv = window.location.hostname === 'localhost' && 
                               window.location.port === '8000';
        
        if (isRestrictedEnv) {
            // Use mock data for demonstration
            console.log('🔄 Using mock data for demonstration (API calls blocked in this environment)');
            
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
            
            data = getMockRSSData(rssUrl);
            originalRssXml = getMockRSSXML(rssUrl);
            apiCallMetadata.endTime = Date.now();
            apiCallMetadata.responseTime = apiCallMetadata.endTime - apiCallMetadata.startTime;
            apiCallMetadata.serviceName = 'Mock Data (Demo Mode)';
            apiCallMetadata.apiEndpoint = 'Local Mock Service';
            apiCallMetadata.httpStatus = 200;
            apiCallMetadata.mockData = true;
            
        } else {
            // Option 1: Try rss2json.com (supports CORS)
            try {
                const rss2jsonUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;
                console.log('🚀 Trying rss2json.com API:', rss2jsonUrl);
                
                apiCallMetadata.apiEndpoint = rss2jsonUrl;
                
                // Fetch both the JSON conversion and original RSS in parallel
                const [jsonResponse, rssResponse] = await Promise.all([
                    fetch(rss2jsonUrl, {
                        method: 'GET',
                        headers: apiCallMetadata.requestHeaders
                    }),
                    fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(rssUrl)}`, {
                        method: 'GET'
                    })
                ]);
                
                apiCallMetadata.endTime = Date.now();
                apiCallMetadata.responseTime = apiCallMetadata.endTime - apiCallMetadata.startTime;
                apiCallMetadata.httpStatus = jsonResponse.status;
                
                if (jsonResponse.ok) {
                    data = await jsonResponse.json();
                    apiCallMetadata.serviceName = 'rss2json.com';
                    console.log('✅ rss2json.com API Response received:', data);
                    
                    // Try to get original RSS XML
                    if (rssResponse.ok) {
                        const rssData = await rssResponse.json();
                        originalRssXml = rssData.contents;
                        console.log('✅ Original RSS XML fetched successfully');
                    }
                } else {
                    throw new Error(`HTTP ${jsonResponse.status}: ${jsonResponse.statusText}`);
                }
            } catch (error1) {
                console.log('⚠️ rss2json.com failed, trying alternative...', error1.message);
                
                // Reset timing for second attempt
                apiCallMetadata.startTime = Date.now();
                
                // Option 2: Try allorigins.win as CORS proxy
                const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent('https://api.rsstojson.com/v1/parser?rss_url=' + encodeURIComponent(rssUrl))}`;
                const rssProxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(rssUrl)}`;
                console.log('🚀 Trying CORS proxy with rsstojson:', proxyUrl);
                
                apiCallMetadata.apiEndpoint = proxyUrl;
                apiCallMetadata.fallbackService = true;
                
                // Fetch both JSON conversion and original RSS
                const [jsonResponse, rssResponse] = await Promise.all([
                    fetch(proxyUrl, {
                        method: 'GET',
                        headers: apiCallMetadata.requestHeaders
                    }),
                    fetch(rssProxyUrl, {
                        method: 'GET'
                    })
                ]);
                
                apiCallMetadata.endTime = Date.now();
                apiCallMetadata.responseTime = apiCallMetadata.endTime - apiCallMetadata.startTime;
                apiCallMetadata.httpStatus = jsonResponse.status;
                
                if (!jsonResponse.ok) {
                    throw new Error(`HTTP error! status: ${jsonResponse.status} - ${jsonResponse.statusText}`);
                }
                
                const proxyData = await jsonResponse.json();
                data = JSON.parse(proxyData.contents);
                apiCallMetadata.serviceName = 'rsstojson.com (via proxy)';
                console.log('✅ Proxy API Response received:', data);
                
                // Get original RSS
                if (rssResponse.ok) {
                    const rssData = await rssResponse.json();
                    originalRssXml = rssData.contents;
                    console.log('✅ Original RSS XML fetched via proxy');
                }
            }
        }
        
        // Display results with service info, API metadata, and original RSS
        displayResults(data, apiCallMetadata, originalRssXml);
        
    } catch (error) {
        apiCallMetadata.endTime = Date.now();
        apiCallMetadata.responseTime = apiCallMetadata.endTime - apiCallMetadata.startTime;
        apiCallMetadata.error = error.message;
        
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
function displayResults(data, apiMetadata, originalRssXml = null) {
    const resultSection = document.getElementById('resultSection');
    const apiDetails = document.getElementById('apiDetails');
    const feedInfo = document.getElementById('feedInfo');
    const feedItems = document.getElementById('feedItems');
    const jsonDisplay = document.getElementById('jsonDisplay');
    const rssDisplay = document.getElementById('rssDisplay');
    
    // Normalize data structure (different APIs return different formats)
    let normalizedData = normalizeApiResponse(data);
    
    // Show API call details
    displayApiDetails(apiDetails, apiMetadata);
    
    // Show feed information
    if (normalizedData.title || normalizedData.description) {
        feedInfo.innerHTML = `
            <strong>📰 ${normalizedData.title || 'RSS Feed'}</strong><br>
            ${normalizedData.description || 'No description available'}
            ${normalizedData.link ? `<br>🔗 <a href="${normalizedData.link}" target="_blank" style="color: var(--text-secondary);">${normalizedData.link}</a>` : ''}
        `;
        feedInfo.style.display = 'block';
    }
    
    // Show feed items
    if (normalizedData.items && normalizedData.items.length > 0) {
        feedItems.innerHTML = '<h3 style="color: var(--accent-green); font-size: 22px; margin-bottom: 15px;">📋 Latest Articles (' + normalizedData.items.length + ' items)</h3>';
        
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
                ${item.link || item.url ? `<div style="margin-top: 10px;"><a href="${item.link || item.url}" target="_blank" style="color: var(--accent-green); text-decoration: none;">🔗 Read more →</a></div>` : ''}
            `;
            
            feedItems.appendChild(itemDiv);
        });
        
        if (normalizedData.items.length > 10) {
            const moreInfo = document.createElement('div');
            moreInfo.style.textAlign = 'center';
            moreInfo.style.padding = '15px';
            moreInfo.style.color = 'var(--accent-orange)';
            moreInfo.style.fontStyle = 'italic';
            moreInfo.innerHTML = `... and ${normalizedData.items.length - 10} more items (showing first 10)`;
            feedItems.appendChild(moreInfo);
        }
    } else {
        feedItems.innerHTML = '<p style="color: var(--accent-orange); font-style: italic;">No feed items found.</p>';
    }
    
    // Show formatted JSON
    jsonDisplay.textContent = JSON.stringify(data, null, 2);
    
    // Show original RSS XML if available
    if (originalRssXml) {
        rssDisplay.textContent = formatXML(originalRssXml);
    } else {
        rssDisplay.innerHTML = '<span style="color: var(--accent-orange); font-style: italic;">Original RSS XML not available<br><br>In demo mode or due to CORS restrictions.</span>';
    }
    
    // Show results section
    resultSection.style.display = 'block';
    
    // Scroll to results
    resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/**
 * Display API call details and metadata
 */
function displayApiDetails(apiDetailsElement, metadata) {
    const statusClass = metadata.httpStatus >= 200 && metadata.httpStatus < 300 ? 'api-status-success' : 'api-status-error';
    const responseTimeFormatted = metadata.responseTime ? `${metadata.responseTime}ms` : 'N/A';
    const currentTime = new Date().toLocaleString();
    
    let apiDetailsHTML = `
        <h3>🔧 API Call Details</h3>
        <div class="api-detail-row">
            <div class="api-detail-label">Request URL:</div>
            <div class="api-detail-value">${escapeHtml(metadata.requestUrl)}</div>
        </div>
        <div class="api-detail-row">
            <div class="api-detail-label">API Endpoint:</div>
            <div class="api-detail-value">${escapeHtml(metadata.apiEndpoint || 'N/A')}</div>
        </div>
        <div class="api-detail-row">
            <div class="api-detail-label">Service:</div>
            <div class="api-detail-value">${escapeHtml(metadata.serviceName || 'Unknown')}</div>
        </div>
        <div class="api-detail-row">
            <div class="api-detail-label">HTTP Status:</div>
            <div class="api-detail-value"><span class="${statusClass}">${metadata.httpStatus || 'N/A'}</span></div>
        </div>
        <div class="api-detail-row">
            <div class="api-detail-label">Response Time:</div>
            <div class="api-detail-value api-timing">${responseTimeFormatted}</div>
        </div>
        <div class="api-detail-row">
            <div class="api-detail-label">Request Time:</div>
            <div class="api-detail-value">${currentTime}</div>
        </div>
    `;
    
    // Add request headers info
    if (metadata.requestHeaders) {
        const headersString = Object.entries(metadata.requestHeaders)
            .map(([key, value]) => `${key}: ${value}`)
            .join(', ');
        apiDetailsHTML += `
        <div class="api-detail-row">
            <div class="api-detail-label">Request Headers:</div>
            <div class="api-detail-value">${escapeHtml(headersString)}</div>
        </div>
        `;
    }
    
    // Add additional metadata if available
    if (metadata.fallbackService) {
        apiDetailsHTML += `
        <div class="api-detail-row">
            <div class="api-detail-label">Fallback Used:</div>
            <div class="api-detail-value api-status-success">✅ Yes (Primary service failed)</div>
        </div>
        `;
    }
    
    if (metadata.mockData) {
        apiDetailsHTML += `
        <div class="api-detail-row">
            <div class="api-detail-label">Demo Mode:</div>
            <div class="api-detail-value api-status-success">✅ Using mock data (API calls blocked)</div>
        </div>
        `;
    }
    
    if (metadata.error) {
        apiDetailsHTML += `
        <div class="api-detail-row">
            <div class="api-detail-label">Error:</div>
            <div class="api-detail-value api-status-error">${escapeHtml(metadata.error)}</div>
        </div>
        `;
    }
    
    apiDetailsElement.innerHTML = apiDetailsHTML;
    apiDetailsElement.style.display = 'block';
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
                     rssUrl.includes('nytimes') ? 'NY Times US News' :
                     rssUrl.includes('techcrunch') ? 'TechCrunch' :
                     rssUrl.includes('demo.rss') ? 'Demo RSS Feed - API Testing Examples' :
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
 * Generate mock RSS XML for demonstration when APIs are blocked
 */
function getMockRSSXML(rssUrl) {
    const feedName = rssUrl.includes('bbc') ? 'BBC News' :
                     rssUrl.includes('nytimes') ? 'NY Times US News' :
                     rssUrl.includes('techcrunch') ? 'TechCrunch' :
                     rssUrl.includes('demo.rss') ? 'Demo RSS Feed - API Testing Examples' :
                     'Sample RSS Feed';
    
    const feedLink = rssUrl.replace('/rss.xml', '').replace('/feed/', '');
    
    return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:wfw="http://wellformedweb.org/CommentAPI/" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${feedName}</title>
    <description>Latest news and updates from ${feedName} - This is mock data for demonstration purposes</description>
    <link>${feedLink}</link>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <language>en-US</language>
    <atom:link href="${rssUrl}" rel="self" type="application/rss+xml" />
    
    <item>
      <title>Breaking: Major Technology Breakthrough Announced</title>
      <description>Scientists have made a significant breakthrough in quantum computing technology that could revolutionize how we process information. This development promises to accelerate computational speeds by orders of magnitude.</description>
      <link>https://example.com/article1</link>
      <pubDate>${new Date(Date.now() - 1000 * 60 * 30).toUTCString()}</pubDate>
      <guid>https://example.com/article1</guid>
    </item>
    
    <item>
      <title>Global Climate Summit Reaches Historic Agreement</title>
      <description>World leaders have reached a groundbreaking consensus on climate action during the latest international summit. The agreement includes ambitious targets for carbon reduction and renewable energy adoption.</description>
      <link>https://example.com/article2</link>
      <pubDate>${new Date(Date.now() - 1000 * 60 * 60 * 2).toUTCString()}</pubDate>
      <guid>https://example.com/article2</guid>
    </item>
    
    <item>
      <title>New Study Reveals Surprising Health Benefits</title>
      <description>Researchers have discovered unexpected health benefits from a common daily activity. The long-term study involving thousands of participants shows promising results for overall wellbeing.</description>
      <link>https://example.com/article3</link>
      <pubDate>${new Date(Date.now() - 1000 * 60 * 60 * 4).toUTCString()}</pubDate>
      <guid>https://example.com/article3</guid>
    </item>
    
    <item>
      <title>Space Exploration Mission Launches Successfully</title>
      <description>The latest space mission has launched successfully, carrying advanced scientific instruments to explore distant planets. The mission aims to gather crucial data about potential life beyond Earth.</description>
      <link>https://example.com/article4</link>
      <pubDate>${new Date(Date.now() - 1000 * 60 * 60 * 6).toUTCString()}</pubDate>
      <guid>https://example.com/article4</guid>
    </item>
    
    <item>
      <title>Economic Markets Show Strong Recovery Signs</title>
      <description>Financial markets are displaying robust recovery indicators following recent global events. Analysts are optimistic about sustained growth in key sectors throughout the coming quarter.</description>
      <link>https://example.com/article5</link>
      <pubDate>${new Date(Date.now() - 1000 * 60 * 60 * 8).toUTCString()}</pubDate>
      <guid>https://example.com/article5</guid>
    </item>
    
  </channel>
</rss>`;
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

/**
 * Format XML string with proper indentation for display
 */
function formatXML(xml) {
    try {
        // Remove extra whitespace and normalize
        let formatted = xml.replace(/\s+</g, '<').replace(/>\s+/g, '>');
        
        // Add line breaks after tags for better readability
        formatted = formatted.replace(/></g, '>\n<');
        
        // Handle self-closing tags and content within tags
        formatted = formatted.replace(/(<[^>]+>)([^<]+)/g, '$1\n$2');
        
        // Simple indentation
        const lines = formatted.split('\n');
        let indentLevel = 0;
        const indentString = '  '; // 2 spaces
        
        const formattedLines = lines.map(line => {
            const trimmedLine = line.trim();
            
            if (trimmedLine === '') return '';
            
            // Decrease indent for closing tags
            if (trimmedLine.startsWith('</')) {
                indentLevel = Math.max(0, indentLevel - 1);
            }
            
            const indentedLine = indentString.repeat(indentLevel) + trimmedLine;
            
            // Increase indent for opening tags (but not self-closing or processing instruction tags)
            if (trimmedLine.startsWith('<') && 
                !trimmedLine.startsWith('</') && 
                !trimmedLine.startsWith('<?') &&
                !trimmedLine.endsWith('/>') &&
                !trimmedLine.includes('</')) {
                indentLevel++;
            }
            
            return indentedLine;
        });
        
        return formattedLines.join('\n');
    } catch (error) {
        console.warn('XML formatting failed:', error);
        return xml; // Return original if formatting fails
    }
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
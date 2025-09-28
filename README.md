# 🌐 API Calls Demo - RSS to JSON

A modern, projector-friendly web application for demonstrating API calls to RSS-to-JSON services. Perfect for classroom presentations and API learning sessions.

## ✨ Features

- **🎨 Projector-Friendly Design**: Dark theme with high contrast colors optimized for presentation
- **📱 Responsive Interface**: Clean, modern UI that works on all screen sizes
- **⚡ Real-time API Calls**: Demonstrates live API calls to RSS-to-JSON services
- **🔄 Multiple Service Support**: Falls back between different APIs for reliability
- **📊 Beautiful Data Display**: Clean, readable formatting of RSS feed data
- **🌍 CORS Handling**: Implements proper CORS proxy solutions
- **📋 Example Feeds**: Pre-configured example RSS feeds for quick testing

## 🎯 Perfect For

- **👩‍🏫 Classroom Demonstrations**: Projector-optimized colors and fonts
- **📚 API Learning**: Shows real-world API integration patterns
- **🔬 Development Training**: Demonstrates error handling and fallback strategies
- **🏢 Presentations**: Professional interface suitable for business contexts

## 🚀 Quick Start

### Method 1: Simple File Opening
1. Download the repository files
2. Open `index.html` in any modern web browser
3. Enter an RSS URL or click one of the examples
4. Click "Fetch RSS Feed" to see the magic!

### Method 2: Local Server (Recommended)
```bash
# Clone the repository
git clone https://github.com/School-of-Computing-and-Informatics/cmps-357-api-calls.git
cd cmps-357-api-calls

# Start a local web server
python3 -m http.server 8000
# OR
npx serve .
# OR
php -S localhost:8000

# Open browser to http://localhost:8000
```

## 🎨 Color Scheme

Designed specifically for projector presentations:

- **Background**: Dark navy (`#1a1a2e`) - easy on the eyes
- **Primary Accent**: Bright green (`#16db93`) - high visibility
- **Secondary Accent**: Orange (`#f39c12`) - good contrast
- **Text**: Light gray (`#eee`) - optimal readability
- **Panels**: Deep blue (`#0f3460`) - subtle depth

## 🔧 Technical Features

### API Services Used
1. **Primary**: `rss2json.com` - Free, CORS-enabled RSS to JSON API
2. **Fallback**: `rsstojson.com` via CORS proxy - Alternative service
3. **Demo Mode**: Mock data when APIs are blocked (development environments)

### Error Handling
- Network failure detection
- Service fallback mechanisms
- User-friendly error messages
- Graceful degradation to demo mode

### Data Processing
- HTML tag stripping for clean display
- Date formatting for readability
- Content truncation for manageable display
- JSON prettification for raw data view

## 📖 Example RSS Feeds

The application includes these pre-configured feeds:

- **📰 BBC News**: `https://feeds.bbci.co.uk/news/rss.xml`
- **📰 NY Times US News**: `https://rss.nytimes.com/services/xml/rss/nyt/US.xml`
- **💻 TechCrunch**: `https://techcrunch.com/feed/`

## 🏗️ Project Structure

```
cmps-357-api-calls/
├── index.html          # Main HTML file with projector-friendly styling
├── app.js             # JavaScript with API logic and error handling
└── README.md          # This documentation
```

## 🔍 Code Highlights

### Modern JavaScript Features
- Async/await for clean API calls
- Error handling with try/catch
- ES6+ syntax and best practices
- Modular function organization

### CSS Features
- CSS Grid and Flexbox layouts
- Smooth transitions and hover effects
- Projector-optimized color palette
- Responsive design patterns

### API Integration
- Multiple service fallback
- CORS proxy implementation
- JSON data normalization
- Rate limiting consideration

## 🎓 Educational Value

This project demonstrates:

1. **API Integration**: Real-world API consumption patterns
2. **Error Handling**: Robust fallback strategies
3. **CORS Solutions**: Proxy server implementation
4. **Data Processing**: JSON parsing and display formatting
5. **UI/UX Design**: Presentation-optimized interfaces
6. **Modern Web Development**: Current best practices

## 🔧 Customization

### Adding New RSS Sources
```javascript
// In app.js, add to the example URLs section
<span class="example-url" onclick="useExampleUrl('https://your-rss-feed.com/rss.xml')">
    🆕 Your Feed Name
</span>
```

### Modifying the Color Scheme
```css
/* In index.html <style> section, update these CSS variables */
:root {
    --bg-primary: #1a1a2e;      /* Main background */
    --accent-green: #16db93;    /* Primary accent */
    --accent-orange: #f39c12;   /* Secondary accent */
    --text-light: #eee;         /* Main text */
    --panel-bg: #0f3460;        /* Panel backgrounds */
}
```

## 🌐 Production Deployment

For production use:

1. **Host on any web server** (Apache, Nginx, or static hosting)
2. **Enable HTTPS** for secure API calls
3. **Consider rate limiting** for high-traffic scenarios
4. **Monitor API quotas** for your chosen RSS services

## 📝 License

This project is open source and available for educational use.

## 🤝 Contributing

Feel free to submit issues, fork the repository, and create pull requests for any improvements.

---

**Perfect for CMPS 357 and other web development courses!** 🎓
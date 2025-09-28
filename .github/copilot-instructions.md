# GitHub Copilot Instructions for CMPS 357 API Calls Demo

## Repository Overview

This is an educational web application demonstrating API integration patterns for the CMPS 357 course. The project showcases RSS-to-JSON API calls with a projector-friendly interface optimized for classroom presentations.

## Code Guidelines

### Project Context
- **Primary Purpose**: Educational demonstration of API calls and error handling patterns
- **Target Audience**: Computer science students learning web development and API integration
- **Presentation Environment**: Designed for classroom projectors with high contrast, readable styling

### Coding Standards

#### JavaScript
- Use modern ES6+ syntax with async/await patterns
- Implement comprehensive error handling with try/catch blocks
- Maintain clean separation between API logic, UI manipulation, and utility functions
- Include detailed comments explaining API integration patterns for educational value
- Use descriptive variable names that help students understand the code flow

#### CSS/Styling
- **Critical**: Maintain projector-friendly color scheme with high contrast
- Use CSS custom properties (variables) for consistent theming
- Colors must work well on projectors:
  - Background: Dark navy (`#1a1a2e`)
  - Primary accent: Bright green (`#16db93`)
  - Secondary accent: Orange (`#f39c12`)
  - Text: Light gray (`#eee`)
- Ensure font sizes are large enough for classroom visibility (minimum 16px for body text)
- Maintain responsive design that works on various screen sizes

#### HTML Structure
- Use semantic HTML5 elements for accessibility
- Include ARIA labels and proper form associations
- Structure content logically for screen readers and educational clarity

### API Integration Patterns
- Implement fallback mechanisms between multiple API services
- Always include proper error handling and user feedback
- Show loading states and clear error messages
- Demonstrate CORS handling techniques
- Include API metadata display for educational transparency

### Educational Considerations
- Code should be readable and well-documented for learning purposes
- Include example RSS feeds that are reliable and educational
- Maintain development log in README.md with timestamps for project history
- Ensure all features work offline with mock data when APIs are unavailable

### File Organization
- `index.html`: Main interface with projector-optimized styling
- `app.js`: JavaScript with API logic, error handling, and utility functions
- `README.md`: Comprehensive documentation with development log
- `api_lecture_plan.md`: Educational lecture planning document

### Feature Requirements
- RSS feed URL input with validation
- Click-to-use example feeds for quick demonstration
- Real-time API calls with timing display
- JSON data formatting and display
- Error handling with educational error messages
- Loading indicators and user feedback
- Dark theme optimized for projectors

### Maintenance Guidelines
- Verify RSS feed examples regularly (replace broken feeds)
- Update API services if current ones become unavailable
- Maintain backward compatibility for educational consistency
- Document all changes in the README development log with timestamps
- Test all features both online and offline (with mock data)

## Development Workflow

### Making Changes
1. Always test changes with multiple RSS feeds
2. Verify projector-friendly styling is maintained
3. Ensure educational value is preserved or enhanced
4. Update documentation and development log
5. Test error scenarios and fallback mechanisms

### Adding New Features
- Consider educational impact and classroom utility
- Maintain simple, understandable code structure
- Include comprehensive error handling
- Add to the development log with timestamps
- Ensure features work in presentation environments

### Code Review Priorities
1. **Educational clarity**: Code should be understandable by students
2. **Projector compatibility**: Styling must work well in classrooms
3. **Error handling**: Robust fallback mechanisms for reliability
4. **Documentation**: Comprehensive comments and README updates
5. **Accessibility**: Proper semantic HTML and ARIA labels

## Repository-Specific Notes

- This project is used for live classroom demonstrations
- Changes should enhance the educational experience
- Maintain the development log format for project history tracking
- All API integrations should include educational metadata display
- Keep the interface clean and distraction-free for presentations
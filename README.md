# 📦 Snylmail & Animation Studio

A beautifully designed, worldwide parcel tracking application with support for major international carriers. Also includes a professional animation design studio for creating and exporting animations with AI-agent-ready specifications.

![Snylmail](https://img.shields.io/badge/status-active-success.svg)
![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)

## 🎯 What's Inside

### 📦 Snylmail
Track packages from anywhere in the world with real-time carrier detection and beautiful UI.

### ⚡ Animation Studio
A visual design tool that bridges the gap between visual/interactive design and AI code generation. Design animations visually, export perfect specifications for AI agents.

## ✨ Features

- 🌍 **Worldwide Carrier Support** - Track packages from 12+ international carriers
- 🎨 **Beautiful UI** - Modern gradient design with smooth animations
- 📱 **Responsive Design** - Works perfectly on mobile, tablet, and desktop
- 🔍 **Auto-Detection** - Automatically identifies carrier from tracking number
- ⚡ **Real-time Validation** - Instant feedback as you type
- 📊 **Visual Timeline** - Clear status updates with location history
- 🎯 **User-Friendly** - Simple, intuitive interface

## 🌐 Supported Carriers

- **UPS** - United Parcel Service (Worldwide)
- **FedEx** - Federal Express (Worldwide)
- **USPS** - United States Postal Service
- **DHL** - DHL Express (Worldwide)
- **Royal Mail** - United Kingdom
- **Canada Post** - Canada
- **Australia Post** - Australia
- **China Post** - China
- **Japan Post** - Japan
- **Deutsche Post** - Germany
- **La Poste** - France
- **Correos** - Spain

## 🚀 Quick Start

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, or Edge)
- No server or dependencies required!

### Installation

1. Clone the repository:
```bash
git clone https://github.com/rplusr/stunning-octo-spork.git
cd stunning-octo-spork
```

2. Open `index.html` in your web browser:
```bash
# On macOS
open index.html

# On Linux
xdg-open index.html

# On Windows
start index.html
```

That's it! The application runs entirely in the browser with no build step required.

## 📖 Usage

### Tracking a Package

1. **Enter Tracking Number**: Type or paste your tracking number in the input field
2. **Auto-Detection**: The app will automatically detect the carrier
3. **Track**: Click the "Track Package" button or press Enter
4. **View Results**: See detailed tracking information, timeline, and package details

### Example Tracking Numbers

Try these example tracking numbers to test the application:

- **UPS**: `1Z999AA10123456784`
- **FedEx**: `123456789012`
- **USPS**: `9400111899562843678599`
- **DHL**: `1234567890`
- **Royal Mail**: `AB123456789GB`
- **Canada Post**: `1234567890123456`
- **Australia Post**: `AB123456789AU`
- **China Post**: `AB123456789CN`

## 🎨 Design Features

### Modern UI Elements

- **Animated Gradient Background**: Smooth, continuously shifting gradient
- **Glass Morphism Cards**: Frosted glass effect with backdrop blur
- **Smooth Animations**: Fade-in, slide, and hover effects
- **Responsive Layout**: Adapts to all screen sizes
- **Interactive Timeline**: Visual representation of package journey
- **Status Indicators**: Color-coded status with custom icons

### Color Palette

- Primary: Indigo/Purple gradient
- Success: Green (delivered status)
- Warning: Amber (out for delivery)
- Info: Blue (in transit)

## 🔧 Technical Details

### Technologies Used

- **HTML5** - Semantic markup
- **CSS3** - Modern styling with animations and gradients
- **Vanilla JavaScript** - No frameworks or dependencies
- **Google Fonts** - Inter font family
- **SVG Icons** - Custom vector graphics

### File Structure

```
stunning-octo-spork/
├── index.html          # Main HTML file
├── styles.css          # Stylesheet with animations
├── script.js           # JavaScript logic
└── README.md           # Documentation
```

### Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🎯 Carrier Detection

The application uses regular expression patterns to identify carriers from tracking numbers:

### UPS
- Format: `1Z` followed by 16 alphanumeric characters
- Example: `1Z999AA10123456784`

### FedEx
- Formats: 12, 15, or 20 digits
- Example: `123456789012`

### USPS
- Formats: 20-22 digits starting with 94, 92, 93, or 82
- International: 2 letters + 9 digits + `US`
- Example: `9400111899562843678599`

### DHL
- Formats: 10-11 digits or 3 letters + 7 digits
- Example: `1234567890`

### International Carriers
- Format: 2 letters + 9 digits + country code
- Example: `AB123456789GB` (Royal Mail)

## 🔮 Demo Mode

Since this is a frontend-only application, tracking data is generated for demonstration purposes. In a production environment, you would integrate with carrier APIs:

- UPS API
- FedEx Web Services
- USPS Web Tools
- DHL API
- And respective carrier APIs for other services

---

# ⚡ Animation Studio

## The Problem It Solves

AI coding agents like Claude and Cursor have dramatically reduced the time it takes to go from idea to functional software. But the experience of designing and refining visual and interactive elements with them is challenging.

The terminal is an incredible tool for communicating direction with language, but it's terrible for defining and exploring visual and interactive objects like animations.

In the old world, creating animations meant:
1. Type some code like `cubic-bezier(0.3, 0.05, 0.45, 1)`
2. Refresh your browser
3. Realize it doesn't feel right (because who can know what those numbers feel like?)
4. Edit values, save, refresh, repeat...

**Animation Studio solves this** by letting you:
1. Design animations visually in real-time
2. Adjust properties and see instant feedback
3. Export perfect specifications for AI agents
4. Paste into your terminal and have your agent implement it everywhere

## ✨ Animation Studio Features

- 🎨 **Real-time Visual Editor** - See your animations as you design them
- 📐 **Interactive Bezier Curve Editor** - Drag control points to create custom easing functions
- 🎯 **Component Previews** - Test animations on buttons, cards, modals, notifications, and badges
- ⚙️ **Precise Controls** - Fine-tune duration, delay, and easing with real-time feedback
- 📤 **Multi-format Export** - Generate CSS, JavaScript, and AI-ready prompts
- 🔄 **Play & Loop Controls** - Test animations in different scenarios
- 💾 **Copy to Clipboard** - One-click copy for all export formats

## 🎬 Animation Types

The studio includes 11 pre-built animation types:

- **Fade In/Out** - Smooth opacity transitions
- **Slide In** (Up, Down, Left, Right) - Directional entrances
- **Scale In/Out** - Zoom effects
- **Rotate In** - Spinning entrance with scale
- **Bounce In** - Playful bouncing effect
- **Shake** - Attention-grabbing oscillation

## 🚀 Getting Started with Animation Studio

### Open the Studio

```bash
# On macOS
open animation-studio.html

# On Linux
xdg-open animation-studio.html

# On Windows
start animation-studio.html
```

### Using the Studio

1. **Choose a Component** - Select the UI element you want to animate (button, card, modal, etc.)

2. **Pick an Animation** - Choose from 11 pre-built animation types

3. **Adjust Timing** - Fine-tune duration (100-3000ms) and delay (0-2000ms)

4. **Select Easing** - Choose from presets or create custom cubic-bezier curves

5. **Preview** - Click Play to see your animation in action

6. **Export** - Copy CSS, JavaScript, or AI-ready prompts

### The Visual Bezier Editor

The crown jewel of the Animation Studio is the interactive cubic-bezier curve editor:

- **Visual Canvas** - See your timing function as a curve
- **Draggable Control Points** - Intuitively adjust P1 and P2 handles
- **Real-time Updates** - Watch the animation update as you drag
- **Precise Input** - Fine-tune with numeric inputs for exact values

Instead of guessing what `cubic-bezier(0.3, 0.05, 0.45, 1)` feels like, you can **see it, drag it, feel it**.

### Export Formats

#### CSS Export
```css
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.animated-element {
  animation: fadeIn 600ms ease;
}
```

#### JavaScript Export
```javascript
const element = document.querySelector('.your-element');

element.animate([
  { opacity: 0 },
  { opacity: 1 }
], {
  duration: 600,
  delay: 0,
  easing: 'ease',
  fill: 'forwards'
});
```

#### AI Agent Prompt
```
Implement a fade in animation for button components with
the following exact specifications:

ANIMATION DETAILS:
- Name: fadeIn
- Type: Fade In
- Duration: 600ms
- Easing: ease

KEYFRAMES:
from:
  opacity: 0
to:
  opacity: 1

IMPLEMENTATION REQUIREMENTS:
1. Create a CSS @keyframes animation named "fadeIn"
2. Apply this animation to all button components
3. Use the exact timing function: ease
4. The animation should feel smooth and polished
5. Ensure the animation works across all modern browsers

FEEL:
The animation should feel smooth and balanced, natural and organic.
```

## 🎯 Workflow Example

### Traditional Workflow (The Old Way)
1. Write code: `animation: slideIn 600ms cubic-bezier(0.3, 0.05, 0.45, 1);`
2. Refresh browser
3. "Hmm, too fast and feels weird"
4. Edit: `animation: slideIn 800ms ease-out;`
5. Refresh browser
6. "Better, but the easing isn't quite right"
7. Edit: `animation: slideIn 800ms cubic-bezier(0.2, 0.8, 0.2, 1);`
8. Refresh browser
9. Repeat 10+ times...

### Animation Studio Workflow (The New Way)
1. Open Animation Studio
2. Select "Slide In Up" animation
3. Drag duration slider while watching live preview
4. Switch between easing presets to find the right feel
5. Or drag bezier curve control points for perfect custom easing
6. Click "Copy" on AI Prompt
7. Paste into terminal: "Claude, implement this animation"
8. Done. Perfect. First try.

## 🎨 Visual Interface

The studio features a **3-panel professional layout**:

### Left Panel: Controls
- Component selector
- Animation type dropdown
- Duration slider with live value
- Delay slider with live value
- Easing presets (6 common functions)
- Custom bezier curve editor with draggable points

### Center Panel: Live Preview
- Real-time animation preview
- Grid background for spatial reference
- Play button to trigger animation
- Loop toggle for continuous playback
- Actual component rendering (not just mockups)

### Right Panel: Export
- CSS code with syntax highlighting
- JavaScript implementation examples
- AI-ready prompt with detailed specifications
- One-click copy buttons for each format
- Specifications include the "feel" of the animation

## 🛠️ Technical Implementation

### Technologies
- Pure HTML5, CSS3, JavaScript
- Canvas API for bezier curve visualization
- Web Animations API support
- CSS custom properties for theming
- Zero dependencies, zero build step

### File Structure
```
stunning-octo-spork/
├── animation-studio.html    # Studio interface
├── animation-studio.js      # Interactive logic
└── ...
```

### Dark Theme Design
- Professional dark UI optimized for long sessions
- Reduced eye strain
- Syntax-highlighted code blocks
- Accent colors for visual hierarchy

## 💡 Why This Matters

**Before:** Describing animation feel through text alone is like describing a color to someone who can't see it. Words like "smooth", "snappy", "organic" mean different things to different people.

**After:** You design the exact animation you want, see it working in context, and export a specification that captures your intent with perfect clarity. No ambiguity, no back-and-forth, no "that's not quite what I meant."

This is the future of working with AI agents: **Visual tools for visual problems, language for everything else.**

## 🔄 Integration with AI Workflows

### Step 1: Design Visually
Open Animation Studio, experiment with settings, find the perfect feel.

### Step 2: Export Specification
Click "Copy" on the AI Prompt export.

### Step 3: Implement with AI
Paste into your terminal:
```
Claude, implement this animation across all modals in the application:

[Paste detailed specification]
```

### Step 4: Done
Your AI agent implements it perfectly, first try, because the specification is unambiguous and complete.

## 📱 Mobile Responsive

The application is fully responsive and optimized for:

- **Desktop**: Full-width layout with side-by-side information
- **Tablet**: Stacked layout with optimized spacing
- **Mobile**: Single-column layout with touch-friendly buttons

## 🎨 Customization

### Changing Colors

Edit the CSS variables in `styles.css`:

```css
:root {
    --primary-color: #6366f1;
    --secondary-color: #ec4899;
    --success-color: #10b981;
    /* Add your custom colors */
}
```

### Adding More Carriers

Edit the `carriers` object in `script.js`:

```javascript
const carriers = {
    yourCarrier: {
        name: 'Your Carrier Name',
        patterns: [
            /^YOUR_REGEX_PATTERN$/i
        ],
        website: 'https://yourcarrier.com'
    }
};
```

## 🚀 Future Enhancements

Potential features for future versions:

- Real carrier API integration
- Push notifications for status updates
- Save tracking numbers to local storage
- Multi-package tracking dashboard
- QR code scanning for tracking numbers
- Email notifications
- Internationalization (i18n)
- Dark mode toggle

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💻 Author

Created with ❤️ for worldwide package tracking

## 🙏 Acknowledgments

- Font: Inter by Rasmus Andersson
- Icons: Custom SVG designs
- Inspiration: Modern web design trends

## 📞 Support

If you have any questions or need help, please open an issue in the repository.

---

**Happy Tracking!** 📦✨

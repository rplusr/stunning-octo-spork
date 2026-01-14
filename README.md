# 📦 Global Parcel Tracker

A beautifully designed, worldwide parcel tracking application with support for major international carriers. Track your packages from anywhere in the world with an elegant, responsive interface.

![Parcel Tracker](https://img.shields.io/badge/status-active-success.svg)
![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)

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

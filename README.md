# 📦 Snylmail

Track the trail of your mail - A beautifully designed, worldwide parcel tracking application with support for major international carriers, checksum validation, and AI-powered delivery predictions.

![Snylmail](https://img.shields.io/badge/status-active-success.svg)
![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)

## ✨ Features

- 🌍 **Worldwide Carrier Support** - Track packages from 12+ international carriers
- 🤖 **AI-Powered Predictions** - Smart delivery date predictions with confidence levels
- ✅ **Checksum Validation** - Validates tracking numbers for UPS, FedEx, and USPS
- 🎨 **Beautiful Minimal UI** - Clean, distraction-free design inspired by Things and 1Password
- 📱 **Responsive Design** - Works perfectly on mobile, tablet, and desktop
- 🔍 **Auto-Detection** - Automatically identifies carrier from tracking number
- 🗺️ **Interactive Maps** - Visualize package journey with OpenStreetMap
- 👤 **User Accounts** - Save parcels with Google/Apple sign-in
- 📦 **Parcel Naming** - Give your packages memorable names
- 📊 **Visual Timeline** - Clear status updates with location history

## 🌐 Supported Carriers

### North America
- **UPS** - United Parcel Service (Worldwide)
- **FedEx** - Federal Express (Worldwide)
- **USPS** - United States Postal Service
- **Old Dominion Freight** - LTL freight carrier (USA)
- **XPO Logistics** - Freight and logistics (USA)
- **R+L Carriers** - LTL freight carrier (USA)
- **Canada Post** - Canada

### Europe
- **DHL** - DHL Express (Worldwide)
- **TNT Express** - Express delivery (Europe)
- **Royal Mail** - United Kingdom
- **Deutsche Post** - Germany
- **La Poste** - France
- **Correos** - Spain

### Asia & Pacific
- **SF Express** - Leading express delivery (China/Asia)
- **J&T Express** - Express delivery (Southeast Asia)
- **ZTO Express** - Express delivery (China)
- **YTO Express** - Express delivery (China)
- **STO Express** - Express delivery (China)
- **Yunda Express** - Express delivery (China)
- **Best Express** - Express delivery (China)
- **Cainiao** - Alibaba logistics network (China)
- **Ninja Van** - Express delivery (Southeast Asia)
- **Kerry Express** - Express delivery (Thailand/Asia)
- **China Post** - China
- **Japan Post** - Japan
- **Australia Post** - Australia

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

## 🤖 AI-Powered Delivery Predictions

Snylmail includes an intelligent delivery prediction system that analyzes multiple factors to estimate when your package will arrive:


### How It Works

- **Current Status Analysis**: Evaluates the current package status (Delivered, Out for Delivery, In Transit, etc.)
- **Service Type Recognition**: Factors in Express, Priority, Standard, or Economy shipping
- **Carrier Patterns**: Applies carrier-specific delivery time patterns
- **Journey Analysis**: Reviews the number and timing of tracking events
- **Confidence Scoring**: Provides a confidence level (60-95%) for each prediction

### Example Predictions

- **Out for Delivery**: Today (95% confidence)
- **In Transit (Express)**: 1-2 days (85% confidence)
- **Picked Up (Standard)**: 5-7 days (75% confidence)

The AI prediction appears as a prominent banner in the tracking results, showing:
- Estimated delivery date
- Confidence percentage
- Reasoning behind the prediction

## ✅ Checksum Validation

To ensure tracking number accuracy, Snylmail validates tracking numbers using carrier-specific checksum algorithms:

### Supported Validation

- **UPS**: Mod 10 check digit validation for 1Z tracking numbers
- **FedEx**: Mod 10 validation for 12 and 15-digit tracking numbers
- **USPS**: Mod 10 validation for 20-22 digit tracking numbers

### How It Works

When you enter a tracking number:
1. Pattern matching identifies the potential carrier
2. Checksum algorithm verifies the tracking number is valid
3. If validation fails, you'll see an error message explaining the issue
4. Only valid tracking numbers proceed to tracking

This prevents typos and ensures you're tracking legitimate package numbers.

## 🔐 Firebase Setup (Optional)

Snylmail includes Firebase integration for user accounts and saving parcels. To enable these features:

### 1. Create a Firebase Project

Visit [Firebase Console](https://console.firebase.google.com/) and create a new project.

### 2. Enable Authentication

- Go to Authentication > Sign-in method
- Enable Google and/or Apple sign-in providers

### 3. Create Firestore Database

- Go to Firestore Database
- Create database in production mode
- Set security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/parcels/{parcelId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### 4. Add Configuration

Update `auth.js` with your Firebase config:

```javascript
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};
```

### Demo Mode

Without Firebase configuration, the app falls back to localStorage for saving parcels (no authentication required).

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
    --primary: #0066ff;
    --success: #00c853;
    --warning: #ff9500;
    --danger: #ff3b30;
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

For carriers with checksum validation, also add a validator function:

```javascript
checksumValidators.validateYourCarrier = (trackingNumber) => {
    // Implement your checksum logic
    return true; // or false
};
```


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

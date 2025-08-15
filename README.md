# 🎮 Pillar Valley - React Native 3D Game

> A thrilling 3D pillar jumping game built with React Native, Expo, and Three.js

Jump from pillar to pillar in this addictive 3D arcade game! Test your timing and precision as you navigate through an endless world of floating pillars. Built with modern React Native technologies for smooth cross-platform gameplay.

## 🚀 Quick Start

```bash
# Clone and install
git clone https://github.com/AmanAJ21/Pillar-Valley-3D.git
cd game
npm install

# Start development server
npm start
```

# 🙏 Acknowledgements

This project is inspired by and acknowledges the following repositories:

- **[Evan Bacon's Pillar Valley](https://github.com/EvanBacon/pillar-valley)** - Original concept and inspiration. The original idea and concept belong to Evan Bacon.
- **[bionicop's Pillar Valley](https://github.com/bionicop/pillar-valley)** - Additional implementation reference and inspiration.

This implementation serves as a learning exercise and academic project recreation.

## ✨ Features

- 🎯 **Addictive 3D Gameplay** - Jump between pillars with precise timing
- 📱 **Cross-Platform** - Runs on iOS, Android, and Web
- 🎨 **Stunning 3D Graphics** - Powered by Three.js and React Three Fiber
- ⚡ **Smooth Performance** - Optimized with Expo GL for 60fps gameplay
- 🎮 **Intuitive Controls** - Simple tap-to-jump mechanics
- 🏆 **Endless Challenge** - Procedurally generated pillar layouts

## Prerequisites

Before running this project, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (version 16 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- For iOS development: [Xcode](https://developer.apple.com/xcode/)
- For Android development: [Android Studio](https://developer.android.com/studio)

## 📦 Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/AmanAJ21/Pillar-Valley-3D.git
   cd game
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```

## 🎮 How to Play

1. **Tap to Jump** - Tap anywhere on the screen to make your character jump
2. **Time Your Jumps** - Wait for the right moment to land on the next pillar
3. **Avoid Falling** - Miss a pillar and it's game over!
4. **Beat Your High Score** - See how far you can go

## 🚀 Running the App

### Development Server
```bash
npm start          # Start Expo development server
```

### Platform-Specific Commands
```bash
npm run android    # Run on Android device/emulator
npm run ios        # Run on iOS device/simulator  
npm run web        # Run in web browser
```

## 📁 Project Structure

```
├── src/
│   ├── assets/              # 🖼️  Images, fonts, and static assets
│   ├── components/          # ⚛️  React components
│   │   ├── ads/            # 📢 Advertisement components
│   │   └── PillarJumpGame.js # 🎮 Main game component
│   ├── config/             # ⚙️  Configuration files
│   └── utils/              # 🛠️  Utility functions
├── android/                # 🤖 Android-specific files
├── .expo/                  # 📱 Expo configuration
├── App.js                  # 🚀 Main application entry point
├── app.json               # 📋 Expo app configuration
└── package.json           # 📦 Dependencies and scripts
```

## 🛠️ Tech Stack

### Core Technologies
- **React Native** - Cross-platform mobile development
- **Expo** - Development platform and build tools
- **Three.js** - 3D graphics rendering engine
- **React Three Fiber** - React renderer for Three.js
- **Expo GL** - OpenGL bindings for native performance

### Development Tools
- **Babel** - JavaScript transpilation
- **Sharp** - Image processing and optimization
- **Metro** - JavaScript bundler

## 🔧 Development

### Adding New Features
1. **Components** - Create new React components in `src/components/`
2. **Utilities** - Add helper functions in `src/utils/`
3. **Assets** - Place images, sounds, and models in `src/assets/`
4. **Configuration** - Update settings in `src/config/`

### Building for Production

```bash
# Modern Expo builds (recommended)
eas build --platform android
eas build --platform ios
eas build --platform web

# Legacy builds
expo build:android
expo build:ios
expo build:web
```

### Code Style
- Use ESLint and Prettier for consistent formatting
- Follow React Native best practices
- Keep components small and focused
- Use TypeScript for better type safety (recommended)


## 🌟 Show Your Support

If you found this project helpful, please give it a ⭐ on GitHub!

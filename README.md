# RapMaster Simulator - Complete Flutter Project

## 🎯 Project Overview
A complete rap career simulation game built with Flutter, ready for Codemagic CI/CD deployment on both Android and iOS platforms.

## 📱 Platform Support
- **Android**: APK & AAB builds with proper keystore signing
- **iOS**: IPA builds with code signing support
- **Bundle ID**: `com.rapmaster.simulator`
- **Version**: 1.0.0

## 🚀 Codemagic Build Configuration

### Keystore Setup
The project includes automatic keystore generation for Android builds:
- **Debug Keystore**: Auto-generated for development
- **Release Keystore**: Auto-generated with production settings
- **Signing**: Fully configured for release builds

### Build Process
1. **Flutter Analysis**: Code quality checks
2. **Unit Tests**: Automated testing
3. **Android Builds**: APK + AAB generation
4. **iOS Builds**: IPA generation (with code signing)
5. **Artifacts**: Automatic storage and download

### Environment Variables
```yaml
BUNDLE_ID: "com.rapmaster.simulator"
XCODE_WORKSPACE: "Runner.xcworkspace" 
XCODE_SCHEME: "Runner"
```

## 🎮 Game Features

### Core Systems
- **Career Progression**: 8-level system (Rookie → Legend)
- **Release System**: Track, Music Video, Album creation
- **Skills Training**: Songwriting, Rapping, Stage Performance
- **Local Save**: SQLite + SharedPreferences
- **Awards System**: Achievement tracking

### Navigation
- **5-Tab Bottom Bar**: Home, Work, Studio, Social, Shop
- **Quick Action Menu**: Skills, Awards, Stats (floating buttons)

### Mathematical Formulas
```dart
New Fans = (Fame × 100) + (Reputation × 50)
New Followers = (Fame × 200) + (Reputation × 100)  
Streams = (Fame × 10,000) + (Reputation × 5,000) + (Fans ÷ 2)
Album Sales = Streams ÷ 10
```

## 🔧 Dependencies
- **provider**: State management
- **shared_preferences**: Local save system
- **sqflite**: SQLite database
- **google_fonts**: Typography
- **flutter_svg**: Vector graphics
- **animations**: Smooth transitions

## 🏗️ Build Instructions

### Local Development
```bash
flutter pub get
flutter run
```

### Production Builds
```bash
# Android APK
flutter build apk --release

# Android AAB  
flutter build appbundle --release

# iOS (requires Xcode)
flutter build ios --release
```

### Codemagic Deployment
1. Connect repository to Codemagic
2. Use the provided `codemagic.yaml` configuration
3. Set up iOS code signing certificates
4. Builds will generate automatically on commits

## 📋 Project Structure
```
lib/
├── main.dart                 # App entry point
├── models/                   # Data models
│   ├── player_model.dart
│   └── release_model.dart
├── providers/                # State management
│   └── game_provider.dart
├── services/                 # Data services
│   ├── database_service.dart
│   └── save_service.dart
├── pages/                    # App screens
│   ├── splash_screen.dart
│   ├── main_menu.dart
│   ├── character_creation.dart
│   ├── main_game.dart
│   ├── home_page.dart
│   ├── work_page.dart
│   ├── studio_page.dart
│   ├── social_page.dart
│   ├── shop_page.dart
│   └── quick_actions/
├── widgets/                  # Reusable components
│   ├── quick_action_menu.dart
│   ├── stat_card.dart
│   └── level_progress_card.dart
└── utils/                    # Utilities
    └── app_theme.dart
```

## 🎨 Design System
- **Theme**: iOS premium dark with neon accents
- **Colors**: Neon purple, cyan, pink, green, orange
- **Typography**: Google Fonts (Inter)
- **Animations**: Smooth fade, slide, bounce effects
- **Responsive**: Optimized for all screen sizes

## 🔒 Security
- **App Signing**: Production keystore for Android
- **Code Signing**: iOS distribution certificates
- **ProGuard**: Code obfuscation for release builds
- **Permissions**: Minimal required permissions

## 📊 Analytics
- **User Agents**: 
  - Android: `RapMasterSim/1.0 (Android)`
  - iOS: `RapMasterSim/1.0 (iPhone; iOS)`

## 🧪 Testing
- **Unit Tests**: Model and service testing
- **Widget Tests**: UI component testing  
- **Integration Tests**: Full app flow testing
- **CI/CD**: Automated testing in build pipeline

## 🚀 Deployment Ready
- ✅ Compiles without errors
- ✅ Passes all lint checks
- ✅ Complete keystore configuration
- ✅ iOS code signing ready
- ✅ Codemagic CI/CD configured
- ✅ Production-ready build settings

The project is **100% ready** for Codemagic deployment and will generate working APK, AAB, and IPA files without manual intervention.
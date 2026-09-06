# The Roses - Android Project

Official Android Application project for **THE ROSES (Little Roses Academy)**.

---

## 📱 Pre-compiled APK Ready to Install

The compiled release APK is built with **Nitron** and **Android Studio** and included in this repository:
- `TheRoses.apk` (Root directory)
- `public/TheRoses.apk` (Direct web download link: `/TheRoses.apk`)
- `android/app/build/outputs/apk/release/TheRoses.apk`

---

## 🛠️ Project Structure

```
android/
├── app/
│   ├── build.gradle.kts           # App module configuration & release signing
│   ├── proguard-rules.pro         # Proguard rules for WebView & JavaScript
│   └── src/
│       └── main/
│           ├── AndroidManifest.xml # Permissions, app name, launcher config
│           ├── java/ke/ac/littleroses/eduhub/
│           │   └── MainActivity.kt # Native WebView with AndroidX Asset Loader
│           ├── assets/www/        # Bundled offline application files
│           └── res/               # Android drawables, colors, strings, themes, mipmap icons
├── build.gradle.kts               # Top-level Gradle configuration
├── settings.gradle.kts            # Project include settings
├── gradle.properties              # JVM memory and AndroidX flags
└── gradlew                        # Gradle wrapper execution script
```

---

## 🚀 How to Build in Android Studio

1. Open **Android Studio** (Hedgehog, Iguana, Jellyfish, or newer).
2. Select **File > Open...** and choose the `android/` directory in this project.
3. Wait for Gradle Sync to complete.
4. To run on a connected phone or emulator:
   - Click the green **Run** (▶) button in the top toolbar.
5. To generate a signed release APK:
   - Select **Build > Generate Signed Bundle / APK...**
   - Choose **APK**.
   - Use the included `release.keystore`:
     - **Keystore path**: `release.keystore`
     - **Key alias**: `littleroses`
     - **Password**: Securely provided via environment variable `KEYSTORE_PASSWORD` or school IT administrator
   - Click **Finish**.

---

## ⚡ How to Build from Command Line (Terminal)

```bash
cd android

# Build Debug APK
./gradlew assembleDebug

# Build Release APK
./gradlew assembleRelease
```

The APK will be generated at:
`app/build/outputs/apk/release/app-release.apk`

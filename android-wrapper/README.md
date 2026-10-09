# Cab Safars Android

Flutter Android app that hosts the Cab Safars web app in a native WebView.

- **Website:** https://web-lake-nine-24.vercel.app/app/
- **Android application ID:** `com.cabsafar`
- **Firebase project:** `cab-safars`

The Android wrapper is based on the MIT-licensed
[Foroshga Mobile](https://github.com/elmira-ashrafi/foroshga-mobile) project.

## Requirements

- Flutter stable with Dart 3.7 or newer
- Android SDK and Android build tools
- JDK supported by the Android Gradle Plugin

## Firebase

The Android Firebase app must be registered with application ID `com.cabsafar`.
The local Android config is `android/app/google-services.json`; it is ignored by
Git. Copy the matching Firebase config there before building. Firebase
initialization and FCM use the Google Services Gradle plugin.

## Build an APK

From this directory:

```bash
flutter pub get
flutter test
flutter build apk --debug
```

The debug APK is written to:

```text
build/app/outputs/flutter-apk/app-debug.apk
```

It is signed with the local Android debug key and is suitable for testing.

For a signed release APK, add the private keystore at
`android/keystore/release-key.jks` and create `android/key.properties`:

```properties
storePassword=<store-password>
keyPassword=<key-password>
keyAlias=<key-alias>
storeFile=../keystore/release-key.jks
```

Then run:

```bash
flutter build apk --release
```

Do not commit the keystore, `android/key.properties`, or
`android/app/google-services.json`.

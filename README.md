# Lie Detector Meter

A mobile lie detector app built with React Native and Expo. Switch between Tap and Voice modes, get a Truth or Lie verdict, and watch the meter react with animations, sound, color flashes, and haptic feedback.

## Tech Stack

- React Native (Expo)
- TypeScript
- NativeWind (Tailwind CSS for React Native)

## Requirements

- Node.js 18+
- npm
- Expo Go on a device, or an Android emulator / iOS simulator

## Setup

```bash
npm install
```

## Running

```bash
npm start
```

Then press `a` to open on Android, `i` for iOS, or scan the QR code with Expo Go.

You can also run a platform directly:

```bash
npm run android
npm run ios
```

## Project Structure

```
.
├── App.tsx              App root
├── index.ts             Entry point
├── global.css           Tailwind directives
├── src/
│   ├── components/       Reusable UI components
│   ├── constants/        Theme and configuration values
│   ├── hooks/            Custom hooks
│   ├── screens/          App screens
│   └── types/            Shared TypeScript types
├── tailwind.config.js
├── metro.config.js
└── babel.config.js
```

## Packages

| Package | Purpose |
| --- | --- |
| expo | React Native framework and tooling |
| nativewind | Tailwind CSS styling for React Native |
| react-native-reanimated | Animations |
| react-native-safe-area-context | Safe area handling |

## Time Taken

_To be filled in on completion._

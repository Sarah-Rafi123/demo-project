# Lie Detector Meter

A polished mobile lie detector app built with React Native and Expo. Switch between Tap and Voice modes, get a Truth or Lie verdict, and watch the meter react with animations, sound, color flashes, and haptic feedback.

## Features

- Tap / Voice mode toggle at the top of the screen
- **Tap Mode**: tap the left "TRUTH" pad or the right "LIE" pad to trigger a verdict
- **Voice Mode**: tap the mic, speak any short sentence, and the meter returns a ~50/50 random verdict
- Animated semicircular gauge with a needle that springs to the chosen side
- Color-coded full-screen flash (green for truth, red for lie)
- Sound effects per verdict (ding for truth, buzzer for lie)
- Haptic feedback on every verdict
- Clean component architecture with reusable hooks

## Tech Stack

- React Native + Expo (SDK 56)
- TypeScript
- NativeWind v4 (Tailwind CSS for React Native)
- React Native Reanimated for animations
- React Native SVG for the meter
- expo-audio for sound playback
- expo-haptics for vibration feedback

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

Run a platform directly:

```bash
npm run android
npm run ios
```

## Building an APK

```bash
npx eas build --platform android --profile preview
```

(Requires an Expo account and `eas-cli`.)

## Project Structure

```
.
├── App.tsx                       App root, mounts providers and HomeScreen
├── index.ts                      Entry point
├── global.css                    Tailwind directives
├── assets/
│   └── sounds/                   truth.wav and lie.wav
├── src/
│   ├── components/
│   │   ├── FlashOverlay.tsx      Full-screen color flash on verdict
│   │   ├── Meter.tsx             Animated semicircular gauge with needle
│   │   ├── ModeToggle.tsx        Tap / Voice segmented control
│   │   ├── ResultLabel.tsx       Animated verdict text
│   │   ├── TapPad.tsx            Left/right tap targets for tap mode
│   │   └── VoiceControl.tsx      Microphone button with listening animation
│   ├── constants/
│   │   └── theme.ts              Colors and timing constants
│   ├── hooks/
│   │   ├── useHaptics.ts         Wraps expo-haptics
│   │   ├── useLieDetector.ts     State machine: mode, status, verdict, flash
│   │   └── useSound.ts           Preloads and plays verdict sounds
│   ├── lib/
│   │   └── random.ts             Random verdict helper
│   ├── screens/
│   │   └── HomeScreen.tsx        Composes the whole screen
│   └── types/
│       └── index.ts              Mode, Verdict, Side
├── tailwind.config.js
├── metro.config.js
└── babel.config.js
```

## Packages

| Package | Purpose |
| --- | --- |
| expo | React Native framework and tooling |
| nativewind | Tailwind CSS styling for React Native |
| react-native-reanimated | Animations (needle, scale, flash) |
| react-native-svg | Semicircular gauge rendering |
| react-native-safe-area-context | Safe area handling |
| expo-audio | Truth / lie sound effects |
| expo-haptics | Vibration feedback on verdicts |

## Notes on Voice Mode

Voice Mode uses a press-to-speak UI with a listening animation, then returns a random Truth or Lie verdict (~50/50). It does not transcribe audio; integrating live speech recognition (e.g. `expo-speech-recognition`) requires a custom dev / EAS build and was out of scope for this submission.

## Time Taken

Approximately 5 hours end-to-end (scaffold + feature work + polish).

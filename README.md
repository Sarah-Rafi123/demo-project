# Lie Detector Meter

A polished mobile lie detector app built with React Native and Expo. Switch between Tap and Voice modes, get a Truth or Lie verdict, and watch the meter react with animations, sound, color flashes, and haptic feedback.

## Features

- Tap / Voice mode toggle at the top of the screen
- **Tap Mode**: tap the left "TRUTH" pad or the right "LIE" pad to trigger a verdict
- **Voice Mode**: hold the mic and speak a short sentence; speech is captured with the device's speech recognition, the live transcript is shown, and the meter returns a ~50/50 random verdict
- Animated semicircular gauge with a needle that springs to the chosen side
- Color-coded full-screen flash (green for truth, red for lie)
- Sound effects per verdict (ding for truth, buzzer for lie)
- Haptic feedback on every verdict
- Clean component architecture with reusable hooks

## Tech Stack

- React Native + Expo (SDK 54)
- TypeScript
- NativeWind v4 (Tailwind CSS for React Native)
- React Native Reanimated for animations
- React Native SVG for the meter
- expo-audio for sound playback
- expo-speech-recognition for voice capture
- expo-haptics for vibration feedback

## Requirements

- Node.js 18+
- npm
- A development build on a device or emulator. Voice Mode uses native speech recognition, so it does not run in Expo Go.

## Setup

```bash
npm install
```

## Running

Voice Mode relies on native speech recognition, so run a development build directly on a device or emulator:

```bash
npm run android
npm run ios
```

The first run compiles the native project and applies the microphone and speech-recognition permissions. Tap Mode also works under `npm start`, but Voice Mode requires the development build above.

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
│   │   ├── useSound.ts           Preloads and plays verdict sounds
│   │   └── useSpeechRecognition.ts  Wraps expo-speech-recognition events
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
| expo-speech-recognition | Voice capture and transcription |
| expo-haptics | Vibration feedback on verdicts |

## Notes on Voice Mode

Hold the mic button to start recognition, speak a short sentence, and release. The captured transcript is shown live, and once speech is recognized the meter returns a random Truth or Lie verdict (~50/50). If permission is denied or no speech is detected, the app shows a short prompt and does not return a verdict. Recognition runs through the platform speech service (`expo-speech-recognition`), so a development build is required — it does not run in Expo Go.

## Time Taken

Approximately 6 hours end-to-end (scaffold + feature work + voice recognition + polish).

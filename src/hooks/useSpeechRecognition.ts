import { useCallback, useRef } from "react";
import {
  ExpoSpeechRecognitionModule,
  useSpeechRecognitionEvent,
} from "expo-speech-recognition";

export interface SpeechHandlers {
  onTranscript: (text: string, isFinal: boolean) => void;
  onEnd: () => void;
  onError: (message: string) => void;
}

export function useSpeechRecognition(handlers: SpeechHandlers) {
  const handlersRef = useRef(handlers);
  handlersRef.current = handlers;

  useSpeechRecognitionEvent("result", (event) => {
    const text = event.results[0]?.transcript ?? "";
    handlersRef.current.onTranscript(text, event.isFinal);
  });

  useSpeechRecognitionEvent("end", () => {
    handlersRef.current.onEnd();
  });

  useSpeechRecognitionEvent("error", (event) => {
    handlersRef.current.onError(event.message || event.error);
  });

  const start = useCallback(async () => {
    try {
      const permission = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
      if (!permission.granted) {
        handlersRef.current.onError(
          "Microphone and speech access are needed for Voice Mode.",
        );
        return false;
      }
      ExpoSpeechRecognitionModule.start({
        lang: "en-US",
        interimResults: true,
        continuous: false,
        maxAlternatives: 1,
      });
      return true;
    } catch {
      handlersRef.current.onError("Could not start voice recognition.");
      return false;
    }
  }, []);

  const stop = useCallback(() => {
    try {
      ExpoSpeechRecognitionModule.stop();
    } catch {}
  }, []);

  return { start, stop };
}

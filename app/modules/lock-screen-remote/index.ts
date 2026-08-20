import { requireOptionalNativeModule } from 'expo';

type SkipEvent = {
  direction: 1 | -1;
};

type NativeModule = {
  addListener(
    event: 'onSkip',
    listener: (event: SkipEvent) => void,
  ): { remove: () => void };
};

const native = requireOptionalNativeModule<NativeModule>('LockScreenRemote');

/**
 * Headphones and CarPlay send next/previous track. expo-audio only wires play/pause,
 * so this module owns those two commands and never a seek (task 020).
 */
export function addSkipListener(listener: (direction: 1 | -1) => void): () => void {
  if (native === null) {
    return () => {};
  }
  const subscription = native.addListener('onSkip', (event) => {
    listener(event.direction);
  });
  return () => {
    subscription.remove();
  };
}

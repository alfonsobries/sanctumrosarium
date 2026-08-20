import { Platform } from 'react-native';
import { requireOptionalNativeModule } from 'expo';

type NativeModule = {
  requestAuthorization(): Promise<boolean>;
  begin(): void;
  end(): Promise<boolean>;
};

const native = requireOptionalNativeModule<NativeModule>('MindfulSession');

/** Health is iPhone-only in this pass. Android Health Connect stays out (task 038). */
export function healthWriteAvailable(): boolean {
  return Platform.OS === 'ios' && native !== null;
}

export async function requestHealthWrite(): Promise<boolean> {
  if (native === null) {
    return false;
  }
  return native.requestAuthorization();
}

export function beginMindfulSession(): void {
  native?.begin();
}

export function endMindfulSession(): void {
  void native?.end();
}

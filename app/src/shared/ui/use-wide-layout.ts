import { useWindowDimensions } from 'react-native';

/** Wide enough (an iPad, a tablet) to lay a screen out in two columns. */
export function useWideLayout(): boolean {
  return useWindowDimensions().width >= 768;
}

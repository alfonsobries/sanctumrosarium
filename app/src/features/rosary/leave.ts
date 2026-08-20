import type { useRouter } from 'expo-router';

type Router = ReturnType<typeof useRouter>;

/** Opened by deep link there is no stack behind: leaving still lands at home. */
export function leaveToHome(router: Router): void {
  if (router.canGoBack()) {
    router.back();
    return;
  }
  router.replace('/');
}

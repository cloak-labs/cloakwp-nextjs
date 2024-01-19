import { useEffect } from "react";
import { useRouter } from "next/router";

function abortRouteChange(abortMsg?: string) {
  throw new Error(abortMsg ?? "Aborting route change by throwing an Error.");
}

export function useAbortRouteChanges(abortMsg?: string) {
  const router = useRouter();
  const eventCallback = (event) => {
    console.log("eventCallback event: ", event);
    return abortRouteChange(abortMsg);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      router.events.on("routeChangeStart", eventCallback);

      return () => {
        router.events.off("routeChangeStart", eventCallback);
      };
    }
  }, [router, abortRouteChange]);
}

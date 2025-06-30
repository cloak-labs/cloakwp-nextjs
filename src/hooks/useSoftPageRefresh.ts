import React from "react";
import { useRouter } from "next/router";

export const useSoftPageRefresh = (pageData: Record<string, any>) => {
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const refresh = () => {
    router.replace(router.asPath, undefined, { scroll: false });
    setIsRefreshing(true);
  };

  React.useEffect(() => {
    setIsRefreshing(false);
  }, [pageData]);

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "q") {
        event.preventDefault();
        refresh();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [router.asPath]);

  return { isRefreshing, refresh };
};

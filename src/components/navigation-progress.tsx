import { useEffect, useRef } from "react";
import { useIsFetching } from "@tanstack/react-query";
import { useRouterState } from "@tanstack/react-router";
import LoadingBar, { LoadingBarRef } from "react-top-loading-bar";

export function NavigationProgress() {
  const ref = useRef<LoadingBarRef>(null);
  const routerState = useRouterState();

  // Only show for queries that have showLoadingBar: true
  const loadingBarQueries = useIsFetching({
    predicate: (query) => query.meta?.showLoadingBar === true,
  });

  useEffect(() => {
    const isLoading = routerState.status === "pending" || loadingBarQueries > 0;

    if (isLoading) {
      ref.current?.continuousStart();
    } else {
      ref.current?.complete();
    }
  }, [routerState.status, loadingBarQueries]);

  return (
    <LoadingBar
      color='var(--muted-foreground)'
      ref={ref}
      shadow={true}
      height={1}
    />
  );
}

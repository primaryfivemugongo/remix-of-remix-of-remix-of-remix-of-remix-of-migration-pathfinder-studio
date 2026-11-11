import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    // 'preserve' stops trailing-slash redirect normalization so the static
    // prerender pass (which requests "<path>/") gets a direct 200 instead of
    // a redirect loop; the splat route strips the slash before lookup.
    trailingSlash: 'preserve',
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    // Fast loads skip the skeleton entirely (the top progress bar still shows),
    // and a skeleton that does appear stays just long enough not to flash.
    // The library default of 500 ms made every slow-ish navigation feel slower.
    defaultPendingMs: 100,
    defaultPendingMinMs: 200,
  });

  return router;
};

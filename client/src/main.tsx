import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes } from "react-router";
import { Route } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { Home } from "./pages/home";
import { Detail } from "./pages/detail";
import { Layout } from "./components/ui/layout";

import "./index.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // With SSR, we usually want to set some default staleTime
      // above 0 to avoid refetching immediately on the client
      // staleTime: 60 * 1000,
      refetchOnWindowFocus: false,
      retry: false,
      networkMode: "always",
      staleTime: 0,
      gcTime: 0,
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="detail" element={<Detail />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
);

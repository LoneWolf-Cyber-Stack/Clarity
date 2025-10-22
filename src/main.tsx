// This script manually configures the Vite HMR websocket for Cloudflare Pages previews.
// In this specific environment, Vite's auto-detection can fail, leading to connection errors.
// By explicitly setting the protocol to 'wss' and the host to the current hostname,
// we ensure the HMR client connects correctly.
if (import.meta.env.DEV) {
  const script = document.createElement('script');
  script.type = 'module';
  script.innerHTML = `
    import RefreshRuntime from "/@react-refresh"
    RefreshRuntime.injectIntoGlobalHook(window)
    window.$RefreshReg$ = () => {}
    window.$RefreshSig$ = () => (type) => type
    window.__vite_plugin_react_preamble_installed__ = true
    // Configure HMR for Cloudflare Pages previews
    window.__vite_hmr_options__ = {
      protocol: 'wss',
      host: location.hostname,
      // The path is typically '/'. Vite's client will default to this if not specified.
    }
    import("/@vite/client");
  `;
  document.body.appendChild(script);
}
import { enableMapSet } from "immer";
enableMapSet();
if (process.env.NODE_ENV === 'production') { import('@/lib/errorReporter'); }
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { RouteErrorBoundary } from '@/components/RouteErrorBoundary';
import '@/index.css'
import { HomePage } from '@/pages/HomePage'
import { AuthPage } from '@/pages/AuthPage';
import { ProtectedRoute } from '@/components/ProtectedRoute';
const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <HomePage />
      </ProtectedRoute>
    ),
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/auth",
    element: <AuthPage />,
    errorElement: <RouteErrorBoundary />,
  },
]);
// Do not touch this code
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  </StrictMode>,
)
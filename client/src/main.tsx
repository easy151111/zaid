import { SDKProvider, useLaunchParams } from '@telegram-apps/sdk-react';
import React, { useMemo, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { TonConnectUIProvider } from '@tonconnect/ui-react';

import { AuthProvider } from "./context/AuthContext";
import { QueryProvider } from "./context/QueryProvider";
import { NotificationProvider } from "./context/NotificationContext";
import { App } from "./App";

import './mockEnv.ts';

const Root = () => {
  const manifestUrl = useMemo(() => {
    return new URL('tonconnect-manifest.json', window.location.href).toString();
  }, []);

  const debug = false; // or set this based on some condition
  console.log(manifestUrl);
  
  useEffect(() => {
    if (debug) {
      import('eruda').then((lib) => lib.default.init());
    }
  }, [debug]);
  
  return (
    <React.StrictMode>
      <BrowserRouter>
        <TonConnectUIProvider manifestUrl={manifestUrl}>
          <SDKProvider acceptCustomStyles debug={debug}>
            <QueryProvider>
              <AuthProvider>
                <NotificationProvider>
                  <App />
                </NotificationProvider>
              </AuthProvider>
            </QueryProvider>
          </SDKProvider>
        </TonConnectUIProvider>
      </BrowserRouter>
    </React.StrictMode>
  );
};

ReactDOM.createRoot(document.getElementById("root")!).render(<Root />);

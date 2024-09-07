<<<<<<< HEAD
import { SDKProvider } from '@telegram-apps/sdk-react';
import React, { useMemo } from "react";
=======
import { SDKProvider, useLaunchParams } from '@telegram-apps/sdk-react';
import React, { useMemo, useEffect } from "react";
>>>>>>> 2555042 (Update)
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { TonConnectUIProvider } from '@tonconnect/ui-react';

import { AuthProvider } from "./context/AuthContext";
import { QueryProvider } from "./context/QueryProvider";
import { NotificationProvider } from "./context/NotificationContext";
import { App } from "./App";

<<<<<<< HEAD
=======
import './mockEnv.ts';

>>>>>>> 2555042 (Update)
const Root = () => {
  const manifestUrl = useMemo(() => {
    return new URL('tonconnect-manifest.json', window.location.href).toString();
  }, []);
<<<<<<< HEAD
=======

  const debug = true; // or set this based on some condition
  console.log(manifestUrl);
  
  useEffect(() => {
    if (debug) {
      import('eruda').then((lib) => lib.default.init());
    }
  }, [debug]);
>>>>>>> 2555042 (Update)
  
  return (
    <React.StrictMode>
      <BrowserRouter>
        <TonConnectUIProvider manifestUrl={manifestUrl}>
<<<<<<< HEAD
          <SDKProvider acceptCustomStyles>
=======
          <SDKProvider acceptCustomStyles debug={debug}>
>>>>>>> 2555042 (Update)
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

import "./polyfills";
import "./index.css";
import "@rainbow-me/rainbowkit/styles.css";
import React from "react";
import ReactDOM from "react-dom/client";
import reportWebVitals from "./reportWebVitals";

import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { http, WagmiProvider } from "wagmi";
import { polygon, polygonAmoy } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import App from "./App";

const config = getDefaultConfig({
  appName: "GameStaker",
  projectId: "c9bfdfeba6902d82c74c3c748bcd073e",
  chains: [
    (process.env.REACT_APP_ENABLE_TESTNET as any) === "false"
      ? polygon
      : polygonAmoy,
  ],
  transports: {
    [polygon.id]: http(),
    [polygonAmoy.id]: http(),
  },
});

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <App />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

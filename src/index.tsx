import "./polyfills";
import "./index.css";
import "@rainbow-me/rainbowkit/styles.css";
import React from "react";
import ReactDOM from "react-dom/client";
import reportWebVitals from "./reportWebVitals";

import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { avalanche, avalancheFuji } from "wagmi/chains";

import App from "./App";

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [
    // avalanche,
    // avalancheFuji,
    ...(process.env.REACT_APP_ENABLE_TESTNET === "true"
      ? [avalancheFuji]
      : [avalanche]),
  ],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: "FishMiner",
  projectId: process.env.REACT_APP_PROJECT_ID as any,
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains}>
        <App />
      </RainbowKitProvider>
    </WagmiConfig>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

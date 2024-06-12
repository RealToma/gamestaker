import "./polyfills";
import "./index.css";
import "@rainbow-me/rainbowkit/styles.css";
import React from "react";
import ReactDOM from "react-dom/client";
import reportWebVitals from "./reportWebVitals";

import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { bsc, bronosTestnet, polygon, polygonMumbai } from "wagmi/chains";

import App from "./App";

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [
    // avalanche,
    // avalancheFuji,
    ...(process.env.REACT_APP_ENABLE_TESTNET === "true"
      ? [bronosTestnet]
      : [bsc]),
  ],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: "GameStaker",
  // projectId: process.env.REACT_APP_PROJECT_ID as any,
  projectId: "c9bfdfeba6902d82c74c3c748bcd073e",
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

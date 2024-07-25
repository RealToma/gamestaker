import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { MetaMaskProvider } from "@metamask/sdk-react";
import RefContextProvider from "./hooks/RefContext";
// import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
// import { http, WagmiProvider } from "wagmi";
// import { polygon, polygonAmoy } from "wagmi/chains";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "@rainbow-me/rainbowkit/styles.css";

// Bootstrap CSS
import "bootstrap/dist/css/bootstrap.min.css";
// Bootstrap Bundle JS
import "bootstrap/dist/js/bootstrap.bundle.min";

const isTestnet: any = true;
// const config = getDefaultConfig({
//   appName: "GameStaker",
//   projectId: "c9bfdfeba6902d82c74c3c748bcd073e",
//   chains: [!isTestnet ? polygon : polygonAmoy],
//   transports: {
//     [polygon.id]: http(),
//     [polygonAmoy.id]: http(),
//   },
// });

// const queryClient = new QueryClient();

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    {/* <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider> */}
    <MetaMaskProvider
      debug={false}
      sdkOptions={{
        logging: {
          developerMode: false,
        },
        communicationServerUrl: "https://metamask-sdk.api.cx.metamask.io/",
        checkInstallationImmediately: false, // This will automatically connect to MetaMask on page load
        i18nOptions: {
          enabled: true,
        },
        dappMetadata: {
          name: "gamestaker",
          url: window.location.protocol + "//" + window.location.host,
        },
      }}
    >
      <RefContextProvider>
        <App />
      </RefContextProvider>
    </MetaMaskProvider>
    {/* </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider> */}
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

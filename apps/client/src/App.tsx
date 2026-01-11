import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";

// Default styles that can be overridden by your app
import "@solana/wallet-adapter-react-ui/styles.css";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import { CreateWorkflow } from "./utils/CreateWorkflow";
import { ThemeProvider } from "./components/ui/theme-provider";

export default function App() {
  return (
    <div>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <BrowserRouter>
          <Routes>
            <Route
              path="/canvas"
              element={
                <ConnectionProvider endpoint={"https://api.devnet.solana.com"}>
                  <WalletProvider wallets={[]} autoConnect>
                    <WalletModalProvider>
                      <CreateWorkflow />
                    </WalletModalProvider>
                  </WalletProvider>
                </ConnectionProvider>
              }
            />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </div>
  );
}

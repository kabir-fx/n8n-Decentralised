import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";

// Default styles that can be overridden by your app
import "@solana/wallet-adapter-react-ui/styles.css";

import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { CreateWorkflow } from "./utils/CreateWorkflow";
import { ThemeProvider } from "./components/ui/theme-provider";
import { Auth } from "./pages/Auth";
import { ProtectedRoute } from "./components/ProtectedRoute";

export default function App() {
  return (
    <div>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/signin" />} />
            <Route path="/signin" element={<Auth />} />
            <Route path="/signup" element={<Auth />} />
            <Route
              path="/canvas"
              element={
                <ProtectedRoute>
                  <ConnectionProvider
                    endpoint={"https://api.devnet.solana.com"}
                  >
                    <WalletProvider wallets={[]} autoConnect>
                      <WalletModalProvider>
                        <CreateWorkflow />
                      </WalletModalProvider>
                    </WalletProvider>
                  </ConnectionProvider>
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </div>
  );
}

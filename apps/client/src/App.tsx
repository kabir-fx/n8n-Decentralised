import { BrowserRouter, Route, Routes } from "react-router-dom";
import { CreateWorkflow } from "./utils/CreateWorkflow";
import { ThemeProvider } from "./components/ui/theme-provider";

export default function App() {

  return <div>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <BrowserRouter>
        <Routes>
          <Route path="/canvas" element={<CreateWorkflow />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  </div>
}
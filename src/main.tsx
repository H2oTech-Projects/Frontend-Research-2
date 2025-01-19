import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { ThemeProvider } from "./context/theme-provider";
import { BrowserRouter as Router } from "react-router-dom";
createRoot(document.getElementById("root")!).render(
    <Router basename="/">
        <ThemeProvider
            defaultTheme="system"
            storageKey="ui-theme"
        >
            <App />
        </ThemeProvider>
    </Router>,
);

import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ThemeProvider } from "./context/theme-provider.tsx";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";

import store from "./redux/store/store.ts";
createRoot(document.getElementById("root")!).render(
    <Router basename="/">
        <ThemeProvider
            defaultTheme="system"
            storageKey="ui-theme"
        >
            <Provider store={store}>
                <App />
            </Provider>
        </ThemeProvider>
    </Router>,
);

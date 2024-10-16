import { lazy, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

// import App from "./App.tsx";
const App = lazy(() => import("./App")); // デバッグ用にApp.tsxが別.jsにビルドされるようにする

const root = document.getElementById("root");
if (!root) {
	throw new Error("Root element not found");
}
createRoot(root).render(
	<StrictMode>
		<App />
	</StrictMode>,
);

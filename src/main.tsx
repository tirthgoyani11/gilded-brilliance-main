import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

declare global {
	interface Window {
		dataLayer?: unknown[];
	}
}

const initOptionalGA = () => {
	const gaId = import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined;
	if (!gaId) return;

	const script = document.createElement("script");
	script.async = true;
	script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId)}`;
	document.head.appendChild(script);

	window.dataLayer = window.dataLayer || [];
	const gtag = (...args: unknown[]) => {
		window.dataLayer?.push(args);
	};

	gtag("js", new Date());
	gtag("config", gaId);
};

initOptionalGA();

createRoot(document.getElementById("root")!).render(<App />);

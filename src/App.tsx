import Color from "color";
import { format } from "date-fns";
import "./App.css";

function App() {
	const color = Color("rgb(255, 255, 255)");
	return (
		<>
			<h1>Vite + React CDN test</h1>
			<p>今日は {format(new Date(), "yyyy年MM月dd日")} です。</p>
			<p>{color.hex()} は白い色です。</p>
		</>
	);
}

export default App;

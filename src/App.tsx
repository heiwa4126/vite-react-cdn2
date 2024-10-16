// import { format } from "date-fns/format";
import * as dateFns from "date-fns";
import "./App.css";

function App() {
	return (
		<>
			<h1>Vite + React CDN test</h1>
			<p>今日は {dateFns.format(new Date(), "yyyy年MM月dd日")} です。</p>
		</>
	);
}

export default App;

// STATE

function App() {
	const [count, setCount] = useState(0);

	function countInc() {
		setCount(count + 1)
	}

	function countDec() {
		setCount(count - 1)
	}

	return (
		<div className="App">
			<h1>List</h1>
			<p>{count}</p>
			<button onClick={countInc}>+1</button>
			<button onClick={countDec}>-1</button>
		</div>
	);
}
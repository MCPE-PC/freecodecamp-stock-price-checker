document.querySelector('#testForm2').addEventListener('submit', (event) => {
	event.preventDefault();
	const stock = event.target[0].value;
	const checkbox = event.target[1].checked;
	fetch(`/api/stock-prices/?stock=${stock}&like=${checkbox}`)
		.then((result) => result.json())
		.then((data) => {
			document.querySelector('#jsonResult').textContent = JSON.stringify(data);
		});
});

document.querySelector('#testForm').addEventListener('submit', (event) => {
	event.preventDefault();
	const stock1 = event.target[0].value;
	const stock2 = event.target[1].value;
	const checkbox = event.target[2].checked;
	fetch(`/api/stock-prices?stock=${stock1}&stock=${stock2}&like=${checkbox}`)
		.then((result) => result.json())
		.then((data) => {
			document.querySelector('#jsonResult').textContent = JSON.stringify(data);
		});
});

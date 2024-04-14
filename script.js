document.addEventListener('DOMContentLoaded', () => {
  fetch('/tickerData')
    .then(response => response.json())
    .then(data => {
      const tickerList = document.getElementById('tickerList');
      data.forEach(ticker => {
        const li = document.createElement('li');
        li.textContent = `${ticker.name} | Last: ${ticker.last} | Buy: ${ticker.buy} | Sell: ${ticker.sell} | Volume: ${ticker.volume} | Base Unit: ${ticker.base_unit}`;
        tickerList.appendChild(li);
      });
    })
    .catch(error => console.error('Error fetching ticker data:', error));
});

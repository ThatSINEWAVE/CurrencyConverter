document.addEventListener('DOMContentLoaded', function () {
  const fromInput = document.getElementById('from');
  const toInput = document.getElementById('to');
  const fromCurrency = document.getElementById('fromCurrency');
  const toCurrency = document.getElementById('toCurrency');
  const exchangeRateDiv = document.getElementById('exchangeRate');
  const lastUpdatedDiv = document.getElementById('lastUpdated');

  function fetchExchangeRate() {
    const amount = parseFloat(fromInput.value);
    const from = fromCurrency.value;
    const to = toCurrency.value;

    if (!isNaN(amount)) {
      fetch(`https://api.fxratesapi.com/convert?date=2024-05-27&from=${from}&to=${to}&amount=${amount}`)
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            const rate = data.info.rate;
            const result = data.result;
            const date = new Date(data.date).toLocaleString();
            exchangeRateDiv.textContent = `Exchange rate of ${from} to ${to} is ${rate.toFixed(6)} ${from} for 1 ${to}`;
            toInput.value = result.toFixed(2);
            lastUpdatedDiv.textContent = `Last updated at ${date}`;
          } else {
            exchangeRateDiv.textContent = 'Failed to fetch exchange rate';
            toInput.value = '';
            lastUpdatedDiv.textContent = '';
          }
        })
        .catch(error => {
          console.error('Error:', error);
          exchangeRateDiv.textContent = 'Failed to fetch exchange rate';
          toInput.value = '';
          lastUpdatedDiv.textContent = '';
        });
    } else {
      exchangeRateDiv.textContent = '';
      toInput.value = '';
      lastUpdatedDiv.textContent = '';
    }
  }

  fromInput.addEventListener('input', fetchExchangeRate);
  fromCurrency.addEventListener('change', fetchExchangeRate);
  toCurrency.addEventListener('change', fetchExchangeRate);

  // Swap functionality
  document.querySelector('.swap-icon').addEventListener('click', function () {
    const temp = fromCurrency.value;
    fromCurrency.value = toCurrency.value;
    toCurrency.value = temp;
    fetchExchangeRate();
  });

  // Restrict input to only numbers
  fromInput.addEventListener('keydown', function (e) {
    if (![46, 8, 9, 27, 13, 110, 190].includes(e.keyCode) &&
      (e.keyCode < 48 || e.keyCode > 57) &&
      (e.keyCode < 96 || e.keyCode > 105)) {
      e.preventDefault();
    }
  });
});

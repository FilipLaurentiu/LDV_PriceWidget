const apiUrl = 'https://ldvbank.com/en/api/public/get-pairs-list/';
var lastCurrencyPrices = [];
var currentPrices = [];
var availableFiatCurrency = [];
var availableCryptoCurrency = [];
var selectedFiat = 'EUR';
var selectedCrypto = 'BTC';
var selectedAmountToBuy = 0;
var lastUpdateTime;

window.addEventListener('load', () => {
    fetchPrices();
    setInterval(fetchPrices, '15000');
})

async function fetchPrices() {
    const response = await fetch(apiUrl);
    if (response.ok) {
        setLastUpdateTime();
        const json = await response.json();
        if (json) {
            setAvailablePrices(json);
        }
    } else {
        // error message
    }
}

function setLastUpdateTime() {
    var el = document.getElementById('last_update_time');
    lastUpdateTime = new Date();
    el.innerText = `Last update time: ${lastUpdateTime.toLocaleString(undefined, { hour12: false })}`;
}

function setAvailablePrices(json) {
    this.currentPrices = json;
    this.lastCurrencyPrices = this.currentPrices;
    setAvailableCurrency();
    setMarketSummary();
}

function setAvailableCurrency() {
    // init fiat currency
    this.availableFiatCurrency = [];
    this.currentPrices.forEach(prices => {
        if (!this.availableFiatCurrency.includes(prices.BaseCoin)) {
            this.availableFiatCurrency.push(prices.BaseCoin);
        }
    });
    var HTMLSelectEl = document.getElementById('fiat_currency');
    var HTMLAvailableOption = '';
    this.availableFiatCurrency.forEach(curr => {
        const optionEl = `<option value="${curr}" id="${curr}_value">${curr}</option>`
        HTMLAvailableOption += optionEl;
    });
    HTMLSelectEl.innerHTML = HTMLAvailableOption;
    if (this.selectedFiat) {
        document.getElementById(`${this.selectedFiat}_value`).selected = true;
    }

    //init crypto currency
    this.availableCryptoCurrency = [];
    this.currentPrices.forEach(prices => {
        if (!this.availableCryptoCurrency.includes(prices.TargetCoin)) {
            this.availableCryptoCurrency.push(prices.TargetCoin);
        }
    });
    var HTMLSelectEl = document.getElementById('crypto_currency');
    var HTMLAvailableOption = '';
    this.availableCryptoCurrency.forEach(curr => {
        const optionEl = `<option value="${curr}" id="${curr}_value">${curr}</option>`
        HTMLAvailableOption += optionEl;
    });
    HTMLSelectEl.innerHTML = HTMLAvailableOption;
    if (this.selectedCrypto) {
        document.getElementById(`${this.selectedCrypto}_value`).selected = true;
    }
}

function setMarketSummary() {
    const currentForSelectedFiat = this.currentPrices.filter(price => price.BaseCoin === this.selectedFiat);
    const lastForSelectedFiat = this.lastCurrencyPrices.filter(price => price.BaseCoin === this.selectedFiat);

    this.availableCryptoCurrency.forEach(crypto => {
        // Buy 
        const cryptoBuyPriceEl = document.getElementById(`${crypto}_buy_price`);
        const currentCryptoBuyPrice = currentForSelectedFiat.find(prices => prices.TargetCoin === crypto).PriceLastBidToBuy;
        const lastCryptoBuyce = lastForSelectedFiat.find(prices => prices.TargetCoin === crypto).PriceLastBidToBuy;
        cryptoBuyPriceEl.innerText = currentCryptoBuyPrice;
        cryptoBuyPriceEl.style.color = lastCryptoBuyce > currentCryptoBuyPrice ? 'red' : 'green';

        // Sell
        const cryptoSellPriceEl = document.getElementById(`${crypto}_sell_price`);
        const currentCryptoSellPrice = currentForSelectedFiat.find(prices => prices.TargetCoin === crypto).PriceLastAskedToSell;
        const lastCryptoSellPrice = lastForSelectedFiat.find(prices => prices.TargetCoin === crypto).PriceLastAskedToSell;
        cryptoSellPriceEl.innerText = currentCryptoSellPrice;
        cryptoSellPriceEl.style.color = lastCryptoSellPrice > currentCryptoSellPrice ? 'red' : 'green';

    })
}

function fiatCurrencyChange(value) {
    this.selectedFiat = value;
    document.getElementById('amount_fiat_label').innerText = this.selectedFiat;
}

function cryptoCurrencyChange(value) {
    this.selectedCrypto = value;
    document.getElementById('amount_crypto_label').innerText = this.selectedCrypto;
}

function calculateCryptoResult(value) {
    this.selectedAmountToBuy = parseFloat(value);
    var resultField = document.getElementById('result_field');
    const LDVEchangeRate = this.currentPrices.find(price => price.BaseCoin === this.selectedFiat && price.TargetCoin === this.selectedCrypto);
    resultField.value = LDVEchangeRate && this.selectedAmountToBuy ? (this.selectedAmountToBuy / LDVEchangeRate.PriceLastBidToBuy).toFixed(4) : '';
}

function navigateToBuy() {
    const url = `https://ldvbank.com/en/api/${this.selectedCrypto}/${this.selectedFiat}/${this.selectedAmountToBuy}`;
    window.location.replace(url);

}

function allowOnlyNumber(event) {
    if (event.which != 8 && event.which != 0 && event.which < 48 || event.which > 57) {
        event.preventDefault();
    }
}

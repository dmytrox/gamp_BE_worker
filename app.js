const express = require('express');
const cron = require('node-cron');
const fetch = require('node-fetch');
const ua = require('universal-analytics');

require('dotenv').config()

const port = 3000
const app = express()

cron.schedule('* * * * *', () => {
  let myHeaders = new fetch.Headers();
  myHeaders.append("apikey", process.env.CURRENCY_API_KEY);

  const requestOptions = {
    method: 'GET',
    redirect: 'follow',
    headers: myHeaders
  };

  const preferedCurrencies = {
    to: process.env.C_TO,
    from: process.env.C_FROM
  }

  let visitor = ua(process.env.GA_UA_TOKEN);
  fetch(`https://api.apilayer.com/fixer/convert?to=${preferedCurrencies.to}&from=${preferedCurrencies.from}&amount=1`, requestOptions)
    .then(response => response.text())
    .then(result => {
      visitor.event("uah/usd", JSON.parse(result).result, "currency ratio").send()
    })
    .catch(e => console.log(e));
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
});
// quick (and very personalised) script to alert if your crypto on coingecko has gone up or down
// run from 'scripts editor' of google sheets
// connects to coingecko's api
// requires a couple of steps if you want to get it to work

// as an example this checks for the price of bitcoin against usd
  var url = 'https://api.coingecko.com/api/v3/simple/price'
      + '?ids=bitcoin'
      + '&vs_currencies=usd';
  var priceTodayResponse = UrlFetchApp.fetch(url);
// this will alert on percentage change from yesterday's average price
  var parsedPriceToday = JSON.parse(priceTodayResponse);
  var priceToday = parsedPriceToday.bitcoin.usd
  var today = new Date();
  var MILLIS_PER_DAY = 1000 * 60 * 60 * 24;
  var yesterday = new Date(today.getTime() - MILLIS_PER_DAY);
  var todayFormatted = Utilities.formatDate(today, "GMT", 'dd-MM-yyyy');
  var yesterdayFormatted = Utilities.formatDate(yesterday, "GMT", 'dd-MM-yyyy');
  var dailyAverageUrl = 'https://api.coingecko.com/api/v3/coins/bitcoin/history'
      + '?date='
      + yesterdayFormatted;
      + '&localization=false';
  var dailyResponse = UrlFetchApp.fetch(dailyAverageUrl);
  var parsedDailyResponse = JSON.parse(dailyResponse);
  var priceYesterday = parsedDailyResponse.market_data.current_price.usd
// this just assumes you have manually created a sheet called BitcoinPrice
  var getSheet = SpreadsheetApp.getActive().getSheetByName('BitcoinPrice');
// I entered a quick function on the sheet itself to calculate percentage change in cell D2
  var percentChange = getSheet.getRange('D2').getValue();
  var emailAddress = 'name@gmail.com';
  var subject = 'Bitcoin 24 hour change: ' + percentChange + '%';
  var message = '1 Bitcoin is worth $' + priceToday;

function getBitcoinPrice() {
  getSheet.getRange('B2').setValue(priceYesterday);
  getSheet.getRange('A2').setValue(todayFormatted);
  getSheet.getRange('C2').setValue(priceToday);
  
  if (percentChange > '15'){
   MailApp.sendEmail(emailAddress, subject, message);
    console.log('Email sent for increase in price');
  }
  
  if (percentChange < '-15'){
   MailApp.sendEmail(emailAddress, subject, message);
    console.log('Email sent for drop in price');
 }
}

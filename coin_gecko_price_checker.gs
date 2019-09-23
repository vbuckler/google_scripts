// quick script to send email alerts if your crypto has gone 
// up or down by a determined amount. 
// run from 'scripts editor' of google sheets, use triggers
// to run at different times. 
// uses coingecko's api to get price

// this example uses bitcoin vs usd
var coinid = 'bitcoin';
var url = 'https://api.coingecko.com/api/v3/simple/price'
var url = 'https://api.coingecko.com/api/v3/simple/price?ids=
    + coinid
    + '&vs_currencies=usd';
var priceTodayResponse = UrlFetchApp.fetch(url);
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
// Here I had manually named my Google Sheet tab 'BitcoinPrice', and got the
// Google api to activate it 
var getSheet = SpreadsheetApp.getActive().getSheetByName('BitcoinPrice');
var percentChange = getSheet.getRange('D2').getValue();
var percentChangeRounded = Math.round(percentChange);
// I found sending to domains other than gmail.com didn't work from my
// non paid Google account.
var emailAddress = 'name@gmail.com';
var subject = 'BTC Price Alert!';
var message = '1 BTC = $' + priceToday + '\n' 
  + '\n'
  + 'BTC 24 hour change: ' + percentChangeRounded + '%' + '\n'
  + '\n'
  + 'This email will send:' + '\n'
  + '1\. Daily when BTC price is not between \$10000 and \$8000' + '\n'
  + '2\. Hourly if \% change is \+\/\-30\% while the price is \> \$10000 or \< \$8000';
var send = 0;
var sent = 1;
var sendCheck = getSheet.getRange('E2').getValue();

function dailySender () {
  // set cell E2 to 0 once a day to cause new email to be sent if necessary.
  // set to trigger at whatever frequency you would like emails to be sent
  // when the price is outside of your range
  // create time based triggers by following the link 
  // 'Current project's triggers' in the edit menu of the Script Editor
  getSheet.getRange('E2').setValue(send);
}

function setBitcoinPrice() {
  // I set this to trigger every 10 mins
  getSheet.getRange('A1').setValue('Date');
  getSheet.getRange('B1').setValue('Bitcoin Price Yesterday');
  getSheet.getRange('C1').setValue('Price right now');
  getSheet.getRange('D1').setValue('Percentage Change');
  getSheet.getRange('E1').setValue('Email Tracker');
  getSheet.getRange('A2').setValue(todayFormatted);
  getSheet.getRange('B2').setValue(priceYesterday);
  getSheet.getRange('C2').setValue(priceToday);
  getSheet.getRange('D2').setValue(((priceToday-priceYesterday)/priceYesterday)*100);
  }
 
function bitcoinAlert() {
  // triggered every 10 minutes
  // make sure an email hasn't been sent already today
  // you also determine the price range that will trigger alerts here
  if (sendCheck == 0){
    if (priceToday > '10000'){
      MailApp.sendEmail(emailAddress,subject, message);
      getSheet.getRange('E2').setValue(sent);
    }
    if (priceToday < '8000'){
      MailApp.sendEmail(emailAddress,subject, message);
      getSheet.getRange('E2').setValue(sent);
    }
  }
  else {
    Logger.log('No alert sent.')
  }
}

function alertOnPercentChange() {
  // this function will send an email based
  // on percentage change more frequently
  // provided the price is outside of the range above
  // and you set the trigger to hourly
  if (percentChange < '-30'){
    getSheet.getRange('E2').setValue(send);
  }
  if (percentChange > '30'){
    getSheet.getRange('E2').setValue(send);
  }
}

const StockCapture = require('./lib/stock_capture.js') 

if (!process.env.token) {
  console.log('Error: Specify token in environment');
  process.exit(1);
}

var Botkit = require('botkit');
let fs = require('fs')

var controller = Botkit.slackbot({
  debug: false
});

var bot = controller.spawn({
  token: process.env.token
}).startRTM();

controller.hears(['(.*)'],['direct_message', 'direct_mention', 'mention'], function(bot, message) {
  let arg = message.match[1]
  let company, period;

  let match = arg.match(/(.*)(1日|5日|1か月|3か月|1年|5年|最長)$/)

  if(match) {
    company = match[1]
    period = match[2]
  }else{
    company = arg
  }

  StockCapture.capture(company, period, () => {
    bot.api.files.upload({
      file: fs.createReadStream('stock-chart.png'),
      filename: 'stock-chart.png',
      channels: message.channel
    },(err,res) => {
        if (err) console.log(err)
    })
  })


});

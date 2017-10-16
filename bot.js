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
  let company = message.match[1]

  StockCapture.capture(company, () => {
    bot.api.files.upload({
      file: fs.createReadStream('stock-chart.png'),
      filename: 'stock-chart.png',
      channels: message.channel
    },(err,res) => {
        if (err) console.log(err)
    })
  })


});

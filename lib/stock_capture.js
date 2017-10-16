const puppeteer = require('puppeteer');

const periods = {
  '1日': '1d',
  '5日': '5d',
  '1か月': '1M',
  '3か月': '3M',
  '1年': '1Y',
  '5年': '5Y',
  '最長': '40Y',
}

const capture = async (company, period ,cb) => {
  const browser = await puppeteer.launch({headless: true});
  const page = await browser.newPage();

  const targetElementSelector = '#fac-ut'

  await page.goto('https://google.co.jp')
  await page.type('#lst-ib', `${company} 株価`)
  await page.click('#tsf > div.tsf-p > div.jsb > center > input[type="submit"]:nth-child(1)')
  await page.waitFor(targetElementSelector)

  if(period){
    const dataPeriod = periods[period]
    await page.click(`#fac-sbtns > ol > li[data-period='${dataPeriod}']`)
    await page.waitFor(1000)
  }

  const clip = await page.evaluate(s => {
    const el = document.querySelector(s)

    // エレメントの高さと位置を取得
    let { width, height, top: y, left: x } = el.getBoundingClientRect()

    // padding分調整
    width += 32
    height += 44
    x -= 16

    return { width, height, x , y}
  }, targetElementSelector)

  // スクリーンショットに位置と大きさを指定してclipする
  await page.screenshot({ clip, path: 'stock-chart.png' })

  cb()

  browser.close();
};

module.exports.capture = capture

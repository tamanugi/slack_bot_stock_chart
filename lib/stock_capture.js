const puppeteer = require('puppeteer');

const capture = async (company, cb) => {
  const browser = await puppeteer.launch({headless: true});
  const page = await browser.newPage();

  const targetElementSelector = '#fac-ut'

  await page.goto('https://google.co.jp')
  await page.type('#lst-ib', `${company} 株価`)
  await page.click('#tsf > div.tsf-p > div.jsb > center > input[type="submit"]:nth-child(1)')
  await page.waitFor(targetElementSelector)

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

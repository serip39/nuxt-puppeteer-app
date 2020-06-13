const puppeteer = require('puppeteer')

async function setUpPage (goToUrl) {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: '/usr/bin/chromium-browser',
    args: [
      '--disable-gpu',
      '--disable-dev-shm-usage',
      '--disable-setuid-sandbox',
      '--no-first-run',
      '--no-sandbox',
      '--no-zygote',
      '--single-process'
    ]
  })

  const page = await browser.newPage()
  await page.setJavaScriptEnabled(false)
  await page.setRequestInterception(true)

  page.on('request', request => {
    if (goToUrl === request.url()) {
      request.continue().catch(err => console.error(err))
    } else {
      request.abort().catch(err => console.error(err))
    }
  })

  await page.goto(goToUrl,  {waitUntil: 'networkidle2'})

  return { browser, page }
}

async function trainYahoo (yahooId) {
  const scrapingUrl = `https://transit.yahoo.co.jp/traininfo/detail/${yahooId}/0/`

  const { browser, page } = await setUpPage(scrapingUrl)

  const name = await page.$eval('h1.title', el => {
    let text = el.textContent
    if(text.indexOf("[") === -1) return text
    return text.substring(0, text.indexOf("["))
  })

  const result = await page.$$eval('#mdServiceStatus', list => list.map(el  => {
    return {
      status: el.querySelector('dl dt').textContent.trim().substr(3),
      desc: el.querySelector('dl dd > p').textContent.trim()
    }
  }))

  await browser.close()

  return { name, yahooId, ...result[0] }
}

function now () {
  const weekday = ['日', '月', '火', '水', '木', '金', '土']

  let date = new Date()
  let format = 'YYYY/MM/DD(WW) hh:mm'
  format = format.replace(/YYYY/g, date.getFullYear())
  format = format.replace(/MM/g, ('0' + (date.getMonth() + 1)).slice(-2))
  format = format.replace(/DD/g, ('0' + date.getDate()).slice(-2))
  format = format.replace(/WW/g, weekday[date.getDay()])
  format = format.replace(/hh/g, ('0' + date.getHours()).slice(-2))
  format = format.replace(/mm/g, ('0' + date.getMinutes()).slice(-2))
  return format
}

async function train () {
  const datetime = now()
  const yamanote = await trainYahoo(21)
  const keihinTohoku = await trainYahoo(22)
  const tokaido = await trainYahoo(27)
  const uenoTokyo = await trainYahoo(627)

  const result = {
    datetime,
    trains: [
      yamanote,
      keihinTohoku,
      tokaido,
      uenoTokyo
    ]
  }

  console.log(result)

  return result
}

module.exports = {
  train
}


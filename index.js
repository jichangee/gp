const request = require('request')

const gpList = ['SH515650', 'SH515030', 'SZ159928']

let lastInfo = ''
let hasChange = true

const getList = (codeList) => {
  const body = {
    version: 2.0,
    channel: 'MobileH5',
    requestId: '0cf1f906-161d-fc99-7517-f8654e444c14',
    cltplt: 'h5',
    cltver: 1.0,
    body: {
      codeList: codeList,
    },
  }
  request(
    {
      url: 'https://quote.stock.pingan.com/restapi/nodeserver/quote/quoteIndex',
      method: 'post',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(body),
    },
    (err, res) => {
      if (err) {
        return
      }
      const json = JSON.parse(res.body)
      getInfo(json.results.subBeans)
    }
  )
}

const getInfo = (subBeans) => {
  const list = []
  subBeans.forEach((item) => {
    list.push(`${item.name}：${calcPer(item.newPrice, item.prevClosePx)}`)
  })
  sendInfo(list)
}

const calcPer = (newPrice, prevClosePx) => {
  return `${(((newPrice - prevClosePx) / prevClosePx) * 100).toFixed(2)}%`
}

const sendInfo = (list) => {
  const text = list.join('，')
  hasChange = lastInfo !== text
  lastInfo = text
  request.get(
    `https://sc.ftqq.com/SCU60039T6f839ebc217d945aa1bdfc0d44f6621c5d775f6060b3f.send?text=${encodeURIComponent(
      text
    )}`
  )
}

const canTrading = () => {
  const d = new Date()
  const day = d.getDay()
  const hours = d.getHours()
  const minu = d.getMinutes()
  let res = day > 0 && day < 6 && hours > 9 && hours < 15
  res = hasChange
  if (hours === 9 && minu < 30) {
    res = false
  }
  // 收盘后再发一次
  if (hours === 11 && minu > 40 || hours === 12) {
    res = false
  }
  // 收盘后再发一次
  if (hours === 15 && minu <= 10) {
    res = true
  }
  console.log('res', res)
  return res
}

const init = () => {
  // 休息日不获取数据
  if (canTrading()) {
    getList(gpList)
  }
}

init()
setInterval(() => {
  init()
}, 10 * 60 * 1000)

setInterval(() => {
  hasChange = true
}, 12 * 60 * 60 * 1000);
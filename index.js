const request = require('request')

const gpList = ['SH515650', 'SH515030', 'SZ159928']

const getList = (codeList) => {
  const body = {
    "version": 2.0,
    "channel": "MobileH5",
    "requestId": "0cf1f906-161d-fc99-7517-f8654e444c14",
    "cltplt": "h5",
    "cltver": 1.0,
    "body": {
        "codeList": codeList
    }
  }
  request({
    url: 'https://quote.stock.pingan.com/restapi/nodeserver/quote/quoteIndex',
    method: 'post',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify(body)
  }, (err, res) => {
    if (err) {
      return
    }
    const json = JSON.parse(res.body)
    getInfo(json.results.subBeans)
  })
}

const getInfo = (subBeans) => {
  const list = []
  subBeans.forEach(item => {
    list.push(`${item.name}：${calcPer(item.newPrice, item.prevClosePx)}`)
  })
  sendInfo(list)
}

const calcPer = (newPrice, prevClosePx) => {
  return `${((newPrice - prevClosePx) / prevClosePx * 100).toFixed(2)}%`
}

const sendInfo = (list) => {
  const text = list.join('，')
  console.log('text', text)
  request.get(`https://sc.ftqq.com/SCU60039T6f839ebc217d945aa1bdfc0d44f6621c5d775f6060b3f.send?text=${encodeURIComponent(text)}`)
}

const init = () => {
  const d = new Date().getDay()
  // 休息日不获取数据
  if (d === 6 || d === 0) {
    return;
  }
  getList(gpList)
}

init()
setInterval(() => {
  init()
}, 10 * 60 * 1000);
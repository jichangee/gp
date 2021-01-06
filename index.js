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
  subBeans.forEach(item => {
    console.log(item.name, calcPer(item.newPrice, item.prevClosePx));
  })
}

const calcPer = (newPrice, prevClosePx) => {
  return `${((newPrice - prevClosePx) / prevClosePx * 100).toFixed(2)}%`
}

getList(gpList)
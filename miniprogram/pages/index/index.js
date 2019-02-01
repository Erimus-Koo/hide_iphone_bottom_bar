//index.js
var theme = ['light', 'dark']

// 获得机型数据 - 简版
var ipx = false
var iphoneModel = ''
var ipBarFixTop = 0
wx.getSystemInfo({
  success: function(res) {
    console.group('Get Model Info')
    // get model name (contain net status & version)
    iphoneModel = res.model.toLowerCase()
    var bkt1 = iphoneModel.indexOf('<') //<iPhone11,8>
    var bkt2 = iphoneModel.indexOf('(') //(GSM+CDMA)
    var bkt = Math.min(bkt1, bkt2)
    bkt = (bkt != -1) ? bkt : Math.max(bkt1, bkt2) //if one of it undefined, get the other one.
    iphoneModel = (bkt != -1) ? iphoneModel.slice(0, bkt) : iphoneModel
    iphoneModel = iphoneModel.replace('iphone', '')
    console.log('iphoneModel:', iphoneModel)

    // if round corner model
    var model = res.model.toLowerCase()
    ipx = (model.indexOf('iphone') != -1 && model.indexOf('x') != -1)
    console.log('ipx:', ipx)

    // fake bottom bar position
    ipBarFixTop = res.windowHeight - 13 //bottom:8, height:5
    console.log('ipBarFixTop:', ipBarFixTop)
    console.groupEnd()
  }
})


// 范例用打印内容（可以连同setData去除）
var sys = ''
wx.getSystemInfo({
  success: function(res) {
    sys += '请稍微等待，等底部横条变化。\n仅在黑白两色的背景上有效。\n'
    sys += ('\n brand: ' + res.brand)
    sys += ('\n model: ' + res.model)
    sys += ('\n pixelRatio: ' + res.pixelRatio)
    sys += ('\n screenWidth: ' + res.screenWidth)
    sys += ('\n screenHeight: ' + res.screenHeight)
    sys += ('\n windowWidth: ' + res.windowWidth)
    sys += ('\n windowHeight: ' + res.windowHeight)
    sys += ('\n statusBarHeight: ' + res.statusBarHeight)
    sys += ('\n language: ' + res.language)
    sys += ('\n version: ' + res.version)
    sys += ('\n platform: ' + res.platform)
    sys += ('\n fontSizeSetting: ' + res.fontSizeSetting)
    sys += ('\n SDKVersion: ' + res.SDKVersion)
    sys += ('\n benchmarkLevel: ' + res.benchmarkLevel)
    sys += ('\n\n__________')
    sys += ('\n iphoneModel: ' + iphoneModel)
    sys += ('\n ipx: ' + ipx)
    sys += ('\n ipBarFixTop: ' + ipBarFixTop)
  }
})

// 改变主题
function setThemeColor(target, tm) {
  console.log('Switch to Theme[' + tm + ']: ' + theme[tm])
  wx.setStorageSync('theme', tm)
  target.setData({
    theme: theme[tm]
  })
  var ftc = '#000000'
  var bgc = '#ffffff'
  var bgtx = 'dark'
  if (theme[tm].indexOf('dark') != -1) { //dark theme
    ftc = '#ffffff'
    bgc = '#000000'
    bgtx = 'light'
  }
  wx.setNavigationBarColor({
    frontColor: ftc,
    backgroundColor: bgc,
    animation: {
      duration: 200,
      timingFunc: 'easeInOut'
    }
  })
  wx.setBackgroundColor({
    backgroundColor: bgc
  })
  wx.setBackgroundTextStyle({
    textStyle: bgtx
  })
}

Page({
  onLoad: function() {
    // load theme
    var tm = wx.getStorageSync('theme')
    tm = tm ? tm : 0 //default
    console.log('Theme id:', tm, theme[tm])
    setThemeColor(this, tm)

    this.setData({
      log: sys,
      ipx: ipx,
      iphoneModel: iphoneModel,
      ipBarFixTop: ipBarFixTop
    })
  },
  changeTheme: function() {
    var tm = wx.getStorageSync('theme') || 0
    tm = (tm + 1) % theme.length
    setThemeColor(this, tm)
  },
  onPullDownRefresh: function() {
    wx.stopPullDownRefresh()
  }
})
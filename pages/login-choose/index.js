import {
  domain,
} from '../../utils/util'
Page({

  data: {
    checked: true,
    domain
  },

  getPhoneNumber(e) {
    console.log('phone', e.detail)
    if (!this.data.checked) {
      return wx.showModal({
        title: "提示",
        content: '请同意用户《注册协议》与《隐私政策》',
        showCancel: false,
        confirmText: '知道了'
      })
    }
    this.savePhone(e.detail.code)
  },

  savePhone(code) {
    const that = this;
    wx.request({
      url: `${this.data.domain}api/wxInfo`,
      method: 'POST',
      data: {
        code,
        openId: wx.getStorageSync('openId'),
        sessionKey: wx.getStorageSync('sessionKey')
      },
      success(res) {
        console.log(res, 8127638)
        if (res.data.code === '0000') {
          wx.setStorageSync('userInfo', res.data.data);
          wx.navigateBack({
            delta: 1,
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 1500
          })
        }
      }
    })
  },

  handleCheckChange(e) {
    const checked = e.detail.checked
    this.setData({
      checked,
    });
  },

  onLoad(options) {

  },

  onReady() {

  },

  onShow() {

  },


  onShareAppMessage() {

  }
})
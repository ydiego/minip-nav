import {
  domain,
} from '../../utils/util'
Page({

  data: {
    phoneError: false,
    phoneNumber: '',
    checked: false,
    verifyText: '发送验证码',
    verifyCode: '',
    isInCountdown: false,
    isPhoneNumber: false,
    domain
  },

  onLoad(options) {

  },

  sendSMS() {
    const that = this;
    if (!that.data.isPhoneNumber) {
      return wx.showToast({
        title: '请输入正确手机号',
        icon: 'none'
      })
    }

    this.setData({
      isInCountdown: true
    })
    wx.request({
      url: `${this.data.domain}api/sendSMS`,
      method: "POST",
      data: {
        phone: '15757185259'
      },
      success(res) {
        if (res.data.code === '0000') {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          });
          that.countDown();
        } else {
          tis.setData({
            isInCountdown: false
          })
        }
      },
    })
  },

  countDown() {
    let time = 5;
    let verifyText = ''
    const that = this;
    if (that.data.isInCountdown) return;
    var timeStop = setInterval(function () {
      time--;
      if (time > 0) {
        verifyText = `${time}秒后重新发送`;
        that.setData({
          verifyText,
          isInCountdown: true
        })
      } else {
        time = 60; //当减到0时赋值为60
        clearInterval(timeStop);
        that.setData({
          verifyText: '发送验证码',
          isInCountdown: false
        })
      }
    }, 1000)
  },

  checkPhone(phone) {
    return /^[1][3,4,5,7,8,9][0-9]{9}$/.test(phone)
  },

  onPhoneInput(e) {
    const {
      phoneError,
    } = this.data;
    const isPhoneNumber = this.checkPhone(e.detail.value);
    if (phoneError === isPhoneNumber) {
      this.setData({
        phoneNumber: e.detail.value,
        phoneError: !isPhoneNumber,
      });
    }
    this.setData({
      isPhoneNumber
    })

  },

  onVerifyCodeChange(e) {
    this.setData({
      verifyCode: e.detail.value
    })
  },

  handleCheckChange(e) {
    const checked = e.detail.checked
    this.setData({
      checked,
    });
  },

  onLogin() {
    const {
      phoneNumber,
      isPhoneNumber,
      verifyCode,
    } = this.data;
    if (!isPhoneNumber) {
      return wx.showToast({
        title: '请输入正确手机号',
        icon: 'none'
      })
    }
    console.log(verifyCode)
    if (verifyCode.length < 4) {
      return wx.showToast({
        title: '请输入4位验证码',
        icon: 'none'
      })
    }
    const openId = wx.getStorageSync('openId')
    const sessionKey = wx.getStorageSync('sessionKey')

    console.log(phoneNumber, verifyCode, openId, sessionKey)
    wx.request({
      url: `${this.data.domain}api/account/login`,
      method: 'POST',
      data: {
        phone: phoneNumber,
        code: verifyCode,
        openId,
        sessionKey
      },
      success(res) {
        console.log(res.data.data, 90909)
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

  onReady() {

  },

  onShow() {

  },

  onHide() {

  },

  onUnload() {

  },
})
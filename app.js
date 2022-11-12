import updateManager from './common/updateManager';
import {
  domain
} from './utils/util'

App({
  onLaunch: function () {
    const openid = wx.getStorageSync('openId');
    const userInfo = wx.getStorageSync('userInfo');
    const _ = this;
    if (!openid) {
      wx.login({
        success(res) {
          wx.request({
            url: `${domain}api/wxLogin`,
            method: 'POST',
            data: {
              code: res.code
            },
            success(res) {
              if (res.data.code === '0000') {
                const {
                  openid,
                  session_key
                } = res.data.data
                wx.setStorageSync('openId', openid)
                wx.setStorageSync('sessionKey', session_key)
                _.getUserInfo(openid);
              }
            }
          })
        }
      })
    } else if (!userInfo) {
      this.getUserInfo(openid)
    }

  },

  getUserInfo(openId) {
    wx.request({
      url: `${domain}api/account/get`,
      data: {
        openId
      },
      success(res) {
        console.log(res, 8888)
        if (res.data.code === '0000') {
          wx.setStorageSync('userInfo', res.data.data)
        }
      }
    })
  },

  onShow: function () {
    updateManager();
    this.getShareImage();
  },
  getShareImage() {
    const _ = this;
    wx.request({
      url: `${domain}api/share/getActive`,
      success(res) {
        const resData = res.data.data
        if (resData) {
          _.global.shareImage = `${domain}uploads/${resData.url}`;
        } else {
          _.global.shareImage = '';
        }
      }
    })
  },
  global: {
    shareImage: ''
  }
});
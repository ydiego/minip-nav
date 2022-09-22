import updateManager from './common/updateManager';
import { domain } from './utils/util'

App({
  onLaunch: function () {},
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

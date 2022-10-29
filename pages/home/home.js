import dayjs from 'dayjs'
import {
  domain,
  jumpUtil
} from '../../utils/util'

Page({
  data: {
    imgSrcs: [],
    pageLoading: true,
    indicatorDots: true,
    vertical: false,
    interval: 3000,
    duration: 1000,
    autoplay: true,
    navigation: {
      type: 'dots'
    },
    list: [],
    domain,
  },

  onShow() {
    this.getTabBar().init();
  },

  onLoad() {
    this.init();
  },

  onReachBottom() {},

  onPullDownRefresh() {
    this.init();
  },

  init() {
    this.getImages();
    this.getList();
  },

  getImages() {
    const _ = this;
    wx.request({
      url: `${this.data.domain}api/adv/listAll`,
      success(res) {
        _.setData({
          imgSrcs: res.data.data,
          pageLoading: false,
        })
      }
    })
  },

  getList(page = 1) {
    const _ = this;
    wx.request({
      url: `${this.data.domain}api/info/today`,
      success(res) {
        console.log(res, 989)
        _.setData({
          list: res.data.data,
          pageLoading: false,
        })
      },
    })
  },

  swiperImageClick(event) {
    jumpUtil(event)
  },

  onReTry() {},

  getShareImage() {
    console.log(getApp().global.shareImage, 333)
    return getApp().global.shareImage || '../../images/share.jpg';
  },

  onShareAppMessage() {
    const imageUrl = this.getShareImage();
    return {
      title: '互动云展',
      path: 'pages/home/home',
      imageUrl
    }
  },

  onShareTimeline() {
    const imageUrl = this.getShareImage();
    return {
      title: '互动云展',
      path: 'pages/home/home',
      imageUrl
    }
  }
});
import {
  domain
} from '../../utils/util'
Page({

  data: {
    countryList: [],
    internationalList: [],
    options: {},
    domain,
    stickyProps: {
      zIndex: 2,
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options, 99)
    this.setData({
      options
    }, () => {
      wx.setNavigationBarTitle({
        title: options.category === '1' ? '网拍' : '线下拍'
      })

      this.init()
    })

  },
  onPullDownRefresh() {
    this.init();
  },

  init() {
    this.getImages();
    this.getList(1);
    this.getList(2);
  },

  getImages() {
    const _ = this;
    wx.request({
      url: `${this.data.domain}api/adv/listAll?position=${this.options.category === '1' ? 'online' : 'offline'}`,
      success(res) {
        _.setData({
          imgSrcs: res.data.data,
        })
      }
    })
  },

  getList(secondCategory = 1) {
    const _ = this;
    wx.request({
      url: `${this.data.domain}api/info/today?category=${this.data.options.category}&secondCategory=${secondCategory}`,
      success(res) {
        console.log(res, 989)
        _.setData({
          [secondCategory === 1 ? 'countryList' : 'internationalList']: res.data.data,
        })
      },
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})
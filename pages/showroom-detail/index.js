import dayjs from 'dayjs'
import {
  domain,
} from '../../utils/util'
Page({

  data: {
    domain,
    info: {},
    pages: [],
    loading: true,
    indicatorDots: true,
    vertical: false,
    interval: 3000,
    duration: 1000,
    autoplay: false,
    navigation: {
      type: 'dots'
    },
    currentPage: -1,
  },

  onLoad(options) {
    wx.showLoading({
      title: '加载中',
    })
    this.setData({
      options
    }, () => {
      this.getShowroomDetail()
    })
  },

  onShow() {

  },

  onHide() {

  },

  onShareAppMessage() {

  },

  handlePageClick(e) {
    const index = e.currentTarget.dataset.index
    let currentPage = index;

    if (index === this.data.pages.length - 1) {
      currentPage = -1;
      // setTimeout(() => {
      //   this.setData({
      //     currentPage
      //   })
      // }, 800);
    }
    this.setData({
      currentPage
    })
  },

  getShowroomDetail() {
    const _ = this;
    wx.request({
      url: `${_.data.domain}api/showroom/detail`,
      data: {
        id: _.data.options.id
      },
      success(res) {
        const info = res.data.data;
        const now = +new Date();
        if (+new Date(info.startAt) < now && +new Date(info.endAt) > now) {
          info.status = 'ing'
          info.statusText = '现正举行'
        }
        if (+new Date(info.endAt) < now) {
          info.status = 'done';
          info.statusText = '现已结束'
        }
        info.startAt = dayjs(info.startAt).format('MM月DD日')
        info.endAt = dayjs(info.endAt).format('MM月DD日')
        info.status =
          _.setData({
            info: res.data.data,
            loading: false
          })
        wx.hideLoading()
        _.getBookInfo(res.data.data.bookId)
      }
    })
  },

  getBookInfo(id) {
    const _ = this;
    wx.request({
      url: `${_.data.domain}api/books/detail`,
      data: {
        id
      },
      success(res) {
        _.setData({
          pages: res.data.data.pages
        })
      }
    })
  },

  toShowroom() {
    const userInfo = wx.getStorageSync('userInfo')
    if (!userInfo) {
      wx.showToast({
        title: '访问云展厅前需先注册',
        icon: 'none',
        duration: 1500,
      })
      setTimeout(() => {
        wx.navigateTo({
          url: '/pages/register/index',
        })
      }, 1500);
      return;
    }
    wx.navigateTo({
      url: `/pages/webview/webview?path=${encodeURIComponent(this.data.info.webviewUrl)}`,
    })
  },

  // getPhoneNumber(e) {
  //   console.log(e.detail);
  //   this.savePhone(e.detail.code)
  // },

  // savePhone(code) {
  //   console.log(2333);
  //   wx.request({
  //     url: 'http://localhost:4000/api/wxInfo',
  //     method: 'POST',
  //     data: {
  //       code
  //     },
  //     success(res) {
  //       console.log(res, 8127638)
  //     }
  //   })
  // }
})
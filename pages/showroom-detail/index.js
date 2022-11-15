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
    currentPage: -1,
    comments: [],
    commentContent: ''
  },

  onLoad(options) {
    wx.showLoading({
      title: '加载中',
    })
    this.setData({
      options
    }, () => {
      this.getShowroomDetail()
      this.getComments();
    })
  },

  onShow() {

  },

  onHide() {

  },

  onShareAppMessage() {

  },

  handleCommentChange(e) {
    console.log(e)
    this.setData({
      commentContent: e.detail.value
    })
  },

  submitComment() {
    const {
      commentContent,
      options
    } = this.data;
    const user = wx.getStorageSync('userInfo');
    const _ = this;
    if (!user || !user.id) {
      wx.showToast({
        title: '请先登录再评论',
        duration: 1500,
        icon: 'none'
      })
      setTimeout(() => {
        wx.navigateTo({
          url: '/pages/register/index',
        })
      }, 1500);
      return;
    }
    if (!_.data.commentContent) {
      return wx.showToast({
        title: '评论内容不能为空~',
        icon: 'none'
      });
    }
    wx.request({
      url: `${_.data.domain}api/comment/create`,
      method: 'POST',
      data: {
        content: commentContent,
        showroomId: options.id,
        accountId: user.id
      },
      success(res) {
        if (res.data.code === '0000') {
          _.setData({
            commentContent: ''
          })
          _.getComments();

        } else {
          wx.showToast({
            title: '哎呀,出错了',
            icon: 'none'
          })
        }
      },
      fail(e) {
        console.log(e, 8888);
      }
    })
  },

  getComments() {
    const _ = this;
    wx.request({
      url: `${_.data.domain}api/comment/query`,
      data: {
        showroomId: _.data.options.id
      },
      success(res) {
        if (res.data.code === '0000') {
          const comments = res.data.data.map(c => {
            const oriNickName = c.account.nickName;
            const tn = oriNickName.substr(0, 3) + '****' + oriNickName.substr(-2);
            c.account.nickName = tn;
            c.account.phone = tn;
            c.createAt = dayjs(c.createAt).format('MM.DD')
            return c;
          })
          _.setData({
            comments
          })
        }
      }
    })
  },

  handlePageClick(e) {
    const index = e.currentTarget.dataset.index
    let currentPage = index;

    if (index === this.data.pages.length - 1) {
      currentPage = -1;
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
        res.data.data.bookId && _.getBookInfo(res.data.data.bookId)
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
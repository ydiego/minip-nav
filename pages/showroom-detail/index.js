import dayjs from 'dayjs'
import {
  domain,
} from '../../utils/util'

const defaultCommentPlaceholder = '喜欢就给个评论支持一下~';
Page({

  data: {
    domain,
    info: {},
    pages: [],
    loading: true,
    currentPage: -1,
    comments: [],
    commentContent: '',
    commentPlaceholder: defaultCommentPlaceholder,
    showPlaceholder: false,
    inputFocus: false,
    replyInfo: null,
    inputBottom: 0,
  },

  onLoad(options) {
    console.log(wx.getLaunchOptionsSync(), 333)
    const {
      scene
    } = wx.getLaunchOptionsSync();
    wx.showLoading({
      title: '加载中',
    })
    this.setData({
      options,
      scene
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
    return {
      title: this.data.info.title || 互动云展,
      path: `pages/showroom-detail/index?id=${this.data.options.id}`,
      imageUrl: this.data.domain + 'uploads/' + this.data.info.thumb
    }
  },

  onShareTimeline() {
    return {
      title: this.data.info.title,
      path: `pages/showroom-detail/index?id=${this.data.options.id}`,
      imageUrl: this.data.domain + 'uploads/' + this.data.info.thumb
    }
  },


  handleCommentChange(e) {
    this.setData({
      commentContent: e.detail.value
    })
  },

  submitComment() {
    const {
      commentContent,
      options,
      replyInfo
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
          url: '/pages/login-choose/index',
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
    if (replyInfo) return this.submitReply(user);
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

  submitReply(user) {
    console.log(this.data.replyInfo);
    const _ = this;
    const {
      commentContent,
      replyInfo
    } = _.data;
    wx.request({
      url: `${_.data.domain}api/comment/reply`,
      method: 'POST',
      data: {
        content: commentContent,
        commentId: replyInfo.commentId,
        nickName: _.desensitization(user.nickName),
        avatar: user.avatar || ''
      },
      success(res) {
        if (res.data.code === '0000') {
          _.setData({
            commentContent: '',
            replyInfo: null,
            commentPlaceholder: defaultCommentPlaceholder,
            showPlaceholder: false,
          })
          _.getComments();

        } else {
          wx.showToast({
            title: '哎呀,出错了',
            icon: 'none'
          })
        }
      },
    })
  },

  desensitization(str) {
    return str.substr(0, 3) + '****' + str.substr(-2);
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
            const tn = _.desensitization(oriNickName);
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
    if (this.data.scene === 1154) {
      return wx.showToast({
        title: '点击右下角去小程序查看',
        icon: 'none',
        duration: 1500,
      })
    }
    if (!userInfo) {
      wx.showToast({
        title: '访问云展厅前需先注册',
        icon: 'none',
        duration: 1500,
      })
      setTimeout(() => {
        const encodeUrl = encodeURIComponent(`/pages/webview/webview?path=${encodeURIComponent(this.data.info.webviewUrl)}`)
        wx.navigateTo({
          url: `/pages/login-choose/index?redirect=${encodeUrl}`,
        })
      }, 1500);
      return;
    }
    wx.navigateTo({
      url: `/pages/webview/webview?path=${encodeURIComponent(this.data.info.webviewUrl)}`,
    })
  },
  handleCommentReply(e) {
    const {
      commentId,
      nickName,
      avatar
    } = e.currentTarget.dataset
    this.setData({
      commentPlaceholder: `回复 @${nickName}`,
      inputFocus: true,
      showPlaceholder: true,
      replyInfo: {
        commentId,
        nickName,
        avatar
      }
    })
  },
  handlePlaceholderClick() {
    this.setData({
      showPlaceholder: false,
      commentContent: '',
      commentPlaceholder: defaultCommentPlaceholder,
      replyInfo: null,
      inputFocus: false
    })
  },
  handleInputFocus(e) {
    this.setData({
      inputBottom: e.detail.height - 1
    })
  },
  handleInputBlur() {
    this.setData({
      inputBottom: 0
    })
  }
})
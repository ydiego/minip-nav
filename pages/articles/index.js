import {
  domain,
  jumpUtil
} from '../../utils/util'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    total: 0,
    list: [],
    isAll: false,
    domain,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  onShow() {
    this.getTabBar().init();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    this.getList();
  },

  getList(page = 1) {
    const _ = this;
    wx.request({
      url: `${this.data.domain}api/article/list?type=1`,
      data: {
        page,
        pageSize: 10,
      },
      success(res) {
        console.log(res, 8989)
        const _list = [..._.data.list];
        const data = res.data.data.data;
        console.log(data);
        _.setData({
          list: page === 1 ? [...data] : [..._list, ...data],
          total: data.total,
          page: page + 1,
          isAll: data.length === 0
        });

      }
    })
  },

  toDetail(e) {
    jumpUtil(e)
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    this.getList(1);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    if (this.data.isAll) return;
    this.getList(this.data.page);
  },

  getShareImage() {
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
})
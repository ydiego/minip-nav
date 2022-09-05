import dayjs from 'dayjs'
import {
  domain,
  jumpUtil
} from '../../utils/util';

Page({
  data: {
    page: 1,
    total: 0,
    list: [],
    isAll: false,
    domain,
  },

  onLoad() {
    this.getList(1);
  },

  onShow() {
    this.getTabBar().init();
  },
  onPullDownRefresh() {
    this.getList(1);
  },

  onReachBottom() {
    if (this.data.isAll) return;
    this.getList(this.data.page);
  },

  getList(page = 1) {
    const _ = this;
    wx.request({
      url: `${this.data.domain}api/info/history`,
      data: {
        page,
        pageSize: 10,
      },
      success(res) {
        console.log(res, 8989)
        const _list = [..._.data.list];
        const data = res.data.data;
        const result = data.data.map(item => {
          item.startAt = dayjs(item.startAt).format('MM-DD HH:mm')
          item.endAt = dayjs(item.endAt).format('MM-DD HH:mm')
          return item;
        })
        console.log(data.data);
        _.setData({
          list: page === 1 ? [...result] : [..._list, ...result],
          total: data.total,
          page: page + 1,
          isAll: data.data.length === 0
        });

      }
    })
  },
  jump(e) {
    jumpUtil(e)
  },

  onShareAppMessage() {
    return {
      title: '自定义转发标题',
      path: 'pages/home/home'
    }
  },

  onShareTimeline() {
    return {
      title: '自定义转发标题',
      path: 'pages/home/home'
    }
  }
});
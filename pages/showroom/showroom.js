import dayjs from 'dayjs'
import {
  domain,
} from '../../utils/util'
Page({

  data: {
    searchValue: '',
    domain,
    page: 1,
    total: 0,
    list: [],
    isAll: false,
  },

  onLoad(options) {

  },

  onReady() {
    this.getShowroomList();
  },

  onShow() {
    this.getTabBar().init();
  },
  onHide() {

  },
  onUnload() {

  },
  onPullDownRefresh() {
    this.getShowroomList(1);
  },

  onReachBottom() {
    if (this.data.isAll) return;
    this.getShowroomList(this.data.page);
  },

  onShareAppMessage() {

  },

  getShowroomList(page = 1, searchValue = '') {
    const _ = this;
    wx.request({
      url: `${this.data.domain}api/showroom/list`,
      data: {
        page,
        pageSize: 10,
        title: searchValue,
      },
      success(res) {
        const _list = [..._.data.list];
        const data = res.data.data;
        const now = +new Date();
        const result = data.data.map(item => {
          if (+new Date(item.startAt) < now && +new Date(item.endAt) > now) {
            item.status = 'ing'
            item.statusText = '展览中'
          }
          if (+new Date(item.endAt) < now) {
            item.status = 'done';
            item.statusText = '已结束'
          }
          item.startAt = dayjs(item.startAt).format('YYYY年MM月DD日 HH:mm')
          item.endAt = dayjs(item.endAt).format('YYYY年MM月DD日 HH:mm')
          return item;
        })
        _.setData({
          list: page === 1 ? [...result] : [..._list, ...result],
          total: data.total,
          page: page + 1,
          isAll: data.data.length === 0
        });

      }
    })
  },

  handleSearch() {
    this.getShowroomList(1, this.data.searchValue)
  },

  clearHandle() {
    this.setData({
      searchValue: '',
    });
  },

  toShowroomDetail() {

  }
})
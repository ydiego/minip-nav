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
    renderList: [],
    isAll: false,
    stickyProps: {
      zIndex: 2,
    },
    tags: [{
      id: 0,
      name: '全部'
    }],
    activeTab: 0,
    tagsOfData: {
      0: []
    },
  },

  onLoad(options) {

  },

  onReady() {
    this.getShowroomList();
    this.getShowroomTags();
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
    if (this.data.isAll || this.activeTab !== 0) return;
    this.getShowroomList(this.data.page);
  },

  onShareAppMessage() {

  },

  onShareTimeline() {
    return {
      title: '互动艺术云展厅',
      // path: `pages/showroom-detail/index?id=${this.data.options.id}`,
      // imageUrl: this.data.domain + 'uploads/' + this.data.info.thumb
    }
  },

  getShowroomTags() {
    const _ = this;
    wx.request({
      url: `${this.data.domain}api/showroomTags/all`,
      success({
        data
      }) {
        _.setData({
          tags: [
            ..._.data.tags,
            ...data.data
          ]
        })
      }
    })
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

        const result = _.dataDeal(data.data)
        const renderList = page === 1 ? [...result] : [..._list, ...result]
        _.setData({
          list: renderList,
          renderList,
          total: data.total,
          page: page + 1,
          isAll: data.data.length === 0
        });

      }
    })
  },

  dataDeal(data) {
    const now = +new Date();
    return data.map(item => {
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
  },

  onTabsChange(event) {
    console.log(`Change tab, tab-panel value is ${event.detail.value}.`);
    const activeIndex = event.detail.value;
    this.setData({
      activeTab: activeIndex
    })
    let renderList = this.data.list
    if (activeIndex !== 0) {
      renderList = renderList.filter(item => item.tagId === activeIndex)
    }
    this.setData({
      renderList
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
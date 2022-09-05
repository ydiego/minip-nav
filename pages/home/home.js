import dayjs from 'dayjs'
import {
  domain,
  jumpUtil
} from '../../utils/util'

Page({
  data: {
    imgSrcs: [],
    pageLoading: true,
    current: 1,
    indicatorDots: true,
    vertical: false,
    interval: 2000,
    duration: 500,
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

  sortByPlatform(data) {
    const map = {};
    let sortRes = [];
    data.forEach(item => {
      const {
        appId,
        logo,
        id,
        sort,
        name,
        startAt,
        endAt,
        desc,
      } = item;
      const mapItem = map[item.platformId]
      if (!mapItem) {
        map[item.platformId] = {
          appId,
          logo,
          id,
          sort,
          name,
          desc,
          list: [{
            startAt,
            endAt
          }]
        }
      } else {
        if (desc) {
          mapItem.desc = desc;
        }
        mapItem.list.push({
          startAt,
          endAt
        });
        mapItem.sort = mapItem.sort + sort;
      }
    });
    sortRes = Object.values(map).sort((a, b) => b.sort - a.sort).map(item => {
      return {
        ...item,
        list: this.sortData(item.list)
      }
    });
    return sortRes;
  },

  sortData(data) {
    // this.sortByPlatform(data);
    const now = +new Date();
    const ongoing = data.filter(item => {
      return +new Date(item.startAt) < now && +new Date(item.endAt) > now
    }).sort((a, b) => b.sort - a.sort);
    const coming = data.filter(item => {
      return +new Date(item.startAt) > now;
    }).sort((a, b) => b.sort - a.sort);
    const result = [...ongoing, ...coming].map(item => {
      if (+new Date(item.startAt) < now) {
        item.status = '拍卖中'
      } else {
        item.status = '预展中'
      }
      item.startAt = dayjs(item.startAt).format('MM.DD HH:mm')
      item.endAt = dayjs(item.endAt).format('MM.DD HH:mm')

      return item;
    })
    return result;
  },

  onReTry() {},

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
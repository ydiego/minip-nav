import dayjs from 'dayjs'
import {
  domain,
  jumpUtil
} from '../../utils/util'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    list: {
      type: Array,
      value: []
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    listData: [],
    domain,
    imgSrcs: [],
  },
  observers: {
    list: function (val) {
      this.setData({
        listData: this.sortByPlatform(val)
      })
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    sortByPlatform(data) {
      const map = {};
      let sortRes = [];
      data.forEach(item => {
        const {
          sort,
          desc,
          startAt,
          endAt,
        } = item;
        const mapItem = map[item.platformId]
        if (!mapItem) {
          map[item.platformId] = {
            ...item,
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

    itemClick(e) {
      jumpUtil(e)
    },
  }
})
import { createStore } from "vuex";
// 创建一个新的 store 实例
const store = createStore({
  state() {
    return {
      count: 0,
      isFullscreen: false,  //默认不是全屏状态
      buycarts: [],
    };
  },
  mutations: {
    increment(state, payload) {
      state.count += payload;
    },
    setFullscreen(state, payload) {     //设置全屏方法  state传入状态,payload有效载荷,载荷告诉为全品就是全屏
      state.isFullscreen = payload;
    },
    addBuycarts(state, payload) {      //添加产品到购物车
      state.buycarts.push(payload);
    },
    addBuycartsNum(state, payload) {   //添加购物车商品的数量
      state.buycarts[payload].num++;
    },
    minusBuycartsNum(state, payload) {  //减少购物车商品数量
      state.buycarts[payload].num--;
      if (state.buycarts[payload].num == 0) {
        state.buycarts.splice(payload, 1);
      }
    },
  },
  getters: {
    totalPrice(state) {
      let total = state.buycarts.reduce((pre, item) => {
        return pre + item.price * item.num;
      }, 0);
      return total;
    },
  },
  actions: {
    asyncAdd(store, payload) {
      setTimeout(() => {
        store.commit("increment", payload);
      }, 1000);
    },
  },
});

export default store;

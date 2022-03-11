<template>
  <div class="loading" v-show="data.isLoading">
    <Loading :progress="data.progress"></Loading>
  </div>
  <div class="product" v-show="!data.isLoading" id="product">
    <div
      class="desc"
      :class="{ active: data.descIndex == i }"
      v-if="data.products[data.pIndex]"
      v-for="(desc, i) in data.products[data.pIndex].desc"
    >
      <h1 class="title">{{ desc.title }}</h1>
      <p class="content">{{ desc.content }}</p>
    </div>
    <div class="prod-list" :class="{ hidden: store.state.isFullscreen }">
      <h1><SketchOutlined></SketchOutlined>产品推荐</h1>
      <div class="products">
        <div
          class="prod-item"
          :class="{ active: pI == data.pIndex }"
          v-for="(prod, pI) in data.products"
          @click="changeModel(prod, pI)"
        >
          <div class="prod-title">
            {{ prod.title }}
          </div>
          <div class="img">
            <img :src="prod.imgsrc" :alt="prod.title" />
          </div>
          <a-button type="primary" block @click.stop="addBuycart(prod)">
            <template #icon>
              <ShoppingCartOutlined></ShoppingCartOutlined>
            </template>
            加入购物车
          </a-button>
        </div>
      </div>
    </div>
    <div class="scene-list" :class="{ hidden: store.state.isFullscreen }">
      <h3><RadarChartOutlined></RadarChartOutlined> 切换使用场景</h3>

      <div class="scenes">
        <div
          class="scene-item"
          v-for="(scene, index) in data.scenes"
          @click="changeHdr(scene, index)"
        >
          <img
            :class="{ active: index == data.sceneIndex }"
            :src="`./files/hdr/${scene}.jpg`"
            :alt="scene"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Loading from "../components/Loading.vue";
import {
  SketchOutlined,
  RadarChartOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons-vue";
import { useRoute } from "vue-router";
import { onMounted, reactive } from "vue";
import * as api from "../api/index.js";
import { useStore } from "vuex";
import Base3d from "../utils/Base3d";
const route = useRoute();
const store = useStore();
// console.log(route);
const data = reactive({
  products: [],
  isLoading: true,  //加载完成前，loading为true
  scenes: [],
  pIndex: 0,
  sceneIndex: 0,
  base3d: {},
  descIndex: 0,
  progress: 0,
});
function LoadingFinish() {
  data.isLoading = false;//加载完成后，loading为false
}
onMounted(async () => {
  let result = await api.getProducts();
  console.log(result);
  //   data.isLoading = false;
  data.products = result.list;
  data.scenes = result.hdr;
  data.base3d = new Base3d("#product", LoadingFinish);
  data.base3d.onProgress((e) => {
    let progressNum = e.loaded / e.total;
    progressNum = progressNum.toFixed(2) * 100;
    data.progress = progressNum;
    // console.log(progressNum);
  });
});
function changeModel(prod, pI) {
  data.pIndex = pI;
  data.base3d.setModel(prod.modelName);
}
function changeHdr(scene, index) {
  data.sceneIndex = index;
  data.base3d.setEnvMap(scene);
}
function addBuycart(prod) {
  let product = { ...prod, num: 1 };
  let index = 0;
  let isExist = store.state.buycarts.some((item, i) => {
    if (product.id == item.id) {
      index = i;
      return true;
    } else {
      return false;
    }
  });
  if (isExist) {
    store.commit("addBuycartsNum", index);
  } else {
    store.commit("addBuycarts", product);
  }
}
window.addEventListener("mousewheel", (e) => {
  //   console.log(e);
  if (e.deltaY > 0) {
    store.commit("setFullscreen", true);
  }

  if (e.deltaY < 0) {
    store.commit("setFullscreen", false);
  }
});

window.addEventListener("mousewheel", (e) => {
  let duration = data.base3d.animateAction._clip.duration;
  let time = data.base3d.animateAction.time;
  let index = Math.floor((time / duration) * 4);
  data.descIndex = index;
});
</script>

<style lang="less" scoped>
.desc {
  position: fixed;
  z-index: 100000;
  background-color: rgba(255, 255, 255, 0.5);
  width: 600px;
  top: 100px;
  left: 50%;
  margin-left: -300px;
  transition: all 0.5s;

  transform: translate(-100vw, 0);
  padding: 15px;
}
.desc.active {
  transform: translate(0, 0);
}
.prod-list {
  width: 300px;    //宽度：300px
  height: 100vh;   //高度：100%屏幕视觉视口高度
  padding: 60px 0 0;  // 上（60）右（0）下（0）左（0）
  position: fixed;   //左边菜单  固定定位
  z-index: 100000;   //置于顶层
  transition: all 0.5s;  //渐变退出效果效果  0.5s退出
  background-color: rgba(255, 255, 255, 0.8);  // 白色和0.8透明度
  left: 0;  // 定位左边0
  top: 0;   // 定位顶边0
  h1 {
    font-size: 20px;
    font-weight: 900;
    padding: 10px 25px 0;
  }
  .products {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .prod-item {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 250px;
      background-color: #fff;
      border-radius: 20px;
      overflow: hidden;
      margin: 10px 0;
      box-shadow: 2px 2px 5px #666;
      transition: all 0.3s;
      &.active {
        box-shadow: 2px 2px 5px #666, 0px 0px 10px red;
      }
      &:hover {
        transform: translate(0px, -5px);
        box-shadow: 2px 2px 5px #666, 0px 0px 10px orangered;
        // background-color: orange;
      }
      img {
        width: 190px;
      }
      .prod-title {
        padding: 0 20px;
      }
    }
  }
}
.prod-list.hidden {
  transform: translate(-100%, 0); //水平位置移动-100%  垂直不变
}
.scene-list {
  width: 300px;
  height: 100vh;
  padding: 60px 0 0;
  position: fixed;
  z-index: 100000;
  transition: all 0.5s;
  background-color: rgba(255, 255, 255, 0.8);
  right: 0;
  top: 0;
  h3 {
    font-size: 20px;
    font-weight: 900;
    padding: 0 30px;
  }
  .scenes {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .scene-item {
    padding: 6px 0;

    img {
      width: 250px;
      border-radius: 10px;
      box-shadow: 2px 2px 10px #666;
      transition: all 0.3s;
      &.active {
        box-shadow: 2px 2px 5px #666, 0px 0px 10px red;
      }
      &:hover {
        transform: translate(0px, -5px);
        box-shadow: 2px 2px 5px #666, 0px 0px 10px orangered;
      }
    }
  }
}
.scene-list.hidden {
  transform: translate(100%, 0);
}
</style>

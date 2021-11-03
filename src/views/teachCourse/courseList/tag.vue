<template>
  <div class="direction-tag-box">
    <span class="tag-label">课程方向：</span>
    <div class="tag-right">
      <div class="tag" ref="allTag" v-if="directionsShow">
        <span
          :class="!params.directions ? 'active' : ''"
          @click="params.directions = ''"
          >全部</span
        >
        <span
          v-for="item in directionTag"
          :key="item.id"
          :class="params.directions === item.id ? 'active' : ''"
          @click="params.directions = item.id"
          :title="item.name"
        >
          {{ item.name }}
        </span>
      </div>
      <div class="tag part" v-else>
        <span
          :class="!params.directions ? 'active' : ''"
          @click="params.directions = ''"
          >全部</span
        >
        <span
          v-for="item in directionTag"
          :key="item.id"
          :class="params.directions === item.id ? 'active' : ''"
          @click="params.directions = item.id"
          :title="item.name"
        >
          {{ item.name }}
        </span>
      </div>
      <div class="more-btn" v-if="directionsHeight > 30">
        <span @click="directionsShow = !directionsShow"
          >展开<span class="icon-zhankai iconfont"></span
        ></span>
      </div>
    </div>
  </div>

  <div class="category-tag-box">
    <span class="tag-label">职业方向：</span>
    <div class="tag-right">
      <div class="tag" ref="allTag" v-if="categoryShow">
        <span
          :class="!params.category ? 'active' : ''"
          @click="params.category = ''"
          >全部</span
        >
        <span
          v-for="item in CategoryTag"
          :key="item.id"
          :class="params.category === item.id ? 'active' : ''"
          @click="params.category = item.id"
          :title="item.name"
        >
          {{ item.name }}
        </span>
      </div>
      <div class="tag part" v-else>
        <span
          :class="!params.category ? 'active' : ''"
          @click="params.category = ''"
          >全部</span
        >
        <span
          v-for="item in CategoryTag"
          :key="item.id"
          :class="params.category === item.id ? 'active' : ''"
          @click="params.category = item.id"
          :title="item?.name"
        >
          {{ item?.name }}
        </span>
      </div>
      <div class="more-btn" v-if="categoryHeight > 30">
        <span @click="openOrClose"
          >展开<span class="icon-zhankai iconfont"></span
        ></span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  onMounted,
  reactive,
  watch,
  nextTick,
  toRefs,
} from "vue";
import request from "src/request/getRequest";

type TreactiveData = {
  directionTag: any[];
  CategoryTag: any[];
  allTag: any|null;
  directionsShow: boolean;
  directionsHeight: number;
  categoryHeight:number;
  categoryShow: boolean;
  params: {
    directions: string;
    category: string;
  };
};
export default defineComponent({
  emits: ["tagChange"],
  setup(props, { emit }) {
    const courseApi = request.teachCourse;
    const reactiveData: TreactiveData = reactive({
      directionTag: [{}],
      CategoryTag: [],
      allTag: null,
      directionsShow: true,
      directionsHeight: 0,
      categoryHeight: 0,
      categoryShow: true,
      params: {
        directions: "",
        category: "",
      },
    });
    onMounted(() => {
      // 课程方向
      getDirections().then(() => {
        nextTick(() => {
          reactiveData.directionsHeight = (
            reactiveData as any
          ).allTag.clientHeight;
          if (reactiveData.directionsHeight > 40) {
            reactiveData.directionsShow = false;
          } else {
            reactiveData.directionsShow = true;
          }
        });
      });
      // 职业方向
      getCategory().then(() => {
        nextTick(() => {
          reactiveData.categoryHeight = (
            reactiveData as any
          ).allTag.clientHeight;
          if (reactiveData.categoryHeight > 40) {
            reactiveData.categoryShow = false;
          } else {
            reactiveData.categoryShow = true;
          }
        });
      });
    });
    watch(
      () => reactiveData.params,
      () => {
        console.log(reactiveData.params);
        emit("tagChange", reactiveData.params);
      },
      { deep: true }
    );

    // 获取课程方向
    function getDirections() {
      return new Promise((resolve: any) => {
        courseApi.getDirectionsApi({}).then((res) => {
          console.log(res);
          reactiveData.directionTag = res?.data;
          resolve();
        });
      });
    }
    // 获取职业方向
    function getCategory() {
      return new Promise((resolve: any) => {
        courseApi.getCategoryApi({}).then((res) => {
          console.log(res);
          reactiveData.CategoryTag = res?.data;
          resolve();
        });
      });
    }
    // 展开
    function openOrClose() {
      reactiveData.categoryShow = !reactiveData.categoryShow;
    }
    return {
      ...toRefs(reactiveData),
      openOrClose,
    };
  },
});
</script>

<style lang="less">
.direction-tag-box,
.category-tag-box {
  padding-bottom: 3px;
  display: flex;
  border-bottom: 1px solid #dddddd;
  margin-top: 30px;
  .tag-label {
    flex-shrink: 0;
  }
  .tag-right {
    display: flex;
    flex-direction: row;
    .more-btn {
      flex-shrink: 0;
      display: flex;
      > span {
        margin-top: auto;
        cursor: pointer;
      }
    }
  }
  .tag {
    display: flex;
    flex-wrap: wrap;
    > span {
      margin-right: 10px;
      cursor: pointer;
      padding: 0 5px;
      max-width: 120px;
      overflow: hidden;
      height: 25px;
      text-overflow: ellipsis;
      &.active {
        color: @white;
        background: @theme-color;
      }
    }
    &.part {
      height: 25px;
      overflow: hidden;
    }
  }
}
</style>

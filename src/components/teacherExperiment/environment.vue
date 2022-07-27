<template>
  <div class="image-box">
    <div class="tags">
      <span>类型：</span>
      <span :class="currentType === '' ? 'active' : ''" @click="tabChange('')">
        全部
      </span>
      <span
        :class="currentType === key ? 'active' : ''"
        v-for="(item, key) in imageTypes"
        :key="key"
        @click="tabChange(key)"
      >
        {{ item }}
      </span>
    </div>
    <div class="search-box">
      <a-input-search  enter-button
        v-model:value="searchVal"
        class="search-inbput"
        placeholder="请输入关键字查询"
        @search="onSearch"
      />
    </div>
    <div class="image-list setScrollbar" v-if="imageData.length">
      <div class="image-item" v-for="(item, index) in imageData" :key="item.id">
        <span v-if="item">{{ item.name }}</span>
        <span v-if="item">
          标签：<span v-for="(o, i) in item.tag" :key="o">{{
            Number(i) < item.tag.length - 1 ? o + " / " : o
          }}</span>
        </span>
        <span
          v-if="item.isSelect"
          class="shanchu iconfont icon-shanchu"
          @click="del(index)"
        ></span>
        <span v-else @click="select(index)">选择</span>
      </div>
    </div>
    <Empty v-else></Empty>
    <!-- <div v-else style="text-align: center; margin-top: '50px'; color: '#b6b6b6';">暂无数据</div> -->
    <div class="more-btn-box" v-if="pageinfo.page < pageinfo.pageCount">
      <a-button @click="addMoreImage">加载更多</a-button>
    </div>
  </div>
</template>
<script lang="ts">
import {
  defineComponent,
  ref,
  inject,
  reactive,
  watch,
  onMounted,
  toRefs,
  onUnmounted,
  Ref,
} from "vue";
import request from "src/api/index";
import { IBusinessResp } from "src/typings/fetch.d";
import Tree from "src/components/Tree.vue";
import { MessageApi } from "ant-design-vue/lib/message";
import { ModalFunc } from "ant-design-vue/lib/modal/Modal";
import { useRoute, useRouter } from "vue-router";
// import { IimageData } from "src/views/teacherModule/teacherExperiment/experTyping";
export default defineComponent({
  components: {
    Tree,
  },
  props: ["modelValue", "limitNumber"],
  setup(props, { emit }) {
    let route = useRoute();
    let router = useRouter();
    const http = (request as any).common;
    // const http=(request as any).teacherTrain
    const $message: MessageApi = inject("$message")!;
    const limitNumber: Ref<number> = ref(3);
    props.limitNumber ? (limitNumber.value = props.limitNumber) : "";
    let currentType = ref<string>("");
    let searchVal = ref<string>("");
    let pageinfo = reactive({
      page: 1,
      pageSize: 20,
      pageCount: 0,
    });
    let loading = ref<boolean>(false);
    let imageData = reactive<any[]>([]);
    // 获取镜像
    function getMeImage(isMore: boolean) {
      loading.value = true;
      let param = {
        name: searchVal.value,
        types: currentType.value,
        page: pageinfo.page,
        limit: pageinfo.pageSize,
        withs: "image,config,image.classify",
      };
      if (!isMore) {
        imageData.length = 0;
      }
      http.getMeImage({ param }).then((res: any) => {
        // if (res.code === 1) {
        loading.value = false;
        let { list, page } = res.data;
        list.map((v: any) => {
          v.isSelect = false;
          v.flavor = {
            cpu: 1,
            ram: 2048,
            disk: 30,
          };
          v.is_use_gpuNumber = 0; //   替代 is_use_gpu  是布尔值无法做下拉选项的数据类型
          v.showSelectGpu =
            v.tag && v.tag.length && v.tag.includes("GPU") ? true : false;
          props.modelValue?.forEach((i: any) => {
            if (v.id === i.id) v.isSelect = true;
          });
          // console.log( )
        });
        imageData.push(...list);
        pageinfo.page = page.currentPage;
        pageinfo.pageSize = page.perPage;
        pageinfo.pageCount = page.pageCount;
        // console.log(pageinfo)
        // }
      });
    }
    onMounted(() => {
      getMeImage(false);
    });
    function select(i: number) {
      // if (props.modelValue.length >= 3) {
      //   $message.warn('最多可选3个镜像!')
      //   return
      // }
      if (props.modelValue.length >= limitNumber.value) {
        $message.warn(`镜像最多可选择${limitNumber.value}个`);
        return;
      }
      imageData[i].isSelect = true;
      props.modelValue.push(imageData[i]);
      emit("update:modelValue", props.modelValue);
    }
    function del(i: number) {
      imageData[i].isSelect = false;
      let arr = props.modelValue;
      emit(
        "update:modelValue",
        arr?.filter((v: any) => v.id !== imageData[i].id)
      );
    }
    // 获取配置
    let imageTypes = reactive({});
    function getConfigs() {
      http.getConfigs().then((res: any) => {
        imageTypes = Object.assign(imageTypes, res.data.image_types);
      });
    }
    getConfigs();
    function tabChange(key: string) {
      currentType.value = key;
      getMeImage(false);
    }
    function onSearch() {
      getMeImage(false);
    }
    function addMoreImage() {
      pageinfo.page++;
      getMeImage(true);
    }
    // watch(
    //   () => props.modelValue,
    //   (newVal) => {
    //     console.log(newVal)
    //     imageData.forEach((v: any) => {
    //       v.isSelect = false
    //       newVal?.forEach((vv: any) => {
    //         if (v.id === vv.id) v.isSelect = true
    //       })
    //     })
    //   },
    //   {deep: true}
    // )
    // onUnmounted(() => {
    //   debugger
    // })
    return {
      currentType,
      searchVal,
      pageinfo,
      imageTypes,
      tabChange,
      imageData,
      select,
      del,
      onSearch,
      addMoreImage,
    };
  },
});
interface Iimage {
  name: string;
  tag: [];
}
interface Icongig {
  cpu_text: string;
  disk_text: string;
  ram_text: string;
  swap: string;
  cpu: number;
  ram: number;
  disk: number;
  ramNum: number;
}
</script>

<style lang="less" scoped>
.image-box {
  height: 100%;
  display: flex;
  flex-direction: column;

  .tags {
    display: flex;
    flex-wrap: wrap;
    min-height: 30px;
    line-height: 30px;
    flex-shrink: 0;

    > span {
      padding: 0px 20px;
      color: #000000;
      font-size: 14px;
      cursor: pointer;
    }

    > span.active {
      background: var(--primary-color);
      color: #fff;
      border-radius: 4px;
    }

    > span:nth-child(1) {
      padding: 2px 0;
      cursor: auto;
    }
  }

  .search-box {
    margin-top: 27px;
    width: 341px;
    height: 32px;
    background: #ffffff;
    border-radius: 6px;
    margin-bottom: 27px;
    flex-shrink: 0;
  }

  .image-list {
    height: 100%;
    overflow: auto;
    padding-right: 15px;

    .image-item {
      padding: 10px 16px;
      background: #ffffff;
      border: 1px solid #eeeeee;
      border-radius: 6px;
      display: flex;
      margin-bottom: 16px;

      &:hover {
        background: rgba(var(--primary-1), 0.2);
        border: 1px solid rgba(var(--primary-color), 0.7);
        border-radius: 6px;
        box-shadow: 0px 3px 6px 0px var(--black-0-7);
        cursor: pointer;
      }

      > span {
        margin: auto 0;
      }

      > span:nth-child(1) {
        width: 60%;
        color: #050101;
        font-size: 14px;
      }

      > span:nth-child(2) {
        width: 40%;
        color: rgba(5, 1, 1, 0.45);
        font-size: 12px;
      }

      > span:nth-child(3) {
        width: 50px;
        flex-shrink: 0;
        text-align: center;
        color: var(--primary-color);
        font-size: 14px;
      }
    }
  }

  .more-btn-box {
    flex-shrink: 0;
    text-align: center;
  }
}
</style>

<template>
  <div class="data-set-box">
    <a-radio-group
      class="data-set-type"
      v-model:value="params.common"
      button-style="solid"
      @change="dataSetChange"
    >
      <a-radio-button :value="1">公共数据集</a-radio-button>
      <a-radio-button :value="0">我的数据集</a-radio-button>
    </a-radio-group>
    <div class="data-set-tag-box">
      类型：
      <a-radio-group
        v-model:value="params.category"
        button-style="solid"
        @change="tagChange"
      >
        <a-radio-button value="">全部</a-radio-button>
        <a-radio-button
          v-for="(it, ind) in category"
          :key="ind"
          :value="it.uid"
          >{{ it.name }}</a-radio-button
        >
      </a-radio-group>
      <a-input-search
        class="select-keyword"
        placeholder="请输入关键字查询"
        v-model:value="params.keyword"
        style="width: 300px"
        @search="onSearch"
      />
    </div>
    <div class="data-set-base-box setScrollbar">
      <template v-if="dataSetList.length > 0">
        <div class="data-set-item" v-for="item in dataSetList" :key="item.id">
          <div><img :src="item.cover" alt="" /></div>
          <div class="data-base-info">
            <h2>{{ item.name }}</h2>
            <div class="tag">
              <div>
                <i class="iconfont icon-wenjianjia"></i
                ><span>{{ item.amount }}</span>
              </div>
              <div>
                <i class="iconfont icon-cunchuzhi"></i
                ><span>{{ item.size }}</span>
              </div>
            </div>
          </div>
          <div>
            <span
              v-if="selected.includes(item.uid)"
              class="shanchu iconfont icon-shanchu"
              @click="remove(item)"
            ></span>
            <span v-else class="select-btn" @click="select(item)">选择</span>
          </div>
        </div>
      </template>
      <empty v-else></empty>
      <p
        class="look-more-btn"
        @click="lookMore"
        v-if="dataSetList.length < count"
      >
        查看更多>>
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, toRefs,watch,Ref,ref,inject } from "vue";
import request from "src/request/getRequest";
import storage from "src/utils/extStorage";
import empty from "src/components/Empty.vue";
import { MessageApi } from "ant-design-vue/lib/message";
export default defineComponent({
  components: { empty },
  props: ["value", "name",'limitNumber'],
  setup(props, { emit }) {
    const $message: MessageApi = inject("$message")!;
    const datasetApi = request.teacherWorkbench;
    const uid = storage.lStorage.get("uid");
    const limitNumber: Ref<number> = ref(3);
    props.limitNumber?limitNumber.value=props.limitNumber:''
    const reactiveData: {
      params: any;
      category: any[];
      dataSetList: any[];
      selected: any[]; // 已经选择uid
      count: number;
    } = reactive({
      params: {
        per_page: 20,
        page: 1,
        category: "",
        label: "",
        keyword: "",
        common: 1,
        user_id: uid,
      },
      category: [],
      dataSetList: [],
      selected: [], // 已经选择uid
      count: 0,
    });

    onMounted(() => {
      getDataCategory().then(() => {
        getDataList();
      });
    });
    // 获取数据集类型
    function getDataCategory() {
      return new Promise((reslove: any, reject: any) => {
        datasetApi.getDatacategoryApi({}).then((res: any) => {
          reactiveData.category = res.data;
          reslove();
        });
      });
    }
    // 获取数据集列表
    function getDataList() {
      datasetApi
        .getDataSetApi({ param: reactiveData.params })
        .then((res: any) => {
          // console.log(res);
          reactiveData.dataSetList.push(...res.data);
          reactiveData.count = res.total;
        });
    }
    // 搜索
    function onSearch() {
      reactiveData.params.page = 1;
      reactiveData.dataSetList = [];
      getDataList();
    }

    // 数据集变化时触发
    function dataSetChange() {
      reactiveData.params.page = 1;
      reactiveData.dataSetList = [];
      getDataList();
    }

    // 数据集标签发生变化时
    function tagChange() {
      reactiveData.params.page = 1;
      reactiveData.dataSetList = [];
      getDataList();
    }

    // 查看所有
    function lookMore() {
      reactiveData.params.page++;
      getDataList();
    }

    // 移除
    function remove(val: any) {
      let i = reactiveData.selected.indexOf(val.uid);
      reactiveData.selected.splice(i, 1);
      updateData();
    }

    // 选择
    function select(val: any) {
      if(limitNumber.value === reactiveData.selected.length){
        $message.warn(`数据集最多可选择${limitNumber.value}个`)
        return
      }
      reactiveData.selected.includes(val.uid)
        ? ""
        : reactiveData.selected.push(val.uid);
      updateData();
    }

    // 更新选中的数据集数据
    function updateData() {
      let names: any = [];
      emit("update:value", reactiveData.selected);
      // console.log(reactiveData.selected);
      reactiveData.dataSetList.map((item: any) => {
        reactiveData.selected.includes(item.uid)
          ? names.push({ uid: item.uid, name: item.name,amount:item.amount,size:item.size })
          : "";
      });
      emit("update:name", names);
    }
    watch(()=>{return props.value},(val:any)=>{
      reactiveData.selected=val
    },{deep:true,immediate:true})
    return {
      ...toRefs(reactiveData),
      onSearch,
      dataSetChange,
      tagChange,
      lookMore,
      remove,
      select,
    };
  },
});
</script>

<style lang="less">
.data-set-box {
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  .data-set-type {
    &.ant-radio-group {
      border-bottom: 1px solid #cdcdcd;
    }
  }
  .data-set-tag-box {
    padding-top: 25px;
    .ant-radio-button-wrapper {
      border-radius: 4px;
    }
    .select-keyword {
      margin-top: 25px;
    }
  }
  .ant-radio-button-wrapper {
    border: none;
    &.ant-radio-button-wrapper:first-child {
      border-left: none;
    }
    &:not(:first-child)::before {
      background-color: transparent;
    }
  }
  .data-set-base-box {
    // flex: 1;
    height: calc(100% - 150px);
    overflow: auto;
    padding-top: 25px;
    .data-set-item {
      display: flex;
      padding: 6px 3px;
      flex-direction: row;
      margin-bottom: 10px;
      background: @white;
      border: 1px solid #cdcdcd;
      border-radius: 6px;
      box-shadow: 0 3px 6px 0 rgba(187, 156, 214, 0.4);
      cursor: pointer;
      > div {
        &:first-child {
          width: 52px;
          height: 52px;
          border-radius: 4px;
          flex-shrink: 0;
          > img {
            width: 100%;
            height: 100%;
          }
        }
        &:nth-child(3) {
          width: 40px;
          margin: auto;
          flex-shrink: 0;
        }
      }
      .data-base-info {
        width: 100%;
        margin-left: 28px;
        h2 {
          font-size: 14px;
          color: #050101;
        }
        .tag {
          display: flex;
          flex-direction: row;
          margin-top: 8px;
          > div {
            margin-right: 30px;
            > .iconfont {
              color: #ffaf47;
            }
            span {
              font-size: 12px;
              color: rgba(5, 1, 1, 0.45);
              margin-left: 6px;
            }
          }
        }
      }
      .select-btn,.shanchu{
        color: @theme-color;
      }
    }
  }
  .look-more-btn {
    text-align: center;
    cursor: pointer;
    color: #878787;
  }
}
</style>

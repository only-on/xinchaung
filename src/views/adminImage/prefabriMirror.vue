<template>
  <div class="prefabriMirror">
    <div class="search">
       <a-form-item class="searchItem">
           <a-input
            @keyup.enter="search"
            v-model:value="params.name"
            placeholder="名称"
            class="input"
          >
            <template #prefix>
              <img src="src/assets/images/screenicon/Group6.png" /> </template
          ></a-input>
        </a-form-item>
        <a-form-item class="searchItem">
          <before-icon :icon='iconimg'>
               <a-select
                  class="select"
                  placeholder="请选择镜像系统"
                  @change="search"
                  v-model:value="imageType"
                >
            <a-select-option value="1">Windows</a-select-option>
            <a-select-option value="2">Linux</a-select-option>
          </a-select>
          </before-icon>
        </a-form-item>
      <!-- <a-form-item class="searchItem" label="更新时间：">
        <a-date-picker @change="search" v-model:value="params.update_time" />
      </a-form-item> -->
      <a-button class="btn" type="primary" @click="search">查询</a-button>
      <a-button type="primary" @click="clear">清空</a-button>
    </div>
    <div>
      <a-config-provider>
        <a-table :columns="columns" :data-source="data" rowKey="id" :loading="loading" :pagination="
          total > 10
            ? {
                hideOnSinglePage: false,
                showSizeChanger: true,
                total: total,
                current:params.page,
                pageSize: params.limit,
                onChange: onChange,
                onShowSizeChange: onShowSizeChange,
              }
            : false
        ">
          <template #imageType="{ record }">
            <div>
              {{ record.classify_id === 1 ? "Windows" : "Linux" }}
            </div>
          </template>
        </a-table>
        <template #renderEmpty>
          <div><empty type="tableEmpty"></empty></div>
        </template>
      </a-config-provider>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, reactive, toRefs, onMounted } from "vue";
import request from "src/api/index";
import beforeIcon from 'src/components/aiAnt/beforeIcon.vue'
import iconimg from 'src/assets/images/screenicon/Group3.png'
interface Istate {
  imageType: any;
  params: any;
  loading:boolean;
  data: any[];
  total:number;
}
const columns = [
  {
    title: "镜像名称",
    dataIndex: "name",
  },
  {
    title: "镜像系统",
    dataIndex: "imageType",
    slots: { customRender: "imageType" },
  },
   {
    title: "镜像大小",
    dataIndex: "size",
  },
  {
    title: "镜像类型",
    dataIndex: "ostypes",
  }
];
export default defineComponent({
  components: {beforeIcon},
  setup() {
    const http = (request as any).adminImage;
    const state: Istate = reactive({
      imageType: undefined,
      loading:false,
      params: {
        limit:10,
        name: "",
        classify: "",
        update_time: "",
        is_init: 1,
        withs: "classify,user,userProfile",
      },
      data: [],
      total:0,
    });
    const methods = {
       onChange(page: any, pageSize: any) {
        state.params.page = page;
        state.params.limit = pageSize;
        methods.getImageList();
      },
      onShowSizeChange(current: any, size: any) {
        console.log(current, size, "current, size");
        state.params.page = 1;
        state.params.limit = size;
        methods.getImageList();
      },
      getImageList() {
        state.loading=true,
        state.params.classify = state.imageType === undefined ? "" : state.imageType;
        http.imageList({ param: state.params }).then((res: any) => {
          console.log(res);
          state.data = res.data.list;
          state.total=res.data.page.totalCount;
          state.loading=false;
        });
      },
      search() {
        state.params.page = 1;
        methods.getImageList();
      },
      clear() {
        state.imageType = undefined;
        state.params.name = "";
        state.params.classify = "";
        state.params.update_time = "";
        methods.getImageList();
      },
    };
    onMounted(() => {
      methods.getImageList();
    });
    return { ...toRefs(state), columns, ...methods,iconimg};
  },
});
</script>
<style lang="less" scoped>
.search {
  display: flex;
  .searchItem {
    margin-right: 20px;
    .select{
      width: 190px;
    }
  }
  .btn {
    margin-right: 20px;
  }
}
:deep(.ant-table-pagination.ant-pagination) {
  float: none;
  text-align: center;
}
</style>

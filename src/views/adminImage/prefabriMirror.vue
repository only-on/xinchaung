<template>
  <div class="prefabriMirror">
    <div class="search">
      <a-form-item class="searchItem" label="名称：">
        <a-input @keyup.enter="search" v-model:value="params.name"></a-input>
      </a-form-item>
      <a-form-item class="searchItem" label="镜像分类：">
        <a-select
          class="select"
          default-value="请选择"
          @change="search"
          v-model:value="imageType"
        >
          <a-select-option value="1">Windows</a-select-option>
          <a-select-option value="2">Linux</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item class="searchItem" label="更新时间：">
        <a-date-picker @change="search" v-model:value="params.update_time" />
      </a-form-item>
      <a-button class="btn" type="primary" @click="search">查询</a-button>
      <a-button type="primary" @click="clear">清空</a-button>
    </div>
    <div>
      <a-config-provider>
        <a-table :columns="columns" :data-source="data">
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
interface Istate {
  imageType: any;
  params: any;
  data: any[];
}
const columns = [
  {
    title: "镜像名称",
    dataIndex: "name",
  },
  {
    title: "镜像分类",
    dataIndex: "imageType",
    slots: { customRender: "imageType" },
  },
  {
    title: "更新时间",
    dataIndex: "updated_time",
  },
];
export default defineComponent({
  components: {},
  setup() {
    const http = (request as any).adminImage;
    const state: Istate = reactive({
      imageType: undefined,
      params: {
        name: "",
        classify: "",
        update_time: "",
        is_init: 1,
        withs: "classify,user,userProfile",
      },
      data: [],
    });
    const methods = {
      getImageList() {
        state.params.classify = state.imageType === undefined ? "" : state.imageType;
        http.imageList({ param: state.params }).then((res: any) => {
          console.log(res);
          state.data = res.data.list;
        });
      },
      search() {
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
    return { ...toRefs(state), columns, ...methods };
  },
});
</script>
<style lang="less" scoped>
.search {
  display: flex;
  .searchItem {
    margin-right: 20px;
    .select {
      width: 120px;
    }
  }
  .btn {
    margin-right: 20px;
  }
}
</style>

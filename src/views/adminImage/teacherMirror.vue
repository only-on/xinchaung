<template>
  <div class="teacherMirror">
    <div class="search">
      <div class="searchLeft">
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
      <div class="searchRight">
        <a-button type="primary" @click="deleteImage">批量删除</a-button>
      </div>
    </div>
    <div>
      <a-config-provider>
        <a-table
          :columns="columns"
          :data-source="data"
          :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        >
          <template #imageType="{ record }">
            <div>
              {{ record.classify_id === 1 ? "Windows" : "Linux" }}
            </div>
          </template>
          <template #username="{ record }">
            <div>
              {{ record.user.username }}
            </div>
          </template>
          <template #action="{ record }">
            <div @click="deleteImage(record.id)">
              <span class="iconfont icon-shanchu-copy"></span>
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
import { Modal, message } from "ant-design-vue";
interface Istate {
  imageType: any;
  params: any;
  data: any[];
  selectedRowKeys: any[];
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
    title: "所属人",
    dataIndex: "username",
    slots: { customRender: "username" },
  },
  {
    title: "更新时间",
    dataIndex: "updated_time",
  },
  {
    title: "操作",
    dataIndex: "action",
    width: 120,
    slots: { customRender: "action" },
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
        is_init: 0,
        withs: "classify,user,userProfile",
      },
      data: [],
      selectedRowKeys: [],
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
      // 勾选多选框
      onSelectChange(selectedRowKeys: any) {
        state.selectedRowKeys = selectedRowKeys;
      },
      deleteImage(id: any) {
        Modal.confirm({
          title: "提示",
          content: "确定要删除吗？",
          okText: "确认",
          cancelText: "取消",
          onOk: () => {
            // http.deleteTrain({ param: {id:   state.selectedRowKeys} }).then((res: any) => {
            //   console.log(res);
            //   methods.tableList();
            // });
          },
        });
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
  justify-content: space-between;
  .searchLeft {
    display: flex;
  }
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
.iconfont {
  color: @theme-color;
}
</style>

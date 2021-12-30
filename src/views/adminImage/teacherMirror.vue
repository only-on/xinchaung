<template>
  <div class="teacherMirror">
    <div class="search">
      <div class="searchLeft">
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
          <before-icon :icon="iconimg">
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
      <div class="searchRight">
        <a-button type="primary" @click="deleteImage(null)">批量删除</a-button>
      </div>
    </div>
    <div>
      <a-config-provider>
        <a-table
          :columns="columns"
          :data-source="data"
          rowKey="id"
          :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
          :loading="loading"
          :pagination="
          total > 10
            ? {
                hideOnSinglePage: false,
                showSizeChanger: true,
                total: total,
                pageSize: params.limit,
                onChange: onChange,
                onShowSizeChange: onShowSizeChange,
              }
            : false
        "
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
import beforeIcon from 'src/components/aiAnt/beforeIcon.vue'
import iconimg from 'src/assets/images/screenicon/Group3.png'
interface Istate {
  imageType: any;
  loading:boolean;
  params: any;
  data: any[];
  total:number;
  selectedRowKeys: any[];
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
  },
  {
    title: "所属人",
    dataIndex: "username",
    slots: { customRender: "username" },
  },
  // {
  //   title: "更新时间",
  //   dataIndex: "updated_time",
  // },
  {
    title: "操作",
    dataIndex: "action",
    width: 120,
    slots: { customRender: "action" },
  },
];
export default defineComponent({
  components: {beforeIcon},
  setup() {
    const http = (request as any).adminImage;
    const state: Istate = reactive({
      imageType: undefined,
      loading:false,
      params: {
        limit:"",
        name: "",
        classify: "",
        update_time: "",
        is_init: 0,
        withs: "classify,user,userProfile",
      },
      data: [],
      total:0,
      selectedRowKeys: [],
    });
    const methods = {
      onChange(page: any, pageSize: any) {
        state.params.page = page;
        state.params.limit = pageSize;
        methods.getImageList();
      },
      onShowSizeChange(current: any, size: any) {
        console.log(current, size, "current, size");
        state.params.page =1;
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
          state.loading=false
        });
      },
      search() {
        state.params.page =1;
        methods.getImageList();
      },
      // 勾选多选框
      onSelectChange(selectedRowKeys: any) {
        state.selectedRowKeys = selectedRowKeys;
        console.log(state.selectedRowKeys, "state.selectedRowKeys");
      },
      deleteImage(id: any) {
        const deleteId = id ? [id] : state.selectedRowKeys;
        console.log(deleteId, "要删除的ID");
        if (!deleteId.length) {
          message.warning("请选择要删除的镜像！");
          return;
        }
        Modal.confirm({
          title: "提示",
          content: "确定要删除吗？",
          okText: "确认",
          cancelText: "取消",
          onOk: () => {
            http.deleteImage({ param: { id: deleteId } }).then((res: any) => {
              console.log(res);
              methods.getImageList();
            });
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
    return { ...toRefs(state), columns, ...methods,iconimg};
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
    .select{
      width: 190px;
    }
  }
  .btn {
    margin-right: 20px;
  }
}
.iconfont {
  color: @theme-color;
}
:deep(.ant-table-pagination.ant-pagination) {
  float: none;
  text-align: center;
}
</style>

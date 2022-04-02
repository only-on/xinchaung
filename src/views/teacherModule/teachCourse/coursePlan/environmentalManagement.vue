<template>
  <div class="environmental-management-wrap">
    <div class="search-top">
      <div class="search-left">
        <div class="simple-search">
          <label>班级</label>
          <span class="input-span">
            <a-select class="select-input" v-model:value="formData.classType">
              <template #suffixIcon></template>
              <a-select-option value="0">全部</a-select-option>
              <a-select-option value="1">包含</a-select-option>
              <a-select-option value="2">不包含</a-select-option>
            </a-select>
            <a-input v-model:value="formData.className"></a-input>
          </span>
          <a-input-search
            @search="search"
            v-model:value="formData.keyWorld"
            class="search-input-btn"
            placeholder="请输入搜索关键字"
          />
          <a-button type="primary" class="search-btn" @click="switchSearchMode">{{
            searchMode ? "高级检索" : "普通检索"
          }}</a-button>
        </div>
        <div class="complex-search" v-if="searchMode">
          <label>GPU</label>
          <span class="input-span">
            <a-select class="select-input" v-model:value="formData.gpuType">
              <template #suffixIcon></template>
              <a-select-option value="0">全部</a-select-option>
              <a-select-option value="1">=</a-select-option>
              <a-select-option value="2">&lt;</a-select-option>
              <a-select-option value="3">&gt;</a-select-option>
            </a-select>
            <a-input v-model:value="formData.gpu"></a-input>
          </span>
          <label class="m-l">内存</label>
          <span class="input-span">
            <a-select class="select-input" v-model:value="formData.memoryType">
              <template #suffixIcon></template>
              <a-select-option value="0">全部</a-select-option>
              <a-select-option value="1">=</a-select-option>
              <a-select-option value="2">&lt;</a-select-option>
              <a-select-option value="3">&gt;</a-select-option>
            </a-select>
            <a-input v-model:value="formData.memory"></a-input>
          </span>
          <label class="m-l">CPU</label>
          <span class="input-span">
            <a-select class="select-input" v-model:value="formData.cpuType">
              <template #suffixIcon></template>
              <a-select-option value="0">全部</a-select-option>
              <a-select-option value="1">=</a-select-option>
              <a-select-option value="2">&lt;</a-select-option>
              <a-select-option value="3">&gt;</a-select-option>
            </a-select>
            <a-input v-model:value="formData.cpu"></a-input>
          </span>
        </div>
      </div>
      <div class="search-right">
        <a-button type="primary" @click="batchDelete">批量删除</a-button>
        <a-button type="primary" @click="batchDisabled">批量禁用</a-button>
      </div>
    </div>
    <div class="environmental-table">
      <a-table :dataSource="dataList" rowKey="id" :pagination="false" :columns="columns" :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange,getCheckboxProps:getCheckboxProps }"/>
    </div>
    <div class="page-box">
        <a-pagination v-model:current="formData.page" :total="50" show-less-items />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, toRefs, onMounted, Ref, inject, reactive } from "vue";
import { message } from "ant-design-vue";

var updata = inject("updataNav") as Function;
updata({
  tabs: [
    {
      name: "环境管理",
    },
  ],
  showContent: false,
  componenttype: undefined,
  showNav: false,
});
const columns: any = [
  {
    title: "账号",
    dataIndex: "user",
    key: "user",
  },
  {
    title: "姓名",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "班级",
    dataIndex: "className",
    key: "address",
  },
  {
    title: "虚拟机个数",
    dataIndex: "className",
    key: "address",
  },
  {
    title: "占用内存",
    dataIndex: "memory",
    key: "memory",
  },
  {
    title: "占用CPU",
    dataIndex: "cpu",
    key: "cpu",
  },
  {
    title: "占用GPU",
    dataIndex: "gpu",
    key: "gpu",
  },
];
const selectedRowKeys:Ref<any>=ref([])
const dataList: Ref<any> = ref([
    {
        name:"wenhe",
        id:0
    },
    {
        name:"wenhe1",
        id:1
    }
]);
const formData = reactive({
  classType: "0",
  className: "",
  keyWorld: "",
  gpuType: "0",
  gpu: "",
  memoryType: "0",
  memory: "",
  cpuType: "0",
  cpu: "",
  page: 1,
  pageSize: 10,
});
const searchMode = ref(false); // false 简单  true高级

// 选择框发生变化
function onSelectChange(selectedRowKey: any[]) {
    selectedRowKeys.value = selectedRowKey;
    console.log(selectedRowKeys.value);
    
}

//
function getCheckboxProps(record: any) {
    return{
        disabled:record.id==0
    }
}
// 切换搜索方式
function switchSearchMode() {
  searchMode.value = !searchMode.value;
}
// 搜索
function search() {
  console.log(formData);
}

// 批量删除
function batchDelete() {
    if (selectedRowKeys.value.length==0) {
        message.warn("请选择要删除的学生")
    }
}

// 批量禁用
function batchDisabled() {
    if (selectedRowKeys.value.length==0) {
        message.warn("请选择要禁用的的学生")
    }
}
</script>

<style lang="less" scoped>
.environmental-management-wrap {
  width: var(--center-width);
  margin: 72px auto 30px auto;
  .search-top {
    display: flex;
    align-items: flex-end;
  }
  .search-left {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .simple-search {
    display: flex;
  }
  .input-span {
    display: flex;
  }
  label {
    margin-right: 8px;
    display: flex;
    align-items: center;
  }
  :deep(.ant-input) {
  }
  .m-l {
    margin-left: 16px;
  }
  .search-input-btn {
    margin-left: 8px;
    width: 254px;
  }
  .select-input {
    :deep(.ant-select-selector) {
      height: 34px;
      width: 70px;
      .ant-select-selection-item {
        padding-right: 0;
      }
    }
  }
  .search-btn {
    margin-left: 8px;
  }
  .complex-search {
    display: flex;
    margin-top: 16px;
  }
  .search-right {
    margin-left: auto;
    button {
      margin-left: 16px;
    }
  }
  .environmental-table {
    margin-top: 16px;
  }
  .page-box{
      margin-top: 16px;
  }
}
</style>

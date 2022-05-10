<template>
  <div class="environmental-management-wrap">
    <div class="search-top">
      <div class="search-left">
        <div class="simple-search">
          <label>姓名</label>
          <a-input
            @keyup.enter="search"
            v-model:value="formData.name"
            placeholder=""
          />
          <label style="margin-left:20px">班级</label>
          <span class="input-span">
            <!-- <a-select class="select-input" v-model:value="formData.classType">
              <template #suffixIcon></template>
              <a-select-option value="0">全部</a-select-option>
              <a-select-option value="1">包含</a-select-option>
              <a-select-option value="2">不包含</a-select-option>
            </a-select> -->
            <a-input @keyup.enter="search" v-model:value="formData.class"></a-input>
          </span>
          <a-button type="primary" class="search-btn" @click="switchSearchMode">{{
            searchMode ?  "普通检索": "高级检索"
          }}</a-button>
        </div>

        <div class="complex-search" v-if="searchMode">
          <label>GPU</label>
          <span class="input-span">
            <!-- <a-select class="select-input" v-model:value="formData.gpuType">
              <template #suffixIcon></template>
              <a-select-option value="0">全部</a-select-option>
              <a-select-option value="1">=</a-select-option>
              <a-select-option value="2">&lt;</a-select-option>
              <a-select-option value="3">&gt;</a-select-option>
            </a-select> -->
            <span class="inputDiv">=</span>
            <a-input v-model:value="formData.gpu" @keyup.enter="search"></a-input>
          </span>
          <label class="m-l">内存</label>
          <span class="input-span">
            <!-- <a-select class="select-input" v-model:value="formData.memoryType">
              <template #suffixIcon></template>
              <a-select-option value="0">全部</a-select-option>
              <a-select-option value="1">=</a-select-option>
              <a-select-option value="2">&lt;</a-select-option>
              <a-select-option value="3">&gt;</a-select-option>
            </a-select> -->
            <span class="inputDiv">=</span>
            <a-input v-model:value="formData.memory" @keyup.enter="search"></a-input>
          </span>
          <label class="m-l">CPU</label>
          <span class="input-span">
            <!-- <a-select class="select-input" v-model:value="formData.cpuType">
              <template #suffixIcon></template>
              <a-select-option value="0">全部</a-select-option>
              <a-select-option value="1">=</a-select-option>
              <a-select-option value="2">&lt;</a-select-option>
              <a-select-option value="3">&gt;</a-select-option>
            </a-select> -->
            <span class="inputDiv">=</span>
            <a-input v-model:value="formData.cpu" @keyup.enter="search"></a-input>
          </span>
        </div>
      </div>
      <div class="search-right">
        <!-- <a-button type="primary" @click="batchDelete">批量删除</a-button> -->
        <a-button type="primary" @click="batchDisabled">批量禁用</a-button>
      </div>
    </div>
    <div class="environmental-table">
      <a-table
        :dataSource="dataList"
        rowKey="id"
        :pagination="false"
        :columns="columns"
        :row-selection="{
          selectedRowKeys: selectedRowKeys,
          onChange: onSelectChange,
          getCheckboxProps: getCheckboxProps,
        }"
      />
    </div>
    <div class="page-box" v-if="formData.total > 10">
      <a-pagination
        v-model:current="formData.page"
        :total="formData.total"
        show-less-items
      />
    </div>
  </div>
  <a-modal
    v-model:visible="disabledVisible"
    title="禁用帐号"
    @ok="handleOk"
    @cancel="handleCancel"
    class="disable-modal"
  >
    <div>
      <h2 class="time-lable">请选择禁用时间段</h2>
      <div class="select-time-wrap">
        <span>
          <a-date-picker
            v-model:value="beginTime"
            placeholder="请选择开始时间"
            show-time
            format="YYYY-MM-DD HH:mm:ss"
            :disabled-date="disabledDate"
            disabled
          />
        </span>
        <span>~</span>
        <span>
          <a-date-picker
            v-model:value="endTime"
            placeholder="请选择结束时间"
            show-time
            format="YYYY-MM-DD HH:mm:ss"
            :disabled-date="disabledDate"
          />
        </span>
      </div>
    </div>
  </a-modal>
</template>

<script lang="ts" setup>
import { ref, toRefs, onMounted, Ref, inject, reactive } from "vue";
import { message } from "ant-design-vue";
import request from "src/api/index";
import moment, { Moment } from "moment";

var updata = inject("updataNav") as Function;
const http = (request as any).coursePlain;
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
    dataIndex: "username",
    key: "username",
  },
  {
    title: "姓名",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "班级",
    dataIndex: "classname",
    key: "classname",
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
const selectedRowKeys: Ref<any> = ref([]);
const dataList: Ref<any> = ref([]);
const disabledVisible = ref(false);
const formData = reactive({
  classType: "",
  class: "",
  name: "",
  gpuType: "",
  gpu: "",
  memoryType: "",
  memory: "",
  cpuType: "",
  cpu: "",
  page: 1,
  pageSize: 10,
  total: 0,
});
const beginTime = ref<Moment>(moment(new Date()));
let endTime = ref<Moment>();
const searchMode = ref(false); // false 简单  true高级

function getList() {
  let params = {};
  if (searchMode.value) { // 高级查询
    
  }else{
    // 普通查询
  }
  
  dataList.value=[]
  http
    .envMonitoringList({
      param:formData,
    })
    .then((res: any) => {
      const { data, total } = res.data;
      formData.total = total;
      dataList.value.push(...data);
    });
}
// 选择框发生变化
function onSelectChange(selectedRowKey: any[]) {
  selectedRowKeys.value = selectedRowKey;
  console.log(selectedRowKeys.value);
}

//
function getCheckboxProps(record: any) {
  return {
    disabled: record.status == 1,
  };
}
// 切换搜索方式
function switchSearchMode() {
  searchMode.value = !searchMode.value;
}
// 搜索
function search() {
  console.log(formData);
  formData.page=1
  formData.pageSize=10
  getList()
}

// 批量删除
function batchDelete() {
  if (selectedRowKeys.value.length == 0) {
    message.warn("请选择要删除的学生");
  }
}

// 批量禁用
function batchDisabled() {
  if (selectedRowKeys.value.length == 0) {
    message.warn("请选择要禁用的的学生");
    return;
  }
  disabledVisible.value = true;
}
// 确认
function handleOk() {
  if (!endTime.value) {
        message.error('请选择时间', 3)
        return
      }
      if (moment(beginTime.value).unix() > moment(endTime.value).unix()) {
        message.error('结束时间必须大于开始时间', 3)
        return
      }
      let param = {
        ids:selectedRowKeys.value?.join(','),
        start_time: beginTime.value.format('YYYY-MM-DD HH:mm:ss'),
        end_time: endTime.value?.format('YYYY-MM-DD HH:mm:ss')
      }
      http.forbiddenUser({param}).then((res: any) => {
        message.success('禁用成功', 3)
        beginTime.value = moment(new Date())
        selectedRowKeys.value=[]
        endTime.value = undefined
        getList()
        disabledVisible.value=false
      })
}

// 取消弹框
function handleCancel() {
      disabledVisible.value = false;
      beginTime.value = moment(new Date());
      endTime.value = undefined
}
function disabledDate(current: any) {
  return current && moment(current).add(1, "days") < moment();
}
onMounted(() => {
  getList();
});
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
    width: 180px;
  }
  .m-l {
    margin-left: 16px;
  }
  .search-input-btn {
    margin-left: 8px;
    width: 254px;
    :deep(.ant-input) {
      width: 220px;
    }
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
  .page-box {
    margin-top: 16px;
  }
}
.inputDiv{
  display: inline-block;
  width:50px;
  height: 34px;
  line-height: 34px;
  text-align: center;
  border: 1px solid var(--gray-5);
  background-color: var(--white-100);
  border-right: none;
}
</style>

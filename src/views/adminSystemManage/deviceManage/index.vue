<template>
  <div class="deviceManage" v-layout-bg>
    <div class="searchParams">
      <div class="searchLeft">
        <div>
          <span class="inputLable">设备IP: </span>
          <a-input class="input"></a-input>
        </div>
        <div>
          <span class="inputLable"> 设备类型: </span>
          <a-select class="input" default-value="lucy" @change="handleChange">
            <a-select-option value="jack"> Jack </a-select-option>
          </a-select>
        </div>
        <div>
          <span class="inputLable"> 设备状态: </span>
          <a-select class="input" default-value="lucy" @change="handleChange">
            <a-select-option value="jack"> Jack </a-select-option>
          </a-select>
        </div>
        <div>
          <a-button type="primary">查询</a-button>
        </div>
        <div>
          <a-button type="primary">清空</a-button>
        </div>
      </div>

      <div>
        <a-button type="primary">一键关机</a-button>
      </div>
    </div>
    <div>
      <a-config-provider>
        <a-table :columns="columns" :data-source="data"> </a-table>
        <template #renderEmpty>
          <div><empty type="tableEmpty"></empty></div>
        </template>
      </a-config-provider>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, reactive, onMounted, toRefs, inject, watch } from "vue";
interface state {
  data: any[];
}
const columns = [
  {
    title: "设备IP",
    dataIndex: "name",
  },
  {
    title: "设备类型",
    dataIndex: "age",
  },
  {
    title: "设备状态",
    dataIndex: "address",
  },
  {
    title: "操作",
    dataIndex: "address",
  },
];
export default defineComponent({
  name: "deviceManage",
  components: {},
  setup: (props, context) => {
    const state: state = reactive({
      data: [],
    });
    var updata = inject("updataNav") as Function;
    updata({
      tabs: [],
      navPosition: "outside",
      navType: false,
      showContent: true,
      componenttype: undefined,
      showNav: true,
      backOff: false,
      showPageEdit: false,
    });
    const methods = {
      handleChange() {},
    };
    onMounted(() => {});
    return { ...toRefs(state), columns, ...methods };
  },
});
</script>
<style lang="less" scoped>
.searchParams {
  display: flex;
  justify-content: space-between;
  .searchLeft {
    display: flex;
    > div {
      margin-right: 20px;
      margin-bottom: 20px;
      .inputLable {
        font-weight: bold;
      }
    }
  }
  .input {
    width: 165px;
  }
}
</style>

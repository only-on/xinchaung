<template>
    <div class="autogroup">
          <span>分组方式</span>
          <a-select
            class="select"
            v-model:value="selectValue"
            style="width: 120px"
            @focus="focus"
            @change="handleChange"
          >
            <a-select-option value="jack">小组人数</a-select-option>
            <a-select-option value="lucy">小组数</a-select-option>
          </a-select>
          <a-input v-model:value="number" style="width: 265px" />
        </div>
  </template>
  <script lang="ts" setup>
    import { ref, toRefs, onMounted,reactive } from "vue";
    import handGroupCom from './handGroupCom/index.vue'
    import autoGroupCom from './autoGroupCom/index.vue'
    const columns: any = ref();
    const data: any = ref([]);
    const modalVisable: any = ref(false);
    const selectValue: any = ref("");
    const number: any = ref("");
    const groupType:any=ref('');
    columns.value = [
      {
        title: "小组名称",
        dataIndex: "age",
        key: "age",
      },
      {
        title: "小组人数",
        dataIndex: "age",
        key: "age",
      },
      {
        title: "姓名",
        dataIndex: "age",
        key: "age",
      },
      {
        title: "操作",
        key: "action",
        scopedSlots: { customRender: "action" },
      },
    ];
    const tableData: any = reactive({
      total: 0,
      page: 1,
      limit: 10,
    });
    function focus() {
      console.log("focus");
    }
    function handleChange(value: string) {
      console.log(`selected ${value}`);
    }
    function onSearch(value: any) {
      console.log(value);
    }
    function onChange(page: any, pageSize: any) {}
    function onShowSizeChange(current: any, size: any) {}
    function autoGroup() {
      groupType.value='auto';
      modalVisable.value = true;
    }
    function handGroup(){
      groupType.value='hand';
      modalVisable.value = true;
    }
    function handleOk() {
      modalVisable.value = false;
    }
    function handleCancel() {
      modalVisable.value = false;
    }
    </script>
  <style lang="less" scoped>
  .select {
    margin-left: 10px;
    margin-right: 4px;
  }
  </style>
<template>
    <div class="autogroup">
      <a-modal
      :width="groupType=='auto'?540:900"
      cancelText="取消"
      okText="分组"
      :visible="visable"
      @ok="handleOk"
      @cancel="handleCancel"
      title="学生分组"
    >
        <div>
          <span>分组方式</span>
          <a-select
            class="select"
            v-model:value="selectValue"
            style="width: 120px"
            @focus="focus"
            @change="handleChange"
          >
            <a-select-option value="group_people_num">小组人数</a-select-option>
            <a-select-option value="group_num">小组数</a-select-option>
          </a-select>
          <a-input v-model:value="number" style="width: 265px" />
        </div>
    </a-modal>   
    </div>
  </template>
  <script lang="ts" setup>
    import { ref, toRefs, onMounted,reactive } from "vue";
    import handGroupCom from './handGroupCom/index.vue'
    import autoGroupCom from './autoGroupCom/index.vue'
    import { Modal, message } from "ant-design-vue";
    import request from 'src/api/index'
    const http = (request as any).teacherMemberManage;
    const columns: any = ref();
    const data: any = ref([]);
    const selectValue: any = ref("");
    const number: any = ref("");
    const groupType:any=ref('');
    interface Props {
      visable:any;
    }
    const props = withDefaults(defineProps<Props>(), {
      visable:()=>{}
    })
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
    }
    function handGroup(){
      groupType.value='hand';
    }
    const emit = defineEmits<{ (e: "updateVisable", val: any,groupok:any): void }>();
    function handleOk() {
      if (!number.value) {
          message.warning("人数或小组数不能为空！");
          return;
        }
        if (number.value < 1) {
          message.warning("请输入大于0的整数！");
          return;
        }
        if (!Number.isInteger(Number(number.value))) {
          message.warning("请输入大于0的整数！");
          return;
        }
        const params = {
          id:500274,
          type:1,
          number:number.value,
          group_type:selectValue.value,
        };
        http.automaticGroup({ param: params }).then((res: any) => {
          emit("updateVisable",'false',true);
        });
    }
    function handleCancel() {
      emit("updateVisable",'false',false);
    }
    </script>
  <style lang="less" scoped>
  .select {
    margin-left: 10px;
    margin-right: 4px;
  }
  </style>
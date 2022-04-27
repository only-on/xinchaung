<template>
    <div class="userloginInformation" v-layout-bg>
        <div class="searchParams">
            <div class='searchItem'>
                <span class="inputLable">用户名</span>
              <a-input
                style="width:150px"
                placeholder="请输入搜索关键词"
                v-model:value="state.username"
                @keyup.enter="handleChange"
              >
              </a-input>
            </div>
            <div class='searchItem'>
                <span class="inputLable">操作类型</span>
              <a-input
                style="width:150px"
                placeholder="请输入搜索关键词"
                v-model:value="state.opertype"
                @keyup.enter="handleChange"
              >
              </a-input>
            </div>
        </div>
        <a-table :columns="columns" :data-source="state.data" rowKey="id"> </a-table>
    </div>
  </template>
  <script lang="ts" setup>
  import { defineComponent, ref, reactive, onMounted, toRefs, inject, watch } from "vue";
  import request from "src/api/index";
  const columns:any=ref()
  columns.value= [
    {
      title: "id",
      dataIndex: "id",
    },
    {
      title: "用户名",
      dataIndex: "user_name",
    },
    {
      title: "操作类型",
      dataIndex: "type",
    },
    {
      title: "操作行为",
      dataIndex: "operation_type",
    },
    {
      title: "IP地址",
      dataIndex: "ip",
    },
    {
      title: "操作时间",
      dataIndex: "created_at",
    },
  ];
      const http = (request as any).adminSystemManage;
        var configuration: any = inject("configuration");
        var updata = inject("updataNav") as Function;
        updata({
        tabs: [
            { name: "用户登录信息", componenttype: 0 }
        ],
        showContent: true,
        componenttype: undefined,
        showNav:true,
        });
        const state:any = reactive({
        opertype:'',
        username:'',
        data: [],
        query: {
          type: "",
          operation_type: "",
          ip: "",
          begintime: "",
          endtime: "",
        }
      });
        function getSystemList() {
          state.query.type = state.opertype === undefined ? "" : state.opertype;
          http.systemLogList({ param: { query: state.query } }).then((res: any) => {
            console.log(res);
            state.data = res.data.list;
          });
        }
        function search() {
          getSystemList();
        }
        function clear() {
          state.opertype = undefined;
          state.query.type = "";
          state.query.operation_type = "";
          state.query.ip = "";
          state.query.begintime = "";
          state.query.endtime = "";
          getSystemList();
        }
        function handleChange() {
          getSystemList();
        }
        onMounted(() => {
            // methods.getSystemList();
        })
  </script>
  <style lang="less" scoped>
  .searchParams {
    display: flex;
    > div {
      margin-right: 20px;
      margin-bottom: 20px;
      .inputLable {
        margin-right:15px;
      }
    }
    .input {
      width: 165px;
    }
  }
  </style>
  
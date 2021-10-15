<template>
  <div class="train-resource">
    <a-table
      :data-source="dataSource"
      :columns="columns"
      :rowKey="rowKey"
      :pagination="false"
    >
    <template #name="{text}">
      <div :title="text">{{text}}</div>
    </template>
    <template #describe="{text}">
      <div :title="text">{{text}}</div>
    </template>
      <template #operation="{ text }">
        <div class="row-action">
          <span @click="show(text)" class="icon-chakan1 iconfont"></span>
          <span @click="down(text)" class="icon-download iconfont"></span>
        </div>
      </template>
    </a-table>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted ,ref} from "vue";
import request from "src/request/getRequest"
import { useRoute } from "vue-router";
import {downloadUrl} from "src/utils/download"

export default defineComponent({
  setup() {
    const TrainApi=request.vmApi
    const route = useRoute();
    let vmQuery = route.query as any;
    const {
      taskId,
    }: any = vmQuery;
    const columns = [
      {
        title: "资源名称",
        dataIndex: "name",
        width: "30%",
        slots: { customRender: "name" },
      },
      {
        title: "资源说明",
        dataIndex: "describe",
        slots: { customRender: "describe" },
      },
      {
        title: "类型",
        dataIndex: "posfix",
      },
      {
        title: "操作",
        slots: { customRender: "operation" },
      },
    ];

    const dataSource: any =ref([]);
    onMounted(()=>{
      getResource()
    })
    function  getResource() {
      let param={
        train_id:taskId,
        pageSize:100,
        page:1
      }
      TrainApi.getTrainResourceApi({param:param}).then((res)=>{
        if (res?.data) {
          dataSource.value=res.data.list
        }
      })
    }
    const rowKey=(row:any)=>{
        return row.id
    }
    function show(val:any){
        console.log(val);
        
    }

    function down(val:any){
      let env=process.env.NODE_ENV==="development"?true:false
       downloadUrl(env?'/proxyPrefix'+val.url:val.url) 
    }
    
    return { dataSource, columns,show ,down,rowKey};
  },
});
</script>

<style lang="less">
.train-resource {
  padding: 15px;
  .row-action{
      >span{
          margin-right: 10px;
          &:hover{
              color: @theme-color;
              cursor: pointer;
          }
      }
  }
  .ant-table-row-cell-break-word{
    text-overflow: ellipsis;
    overflow: hidden;
  }
}
</style>

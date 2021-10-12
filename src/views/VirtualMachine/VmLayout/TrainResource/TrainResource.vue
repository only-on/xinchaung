<template>
  <div class="train-resource">
    <a-table
      :data-source="dataSource"
      :columns="columns"
      :rowKey="rowKey"
      :pagination="false"
    >
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
import { defineComponent } from "vue";

export default defineComponent({
  setup() {
    const columns = [
      {
        title: "资源名称",
        dataIndex: "name",
        width: "30%",
        slots: { customRender: "name" },
      },
      {
        title: "资源说明",
        dataIndex: "desc",
      },
      {
        title: "类型",
        dataIndex: "type",
      },
      {
        title: "操作",
        slots: { customRender: "operation" },
      },
    ];

    const dataSource: any = [
      {
        id: "1",
        name:"文件名称",
        desc:"测试文件",
        type:"pdf"
      },
    ];

    const rowKey=(row:any)=>{
        return row.id
    }
    function show(val:any){
        console.log(val);
        
    }

    function down(val:any){
        console.log(val);
        
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
}
</style>

<template>
    <div>
        <a-cascader
            v-model:value="props.catalogue"
            :options="options"
            placeholder="请选择"
            :loadData="loadData"
            @dropdownVisibleChange='change'
            :fieldNames="{
                label: 'name', value: 'id'
            }"
        />
    </div>
</template>
<script lang="ts" setup>
import request from "src/api/index";
const http = (request as any).QuestionBank;
import type { CascaderProps } from 'ant-design-vue';
import {
  defineProps,
  reactive,
  withDefaults,
  onMounted,
  ref,
  nextTick,
  computed
} from "vue";
interface Props { 
  catalogue:any[];
}
const props = withDefaults(defineProps<Props>(),{
  catalogue:()=>[]
});
const emit = defineEmits<{
  (e: "update:catalogue", val: any): void;
  (e: "vertifyAgain",val:any): void;
}>();
const options:any=ref([])
function change(value:any, selectedOptions:any){
    console.log(value,selectedOptions,'value,selectedOptions')
  emit("update:catalogue",props.catalogue);
  emit("vertifyAgain",props.catalogue)
}
// const catalogue=computed({
//   get:()=>props.catalogue,
//   set:(val:any)=>emit("update:catalogue",props.catalogue)
// })
function loadData(selectedOptions:any){
      const targetOption = selectedOptions[selectedOptions.length - 1];
        targetOption.loading = true;
        http.getDirectoryChidren({urlParams:{directory_id:selectedOptions[selectedOptions.length - 1]?.id}}).then((res:any) => {
            targetOption.loading = false
            targetOption.children = res.data
            targetOption.children.forEach((item:any)=>{
                item.isLeaf=item.has_children==1?false:true
            })
        })
    };
function getLoadData(id:any,options:any){
 http.getDirectoryChidren({urlParams:{directory_id:id}}).then((res:any) => {
          options.forEach((item:any,index:any)=> {
            if(item.id==id){
              console.log(options,index,'options.value index')
              options[index].children=res.data
            }
      });
  })
}
// 获取第一层目录
function getDirectoryFirst() {
  http.getDirectoryFirst().then((res:any) => {
    console.log(res)
    if (res.data?.length) {
        options.value=res.data
        options.value.forEach((item:any)=> {
            item.isLeaf=item.has_children==1?false:true
        });
    }
  })
}
async function processingEchoData(ids:any){
  //   console.log(ids,'idsidsidsids')
  //  let arrdata:any=await getDirectoryFirst()
  //   console.log(arrdata,"arrdata",options.value,'options.valueoptions.valueoptions.valueoptions.value',)
    nextTick(()=>{
      setTimeout(() => {
        console.log(options.value,'options.valueoptions.valueoptions.valueoptions.value',)
        ids.forEach((item:any,index:any)=>{
            getLoadData(item,options.value)
        })
      }, 200)
    }) 
}
onMounted(() => {
  getDirectoryFirst()
  console.log('哈哈哈吧')
})
defineExpose({processingEchoData})
</script> 
<template>
    <div>
        <a-cascader
            v-model:value="catalogue"
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
  ref
} from "vue";
interface Props { 
  catalogue:any[];
}
const props = withDefaults(defineProps<Props>(),{
  catalogue:()=>[]
});
const emit = defineEmits<{
  (e: "update:catalogue", val: any): void;
}>();
function change(value:any, selectedOptions:any){
    console.log(value,selectedOptions,'value,selectedOptions')
  emit("update:catalogue",props.catalogue);
};
const options:any=ref([])
function loadData(selectedOptions:any){
    console.log(selectedOptions[0].id,'selectedOptions')
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
onMounted(() => {
  getDirectoryFirst()
})
</script> 
<template>
    <div class="select_difficult">
        <span
        v-for="(item,index) in  options"
        :key="index"
        @click="change(item.value)"
        :class="difficulty == item.value ? 'active' : ''"
        >{{item.name}}</span
        >
    </div>
</template>
<script lang="ts" setup>
import {
  defineProps,
  withDefaults,
} from "vue";
interface optionType{
    name:string,
    value:any,
}
interface Props { 
  options:optionType[];
  difficulty:any;
}
const props = withDefaults(defineProps<Props>(),{
  options: () =>[],
  difficulty:()=>1
});
const emit = defineEmits<{
  (e: "update:difficulty", difficulty: any): void;
}>();
function change(val:any){
  emit("update:difficulty",val);
};
</script> 
<style lang="less">
.select_difficult {
  > span {
    display: inline-block;
    line-height: 34px;
    width: 100px;
    border: 1px solid #dfdfdf;
    color: #33394bd9;
    text-align: center;
    cursor: pointer;
  }
  .active {
    color: var(--primary-color);
    border-color: var(--primary-color);
  }
}
</style>

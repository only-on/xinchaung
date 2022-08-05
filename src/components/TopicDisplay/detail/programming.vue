<template>
  <div class="programmingDetail">
    <div class="details details1">
      <div class="detailsTit">题目描述</div>
      <MarkedEditor v-model="props.info.desc" class="markdown__editor" :preview="true"/>
    </div>
    <div class="details details2 flexCenter content">
      <div class="contentLeft">
        <div class="detailsTit detailsTit2">输入格式</div>
        <MarkedEditor v-model="props.info.access.input" class="markdown__editor" :preview="true"/>
      </div>
      <div class="contentRight">
        <div class="detailsTit detailsTit2">输出格式</div>
        <MarkedEditor v-model="props.info.access.output" class="markdown__editor" :preview="true"/>
      </div>
    </div>
    <div class="details details3">
      <div class="detailsTit detailsTit2 ">样例</div>
      <div class="flexCenter content">
        <div class="contentLeft">
          <div class="detailsTit detailsTit2 detailsTit3 flexCenter">
            <span>输入</span>
            <span class="copy">复制</span>
          </div>
          <a-textarea v-model:value="props.info.example.output" :disabled="true" placeholder="" :autoSize="{ minRows: 4, maxRows: 6 }" />
        </div>
        <div class="contentRight">
          <div class="detailsTit detailsTit2 detailsTit3 flexCenter">
            <span>输入</span>
            <span class="copy">复制</span>
          </div>
          <a-textarea v-model:value="props.info.example.output" :disabled="true" placeholder="" :autoSize="{ minRows: 4, maxRows: 6 }" />
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {
  defineComponent,
  ref,
  onMounted,
  reactive,
  Ref,
  inject,
  computed,
  toRefs,
  watch,
  defineExpose,
  defineProps,
  withDefaults,
} from "vue";
import MarkedEditor from "src/components/editor/markedEditor.vue";
interface Iinfo{
  desc: string;
  access:any;
  example:any;
}
interface Props {
  info:Iinfo
}
const props = withDefaults(defineProps<Props>(), {
  info:()=>{
    return {
      desc:'',
      access:{
        input:'',
        output:''
      },
      example:{
        input:'',
        output:''
      },
    }
  }
});

// const emit = defineEmits<{
//   (e: "selectedImage", val: any): void;
// }>();

</script>
<style scoped lang="less">
.markdown__editor{
  // height: 200px;
  :deep(.mark__body .mark__preview) {
    min-width: 400px;
  }
}

  .programmingDetail{
    .details{
      padding: 14px 0;
      margin-bottom: 1rem;
      .detailsTit{
        font-size: 16px;
        font-weight: 900;
        color: var(--black);
        // padding-bottom: 1rem;
        padding-bottom: 10px;
        &.detailsTit2{
          // padding-bottom: 1rem;
        }
        &.detailsTit3{
          color: var(--black-65);
          justify-content: space-between;
          .copy{
            cursor: pointer;
            color: var(--primary-color);
          }
        }
      }
    }
    .content{
      justify-content:space-between;
      .contentLeft,.contentRight{
        width: 48%;
      }
    }
  }
</style>

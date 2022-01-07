<template>
  <tr>
    <template v-if="type === 'w1' || type === 'w2' || type === 'w3'">
      <td v-for="(field,index) in fields" :key="index" class="baseCol" :align="field.align" :colspan="type === 'w1'? 4: field.colspan">
        <customInput :field="field" @change="handleCustom($event,index)"/>
        </td>
        <td class="toolCol">
          <slot name="toolbar"/>
        </td>
    </template>
    <template v-if="type === 'w4'">
      <td class="baseCol" colspan="4">
        <template v-for="(field,index) in fields" :key="index" >
          <customInput :field="field" @change="handleCustom($event,index)"/>
        </template>
      </td>
      <td class="toolCol">
        <slot name="toolbar"/>
      </td>
    </template>
    <template v-if="type === 'w5'">
      <template v-for="(field,index) in fields" :key="index">
        <td v-show="index === 0" class="baseCol" :align="field.align">
          <customInput :field="field" @change="handleCustom($event,index)"/>
        </td>
        <td v-show="index === 1" class="baseCol" colspan="3">
          <customInput type="textarea" :field="field" @change="handleCustom($event,index)"/>
        </td>
      </template>
      <td class="toolCol">
        <slot name="toolbar"/>
      </td>
    </template>
    <template v-if="type === 'w6'">
      <td class="baseCol" colspan="4">
        <template v-for="(field,index) in fields" :key="index">
          <customInput v-show="index === 0" :field="field" @change="handleCustom($event,index)"/>
          <customInput v-show="index === 1" type="textarea" :field="field" @change="handleCustom($event,index)"/>
        </template>
      </td>
      <td class="toolCol">
        <slot name="toolbar"/>
      </td>
    </template>
    <template v-if="type === 'w7'">
      <template v-for="(field,index) in fields" :key="index">
        <td v-show="index === 0" class="baseCol" :align="field.align">
          <customInput :field="field" @change="handleCustom($event,index)"/>
        </td>
        <td v-show="index === 1" class="baseCol" colspan="3">
          <antdv-markdown v-model="field.value" :image-upload-url="uploadUrl"/>
        </td>
      </template>
      <td class="toolCol">
        <slot name="toolbar"/>
      </td>
    </template>
    <template v-if="type === 'w8'">
      <td class="baseCol" colspan="4">
        <template v-for="(field,index) in fields" :key="index">
          <customInput v-show="index === 0" :field="field" @change="handleCustom($event,index)" class="borderInput"/>
          <antdv-markdown v-show="index === 1" v-model="field.value" :image-upload-url="uploadUrl"/>
        </template>
      </td>
      <td class="toolCol">
        <slot name="toolbar"/>
      </td>
    </template>
  </tr>
</template>
<script lang="ts">
import { defineComponent, ref, watch,reactive, toRefs,PropType } from 'vue'
import {deepClone} from '../utils'
import AntdvMarkdown from "@xianfe/antdv-markdown/src/index.vue";
import customInput from './customInput.vue'
export default defineComponent({
  components: {
    'antdv-markdown':AntdvMarkdown,
    customInput
  },
  props: {
    type: {
      type: String,
      default: ''
    },
    fields:{
      type: Array as PropType<any[]>,
      default: []
    }
  },
  setup(props,{emit}) {
    var type = ref<string>(props.type)
    var fields = reactive<any[]>(deepClone(props.fields))
    const dev_base_url = import.meta.env.VITE_APP_BASE_API || ''
    var uploadUrl=`${dev_base_url}/api/content/vnc/upload_mkfile`
    watch(()=>props.type, newVal => {
      type.value = newVal
    })
    watch(()=>props.fields, newVal => {
      Object.assign(fields, deepClone(newVal))
    })
    
    const handleCustom = (data:any,index:any) => {
      if (typeof data === 'object') return
      fields[index].value = data
      emit("update:fields", fields)
    }
    return {
      handleCustom,
      ...toRefs(props),
      uploadUrl
    }
  },
})
</script>
<style lang="less" scoped>
.baseCol{
  border: 1px solid #e4e4e4;
  position: relative;
}
.toolCol{
  position: relative;
  width: 22px;
}
.baseStyle{
  background: none;
  color: #777;
  font-family: 'Microsoft YaHei, Microsoft YaHei-Regular';
  letter-spacing: 2px;
  padding: 15px 10px;
  resize: none;
  overflow: hidden;
  width: 100%;
  outline: none;
  font-size: 14px;
  &.focus{
    background: var(--component-background);
  }
  &::-webkit-input-placeholder{
    color: #ccc;
  }
  &::-moz-placeholder{
    color: #ccc;
  }
  &::-ms-input-placeholder{
    color: #ccc;
  }
}
table td{
  vertical-align: top;
  input:nth-child(2n), &:first-child>textarea{
    border-top: 1px solid #e4e4e4;
    margin-top: 5px;
    padding-top: 10px;
  }
  .borderInput{
    border-bottom: 1px solid #e4e4e4;
  }
  textarea.baseStyle{
    height: 102px;
  }
  :deep(.mark__container){
    height: 300px;
    border: none;
    .mark__editor, .mark__preview{
      min-width: auto;
      overflow-y: auto;
    }
  }
}
</style>

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
          <customInput :field="field" @change="handleCustom($event,index)" class="baseLine"/>
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
          <antdv-markdown v-model="field.value"/>
        </td>
      </template>
      <td class="toolCol">
        <slot name="toolbar"/>
      </td>
    </template>
    <template v-if="type === 'w8'">
      <td class="baseCol" colspan="4">
        <template v-for="(field,index) in fields" :key="index">
          <customInput v-show="index === 0" :field="field" @change="handleCustom($event,index)"/>
          <antdv-markdown v-show="index === 1" v-model="field.value"/>
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
import {splitFieldName, deepClone} from '../utils'
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
    watch(()=>props.type, newVal => {
      type.value = newVal
    })
    watch(()=>props.fields, newVal => {
      Object.assign(fields, deepClone(newVal))
    })
    
    const getClass = (name:string) => {
      let style = splitFieldName(name)[1]
      return `baseStyle ${style}`
    }
    const handleCustom = (data:any,index:any) => {
      if (typeof data === 'object') return
      fields[index].value = data
      emit("update:fields", fields)
    }
    return {
      getClass,
      handleCustom,
      ...toRefs(props)
    }
  },
})
</script>
<style lang="less" scoped>
.baseCol{
  padding: 10px;
  border: 1px solid #e4e4e4;
  position: relative;
}
.toolCol{
  position: relative;
  width: 22px;
}
.baseLine{
  display: block;
  margin-bottom: 10px;
}
.readonlyBg{
  background: @component-background;
}
.baseStyle{
  background: none;
  color: #777;
  font-family: 'Microsoft YaHei, Microsoft YaHei-Regular';
  letter-spacing: 2px;
  padding: 10px 0;
  resize: none;
  overflow: hidden;
  border: 1px solid transparent;
  width: 100%;
  outline: none;
  &.tt{
    font-size: 16px;
    // text-align: center;
    line-height: 24px;
  }
  &.st{
    font-size: 14px;
    // text-align: center;
    line-height: 18px;
  }
  &.ct{
    font-size: 14px;
    height: 62px;
  }
  &.focus{
    background: @component-background;
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
  input:nth-child(2n), &:first-child>textarea{
    border-top: 1px solid #e4e4e4;
  }
  textarea.baseStyle.ct{
    height: 102px;
  }
  :deep(.mark__container){
    height: 300px;
    .mark__editor, .mark__preview{
      min-width: auto;
      overflow-y: auto;
    }
  }
}
</style>

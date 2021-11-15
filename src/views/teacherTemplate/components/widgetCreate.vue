<template>
  <tr v-if="type === 'w1' || type === 'w2' || type === 'w3'">
    <td v-for="(field,index) in fields" :key="index" class="baseCol" :align="field.align" :colspan="field.colspan">
     <customInput :field="field" :index="index" @change="handleCustom($event,index)"/>
    </td>
    <td class="toolCol">
      <slot name="toolbar"/>
    </td>
  </tr>
  <tr v-if="type === 'w4'">
    <td class="baseCol" colspan="4">
      <template v-for="(field,index) in fields" :key="index" >
        <customInput :field="field" @change="handleCustom($event,index)" class="baseLine"/>
        <!-- <input :value="field.value" :readonly="field.readonly" :placeholder="field.placeholder" :class="getClass(field.name)" class="baseLine"/> -->
      </template>
    </td>
    <td class="toolCol">
      <slot name="toolbar"/>
    </td>
  </tr>
  <tr v-if="type === 'w5'">
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
  </tr>
  <tr v-if="type === 'w6'">
    <td class="baseCol" colspan="4">
      <template v-for="(field,index) in fields" :key="index">
        <customInput v-show="index === 0" :field="field" @change="handleCustom($event,index)"/>
        <customInput v-show="index === 1" type="textarea" :field="field" @change="handleCustom($event,index)"/>
      </template>
    </td>
    <td class="toolCol">
      <slot name="toolbar"/>
    </td>
  </tr>
  <tr v-if="type === 'w7'">
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
  </tr>
  <tr v-if="type === 'w8'">
    <td class="baseCol" colspan="4">
      <template v-for="(field,index) in fields" :key="index">
        <customInput v-show="index === 0" :field="field" @change="handleCustom($event,index)"/>
        <antdv-markdown v-show="index === 1" v-model="field.value"/>
      </template>
    </td>
    <td class="toolCol">
      <slot name="toolbar"/>
    </td>
  </tr>

</template>
<script lang="ts">
import { defineComponent, ref, watch,reactive } from 'vue'
import './widgetCreate.less'
import {splitFieldName} from '../utils'
import AntdvMarkdown from "@xianfe/antdv-markdown/src/index.vue";
import customInput from './customInput.vue'
export default defineComponent({
  components: {
    'antdv-markdown':AntdvMarkdown,
    customInput
  },
  props: ['value'],
  setup(props,{emit}) {
    var type = ref<string>(props.value.type)
    var fields = reactive<object>(props.value.fields)
    watch(()=>props.value, newVal => {
      Object.assign(fields, newVal.fields)
      type.value = newVal.type
    })
    const getClass = (name:string) => {
      let style = splitFieldName(name)[1]
      return `baseStyle ${style}`
    }
    const handleCustom = (data:any,index:number) => {
      if (typeof data === 'object') return
      fields[index].value = data
    }
    return {
      type,
      fields,
      getClass,
      handleCustom
    }
  },
})
</script>

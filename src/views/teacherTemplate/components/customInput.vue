<template>
    <input v-if="type ==='input'" :value="field.value" :readonly="field.readonly" :placeholder="field.placeholder" :class="getClass(field.name)" @input="handleChange($event)"/>
    <textarea  v-else :value="field.value" :readonly="field.readonly" :placeholder="field.placeholder" :class="getClass(field.name)" @input="handleChange($event)"/> 
</template>
<script lang="ts">
import { defineComponent, reactive, watch, ref } from 'vue'
import {splitFieldName, deepClone} from '../utils'

export default defineComponent({
  props: {
    field: {
      type: Object
    },
    // 文本框类型：input、textarea
    type: {
      type: String,
      default: 'input'
    }
  },
  emits: ['change'],
  setup(props,{emit}) {
    var field = reactive<any>(deepClone(props.field))
    var type = ref<any>(props.type)
    watch(()=>props.field, newVal => {
      Object.assign(field, deepClone(newVal))
    })
    watch(()=>props.type, newVal => {
      type.value = newVal
    })
    const handleChange = (e:any) => {
      field.value = e.target.value
      emit('change', e.target.value)
    }
    const getClass = (name:string) => {
      let style = splitFieldName(name)[1]
      return `baseStyle ${style}`
    }
    return {
      field,
      type,
      handleChange,
      getClass
    }
  },
})
</script>

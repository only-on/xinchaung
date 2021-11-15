<template>
    <input v-if="type ==='input'" :value="field.value" :readonly="field.readonly" :placeholder="field.placeholder" :class="getClass(field.name)" @input="handleChange($event)"/>
    <textarea  v-else :value="field.value" :readonly="field.readonly" :placeholder="field.placeholder" :class="getClass(field.name)" @input="handleChange($event)"/> 
</template>
<script lang="ts">
import { defineComponent, reactive, watch, ref } from 'vue'
import {splitFieldName} from '../utils'

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
  setup(props,{emit}) {
    var field = reactive<any>(props.field)
    var type = ref<any>(props.type)
    watch(()=>props.field, newVal => {
      Object.assign(field, newVal)
    })
    watch(()=>props.type, newVal => {
      type.value = newVal
    })
    const handleChange = (e:any) => {
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

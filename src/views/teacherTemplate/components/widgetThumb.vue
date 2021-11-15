<template>
  <div>
    <div v-if="type == 'w1'" class="wrapper title">
      <div class="title-text slash vertical"></div>
    </div>
    <div v-if="type == 'w2'" class="wrapper">
      <div class="slash vertical"></div>
      <div class="slash-wrapper">
        <div class="slash-lager"></div>
      </div>
    </div>
    <div v-if="type == 'w3'" class="wrapper">
      <div class="slash vertical-T"></div>
      <div class="slash-wrapper">
        <div class="slash-small"></div>
      </div>
      <div class="slash vertical-T"></div>
      <div class="slash-wrapper">
        <div class="slash-small"></div>
      </div>
    </div>
    <div v-if="type == 'w4'" class="wrapper vertical wrapper-column">
      <div class="slash horizontal"></div>
      <div class="slash-wrapper">
        <div class="slash-lager"></div>
      </div>
    </div>
    <div v-if="type == 'w5'" class="wrapper wrapper-region">
      <div class="slash vertical"></div>
      <div class="slash-wrapper break-wrap">
        <div class="slash-mean-less space-right">
          <div class="slash-middle"></div>
          <div class="slash-middle"></div>
        </div>
        <div class="slash-mean-less">
          <div class="slash-middle"></div>
          <div class="slash-middle"></div>
        </div>
      </div>
    </div>
    <div v-if="type == 'w6'" class="wrapper vertical region">
      <div class="slash horizontal"></div>
      <div class="slash-wrapper break-wrap">
        <div class="slash-mean-less space-right">
          <div class="slash-middle"></div>
          <div class="slash-middle"></div>
        </div>
        <div class="slash-mean-less">
          <div class="slash-middle"></div>
          <div class="slash-middle"></div>
        </div>
      </div>
    </div>
    <div v-if="type == 'w7'" class="wrapper region">
      <div class="slash vertical region"></div>
      <div class="slash-wrapper break-wrap">
        <div class="slash-mean-less space-right">
          <div class="slash-block"></div>
        </div>
        <div class="slash-mean-less">
          <div class="slash-middle"></div>
          <div class="slash-middle"></div>
        </div>
      </div>
    </div>
    <div v-if="type == 'w8'" class="wrapper vertical region">
      <div class="slash horizontal"></div>
      <div class="slash-wrapper break-wrap">
        <div class="slash-mean-less space-right">
          <div class="slash-block"></div>
        </div>
        <div class="slash-mean-less">
          <div class="slash-middle"></div>
          <div class="slash-middle"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref,watch } from 'vue'
import './thumb.less'
export default defineComponent({
  props: ['type'],
  setup(props) {
    const type = ref<string>(props.type)
    watch(()=>props.type, newVal => {
      type.value = newVal
    })
    return {
      type
    }
  },
})
</script>

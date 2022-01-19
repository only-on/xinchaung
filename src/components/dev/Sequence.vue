<template>
  <h1>Sequence Diagram</h1>
  <div ref="refDiagram"/>
</template>

<script lang="ts">
// import Diagram from '@xianfe/sequence-diagrams'
import {defineComponent, ref, onMounted} from "vue";

export default defineComponent({
  name: "Sequence",
  setup() {
    const refDiagram = ref()

    // onMounted(() => {
    //   const diagram = Diagram.parse("A->B: Message");
    //   diagram.drawSVG(refDiagram.value, {theme: 'simple'});
    // })
    return {
      refDiagram
    }
  }
})
</script>

<style scoped>

</style>

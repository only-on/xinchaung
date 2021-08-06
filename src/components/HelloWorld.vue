<template>
  <h1>h1{{ msg }}</h1>

  <p>
    Recommended IDE setup:
    <a href="https://code.visualstudio.com/" target="_blank">VSCode</a>
    +
    <a
      href="https://marketplace.visualstudio.com/items?itemName=octref.vetur"
      target="_blank"
    >
      Vetur
    </a>
    or
    <a href="https://github.com/johnsoncodehk/volar" target="_blank">Volar</a>
    (if using
    <code>&lt;script setup&gt;</code>)
  </p>

  <p>See <code>README.md</code> for more information.</p>

  <p>
    <a href="https://vitejs.dev/guide/features.html" target="_blank">
      Vite Docs
    </a>
    |
    <a href="https://v3.vuejs.org/" target="_blank">Vue 3 Docs</a>
  </p>

  <el-button class="result" type="primary"  @click="test"
    >el-button</el-button
  >
  <span class="result"
    >count is:
    {{ count }}
  </span>
  <p>
    Edit
    <code>components/HelloWorld.vue</code> to test hot module replacement.
  </p>
  <h3> </h3>
</template>

<script lang="ts">
import { ref, defineComponent, onMounted } from "vue";
// scss文件引入需要带上后缀名，否则报错
import "../style/hello.scss";
export default defineComponent({
  
  name: "HelloWorld",
  props: {
    msg: {
      type: String,
      required: false,
    },
  },
  emits: ['test2'],
  setup: (props,{emit}) => {
    console.log(emit);
    const count = ref(12);
    function test(){
      emit('test2',[1,2,3])
    }
    onMounted(()=>{
      
    })
    return { count,test };
  },
});
</script>

<style scoped>
a {
  color: #42b983;
}

label {
  margin: 0 0.5em;
  font-weight: bold;
}

code {
  background-color: #eee;
  padding: 2px 4px;
  border-radius: 4px;
  color: #304455;
}
</style>

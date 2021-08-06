<template>
  <img alt="Vue logo" src="./assets/logo.png" />
  <h3>描述是:{{textWord}}</h3>
  <!-- <HelloWorld :msg="textWord" @test2="change2()"/> -->
  <Testemit @emitclick="change2" :number="n2"></Testemit>
</template>

<script lang="ts">
import { defineComponent,ref, onMounted } from 'vue'
import HelloWorld from './components/HelloWorld.vue'
import Testemit from './components/Test.vue'
export default defineComponent({
  name: 'App',
  components: {
    HelloWorld,
    Testemit
  },
  setup: (props,{emit}) => {
    const textWord=ref('儿子')
    const n2=ref(0)
    function change2(arr:any){
      console.log(arr);
      textWord.value='修改了'
      console.log(textWord.value)
      n2.value=arr
    }
    onMounted(()=>{
      //  console.log(textWord)
    })
    return {change2,textWord,n2 };
  },
})
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>

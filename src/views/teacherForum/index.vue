<template>
    <div class="forumn" v-layout-bg >
      <component :is="componentName" :componentName="componentName"/>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, reactive, Ref, inject, watch, provide } from 'vue'
import ForumSquare from './ForumSquare.vue'
import MyPosts from './MyPosts.vue'
import { useRouter, useRoute } from 'vue-router';
export default defineComponent({
  name: '',
  components: {
   ForumSquare,
   MyPosts,
  },
  setup: (props, { emit }) => {
    const route = useRoute();
    const componentNames = ['ForumSquare', 'MyPosts']
    const tabs = [{name: '论坛广场', componenttype: 0}, {name: '我的帖子' , componenttype: 1}]
    var componentName: Ref<string> = ref('ForumSquare') 
    
    var configuration: any = inject('configuration')
    var updata = inject('updataNav') as Function
    updata({tabs: tabs, navPosition: 'outside', navType: false, showContent: false, componenttype: undefined, showNav: true, backOff: false, showPageEdit: false})

    let labelList = [
      {name: 'WIKI', id: 1},
      {name: '热门', id: 2},
      {name: '最新', id: 3},
      {name: '求助', id: 4},
      {name: '分享', id: 5},
      {name: '公告', id: 6},
    ]
    provide('labelList', labelList)

    watch(()=>{ return configuration.componenttype}, (val) => {
      console.log(val)
      // const {page}= route.query
      componentName.value = componentNames[val]
    })
    onMounted(() => {
    
    })
    return {componentName, tabs};
  },
})
</script>

<style scoped lang="less">
.forumn {
  /*width: var(--center-width);
  height: 100%;
  margin: 0 auto;*/
  background-color: var(--lightgray-1);
}
</style>

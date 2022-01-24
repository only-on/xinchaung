<template>
    <div class="my-posts">
      <forumn-top :type="'MyPosts'"></forumn-top>
      MyPosts
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, reactive, Ref, inject, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router';
import ForumnTop from './components/ForumnTop.vue'
export default defineComponent({
  name: 'MyPosts',
  components: {
    ForumnTop
  },
  setup: (props, { emit }) => {
    const route = useRoute();

    onMounted(() => {
    
    })
    return {  };
  },
})
</script>

<style scoped lang="less">
.my-posts {

}
</style>

<template>
  <div class="marked__demo">
    <div class="row">
      <div class="editor">
        <antdv-markdown v-model="content" class="markdown__editor"/>
      </div>
      <div class="textarea">
        <textarea v-model="content"></textarea>
      </div>
    </div>
    <hr/>
    <div class="row">
      <div class="editor">
        <antdv-markdown v-model="content2" class="markdown__editor"/>
      </div>
      <div class="textarea">
        <textarea v-model="content2"></textarea>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import {defineComponent, ref, watch} from "vue";
import AntdvMarkdown from "@xianfe/antdv-markdown/src/index.vue";
import readme from '@xianfe/antdv-markdown/README.md';

export default defineComponent({
  name: "Markdown",
  components: {
    AntdvMarkdown,
  },
  setup() {
    const content = ref(readme);
    const content2 = ref('#demo\n不标准的markdown语法，支持html\n<center>第一个居中</center><center>\n第二个居中</center><center>第三个居中\n</center>\n<p style="background: blue; color: white">来一段蓝色背景文字</p>')
    watch(content, (newVal) => {
      console.log("[markdown] content changed");
    });
    return {content, content2};
  },
});
</script>
<style lang="less" scoped>
.marked__demo {
  height: 100%;
  overflow-y: scroll;
  overflow-x: hidden;

  .row {
    display: flex;

    .editor {
      width: 70%;

      .markdown__editor {
        height: 700px;
      }
    }

    .textarea {
      width: 30%;

      textarea {
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>

<template>
  <div class="question">
    <ul>
      <li>
        <h3>题目描述</h3>
        <antdv-markdown v-model="data.title"  :preview-only="true" />
      </li>
      <li>
        <h3>输入</h3>
        <antdv-markdown v-model="data.input"  :preview-only="true" />
      </li>
      <li>
        <h3>输出</h3>
        <antdv-markdown v-model="data.output"  :preview-only="true" />
      </li>
      <li class="sample">
        <h3>样例</h3>
        <div>
          <div class="smaple-head">
              <span>输入</span>
              <span @click="handleCopy('sample_input')">复制</span>
          </div>
          <a-textarea
            class="sample_input"
            resize="none"
            autoSize
            :readonly="true"
            placeholder="请输入内容"
            v-model:value="data.sample_input">
          </a-textarea>
        </div>
        <div>
          <div class="smaple-head">
              <span>输出</span>
              <span @click="handleCopy('sample_output')">复制</span>
            </div>
            <a-textarea
              class="sample_output"
              resize="none"
              autoSize
              :readonly="true"
              placeholder="请输入内容"
              v-model:value="data.sample_output">
            </a-textarea>
        </div>
      </li>
    </ul>
  </div>
</template>
<script lang="ts" setup>
import { ref, reactive, watch, provide, inject ,computed} from "vue";
import { message } from "ant-design-vue";
interface Props {
  data: any
}
const props = withDefaults(defineProps<Props>(), {
  data: {
    title: '',
    input: '',
    output: '',
    sample_input: '',
    sample_output: '',
  }
})
const handleCopy = (refsName:string) => {
  let htmlNodeList:any = document.getElementsByClassName(refsName)
  if (htmlNodeList.length > 0) {
    htmlNodeList[0].select()
    document.execCommand("Copy")
    message.success('复制成功')
  }
}
</script>
<style lang="less" scoped>
.question{
  ul>li{
    margin-bottom: 20px;
  }
  .sample{
    .smaple-head{
        margin: 10px 0;
        display: flex;
        justify-content: space-between;
        span:last-child{
          color: var(--primary-color);
          cursor: pointer;
      }
    }
    .ant-input{
      border-radius: 0;
    }
  }
  
}
</style>
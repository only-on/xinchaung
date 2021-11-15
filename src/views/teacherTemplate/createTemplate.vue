<template>
  <div class="wrapper" v-layout-bg>
    <div class="toolbar">
      <div class="toolbar-title">报告模板组件</div>
      <div v-for="(item,index) in initialWidgetThumb" :key="index">
        <div class="toolbar-subject">{{item.title}}</div>
        <div class="toolbar-widget">
          <template v-for="(widget, windex) in item.widget" :key="windex">
            <widget-thumb :type="widget.type"/>
          </template>
        </div>
      </div>
    </div>
    <div class="content">
      <a-form :model="form" :rules="rules" layout="vertical" ref="formRef">
        <a-form-item label="报告模板名称" name="name">
          <a-input v-model:value="form.name" placeholder="请输入报告模板名称"/>
        </a-form-item>
        <a-form-item>
          <table ref="tableDom" style="width: 100%; min-height: 100px; border-collapse: collapse;">
            <template v-for="(widget, windex) in dataList" :key="windex">
              <widget-create :value="widget">
                <template #toolbar>
                  <div class="actions">
                    <i class="actions-drag iconfont icon-shanchu"></i>
                    <i class="actions-delete iconfont icon-shanchu" @click="handleDelete(windex)"></i>
                  </div>
                </template>
              </widget-create>
            </template>
          </table>
        </a-form-item>
        <a-form-item class="operate">
          <a-button @click="router.go(-1)">返回</a-button>
          <a-button type="primary" style="margin-left: 10px" @click="handleSave">保存</a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, inject, onMounted, reactive, ref } from 'vue'
import {initialWidgetThumb } from './utils'
import widgetThumb from './components/widgetThumb.vue'
import widgetCreate from './components/widgetCreate.vue'
import {widgetDataModel} from './components/DM'
import {useRouter} from 'vue-router'
import { MessageApi } from "ant-design-vue/lib/message";
export default defineComponent({
  components: {
    widgetThumb,
    widgetCreate
  },
  setup() {
    const $message: MessageApi = inject("$message")!;
    const router = useRouter()
    const formRef = ref();
    var tableDom = ref<null>(null)
    var updata=inject('updataNav') as Function
    updata({showNav: false, showContent: true})
    var form = reactive<any>({
      name: ''
    })
    var rules = {
       name: [
        { required: true, message: '请输入模板标题' },
        { max: 20, message: '模板标题不能超过20个字符' },
        { whitespace: true, message: '不能只包含空格' },
      ],
    }
    var dataList = reactive<any[]>([
      widgetDataModel.w1,
      widgetDataModel.w2,
      widgetDataModel.w3,
      widgetDataModel.w4,
      widgetDataModel.w5,
      widgetDataModel.w6,
      widgetDataModel.w7,
      widgetDataModel.w8,
    ])
    onMounted(()=>{
      let ele:any = document.getElementsByClassName('content_box')[0]
      ele.style.padding = '0'
      ele.style.height = 'auto'
    })
    const handleDelete = (index:number) => {
      if (dataList.length === 1) {
        $message.warn('最少保留一个实验报告组件')
        return
      }
      dataList.splice(index, 1)
    }
    const handleSave = () => {
      formRef.value.validate().then(()=>{
        let params = {
          name: form.name.trim(),
          json_content: dataList,
          html_content: (tableDom.value as any).outerHTML
        }
        console.log(params)
      })
    }
    return {
      initialWidgetThumb,
      form,
      rules,
      dataList,
      handleSave,
      router,
      tableDom,
      formRef,
      handleDelete
    }
  },
})
</script>
<style lang="less" scoped>
@import url(./createTemplate.less);
</style>

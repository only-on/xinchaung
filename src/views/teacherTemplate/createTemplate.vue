<template>
  <div class="wrapper" v-layout-bg>
    <div class="toolbar ">
      <div class="toolbar-title">报告模板组件</div>
      <div v-for="(item,index) in initialWidgetThumb" :key="index">
        <div class="toolbar-subject">{{item.title}}</div>
        <drag-gable class="toolbar-widget" v-model="item.widget" :disabled="isCheck" :sort="false" group="table" @end="handleDragEnd" item-key="type">
          <template #item="{element}">
            <widget-thumb :type="element.type"/>
          </template>
        </drag-gable>
      </div>
    </div>
    <div class="content ">
      <div class="dnd-space">
        <a-form :model="form" :rules="rules" layout="vertical" ref="formRef">
          <a-form-item label="报告模板名称" name="name">
            <a-input v-model:value="form.name" :disabled="isCheck" placeholder="请输入报告模板名称"/>
          </a-form-item>
          <a-form-item>
            <drag-gable :list="dataList" class="tableDom" :sort="true" tag="table" ignore="a, img, input, textarea" item-key="idx">
              <template #item="{element, index}">
                <widget-create :type="element.type" v-model:fields="element.fields">
                  <template #toolbar v-if="!isCheck">
                      <div class="actions">
                        {{element.id}}
                        <i class="actions-drag iconfont icon-yidong"></i>
                        <i class="actions-delete iconfont icon-shanchu" @click="handleDelete(index)"></i>
                      </div>
                    </template>
                  </widget-create>
                </template>
            </drag-gable>
          </a-form-item>
        </a-form>
      </div>
      <!-- <div class="operate">
        <a-button @click="goBack">{{templateId ? '返回' : '取消'}}</a-button>
        <a-button v-show="!isCheck" type="primary" style="margin-left: 10px" @click="handleSave">保存</a-button>
      </div> -->
    </div>
  </div>
  <div class="operate">
    <a-button @click="goBack">{{templateId ? '返回' : '取消'}}</a-button>
    <a-button v-show="!isCheck" type="primary" style="margin-left: 10px" @click="handleSave">保存</a-button>
  </div>
</template>
<script lang="ts">
import { defineComponent, inject, onMounted, reactive, ref } from 'vue'
import {initialWidgetThumb, deepClone } from './utils'
import widgetThumb from './components/widgetThumb.vue'
import widgetCreate from './components/widgetCreate.vue'
import {widgetDataModel} from './components/DM'
import {useRoute, useRouter} from 'vue-router'
import { MessageApi } from "ant-design-vue/lib/message"
import dragGable from 'vuedraggable'
import request from 'src/api/index'
import { IBusinessResp } from 'src/typings/fetch.d'
import { ITeacherTemplateHttp, Iform, WidgetModel } from './templateTyping'
export default defineComponent({
  components: {
    widgetThumb,
    widgetCreate,
    dragGable
  },
  setup() {
    const http=(request as ITeacherTemplateHttp).teacherTemplate
    const $message: MessageApi = inject("$message")!
    const router = useRouter()
    const route = useRoute()
    const formRef = ref<any>(null)
    const templateId = ref<any>('')
    var isCheck = ref<boolean>(false)
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
      {
        ...deepClone(widgetDataModel.w1),
        idx: 0
      }
    ])
    onMounted(()=>{
      templateId.value = route.query.id
      if (route.query.type) {
        isCheck.value = true
      }
      if (templateId.value) {
        getDetail()
      }
    })
    const getDetail = () => {
      dataList.length = 0
      http.viewTemplate({param: {id: templateId.value}}).then((res:IBusinessResp) => {
        if (res && res.data) {
          let result = res.data
          form.name = result.name
          Object.assign(dataList, result.json_content)
          // 增加唯一标识， 否则拖拽排序时input的value值会被影响
          dataList.forEach((item:WidgetModel, index:number) => {
            item.idx = index
          })
        }
      })
    }
    const handleDragEnd = (evt:any) => {
      const clone: HTMLElement = evt.clone.children[0]
      const type: any = clone.getAttribute('data-type')
      const widget:any = deepClone(widgetDataModel[type])
      // 增加唯一标识
      dataList.push(Object.assign(widget,{idx: dataList.length}))
      return true
    }
    const handleDelete = (index:number) => {
      if (dataList.length === 1) {
        $message.warn('最少保留一个实验报告组件')
        return
      }
      console.log('index', index)
      dataList.splice(index, 1)
    }
    const handleSave = () => {
      formRef.value.validate().then(()=>{
        let json_content:WidgetModel[] = dataList.map((item:any) => {
          delete item.idx
          return item
        })
        let params:Iform = {
          name: form.name.trim(),
          json_content: json_content,
          html_content: document.getElementsByClassName('tableDom')[0].outerHTML
        }
        if (templateId.value) {
          params.id = templateId.value
          http.updateTemplate({param: params}).then((res:IBusinessResp) => {
            $message.success('报告模板修改成功！')
            goBack()
          })
        } else {
          http.createTemplate({param: params}).then((res:IBusinessResp) => {
            $message.success('报告模板创建成功！')
            goBack()
          })
        }
      })
    }
    const goBack = () => {
      if (templateId.value) {
        router.go(-1)
      } else {
        router.push('/teacher/teacherTemplate')
      }
    }
    return {
      initialWidgetThumb,
      form,
      rules,
      dataList,
      handleSave,
      router,
      formRef,
      handleDelete,
      handleDragEnd,
      isCheck,
      goBack,
      templateId
    }
  },
})
</script>
<style lang="less" scoped>
.wrapper {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  height: 100%;
}
.content {
  flex:1;
  overflow: auto;
  padding-right: 10px;
  max-height: 806px;
  .dnd-space {
    padding-left: 25px;
    min-height: 800px;
    border-left: 1px solid #E4E4E4;
  }
  .operate{
    text-align: center;
    margin-top: 25px;
  }
  table{
    width: 100%;
  }
}

.toolbar {
  flex-shrink: 0;
  width: 270px;
  border-radius: 8px;
  box-sizing: border-box;
  padding-right: 25px;
  overflow: auto;
  &-title {
    font-size: 16px;
    font-family: Microsoft YaHei, Microsoft YaHei-Regular;
    font-weight: 600;
    text-align: left;
    color: #050101;
    line-height: 24px;
    letter-spacing: 2px;
  }

  &-subject {
    margin-top: 30px;
    font-size: 12px;
    font-weight: 600;
    text-align: left;
    color: #4A1C6E;
    line-height: 24px;
    letter-spacing: 1px;
    font-family: Microsoft YaHei, Microsoft YaHei-Regular;
    margin-bottom: 10px;
  }

  &-widget {
    padding-bottom: 13px;
    display: flex;
    flex-direction: column;
  }
}

.actions {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: absolute;
  right: 0;
  top: 0;
  i{
    font-size: 14px;
    cursor: pointer;
    color: #777777;
    &:first-child:hover{
      color: @theme-color;
    }
    &:last-child:hover{
      color: red;
    }
  }
}
</style>

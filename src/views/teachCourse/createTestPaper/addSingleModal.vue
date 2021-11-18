<template>
  <a-modal 
    :visible="isShow" 
    :title="titles[addType]" 
    @ok="handleOk"
    @cancel="handleCancel"
    :width="820"
  >
    <a-form
      ref="formRef"
      :model="formState"
      :rules="rules"
      layout="vertical"
    >
      <a-form-item label="选择目录" required>
        <a-select 
          v-model:value="formState.directory" 
          placeholder="请选择题目目录" 
          @focus="changefocus" 
          @blur="changeblur" 
          :open="openSelect"
           @select="change"
           ref="select"
        >
          <!-- <a-select-opt-group label="公有">
            <a-select-option :value="item.id" v-for="item in commonList" :key="item.id">{{item.name}}</a-select-option>
          </a-select-opt-group> -->
          <a-select-opt-group label="私有">
            <a-select-option :value="item.id" v-for="item in privateList" :key="item.id">{{item.name}}</a-select-option>
          </a-select-opt-group>
          <template #dropdownRender="{ menuNode: menu }">
            <v-nodes :vnodes="menu" />
            <div class="add">
              <a-input v-model:value="directoryName" @focus="focusInput" @blur="blurInput"/>
              <span
                class="btn"
                @mousedown="e => e.preventDefault()"
                @click="addItem"
              >
                <plus-outlined />
                添加
              </span>
            </div>
          </template>
        </a-select>
      </a-form-item>
      <a-form-item label="题目描述" name="desc">
        <a-textarea
          v-model:value="formState.desc"
          placeholder="请输入题目描述"
          :rows="3"
        />
      </a-form-item>
      <!-- 单选题 -->
      <a-radio-group class="group" v-model:value="formState.checked" v-if="addType === 1">
        <div>
          <a-form-item
            v-for="(item, index) in formState.quesList"
            :key="index"
            :label="item.option"
            required
          >
            <a-input v-model:value="item.content" />
            <a-radio :value="index">设为答案</a-radio>
          </a-form-item>
        </div>
      </a-radio-group>
      <!-- 多选题 -->
      <a-checkbox-group class="group" v-model:value="formState.checkedList" v-if="addType === 2">
        <div>
          <a-form-item
            v-for="(item, index) in formState.quesList"
            :key="index"
            :label="item.option"
            required
          >
            <a-input v-model:value="item.content" />
            <a-checkbox :value="index">设为答案</a-checkbox>
          </a-form-item>
        </div>
      </a-checkbox-group>
      <!-- 判断题 -->
      <a-form-item required label="答案" name="judge" v-if="addType === 3">
        <a-radio-group v-model:value="formState.judge">
          <a-radio value="0">正确</a-radio>
          <a-radio value="1">错误</a-radio>
        </a-radio-group>
      </a-form-item>
      <!-- 填空题 -->
      <div class="fill-content" v-if="addType === 4">
        <a-form-item label="答案" required>
          <span class="prompt">注：多个答案用","隔开</span>
          <a-input v-model:value="formState.fillAnswer"/>
        </a-form-item>
        <div class="checkbox">
          <a-checkbox v-model:checked="formState.fillChecked">答案有序</a-checkbox>
        </div>
      </div>
      <!-- 简答题 -->
      <div class="short-answer" v-if="addType === 5">
        <a-form-item required label="答案" name="shortAnswer">
          <a-textarea
            v-model:value="formState.shortAnswer"
            placeholder="请输入题目答案"
            :rows="3"
          />
        </a-form-item>
        <a-form-item required label="关键字" name="shortKey">
          <span class="prompt">说明：关键字至少五个，多个关键字用空格隔开</span>
          <a-textarea
            v-model:value="formState.shortKey"
            placeholder="请输入答案关键字"
            :rows="2"
          />
        </a-form-item>
      </div>
      <div class="difficulty-score">
        <a-form-item label="难度" required>
          <a-select v-model:value="formState.difficulty" placeholder="">
            <a-select-option v-for="v in typeList.levelType" :value="v.id" :key="v.id">{{v.name}}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="分数" required>
          <a-input placeholder="1-50分" v-model:value="formState.score" />
        </a-form-item>
      </div>
      <a-form-item label="知识点">
        <div class="knowledge">
          <span v-for="(v, i) in selectedKnowledgeList" :key="v.id">
            {{v.text}}
            <i class="iconfont icon-guanbi1-copy" @click="delKnowledge(i)"></i>
          </span>
        </div>
        <a-button type="primary" @click="selectKnowledge">选择</a-button>
      </a-form-item>
    </a-form>
  </a-modal>
  <knowledge-modal v-model:isShow="isShowKnowledge" v-model:selectedList="selectedKnowledgeList"></knowledge-modal>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, toRefs, onMounted, provide, inject, watch, nextTick, PropType, toRaw } from 'vue'
import { PlusOutlined } from '@ant-design/icons-vue';
import request from 'src/api/index'
import { IBusinessResp } from 'src/typings/fetch.d'
import { Ihttp, IpaperType } from './typings'
import knowledgeModal from './knowledgeModal.vue'
import { message } from 'ant-design-vue'
import {useRoute} from "vue-router"

export default defineComponent({
  name: '',
  components: {
    knowledgeModal,
    PlusOutlined,
    VNodes: (_, { attrs }) => {
      return attrs.vnodes;
    },
  },
  props: {
    isShow: Boolean,
    addType: {
      type: Number,
      default: 1
    }
  },
  emits: ['update:isShow', 'addPaperContent', 'getPCatalogueList'],
  setup(props, {emit}) {
    console.log(props)
    const http = (request as Ihttp).teachCourse
    const formRef:any = ref(null);
    const route=useRoute()
    const paper_id=route.query.paper_id
    let formState = reactive({
      directory: undefined,
      desc: '',
      quesList: [
        { option: '选项A', content: '', value: 'A' },
        { option: '选项B', content: '', value: 'B' },
        { option: '选项C', content: '', value: 'C' },
        { option: '选项D', content: '', value: 'D' },
      ],
      score: '',
      checked: 'buhuizhemeqiaoba',   // 单选
      checkedList: [],  // 多选
      difficulty: 1,
      judge: '',
      fillAnswer: '',     // 填空答案
      fillChecked: false,   // 填空答案有序
      shortAnswer: '',     // 简答答案
      shortKey: '',        // 简答关键字
    })
    const rules = {
      // directory: [{required: true, message: '请选择题目目录', trigger: 'change',}],
      score: [
        {required: true, message: '请填写分数', trigger: 'blur'},
        // { min: 1, max: 50, message: '1-50分', trigger: 'blur' },
      ],
      // difficulty: [{required: true, message: '请选择难度', trigger: 'change'}],
    }

    // 获取目录列表
    let directoryList: IDirectoryList = inject('directoryList') || {commonList: [], privateList: []}
    let directoryName = ref('')
    const addItem = ()=> {
      if (!directoryName.value) {
        message.warn('请输入目录名称！')
        return
      }
      http.addCatalogue({
        param: {
          name: directoryName.value,
          // description: '111',
          initial: 0   // 私有
        }
      }).then((res: IBusinessResp) => {
        console.log(res)
        if (!res.status) return
        directoryName.value = ''
        emit('getPCatalogueList')
      })
    }
    const handleOk = async() => {
      // console.log(formRef.value)
      // formRef.value
      //   .validate()
      //   .then(() => {
      //     console.log('values', formState, toRaw(formState));
      //   })
      let validate: boolean | undefined = await validateRule()
      console.log(formState, validate)
      if (!validate) {
        return
      }
      let options = props.addType === 1 || props.addType === 2 ? formState.quesList.map((v: {content: string}) => v.content) : (props.addType === 3 ? ['正确', '错误'] : [])
      let answers = props.addType === 1 ? [formState.checked] 
        : (props.addType === 2 ? formState.checkedList 
        : (props.addType === 3 ? [formState.judge] 
        : (props.addType === 4 ? formState.fillAnswer.split(',') : [formState.shortAnswer])))
        console.log(knowledgeList.selectedKnowledgeList)
        // return 
      let points = knowledgeList.selectedKnowledgeList.map(v => v.id)
      let param = {
        question: formState.desc,
        type_id: props.addType,
        level_id: formState.difficulty,
        origin_score: formState.score,
        points: points,
        options: options,
        keywords: formState.shortKey.split(','),
        answers: answers,
        ordered_answer: formState.fillChecked
      }
      console.log(formState, param)
      http.createQuestion({
        urlParams: {
          poolId: formState.directory
        },
        param
      }).then((res: IBusinessResp) => {
        console.log(res.data)
        if (!res.status) return
        if (paper_id) {
          relationQuests([res.data.id])
        }
        emit('update:isShow', false)
        let arr = res.data
        let answersList: number[] = []
        if (arr.answers.length) {
          props.addType === 1 || props.addType === 2 || props.addType === 3 ? arr.answers.forEach((v: any) => {
            v.answer = Number(v.answer)
            answersList.push(Number(v.answer))
          }) : ''
        } else {
          arr.answers = [{answer: 0}]
        }
        // arr.answers.length ? arr.answers.forEach((v: any) => {
        //   v.answer = Number(v.answer)
        //   answersList.push(Number(v.answer))
        // }) : arr.answers = [{answer: 0}]
        arr.keywordsList = arr.keywords.map((v:any) => v.keyword).join(' ')
        arr.answersList = answersList
        emit('addPaperContent', arr)
        
        
      })
      // emit('addPaperContent', Object.assign(formState, {type: props.addType}))
    }

    // 关联习题
    function relationQuests(questions:any) {
      http
        .relationQuest({
          param: {
            questions: questions,
          },
          urlParams: {
            entity_id: paper_id,
            entity_type: "test",
          },
        })
        .then((res: IBusinessResp) => {
          console.log(res);
          // getPaperList()
        });
    }
    const validateRule = () => {
      console.log(formState)
      if (!formState.directory) {
        message.warn('请选择目录！')
        return
      }
      if (!formState.desc) {
        message.warn('请输入题目描述！')
        return
      }
      if (!formState.score) {
        message.warn('请输入题目分数！')
        return
      }

      let sign = true
      if (props.addType === 1 || props.addType === 2) {
        formState.quesList.forEach(v => {
          if(!v.content && sign) {
            sign = false
            message.warn('请输入选项内容！')
            return
          }
        })
      }
      if ((props.addType === 1 || props.addType === 2) && !sign) {
        return
      }
      
      if (props.addType === 1 && formState.checked === 'buhuizhemeqiaoba') {
        message.warn('单选必须有一个选项！')
        return 
      }
      if (props.addType === 2 && !(formState.checkedList.length > 1)) {
        message.warn('多选必须多于一个选项！')
        return
      }
      if (props.addType === 3 && !formState.judge) {
        message.warn('判断结果必选！')
        return
      }
      if (props.addType === 4 && !formState.fillAnswer) {
        message.warn('请输入答案！')
        return
      }
      if (props.addType === 5 && !formState.shortAnswer) {
        message.warn('请输入答案！')
        return
      }
      if (props.addType === 5 && !(formState.shortKey && formState.shortKey.split(' ').length >= 5)) {
        message.warn('请输入至少5个关键字！')
        return
      }
      return true
    }
    const handleCancel = () =>{
      // 清空数据
      formState.directory = undefined
      formState.desc = ''
      formState.quesList = [
        { option: '选项A', content: '', value: 'A' },
        { option: '选项B', content: '', value: 'B' },
        { option: '选项C', content: '', value: 'C' },
        { option: '选项D', content: '', value: 'D' },
      ]
      formState.score = ''
      formState.checked = 'buhuizhemeqiaoba'
      formState.checkedList = []
      formState.difficulty = 1
      formState.judge = ''
      formState.fillAnswer = ''
      formState.fillChecked = false
      formState.shortAnswer = ''
      formState.shortKey = ''
      console.log(formRef);
      formRef.value.resetFields()
      emit('update:isShow', false)
    }

    // 知识点
    let isShowKnowledge = ref(false)
    let knowledgeList = reactive<ItreeData>({
      selectedKnowledgeList: []
    })
    const selectKnowledge = () => {
      isShowKnowledge.value = true
    }
    const delKnowledge = (i: number) => {
      knowledgeList.selectedKnowledgeList.splice(i, 1)
    }

    // 修改select 点击下拉里的input 下拉框不显示问题
    let select = ref({
      blur: function() {}
    })
    let openSelect = ref(false)
    const change = () => {
      console.log('change')
      openSelect.value = false
      isFocus = false
      select.value.blur()
      console.log(select.value)
    }
    const changefocus = () => {
      console.log('focus')
      openSelect.value = true
    }
    let isFocus = false
    const changeblur = () => {
      console.log('blur')
      !isFocus ? openSelect.value = false : ''
    }
    const focusInput = () => {
      console.log('focusInput')
      isFocus = true
      // openSelect.value = false
    }
    const blurInput = () => {
      console.log('blurInput')
      isFocus = false
      openSelect.value = false
    }

    onMounted(() => {
      // getCCatalogueList()
      nextTick(() => {
        console.log(select.value)
      })
    })
    let typeList: IpaperType = inject('typeList') || {paperType: [], levelType: []}
    console.log(typeList)
    return {
      handleOk,
      handleCancel,
      formState,
      rules,
      ...toRefs(directoryList),
      directoryName,
      addItem,
      typeList,
      titles: {1: '添加单选题', 2: '添加多选题', 3: '添加判断题', 4: "添加填空题", 5: "添加简答题"},
      isShowKnowledge,
      ...toRefs(knowledgeList),
      selectKnowledge,
      delKnowledge,
      changefocus,
      changeblur,
      focusInput,
      blurInput,
      change,
      openSelect,
      select,
      formRef
    }
  },
})

interface ICPDirectoryList {
  id: number,
  name: string
}
interface IDirectoryList {
  commonList: ICPDirectoryList[],
  privateList: ICPDirectoryList[]
}
interface ItreeData {
  selectedKnowledgeList: ItreeDatalist[]
}
interface ItreeDatalist {
  id: string
  text: string
  children?: ItreeDatalist[]
  disabled?: boolean
}
</script>

<style lang="less" scoped>
.ant-select-dropdown {
  .add {
    padding: 12px;
    .ant-input {
      width: 273px;
      margin-right: 22px;
    }
    .btn {
      padding: 4px 8px;
      cursor: pointer;
      color: @theme-color;
    }
  }
}
.difficulty-score {
  display: flex;
  width: 630px;
  justify-content: space-between;
  .ant-input {
    width: 285px;
  }
  :deep(.ant-select-selector) {
    width: 285px;
  }
}
.short-answer {}
.prompt {
  position: absolute;
  top: -30px;
  left: 70px;
  font-size: 12px;
  color: rgba(0,0,0,0.35);
}
.fill-content {
  .prompt {
    left: 50px;
  }
  .ant-row {
    margin-bottom: 12px;
  }
  .checkbox {
    margin-bottom: 24px;
  }
}
.knowledge {
  margin: 20px 0;
  span {
    padding: 6px 12px;
    border-radius: 6px;
    border: 1px solid #ccc;
    color: @theme-color;
    margin-right: 12px;
    .iconfont {
      cursor: pointer;
    }
  }
}

:deep(.ant-modal-footer) {
  text-align: center;
  padding-bottom: 30px;
}

.group {
  width: 100%;
  :deep(.ant-input) {
    margin-right: 27px; 
    width: 630px;
  }
}
</style>

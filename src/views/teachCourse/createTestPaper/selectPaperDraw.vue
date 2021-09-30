<template>
  <a-drawer 
    placement="right" 
    title="" 
    :closable="false"
    :visible="isShow"
    @close="onClose"
    :width="700"
    :afterVisibleChange="afterVisibleChange(isShow)"
  >
    <div class="nav-list">
      <span v-for="(v) in typeList.paperType" :key="v.id" :class="{'current-nav': selectType === v.id}" @click="changeNav(v.id)">{{v.name}}</span>
    </div>
    <div class="list-content">
      <div class="lists">
        <div class="search">
          <a-select v-model:value="searchInfo.poolId" placeholder="请选择题目目录" @select="changeDirectory">
            <a-select-opt-group label="公有">
              <a-select-option :value="item.id" v-for="item in directoryList.commonList" :key="item.id">{{item.name}}</a-select-option>
            </a-select-opt-group>
            <a-select-opt-group label="私有">
              <a-select-option :value="item.id" v-for="item in directoryList.privateList" :key="item.id">{{item.name}}</a-select-option>
            </a-select-opt-group>
          </a-select>
          <a-select v-model:value="searchInfo.levelId" placeholder="请选择试题难度" class="difficulty" @click="changeLevel">
            <a-select-option v-for="v in typeList.levelType" :value="v.id" :key="v.id">{{v.name}}</a-select-option>
          </a-select>
          <a-input-search
            v-model:value="searchInfo.name"
            placeholder="请输入搜索关键字"
            @search="onSearch"
          />
          <a-button type="primary" @click="selectAllHandle">全选（{{paperList.length}}）</a-button>
        </div>
        <ul>
          <li v-for="(list, i) in paperList" :key="i">
            <p>{{list.question}}<span>（{{list.origin_score}}）</span></p>
            <span class="iconfont icon-del" @click="add(i)" v-if="!list.isChecked"></span>
            <span class="iconfont icon-yichu" @click="del(i)" v-if="list.isChecked"></span>
          </li>
        </ul>
      </div>
      <div class="footer">
        <a-pagination
          v-model:current="searchInfo.page" 
          :pageSize="searchInfo.pageSize" 
          :total="searchInfo.total" 
          @change="pageChange" 
          :hideOnSinglePage="true"
          show-size-changer
          @showSizeChange="onShowSizeChange"
        />
      </div>
    </div>
  </a-drawer>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, toRefs, onMounted, provide, inject, watch, nextTick, PropType } from 'vue'
import { Ihttp, IpaperType } from './typings'
import request from 'src/api/index'
import { IBusinessResp } from 'src/typings/fetch.d'

export default defineComponent({
  name: '',
  components: {},
  props: {
    isShow: Boolean,
    selectType: Number,
    modelValue: {
      type: Array as PropType<IpaperList[]>,
      default: []
    }
  },
  emits: ['update:isShow', 'update:selectType', 'update:modelValue'],
  setup(props, {emit}) {
    const http = (request as Ihttp).teachCourse
    console.log(props)
    let searchInfo = reactive({
      poolId: 0,
      levelId: 1,
      name: '',
      page: 1,
      pageSize: 10,
      total: 0
    })
    // 页码变化
    const pageChange = (page: number) => {
      console.log(page, searchInfo)
    }
    const onShowSizeChange = (current: number, pageSize: number) => {
      console.log(current, pageSize, searchInfo);
      searchInfo.pageSize = pageSize
    };
    // 获取习题列表
    let list = reactive<Ilist>({
      paperList: []
    })
    const getQuestionList = () => {
      http.getQuestionList({
        param: {
          name: searchInfo.name,
          level_id: searchInfo.levelId,
          type_id: props.selectType,
          limit: searchInfo.pageSize,
          page: searchInfo.page,
          initial: false,
          include: 'answers'
        },
        urlParams: {
          poolId: searchInfo.poolId
        }
      }).then((res: IBusinessResp) => {
        console.log(res, props)
        if (res) {
          list.paperList = res.data.list
          searchInfo.total = res.data.page.totalCount
          searchInfo.page = res.data.page.currentPage
          searchInfo.pageSize = res.data.page.perPage
          list.paperList.forEach(v => {
            v.isChecked = false
            props.modelValue?.forEach(vv => {
              if (v.id === vv.id) v.isChecked = true
            })
          })
        }
      })
    }
    // 全选
    const selectAllHandle = () => {
      list.paperList.forEach(list => {
        list.isChecked = true
        let answersList: number[] = []
        if (list.answers.length) {
          props.selectType === 1 || props.selectType === 2 || props.selectType === 3 ? list.answers.forEach((v: any) => {
            v.answer = Number(v.answer)
            answersList.push(Number(v.answer))
          }) : ''
        } else {
          list.answers = [{answer: 0, id: 0}]
        }
        // list.answers.length ? list.answers.forEach((v: any) => {
        //   v.answer = Number(v.answer)
        //   answersList.push(Number(v.answer))
        // }) : list.answers = [{answer: 0, id: 0}]
        list.keywordsList = list.keywords.map((v:any) => v.keyword).join(' ')
        list.answersList = answersList
        // props.modelValue.push(list)
        let dd = props.modelValue.filter(v => v.id === list.id) 
        console.log(dd)
        if (!dd.length) {
          props.modelValue.push(list)
        }
      })
      emit('update:modelValue', props.modelValue)
    }
    // 选择习题
    const add = (i: number) => {
      console.log(list.paperList)
      // let arr = list.paperList
      // arr.forEach(list => {
      //   let answersList: number[] = []
      //   list.answers.length ? list.answers.forEach((v: any) => {
      //     v.answer = Number(v.answer)
      //     answersList.push(Number(v.answer))
      //   }) : list.answers = [{answer: 0, id: 0}]
      //   list.keywordsList = list.keywords.map((v:any) => v.keyword).join(' ')
      //   list.answersList = answersList
      // })
      let paper = list.paperList[i]
      let answersList: number[] = []
      if (paper.answers.length) {
        props.selectType === 1 || props.selectType === 2 || props.selectType === 3 ? paper.answers.forEach((v: any) => {
          v.answer = Number(v.answer)
          answersList.push(Number(v.answer))
        }) : ''
      } else {
        paper.answers = [{answer: 0, id: 0}]
      }
      paper.keywordsList = paper.keywords.map((v:any) => v.keyword).join(' ')
      paper.answersList = answersList
      paper.isChecked = true
      props.modelValue.push(paper)
      emit('update:modelValue', props.modelValue)
    }
    // 取消选择的习题
    const del = (i: number) => {
      console.log(list.paperList)
      // list.paperList[i].isChecked = false
      // list.paperList.splice(i, 1)
      // let arr = list.paperList
      // arr.forEach(list => {
      //   let answersList: number[] = []
      //   list.answers.length ? list.answers.forEach((v: any) => {
      //     v.answer = Number(v.answer)
      //     answersList.push(Number(v.answer))
      //   }) : list.answers = [{answer: 0, id: 0}]
      //   list.keywordsList = list.keywords.map((v:any) => v.keyword).join(' ')
      //   list.answersList = answersList
      // })
      let arr = props.modelValue
      emit('update:modelValue', arr?.filter(v => v.id !== list.paperList[i].id))
    }

    const onClose = () =>{
      emit('update:isShow', false)
    }
    const changeNav = (i: number) =>{
      emit('update:selectType', i)
    }
    const changeDirectory = () => {
      console.log(searchInfo.poolId)
      getQuestionList()
    }
    // 搜索
    const onSearch = () => {
      console.log(searchInfo)
      getQuestionList()
    }
    // 难易程度改变
    const changeLevel = () =>{
      getQuestionList()
    }
    let typeList: IpaperType = inject('typeList') || {paperType: [], levelType: []}
    let directoryList: IDirectoryList = inject('directoryList') || {commonList: [], privateList: []}
    const afterVisibleChange = (visible: boolean) => {
      console.log(visible)
      if (visible) {
        getQuestionList()
      } else {
        searchInfo.levelId = 1
        searchInfo.name = ''
        searchInfo.page = 1
      }
    }
    watch(
      () => directoryList,
      (newVal) => {
        console.log(newVal, 'watch')
        searchInfo.poolId = newVal.commonList.length ? newVal.commonList[0].id : newVal.privateList[0].id
        // getQuestionList()
      },
      {deep: true}
    )

    onMounted(() => {
      
    })
    return {
      onClose,
      typeList,
      directoryList,
      searchInfo,
      pageChange,
      onShowSizeChange,
      onSearch,
      changeLevel,
      changeNav,
      ...toRefs(list),
      afterVisibleChange,
      selectAllHandle,
      add,
      del,
      changeDirectory,
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
interface IpaperList {
  id: number
  question: string
  type_id: number
  options: Ioptions[]
  answers: Ianswers[]
  keywords: string[]
  answersList: number[]
  keywordsList: string
  origin_score: number
  isChecked: boolean
}
interface Ilist {
  paperList: IpaperList[]
}

interface Ioptions {
  id: number
  option: string
}
interface Ianswers {
  id: number
  answer: number
}
</script>

<style lang="less" scoped>
.nav-list {
  // padding: 0 8px;
  & > span {
    display: inline-block;
    height: 38px;
    width: 127px;
    line-height: 38px;
    text-align: center;
    cursor: pointer;
    &.current-nav {
      font-size: 16px;
      color: @white;
      background-color: @theme-color;
      border-radius: 6px 6px 0px 0px;
    }
  }
}
.list-content {
  padding: 0 12px;
  .lists {
    .search {
      padding: 26px 0;
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      :deep(.ant-input-search){
        width: 329px;
        height: 33px;
        margin-top: 18px;
      } 
      :deep(.ant-select-selector) {
        width: 329px;
      }
      .difficulty {
        :deep(.ant-select-selector){
          width: 252px;
        }
      }
      .ant-btn {
        margin-top: 18px;
      }
    }
    ul {
      height: 648px;
      overflow: auto;
      margin-bottom: 0;
    }
    li {
      line-height: 26px;
      padding-bottom: 8px;
      border-bottom: 1px solid #d9d9d9;
      margin-bottom: 24px;
      position: relative;
      p {
        margin-bottom: 0;
        color: rgba(0,0,0,0.65);
        font-size: 14px;
        line-height: 26px;
        span {
          color: red;
        }
      }
      .iconfont {
        font-size: 18px;
        color: @theme-color;
        // position: absolute;
        bottom: 3px;
        right: 0;
        cursor: pointer;
      }
    }
  }
  .footer {
    padding: 30px 0;
    text-align: center;
  }
}
</style>

<template>
  <div class="experimentalList" v-layout-bg>
    <div class="content-left">
      <div class="srarch-box">
        <a-input-search v-model:value="treeSelectKeyWord" placeholder="请输入搜索关键字" @search="onTreeSearch" />
      </div>
      <div
        v-if="taskData && taskData.length === 0"
        style="text-align: center; padding: 2em; color: rgba(5, 1, 1, 0.45)"
      >
        暂无数据
      </div>
      <Tree class="scroll-bar-customize" v-model:treeData="taskData" ref="myTree" :currentTab="currentTab" @open="openTree" v-else>
        <template v-slot:first="scope">
          <div class="task-title">
            <span class="task-icon icon-jsfx iconfont"></span>
            <span class="task-name">{{ scope.data.name ? scope.data.name : '' }}</span>
          </div>
        </template>
        <template v-slot:add="scope" v-if="currentTab === 0">
          <div class="btn-box">
            <a-button class="add-btn" @click="addOrUpdate(scope, true)">
              <span class="iconfont icon-tianjia"></span>
              添加章节
            </a-button>
          </div>
        </template>
        <template v-slot:two="scope">
          <div class="children-tree-item" @click="selectTree(scope.data)">
            <span class="iconfont icon-zhangjie"></span>
            <span class="chapter-name">{{ scope.data.data.name ? scope.data.data.name : '' }}</span>
            <span class="task-num" :class="currentTab !== 1 ? 'hover-none' : ''">
              {{ scope.data.data.contents_count }}
            </span>
            <span
              class="iconfont icon-baocun save"
              v-if="currentTab === 2"
              @click.stop="saveToMyAll(scope)"
            ></span>
            <span
              v-if="currentTab === 0"
              @click.stop="delChapter(scope.data)"
              class="iconfont icon-shanchu hover-block delete-pop"
            ></span>
            <span
              class="hover-block iconfont icon-bianji1"
              v-if="currentTab === 0"
              @click.stop="addOrUpdate(scope.data, false)"
            ></span>
            <span
              class="hover-block iconfont"
              :class="
                scope.data.data.contents_count === scope.data.data.contents_share_count
                  ? 'icon-quxiaogongxiang'
                  : 'icon-gongxiang'
              "
              v-if="currentTab === 0"
              @click.stop="shareChapter(scope.data.data)"
            ></span>
          </div>
        </template>
      </Tree>
    </div>
    <div class="content-right">
      <div v-if="isEmptyExperimental">
        <Empty :text="currentTab === 0 ? '该技术方向暂无章节，先来创建一个您需要的章节吧!' : '该技术方向暂无章节'"/>
        <div class="empty-chapter-box">
          <a-button type="primary" v-if="currentTab === 0" @click="addChapter">添加章节</a-button>
        </div>
      </div>
      <div v-else-if="!loading && !isParamSelect && experimentalDataList.length === 0">
        <Empty :text="currentTab === 0 ? '该章节暂无实验，快去创建您需要的实验吧!' : '该章节暂无实验'"/>
        <div class="empty-chapter-box">
          <a-button type="primary" v-if="currentTab === 0" @click="create">创建实验</a-button>
        </div>
      </div>
      <div v-else class="listBox">
        <a-spin :spinning="loading" size="large" tip="Loading...">
          <div class="task-type-box" v-if="TypeList.content_type">
            <span>实验类型：</span>
            <span :class="currentTaskType === 0 ? 'active' : ''" @click="taskChange(0)">全部</span>
            <span
              v-for="(value, key, index) in TypeList.content_type"
              :key="index"
              :class="currentTaskType === key ? 'active' : ''"
              @click="taskChange(key)"
            >
              {{ value }}
            </span>
          </div>
          <div class="task-rank-type-box" v-if="TypeList.content_level">
            <span>实验难度：</span>
            <span :class="currentTaskRankType === 0 ? 'active' : ''" @click="taskRankChange(0)">全部</span>
            <span
              v-for="(value, key, index) in TypeList.content_level"
              :key="index"
              :class="currentTaskRankType === key ? 'active' : ''"
              @click="taskRankChange(key)"
            >
              {{ value }}
            </span>
          </div>
          <div class="action-box">
            <div class="search-box">
              <a-input-search
                v-model:value="experimentKeyWord"
                placeholder="请输入搜索关键字查询"
                @search="onExperimentalSearch"
              />
            </div>
            <a-button v-if="currentTab === 0" type="primary" @click="create">新建实验</a-button>
          </div>
          <div class="task-list setScrollbar" :class="currentTab === 1 ? 'built-in' : ''">
            <div v-if="taskData.length > 0">
              <div>
                <div
                  class="task-item"
                  v-for="(item, index) in experimentalDataList"
                  :key="index"
                  @click="lookDetail(item)"
                >
                  <div class="task-base-name">
                    <span class="iconfont" :class="item.task_type === 1 ? 'icon-zhuomianshiyan' : 'icon-program'"></span>
                    {{ item.name }}
                  </div>
                  <div class="task-base-info">
                    <span class="class-num ">{{ item.class_cnt }}课时</span>
                    <span class="cpu hover-none">CPU:{{ item.envirment.cpu }}核</span>
                    <div class="memory hover-none">
                      <span>内存：{{ item.envirment.ram }}G</span>
                    </div>
                    <span class="disk hover-none">硬盘：{{ item.envirment.disk }}G</span>
                    <div class="hover-block">
                      <span
                        class="iconfont icon-shangyi"
                        @click.stop="sortExperimental(index, true)"
                        v-if="currentTab === 0"
                      ></span>
                      <span
                        class="iconfont icon-xiayi"
                        @click.stop="sortExperimental(index, false)"
                        v-if="currentTab === 0"
                      ></span>
                      <span
                        class="iconfont"
                        :class="item.is_share === 0 ? 'icon-gongxiang' : 'icon-quxiaogongxiang'"
                        v-if="currentTab === 0 && (item.is_final_share === 0 || item.is_share === 1)"
                        @click.stop="shareExperimental(item)"
                      ></span>
                      <span
                        class="iconfont icon-shanchu"
                        @click.stop="deleteExperimental(item)"
                        v-if="currentTab === 0"
                      ></span>

                      <span class="iconfont icon-baocun" v-if="currentTab === 2" @click.stop="saveToMy(item)"></span>
                    </div>
                  </div>
                </div>
                <Empty v-if="experimentalDataList.length === 0" />
              </div>
            </div>
          </div>
          <div v-if="experimentalDataList.length > 0" class="pagination-box">
            <a-pagination
              show-size-changer
              :total="total"
              :current="page"
              :page-size="pageSize"
              @showSizeChange="onShowSizeChange"
              @change="pageChange"
            />
          </div>
        </a-spin>
      </div>
    </div>
    <a-modal v-model:visible="visible" :title="(isEditChapter ? '编辑' : '添加')+'章节'" @ok="handleOk">
      <template #footer>
        <a-button @click="handleCancel">取消</a-button>
        <a-button type="primary" @click="handleOk">保存</a-button>
      </template>
      <a-form
        ref="formRef"
        :model="chapterInfo"
        :rules="{chapterName: {required: true,message: '请输入章节名称',trigger: 'blur'}}"
        layout="vertical"
      >
        <a-form-item label="章节名称" required name="chapterName">
          <a-input v-model:value="chapterInfo.chapterName"/>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, inject, reactive, watch, onMounted, toRefs,createVNode } from 'vue'
import request from 'src/api/index'
import { IBusinessResp } from 'src/typings/fetch.d'
import { ITeacherExperHttp, ITreeList, IListSearchInfo, IExporimentList } from './experTyping'
import Tree from 'src/components/Tree.vue'
import { MessageApi } from "ant-design-vue/lib/message";
import { ModalFunc } from "ant-design-vue/lib/modal/Modal";
import { useRoute, useRouter } from 'vue-router'
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { log } from 'console'
export default defineComponent({
  components: {
    Tree
  },
  setup() {
    let route = useRoute()
    let router = useRouter()
    const http=(request as ITeacherExperHttp).teacherExperiment
    const $message: MessageApi = inject("$message")!;
    const $confirm: ModalFunc = inject("$confirm")!;
    const tabs = [
      {
        name: '我的实验',
        componenttype: 0
      },
      {
        name: '内置实验',
        componenttype: 1
      },
      {
        name: '共享实验',
        componenttype: 2
      }
    ]
    var updata=inject('updataNav') as Function
    updata({tabs:tabs,navPosition:'outside',navType:false,showContent:false,componenttype:undefined,showNav:true,backOff:false,showPageEdit:false})
    var configuration:any=inject('configuration')

    let currentTab = ref<number>()
    let myTree = ref()
    // 当前展开的课程方向数据
    let currentCourseContent: any = {}
    // 当前课程方向索引
    let currentCourseIndex = ref<number>(0)
    // 当前章节索引
    let currentChapterIndex = ref<number>(-1)
    // 当前章节下面是否有实验
    let isEmptyExperimental = ref<boolean>(false)
    let isEmptyChapter = ref<boolean>(false)
    // 当前技术方向信息
    let currentSkillInfo = reactive({
      chapter_id: '0',
      skill_name: '',
      chapter_name: '',
    })
    // 上一次章节索引
    let lastChapterIndex = ref<number>(-1)
    // 是否带有参数查询
    let isParamSelect = ref<boolean>(false)
    // tree
    let treeSelectKeyWord = ref<string>('')
    let taskData = reactive<ITreeList[]>([])
    let currentSelectChapter = reactive({
      id: 0
    })
    function onTreeSearch() {
      experimentalTreeList()
    }
    // 获取树形结构数据
    function experimentalTreeList() {
      return new Promise((resp, reject) => {
        let param = {
          init_type: currentTab.value,
          // name: treeSelectKeyWord.value
        }
        if (treeSelectKeyWord.value) {
          // delete param.name
          param = Object.assign(param, {name: treeSelectKeyWord.value})
        }
        taskData.length = 0
        http.getExpeTreeList({param: {...param}}).then((res: IBusinessResp) => {
          // console.log(res)
          if (res && res.status === 1) {
            let Chapter=(res.data && res.data[0] && res.data[0].children && res.data[0].children[0]) || []
            taskData.push(...res.data)
            currentSelectChapter = Object.assign(currentSelectChapter, Chapter)
            getExperimentList()
            resp(true)
          } else {
            reject(false)
          }
        })
      }).catch(err => {
          console.error(err)
        })
        .finally(() => {
          // this.currentCourseContent.id ? this.recoverTreeStatus() : ''
        })
    }
    // 编辑/添加章节
    let visible = ref<boolean>(false)
    let isEditChapter = ref<boolean>(false)
    // 新增章节参数
    let chapterInfo = reactive({
      chapterName: '',
      chapterId: 0,
      parent_id: 0
    })
    function addOrUpdate(val: any, flag: boolean) {
      // console.log(val, flag)
       //flag true 添加
      isEditChapter.value = !flag
      visible.value = true
      if (!flag) {
        chapterInfo = Object.assign(chapterInfo, {chapterName: val.data.name, chapterId: val.data.id, parent_id: 0})
      } else {
        chapterInfo = Object.assign(chapterInfo, {chapterName: '', chapterId: 0, parent_id: val.data.id})
      }
      currentChapterIndex.value = val.idx ? val.idx : -1
    }
    let formRef = ref()
    function handleOk() {
      formRef.value.validate().then(() => {
        if (chapterInfo.chapterName.length > 19) {
          $message.warn('章节名称为2-19个字符')
          return
        }
        if (isEditChapter.value) {
          http.updateChapter({
            param: {name: chapterInfo.chapterName},
            urlParams: {id: chapterInfo.chapterId}
          }).then((res: IBusinessResp) => {
            $message.success('编辑章节成功')
            visible.value = false
            experimentalTreeList().then(() => {
              recoverTreeStatus()
            })
          })
        } else {
          http.addChapter({
            param: {name: chapterInfo.chapterName, parent_id: chapterInfo.parent_id},
          }).then((res: IBusinessResp) => {
              $message.success('添加章节成功')
              visible.value = false
              isEmptyExperimental.value = false
              experimentalTreeList().then(() => {
                recoverTreeStatus()
              })
              // isEmptyExperimental.value = false
              // taskData[currentCourseIndex.value].children.push({
              //   contents_count: 0,
              //   contents_share_count: 0,
              //   id: res.data.id,
              //   name: res.data.name,
              //   parent_id: res.data.parent_id,
              // })
          })
        }
      }).catch((err: any) => {
        console.log(err)
      })
    }
    function handleCancel() {
      visible.value = false
      chapterInfo.chapterName = ''
      chapterInfo.parent_id = 0
      currentChapterIndex.value = -1
      formRef.value.resetFields()
    }
    // 打开创建章节弹框
    function addChapter() {
      currentChapterIndex.value = -1
      isEditChapter.value = false
      visible.value = true
    }
    // 删除章节
    function delChapter(data: any) {
      const id = data.data.id
      if (data.data.contents_count > 0) {
        $message.warn('该章节下有实验，不可以删除')
        return
      }
      $confirm({
        title: '确定要删除这个章节吗？',
        icon: createVNode(ExclamationCircleOutlined),
        content: '删除后不可恢复',
        okText: '确认',
        cancelText: '取消',
        onOk() {
          http.deleteChapter({urlParams: {id}}).then((res: IBusinessResp) => {
              $message.success('删除章节成功')
              getExperimentList()
              experimentalTreeList().then((data:any) => {
                if (data) recoverTreeStatus()
              })
          })
        },
      })
    }
    // 分享章节 
    function shareChapter(data: any) {
      // console.log(data)
      if (data.contents_count === 0) {
        $message.warn('该章节下没有可以操作的实验')
        return
      }
      const param = {
        category_id: data.id,
        share_type: data.contents_count === data.contents_share_count ? 1 : 0,
      }
      http.shareChapter({param}).then((res: IBusinessResp) => {
          $message.success(param.share_type === 0 ? '分享成功' : '取消分享成功')
          experimentalTreeList().then((data:any) => {
            recoverTreeStatus()
          })
          getExperimentList()
      })
    }
    function saveToMyAll(val: any) {
      const data = val.data.data
      http.saveToContentAll({param: { id: data.id }}).then((res: IBusinessResp) => {
          $message.success('已保存到我的实验')
          getExperimentList()
      })
    }
    // 获取实验列表
    let ListSearchInfo = reactive<IListSearchInfo>({
      experimentKeyWord: '',
      page: 1,
      pageSize: 10,
      total: 0,
      experimentalDataList: [],
      loading: false
    })
    function getExperimentList() {
      let param = {
        category_id: currentSelectChapter.id,
        init_type: currentTab.value,
        content_type: currentTaskType.value,
        content_level: currentTaskRankType.value,
        name: ListSearchInfo.experimentKeyWord,
        page: ListSearchInfo.page,
        limit: ListSearchInfo.pageSize
      }
      if (
        currentTaskType.value !== 0 ||
        currentTaskRankType.value !== 0 ||
        ListSearchInfo.experimentKeyWord
      ) {
        isParamSelect.value = true
      } else {
        isParamSelect.value = false
      }
      ListSearchInfo.loading = true
      http.getExperimentList({param}).then((res: IBusinessResp) => {
        // console.log(res)
        ListSearchInfo.loading = false
        if (res && res.status === 1) {
          let {list, page} =res.data
          // let list=res.data.list
          ListSearchInfo.total = page.totalCount
          ListSearchInfo.experimentalDataList = list
          if (ListSearchInfo.experimentalDataList.length) {
            isEmptyExperimental.value = false
          }
        }
      })
    }
    function onExperimentalSearch() {
      getExperimentList()
    }
    // 页码发生变化时
    const pageChange = (current: number, pageSize: number) => {
      // console.log(current, pageSize)
      ListSearchInfo.page = current
      ListSearchInfo.pageSize = pageSize
      getExperimentList()
    }
    // pageSize 变化的回调
    const onShowSizeChange = (current: number, pageSize: number) => {
      // console.log(current, pageSize)
      ListSearchInfo.page = current
      ListSearchInfo.pageSize = pageSize
      getExperimentList()
    }
    // 实验上下排序
    function sortExperimental(i: number, flag: boolean) {
      const param = {
        up_id: 0,
        down_id: 0,
      }

      if (flag) {   // shangyi
        param.up_id = ListSearchInfo.experimentalDataList[i].id
        if (ListSearchInfo.experimentalDataList[i - 1]) {
          param.down_id = ListSearchInfo.experimentalDataList[i - 1].id
        } else {
          $message.warn('已是最顶端数据')
          return
        }
      } else {
        if (ListSearchInfo.experimentalDataList[i + 1]) {
          param.up_id = ListSearchInfo.experimentalDataList[i + 1].id
        } else {
          $message.warn('已是最底端数据')
          return
        }

        param.down_id = ListSearchInfo.experimentalDataList[i].id
      }
      http.sortExperimental({param}).then((res: IBusinessResp) => {
          $message.success('实验顺序交换成功')
          if (flag) {
            // console.log(i)
            // console.log('上移')
            // moveUp(this.experimentalDataList, i)
            ListSearchInfo.experimentalDataList[i - 1] = ListSearchInfo.experimentalDataList.splice(i, 1, ListSearchInfo.experimentalDataList[i - 1])[0]
          } else {
            // console.log(i)
            // console.log('下移')
            // moveDown(this.experimentalDataList, i)
            ListSearchInfo.experimentalDataList[i + 1] = ListSearchInfo.experimentalDataList.splice(i, 1, ListSearchInfo.experimentalDataList[i + 1])[0]
          }
          // this.experimentalList()
      })
    }
    // 共享/取消共享实验
    function shareExperimental(data: any) {
      if (data.is_final_share > 0) {
        $message.warn('该实验不可共享')
        return
      }
      const param = {
        id: data.id,
        share_type: data.is_share,
      }
      http.shareExperimental({param}).then((res: IBusinessResp) => {
          if (data.is_share === 0) {
            $message.success('共享成功')
          } else {
            $message.success('取消共享成功')
          }
          getExperimentList()
          experimentalTreeList().then((data:any) => {
            if (data) {
              recoverTreeStatus()
            }
          })
      })
    }
    // 删除实验
    function deleteExperimental(data: any) {
      $confirm({
        title: '确定要删除这个实验吗？',
        content: '删除后不可恢复',
        icon: createVNode(ExclamationCircleOutlined),
        okText: '确认',
        cancelText: '取消',
        onOk() {
          http.deleteExperimental({urlParams: {id: data.id}}).then((res: IBusinessResp) => {
              $message.success('删除成功')
              getExperimentList()
              experimentalTreeList().then((data:any) => {
                if (data) {
                  recoverTreeStatus()
                }
              })
          })
        },
      })
    }
    // 保存到我的实验
    function saveToMy(val: any) {
      // console.log(val)
      http.saveToContent({param: {id: val.id }}).then((res: any) => {
        // console.log(res)
        $message.success('已保存到我的实验')
        getExperimentList()
      })
    }
    // 初始化
    function init() {
      getSearchInfo()
      experimentalTreeList().then(res => {
        if (route.query.course_index && route.query.chapter_index) {
          currentCourseIndex.value = Number(route.query.course_index)

          currentChapterIndex.value = Number(route.query.chapter_index)
          let Id=taskData[currentCourseIndex.value].children && taskData[currentCourseIndex.value].children[currentChapterIndex.value] && taskData[currentCourseIndex.value].children[currentChapterIndex.value].id
          currentSelectChapter.id = Id
          // console.log(currentCourseIndex, currentChapterIndex)  ExperimentDetaile
          recoverTreeStatus()
          getExperimentList()
        } else {
          if (res) {
            myTree.value.init()
            initExperimental()
          }
        }
      })
    }
    // 初始化实验列表
    function initExperimental(val?: any) {
      currentTaskType.value = 0
      currentTaskRankType.value = 0
      ListSearchInfo.experimentKeyWord = ''
      ListSearchInfo.page = 1
      ListSearchInfo.pageSize = 10
      if (val) {
        if (val.children.length > 0) {
          isEmptyExperimental.value = false
          currentSelectChapter.id = val.children[0].id
          myTree.value.active(val.children[0])
          currentSkillInfo.chapter_id = val.children[0].id
          currentSkillInfo.chapter_name = val.children[0].name
          currentSkillInfo.skill_name = val.name
          lastChapterIndex.value = 0

          getExperimentList()
        } else {
          isEmptyExperimental.value = true
          chapterInfo.parent_id = val.id
          // console.log('无数据')
        }
        // console.log(this.experimentalSelectParam.category_id)
      } else {
        if (taskData[0] && taskData[0].children && taskData[0].children[0]) {
          isEmptyExperimental.value = false
          currentSelectChapter.id = taskData[0].children[0].id
          currentSkillInfo = Object.assign(currentSkillInfo, {
            chapter_id: taskData[0].children[0].id,
            chapter_name: taskData[0].children[0].name,
            skill_name: taskData[0].name
          })
          currentCourseContent = Object.assign(currentCourseContent, taskData[0])
          currentCourseIndex.value = 0
          lastChapterIndex.value = 0
          getExperimentList()
        } else {
          isEmptyExperimental.value = true
          // this.addChapterParam.parent_id = val.id
          // console.log('wushuju')
        }
      }
    }
    watch(()=>configuration.componenttype, (newVal) => {
      if (typeof(newVal) === 'number') {
        currentTab.value = newVal
        init()
      }
      
      if (newVal == 0) {
        // 我的实验
        // console.log(newVal)
      } else if (newVal == 1) {
        // 内置实验
      } else {
        // 共享实验
      }
    })
    onMounted(() => {
      currentTab.value = route.query.currentTab ? Number(route.query.currentTab) : 0
      init()
    })
    // 获取实验类型和难度
    let TypeList = reactive({
      content_level: [],
      content_type: [],
    })
    function getSearchInfo() {
      http.getSearchInfo({param: {init_type: currentTab.value}}).then((res: IBusinessResp) => {
        // console.log(res)
        if(res && res.data){
          TypeList.content_type = res.data.content_type
          TypeList.content_level = res.data.content_level
        }
      })
    }
    let currentTaskType = ref<number>(0)
    let currentTaskRankType = ref<number>(0)
    function taskChange(type: number) {
      ListSearchInfo.page = 1
      currentTaskType.value = type
      getExperimentList()
    }
    // 实验难度发生变化时
    function taskRankChange(type: number) {
      ListSearchInfo.page = 1
      currentTaskRankType.value = type
      getExperimentList()
    }
    // 选择章节
    function selectTree(data: any) {
      // console.log(data)
      if (currentSelectChapter.id === data.data.id) {
        return
      } else {
        currentTaskType.value = 0
        currentTaskRankType.value = 0
        ListSearchInfo.experimentKeyWord = ''
        isEmptyExperimental.value = false
      }
      currentChapterIndex.value = data.idx
      lastChapterIndex.value = data.idx
      currentSkillInfo.chapter_id = data.data.id
      currentSkillInfo.skill_name = data.parent.name
      currentSkillInfo.chapter_name = data.data.name
      currentSelectChapter.id = data.data.id
      getExperimentList()
    }
    // 打开tree下拉
    function openTree(val: any, index: number) {
      currentCourseIndex.value = index
      currentCourseContent = Object.assign(currentCourseContent, val)
      lastChapterIndex.value = 0
      // console.log(val, index)
      initExperimental(val)
    }
    // 恢复上次展开的树
    function recoverTreeStatus() {
      if (route.query.course_index && route.query.chapter_index) {
        myTree.value.resetSelect(taskData[currentCourseIndex.value].id)
        myTree.value.resetSelectChapter(
          taskData[currentCourseIndex.value].children[
            currentChapterIndex.value !== -1 ? currentChapterIndex.value : lastChapterIndex.value
          ].id,
        )
        return 
      }
      myTree.value.resetSelect(currentCourseContent.id)
      // console.log(currentCourseContent)
      let index=currentChapterIndex.value !== -1 ? currentChapterIndex.value : lastChapterIndex.value
      let Id=currentCourseContent.children && currentCourseContent.children[index] && currentCourseContent.children[index].id
      myTree.value.resetSelectChapter(Id)
    }
    onMounted(() => {
      
    })
    function create() {
      // console.log('创建实验')
      router.push({
        path: '/teacher/teacherExperiment/creatExperiment',
        query: {
          chapter_id: currentSkillInfo.chapter_id,
          chapter_name: currentSkillInfo.chapter_name,
          skill_name: currentSkillInfo.skill_name,
          course_index: currentCourseIndex.value.toString(),
          chapter_index: currentChapterIndex.value.toString(),
        },
      })
    }
    // 查看实验详情
    function lookDetail(val: IExporimentList) {
      // console.log(val, '查看实验详情')
      // console.log(currentTab.value)
        //     tab_type: this.currentTab === 0 ? 'me' : this.currentTab === 1 ? 'init' : 'share',
      //     task_type: val.task_type,
      router.push({
        path: '/teacher/teacherExperiment/ExperimentDetail',
        query: {
          id: val.id,
          currentTab: currentTab.value,
        },
      })
    }
    return {
      myTree,
      currentTab,
      treeSelectKeyWord,
      onTreeSearch,
      taskData,
      openTree,
      chapterInfo,
      addOrUpdate,
      isEditChapter,
      visible,
      addChapter,
      handleCancel,
      handleOk,
      delChapter,
      shareChapter,
      saveToMyAll,
      formRef,
      selectTree,
      TypeList,
      currentTaskType,
      taskChange,
      currentTaskRankType,
      taskRankChange,
      isEmptyExperimental,
      isParamSelect,
      ...toRefs(ListSearchInfo),
      onExperimentalSearch,
      pageChange,
      onShowSizeChange,
      sortExperimental,
      shareExperimental,
      deleteExperimental,
      saveToMy,
      create,
      lookDetail,
    }
  },
})
</script>
<style lang="less" scoped>
@import url('./experimentalList.less');
</style>

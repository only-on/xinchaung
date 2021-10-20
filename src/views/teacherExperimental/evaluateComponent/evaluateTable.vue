<template>
  <div class="evaluate-table">
    <a-table 
      :rowKey="rowkey"
      :dataSource="tableList" 
      :columns="columns" 
      :bordered="true"
      :pagination="false"
      :row-selection="rowSelection"
      v-if="tableList.length"
    >
      <template #time="{ record }">
        <span>{{ record.time || '--'}}</span>
      </template>
      <template #class="{ record }">
        <span>{{ record.class || '--'}}</span>
      </template>
      <template #achievements="{ record }">
        <span class="operation-btn" @click="lookAchievements(236 || record.id)">查看</span>
      </template>
      <template #video="{ record }">
        <span class="operation-btn" @click="lookVideo(record.id)">查看</span>
      </template>
      <template #report="{ record }">
        <span class="operation-btn" @click="lookReport(record.id)">查看</span>
      </template>
      <template #result="{ record }">
        <span class="" v-if="record.score">{{record.score}}分</span>
        <span class="operation-btn" v-if="record.score" @click="editScore(record)">修改</span>
        <span class="operation-btn" v-else @click="Review(record.id)">批阅</span>
      </template>
      <template #env="{ record }">
        <span class="operation-btn disabled" @click="reset(record)">重置</span>
      </template>
    </a-table>
    <Empty v-else/>
    <div class="page-footer-box">
        <!-- show-quick-jumper  -->
      <a-pagination
        v-model:current="page.page" 
        :pageSize="page.pageSize" 
        :total="total" 
        @change="pageChange" 
        :hideOnSinglePage="true"
      />
    </div>
  </div>
  <a-modal v-model:visible="visible" title="请输入分数：" @ok="handleOk" :width="420">
    <a-input-number v-model:value="score" :min="0" :max="100" style='width:100%'/>
  </a-modal>
  <look-achievements-modal 
    :isShowAchievements="isShowAchievements" 
    :lookAchievementsInfo="lookAchievementsInfo"
    @close="lookAchievementsClose"
  ></look-achievements-modal>
  <look-report-modal
    :isShowReport="isShowReport" 
    :reportUrl="reportUrl"
    @close="lookReportClose"
  ></look-report-modal>
  <look-video-modal
    v-model:isShowVideo="isShowVideo" 
    :videoUrl="videoUrl"
  ></look-video-modal>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, PropType, ref } from 'vue'
import request from 'src/api/index'
import { IBusinessResp } from 'src/typings/fetch.d'
import { ITeacherExperimentalHttp } from './../typings'
import { message } from 'ant-design-vue'
import lookAchievementsModal from './lookAchievementsModal.vue'
import lookReportModal from './lookReportModal.vue'
import lookVideoModal from './lookVideoModal.vue'

export default defineComponent({
  components: { lookAchievementsModal, lookReportModal, lookVideoModal },
  props: {
    trainId: {
      type: String
    },
    tableList: {
      type: Array as PropType<ITableList[]>,
      default: []
    },
    total: {
      type: Number,
      default: 0
    },
    selectedRows: {
      type: Array as PropType<ITableList[]>,
      default: []
    },
  },
  emits: ['update:selectedRows', 'pageChange'],
  setup(props, {emit}) {
    const data = reactive<IData>({
      // tableList: [],
      page: {
        page: 1,
        pageSize: 10,
      }
    })
    const http=(request as ITeacherExperimentalHttp).teacherExperimental
    const columns = [
      {
        title: '学号',
        dataIndex: 'num',
        key: 'num',
      },
      {
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '花费时间',
        dataIndex: 'time',
        key: 'time',
        slots: { customRender: 'time' },
      },
      {
        title: '实训成果',
        dataIndex: 'achievements',
        key: 'achievements',
        slots: { customRender: 'achievements' },
        width: 120,
      },
      {
        title: '操作视频',
        dataIndex: 'video',
        key: 'video',
        slots: { customRender: 'video' },
        width: 120,
      },
      {
        title: '实训报告',
        dataIndex: 'report',
        key: 'report',
        slots: { customRender: 'report' },
        width: 120,
      },
      {
        title: '所属班级',
        dataIndex: 'class',
        key: 'class',
        slots: { customRender: 'class' },
      },
      {
        title: '实训成绩',
        dataIndex: 'result',
        key: 'result',
        slots: { customRender: 'result' },
        width: 120,
      },
      {
        title: '实训环境',
        dataIndex: 'env',
        key: 'env',
        slots: { customRender: 'env' },
        width: 120,
      },
    ]
    let isShowVideo = ref(false)
    // 操作处理
    const operationHandle = reactive({
      // 查看成果
      isShowAchievements: false,
      lookAchievementsInfo: {},
      lookAchievements: (id: number) => {
        console.log(id)
        operationHandle.lookAchievementsInfo = {}
        http.showExperimentalNote({param: {train_student_id: id}})
          .then((res: any) => {
            operationHandle.isShowAchievements = true
            console.log(res.datas || res.data && res.data.length)
            if (res.datas || res.data && res.data.length) {
              console.log(res.datas)
              operationHandle.lookAchievementsInfo = res.datas
            } else {
              message.warn('暂无实训成果！')
            }
          })
      },
      lookAchievementsClose: () => {
        operationHandle.isShowAchievements = false
      },
      // 查看视频
      videoUrl: '',
      lookVideo: (id: number) => {
        if (!id) {
          message.warn('服务器没有该文件！')
          return
        }
        isShowVideo.value = true
        operationHandle.videoUrl = '/src/assets/video.mp4'
      },
      // 查看报告
      isShowReport: false,
      reportUrl: '',
      lookReport: (id: number) => {
        if (!id) {
          message.warn('服务器没有该文件！')
          return
        }
        operationHandle.reportUrl = 'http://192.168.101.150/upload/train_html/50243/16322969161533.pdf'
        operationHandle.isShowReport = true
      },
      lookReportClose: () => {
        operationHandle.isShowReport = false
      },
      // 批阅
      visible: false,
      score: 0,
      contentId: 0,
      Review: (id: number) => {
        operationHandle.visible = true
        operationHandle.contentId = id
      },
      handleOk: () =>{
        http.setExperimentalScore({
          param: {
            // train_student_content_id: operationHandle.contentId,
            train_student_content_id: 84,
            score: operationHandle.score
          }
        }).then((res: IBusinessResp) => {
          console.log(res)
          operationHandle.score = 0
          operationHandle.visible = false
          // emit('pageChange', data.page.page)
        })
      },
      editScore: (list: ITableList) => {
        operationHandle.visible = true
        operationHandle.contentId = list.id
        operationHandle.score = list.score
      },
      // 重置
      reset: (list: ITableList) =>{
        http.resetExperimentalServer({
          param: {
            train_id: props.trainId,
            train_student_content_id: list.id
          }
        }).then((res: IBusinessResp) => {
          console.log(res, data.page.page)
          // emit('pageChange', data.page.page)
        })
      }
    })
    // 页码发生变化时
    const pageChange = (page: number, pageSize: number) => {
      data.page.page = page
      data.page.pageSize = pageSize
      emit('pageChange', page)
    }
    // pageSize 变化的回调
    const onShowSizeChange = (current: number, size: number) => {
      data.page.page = current
      data.page.pageSize = size
    }
    
    const rowSelection = {
      onChange: (selectedRowKeys: (string | number)[], selectedRows: ITableList[]) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows, 1);
        emit('update:selectedRows', selectedRows)
      },
      onSelect: (record: ITableList, selected: boolean, selectedRows: ITableList[]) => {
        console.log(record, selected, selectedRows, 2);
      },
      onSelectAll: (selected: boolean, selectedRows: ITableList[], changeRows: ITableList[]) => {
        console.log(selected, selectedRows, changeRows, 3);
      },
    };
    const rowkey = (record: {}, index: number) => {
      return index
    }
    return {
      ...toRefs(props),
      ...toRefs(data),
      ...toRefs(operationHandle),
      columns,
      pageChange,
      onShowSizeChange,
      rowkey,
      rowSelection,
      isShowVideo,
    }
  },
})
  interface ITableList {
    id: number
    num: number
    name: string
    time: string
    achievements: string
    video: string
    report: string
    class: string
    result: number
    env: number
    score: number
  }
  interface IPage {
    page: number
    pageSize: number
    // total: number
  }
  interface IData {
    // tableList: ITableList[],
    page: IPage
  }
</script>

<style lang="less" scoped>
.theme-color{
  color: @theme-color;
}
.evaluate-table {
  .operation-btn {
    cursor: pointer;
    .theme-color();
    &.disabled {
      color: #949494;
      overflow: hidden;
      cursor: not-allowed;
    }
  }
  .page-footer-box {
    margin-top: 28px;
    text-align: center;
    margin-bottom: 48px;
  }
}

:deep(.ant-modal) {
  :deep(.ant-input-number) {
    width: 100%;
  }
}
:deep(.ant-modal-body) {
  height: 750px;
}
</style>
<template>
 <div>
    <div
      class="task-item"
      v-for="(item, index) in taskData"
      :key="index"
      :class="item.name ? 'add-file-item' : ''"
    >
      <p>任务{{ NumberToChinese(index) }}</p>
      <div class="task-item-content">
        <div class="task-left">
          <div class="task-file">
            <label>
              <i>*</i>
              ipynb文件
            </label>
            <div class="upload-file-box">
              <div v-if="item.name" class="file-info">
                <span>
                  {{ item.name }}
                  <!-- <a-icon v-if="!item.status" type="loading" /> -->
                </span>
                <span class="iconfont icon-shanchu" @click="removeFile(index)"></span>
              </div>
              <a-upload
                v-else
                name="file"
                :show-upload-list="false"
                accept=".ipynb"
                :multiple="false"
                :before-upload="beforeUpload"
              >
                <a-button type="primary">选择文件</a-button>
              </a-upload>
            </div>
          </div>
        </div>
        <div class="task-right">
          <span v-if="item.name && index === taskData.length - 1" class="iconfont icon--tainjia" @click="addFile"></span>
          <span
            v-if="!item.name && taskData.length !== 1"
            class="iconfont icon-shanchu"
            @click="deleteFile(index)"
          ></span>
        </div>
      </div>
    </div>
 </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, toRefs, onMounted, provide, inject, watch, nextTick, PropType } from 'vue'
import { MessageApi } from "ant-design-vue/lib/message";
import request from 'src/api/index'
import { IBusinessResp } from 'src/typings/fetch.d'
import { ITeacherExperHttp, ITreeList, IListSearchInfo, IExporimentList } from './../experTyping'

export default defineComponent({
  name: '',
  components: {},
  props: {
    taskData: {
      type: Array as PropType<ITaskList[]>,
      default: []
    },
    jupyterUuid: String as any
  },
  // emit: [],
  setup(props, {emit}) {
    const $message: MessageApi = inject("$message")!;
    const http=(request as ITeacherExperHttp).teacherExperiment
    // watch(
    //   () => props.title,
    //   (newVal) => {

    //   },
    //   {deep: true}
    // )
    function beforeUpload(file: any, fileList: any) {
      // console.log(file, fileList)
      let arr = file.name.split('.')
      if (arr[arr.length - 1] !== 'ipynb') {
        $message.warn('请上传jupyter')
        return
      }
      props.taskData[props.taskData.length-1].status = false
      props.taskData[props.taskData.length-1].name = file.name
      // emit('update:taskData', props.taskData) 
      // console.log(111)
      const fs = new FormData()
      fs.append('jupyter_file', file)
      fs.append('taskfile_subdir', props.jupyterUuid)
      // console.log(fs)
      // console.log(http)
      // return
      http.uploadTaskFile({param: fs}).then((res: any) => {
          props.taskData[props.taskData.length-1].status = true
          props.taskData[props.taskData.length-1].data = res.data
      })
    }
    function addFile() {
      props.taskData?.push({ name: '', file: '', status: false,data:{} })
    }
    function deleteFile(i: number) {
      props.taskData?.splice(i, 1)
    }
    function removeFile(i: number) {
      props.taskData[i].name = ''
      props.taskData[i].status = false
    }
    function NumberToChinese(num: any) {
      var chnNumChar = [
        '一',
        '二',
        '三',
        '四',
        '五',
        '六',
        '七',
        '八',
        '九',
        '十',
        '十一',
        '十二',
        '十三',
        '十四',
        '十五',
        '十六',
        '十七',
        '十八',
        '十九',
        '二十',
      ]
      return chnNumChar[num] ? chnNumChar[num] : '更多'
    }
    return {
      NumberToChinese,
      addFile,
      deleteFile,
      beforeUpload,
      removeFile,
    }
  },
})
interface ITaskList {
  name: string
  file: string
  status: boolean
  data?: any
}
</script>

<style lang="less" scoped>
.task-item {
      >p {
        color: rgba(5, 1, 1, 0.45);
        font-size: 14px;
      }

      .task-item-content {
        display: flex;
        justify-content: space-between;
        flex-direction: row;
        margin-bottom: 10px;
        background-color: #f4f4f4;
      }

      .task-left {
        width: 100%;
        display: flex;
        flex-direction: row;

        label {
          display: inline-block;
          flex-shrink: 0;
          margin: auto 0;
          margin-right: 5px;
        }

        .task-name {
          width: 50%;
          padding: 11px 26px 11px 18px;
          display: flex;
          flex-direction: row;

          .taskName {
            display: inline-block;
          }
        }

        .task-file {
          width: 50%;
          padding: 11px 18px 11px 26px;
          display: flex;
          flex-direction: row;

          .upload-file-box {
            width: 100%;
            line-height: 32px;

            .file-info {
              display: flex;
              flex-direction: row;
              width: 100%;
              justify-content: space-between;
              background-color: #dedede;
              padding: 0 9px;

              >span {
                margin: auto 0;
                font-size: 12px;
                color: #000000;

                &.icon-shanchu {
                  cursor: pointer;
                }
              }
            }
          }
          label i {
            color: #ff0918;
          }
        }
      }

      .task-right {
        width: 18px;
        margin: auto 0;
        margin-left: 10px;
        flex-shrink: 0;

        span {
          color: @theme-color;
          cursor: pointer;
          font-size: 18px;
        }
      }
    }
</style>

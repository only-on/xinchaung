<template>
<a-modal 
    class="detail-modal" 
    title="编辑基础信息" 
    :visible="detailVisible" 
    @cancel="cancelHandle()"
    @ok="submitHandle()"
    :width="800"
  >
  <a-form :model="detailState">
    <div class="list">
      <a-form-item label="课程名称" required>
        <a-input v-model:value="detailState.name"/>
      </a-form-item>
      <a-form-item label="课程方向" required>
        <a-select v-model:value="detailState.course_category_id" placeholder="please select your zone">
          <a-select-option v-for="v in categoriesList" :value="v.id" :key="v.id">{{v.name}}</a-select-option>
        </a-select>
      </a-form-item>
    </div>
    <div class="time-direction">
      <div class="time">
        <a-form-item label="开始时间">
          <a-date-picker
            v-model:value="detailState.start_time"
            format="YYYY-MM-DD"
            :disabled-date="disabledDate"
            :allowClear="false"
          />
        </a-form-item>
        <a-form-item label="结束时间">
          <a-date-picker
            v-model:value="detailState.end_time"
            format="YYYY-MM-DD"
            :disabled-date="disabledDate"
            :allowClear="false"
          />
        </a-form-item>
      </div>
      <a-form-item label="课程方向">
        <a-select v-model:value="detailState.course_direction_id" placeholder="please select your zone">
          <a-select-option v-for="v in directionsList" :value="v.id" :key="v.id">{{v.name}}</a-select-option>
        </a-select>
      </a-form-item>
    </div>
    <div class="introduce">
      <a-form-item label="课程介绍">
        <a-textarea
          v-model:value="detailState.introduce"
          placeholder="请输入课程介绍"
          :rows="3"
        />
        
          <!-- :auto-size="{ minRows: 3, maxRows: 5 }" -->
      </a-form-item>
    </div>
    <div class="img">
      <a-form-item label="课程封面">
        <div class="tip-cover">支持格式:jpg、png，限制尺寸525*300px</div>
          <!-- <upload-image uploadSrc="/api/course/courses/upload" v-model="formData.url" /> -->
          <a-radio-group v-model:value="detailState.url">
            <a-upload
             v-if="!imgSrc"
              accept=".jpg,.png,.image"
              :show-upload-list="false"
              :before-upload=beforeUpload>
              <div class="upload-box">
                <!-- <span class="icon-loading iconfont"></span> -->
                <div class="upload-btn">
                  <span class="icon-tianjia iconfont"></span>
                  <p>上传图片</p>
                </div>
              </div>
            </a-upload>
            <label class='upload-img' v-if="imgSrc">
              <img class="" :src=imgSrc alt="" />
              <a-radio class="" :value=imgSrc></a-radio>
              <span @click=deleteImg() class='icon-shanchu iconfont'></span>
            </label>
            <label class='upload-img' v-for="v in defaultImg" :key=v.id>
              <img class="" :src=v.src alt="" />
              <a-radio class="" :value=v.src></a-radio>
            </label>
          </a-radio-group>
      </a-form-item>
    </div>
  </a-form>
  </a-modal>
</template>
<script lang="ts">
import moment, { Moment } from 'moment';
import request from 'src/api/index'
import { ICourseAnalysisHttp } from './typings'
import { IBusinessResp } from 'src/typings/fetch.d'
import { defineComponent, onMounted, PropType, reactive, toRaw, toRefs, UnwrapRef, ref } from 'vue';
import { message } from 'ant-design-vue'
interface Idetail {
  name: string;
  course_category_id: number;
  course_direction_id: number;
  desc: string;
  start_time: string;
  end_time: string;
  introduce: string;
  url: string;
}
interface FormState {
  name: string;
  course_category_id: number;
  course_direction_id: number;
  desc: string;
  start_time: Moment;
  end_time: Moment;
  introduce: string;
  url: string;
}
export default defineComponent({
  props: {
    courseId:Number,
    detail: {
      type: Object as PropType<Idetail>,
      default: {}
    },
    detailVisible: {
      type: Boolean
    }
  },
  emit: ['cancelDetail'],
  setup(props, {emit}) {
    const http=(request as ICourseAnalysisHttp).teacherCourseAnalysis
    let detailState: UnwrapRef<FormState> = reactive({
      name: props.detail.name,
      course_category_id: props.detail.course_category_id,
      course_direction_id: props.detail.course_direction_id,
      desc: props.detail.desc,
      start_time: moment(props.detail.start_time),
      end_time: moment(props.detail.end_time),
      introduce: props.detail.introduce,
      url: props.detail.url
    });
    // 获取课程方向
    let directionsList = ref([{name: '', id: 0}])
    const getDirections = () => {
      http.getCourseDirections().then((res: IBusinessResp) => {
        console.log(res)
        directionsList.value = res.data
      })
    }
    // 获取职业方向
    let categoriesList = ref([{name: '', id: 0}])
    const getCategories = () => {
      http.getCourseCategories().then((res: IBusinessResp) => {
        console.log(res)
        categoriesList.value = res.data
      })
    }

    let imgSrc = ref('')
    let selectedImg = ref('')
    let dev_base_url = import.meta.env.VITE_APP_BASE_API || ''
    const beforeUpload = (file: any) => {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
      if (!isJpgOrPng) {
        message.error({ content: '只能上传图片!', duration: 2 })
      }

      if (isJpgOrPng) {
        console.log('ooooo')
        // this.loading = true
        const fd = new FormData()
        fd.append('file', file)
        http.uploadImg({param: fd}).then((res: IBusinessResp) => {
          console.log(res)
          if (res.status) {
            imgSrc.value = dev_base_url+res.data.url
            detailState.url = imgSrc.value
          }
        })
      }
      return false
    }
    const deleteImg = () => {
      imgSrc.value = ''
    }
    let sign = '/v0.1.0'
    // console.log(dev_base_url)
    let defaultImg = ref([
      {
        id: 0,
        src: `/src/assets/images/default/d1.jpg`,
      },
      {
        id: 1,
        src: `/src/assets/images/default/d2.jpg`,
      },
      {
        id: 2,
        src: `/src/assets/images/default/d3.jpg`,
      },
      {
        id: 3,
        src: `/src/assets/images/default/d4.jpg`,
      },
      {
        id: 4,
        src: `/src/assets/images/default/d5.jpg`,
      },
    ])
    
    // 确定
    const submitHandle = () => {
      console.log('ok', moment(detailState.start_time).format('YYYY-MM-DD 00:00:00'))
      http.editCourse({
        param: {
          name: detailState.name,
          course_category_id: detailState.course_category_id,
          course_direction_id: detailState.course_direction_id,
          desc: detailState.desc,
          start_time: moment(detailState.start_time).format('YYYY-MM-DD 00:00:00'),
          end_time: moment(detailState.end_time).format('YYYY-MM-DD 23:59:59'),
          introduce: detailState.introduce,
          url: detailState.url
        },
        urlParams: {
          courseId: props.courseId
        }
      }).then((res: IBusinessResp) => {
        console.log(res)
        if (res.status) {
          emit('cancelDetail', res.data)
        }
      })
    }
    // 取消
    const cancelHandle = () => {
      imgSrc.value = ''
      
      emit('cancelDetail')
    }

    const disabledDate = (current: Moment) => {
      // Can not select days before today and today
      return current && current < moment().endOf('day').subtract(1, 'days')
    };
    const range = (start: number, end: number) => {
      const result = [];
      for (let i = start; i < end; i++) {
        result.push(i);
      }
      return result;
    };
    const disabledDateTime = () => {
      return {
        disabledHours: () => range(0, 24).splice(4, 20),
        disabledMinutes: () => range(30, 60),
        disabledSeconds: () => [55, 56],
      };
    };

    onMounted(() =>{
      getDirections()
      getCategories()
    })
    return {
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      disabledDate,
      disabledDateTime,
      moment,
      ...toRefs(props),
      detailState,
      directionsList,
      categoriesList,
      beforeUpload,
      deleteImg,
      imgSrc,
      selectedImg,
      defaultImg,
      submitHandle,
      cancelHandle
    };
  },
});
</script>

<style lang="less" scoped>
:deep(.ant-form) {
  
  
}
:deep(.ant-col) {
  & > label {
    color: rgba(0,0,0,.85);
    font-size: 14px;
  }
} 
  .ant-input,
  :deep(.ant-calendar-picker) .ant-input ,
  :deep(.ant-select-selection-item){
    color: rgba(0,0,0,.45);
    font-size: 14px;
  }
  .ant-select-selection-item {
    color: rgba(0,0,0,.45);
  } 
.list {
  display: flex;
  justify-content: space-between;
  :deep(.ant-row)  {
    flex-direction: column;
    width: 48%;
    .ant-col {
      text-align: left;
      margin-bottom: 12px;
    }
  }
}
.time-direction {
  display: flex;
  justify-content: space-between;
  .time {
    display: flex;
    justify-content: space-between;
    width: 48%;
    .ant-row.ant-form-item {
      width: 45%;
    }
  }
  & > .ant-row.ant-form-item {
    width: 48%;
  }
  :deep(.ant-row)  {
    flex-direction: column;
    .ant-col {
      text-align: left;
      margin-bottom: 12px;
    }
  }
}
.introduce {
  :deep(.ant-row) {
    display: block;
  }
}
.img {
  :deep(.ant-row) {
    display: block;
  }
  .tip-cover {
    margin-bottom: 12px;
    margin-top: -18px;
    margin-left: 78px;
    font-size: 12px;
    color: rgba(0,0,0,.65);
  }
  :deep(.ant-radio-group) {
    display: flex;
    width: 100%;
    flex-direction: row;
    flex-wrap: wrap;
    &>span {
      height: 135px;
      width: 33.333%;
      display: inline-block;
      position: relative;
      margin-bottom: 14px;
      border: 1px dashed @theme-color;
      border-radius: 5px;
    }
    .upload-img {
      height: 135px;
      width: 33.333%;
      display: inline-block;
      margin-bottom: 14px;
      position: relative;
      &:nth-child(3n) {
        padding-left: 14px;
      }
      &:nth-child(3n-1) {
        padding-left: 14px;
      }
      & > img {
        display: inline-block;
        width: 100%;
        height: 135px;
        border-radius: 5px;
      }
      .ant-radio-wrapper {
        position: absolute;
        top: 3px;
        right: 8px;
        margin-left: 10px;
        padding: 8px;
        font-size: 12px;
      }
      .iconfont {
        display: none;
        color: @theme-color;
        cursor: pointer;
        position: absolute;
        bottom: 5px;
        right: 15px;
      }
      &:hover {
        .iconfont {
          display: block;
        }
      }
    }
  }
  :deep(.ant-upload) {
    display: inline-block;
    height: 135px;
    width: 100%;
    .upload-box {
      height: 100%;
    }
    .upload-btn {
      display: flex;
      height: 100%;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
      .iconfont {
        font-size: 24px;
        color: @theme-color;
      }
      p {
        font-size: 14px;
        color: @theme-color;
        margin-top: 10px;
      }
    }
  }
}
</style> 
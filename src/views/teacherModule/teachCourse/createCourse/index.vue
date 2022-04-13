<template>
  <div class="create-course-box">
    <a-steps :current="currentStep" class="create-steps-box">
      <template #progressDot="{ prefixCls }">
        <span :class="`${prefixCls}-icon-dot`" />
      </template>
      <a-step title="设置基本信息" />
      <a-step title="设置课程实验" />
      <a-step title="设置课程成员" />
      <a-step title="完成" />
    </a-steps>
    <div class="create-course-main">
      <template v-if="currentStep === 0">
        <a-form :layout="'vertical'" :rules="rules" :model="formState" ref="formRef">
          <div class="info">
            <div class="left">
              <a-form-item label="课程名称" name="name">
                <a-input v-model:value="formState.name" placeholder="请输入课程名称" />
              </a-form-item>
              <a-form-item label="起始时间" name="date">
                <a-range-picker @change="dateChange">
                  <template #suffixIcon>
                    <SmileOutlined />
                  </template>
                </a-range-picker>
              </a-form-item>
              <a-form-item label="课程方向" name="direction">
                <a-select v-model:value="formState.direction" placeholder="请选择课程方向">
                  <a-select-option :value="item.name" v-for="(item, index) in courseDirection" :key="item.name">
                      {{ item.name }}
                    </a-select-option>
                </a-select>
              </a-form-item>
              <a-form-item label="职业方向" name="direction">
                <a-select v-model:value="formState.direction" placeholder="请选择职业方向">
                  <a-select-option :value="item.name" v-for="(item, index) in vocationDirection" :key="item.name">
                      {{ item.name }}
                    </a-select-option>
                </a-select>
              </a-form-item>
              <a-form-item label="添加标签" name="tags">
                <div>
                    <LabelList :tag="formState.tags" :recommend="formState.recommend" />
                  </div>
              </a-form-item>
              <a-form-item label="封面图" class="cover">
                <!-- <img v-if="imageUrl" :src="imageUrl" alt="" srcset="">
                <a-upload v-model:file-list="fileList" list-type="picture" class="uploader" :show-upload-list="false" :before-upload="beforeUpload" @change="handleChange">
                  <div class="upload">
                    <div class="cover">
                      <img src="src/assets/images/teacherMaterialResource/cover.png" alt="">
                    </div>
                    <loading-outlined v-if="coverLoading"></loading-outlined>
                  </div>
                </a-upload> -->
              </a-form-item>
            </div>
            <div class="right">
              <a-form-item label="可见范围" name="is_public" class="visible-range">
                <a-select v-model:value="formState.is_public">
                  <a-select-option :value="1">
                    <span class="name">公开</span>
                    <span class="tips">所有人可见</span>
                  </a-select-option>
                  <a-select-option :value="0">
                    <span class="name">私有</span>
                    <span class="tips">仅自己可见</span>
                  </a-select-option>
                </a-select>
              </a-form-item>
              <a-form-item label="课时" name="name">
                <a-input v-model:value="formState.name" placeholder="请输入课时" />
              </a-form-item>
              <a-form-item label="实验时长" name="name">
                <a-input v-model:value="formState.name" placeholder="请输入实验时长" />
              </a-form-item>
              <a-form-item label="实验时长" name="name">
                <a-input v-model:value="formState.name" placeholder="请输入实验时长" />
              </a-form-item>
              <a-form-item label="课程简介" name="name">
                <a-textarea v-model:value="formState.description" :auto-size="{ minRows: 6, maxRows: 8 }" placeholder="请输入课程简介" />
              </a-form-item>
            </div>
          </div>
        </a-form>
        <div class="first-step-btn">
          <a-button @click="cancel">取消</a-button>
          <a-button type="primary" @click="next(1)">下一步</a-button>
        </div>
      </template>
      <template v-if="currentStep === 1">
        <div class="info2">
          <SetupChapter />
        </div>
        <div class="first-step-btn">
          <a-button @click="cancel">取消</a-button>
          <a-button type="primary" @click="last(0)">上一步</a-button>
          <a-button type="primary" @click="next(2)">下一步</a-button>
        </div>
      </template>
      <template v-if="currentStep === 2">
        <div class="info3">
          <div class="caozuo">
            <a-button type="primary" @click="last(0)">添加学生</a-button>
            <a-button type="primary" @click="last(0)">删除学生</a-button>
          </div>
        </div>
        <div class="first-step-btn">
          <a-button @click="cancel">取消</a-button>
          <a-button type="primary" @click="last(1)">上一步</a-button>
          <a-button type="primary" @click="next(3)">下一步</a-button>
        </div>
      </template>
      <template v-if="currentStep === 3">
        <div class="info4">
          创建完成
        </div>
        <div class="first-step-btn">
          <a-button @click="cancel">继续添加</a-button>
          <a-button type="primary" @click="">查看详情</a-button>
        </div>
      </template>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { defineComponent,ref,onMounted,reactive,Ref,inject, computed,toRefs, watch,defineExpose, defineProps, withDefaults,} from "vue";
import { useRouter, useRoute } from "vue-router";
import request from "src/api/index";
import { IBusinessResp } from "src/typings/fetch.d";
import { Modal, message } from "ant-design-vue";
import LabelList from 'src/components/LabelList.vue'
import { SmileOutlined } from '@ant-design/icons-vue';
import SetupChapter from '../courseDetail/components/Chapter/SetupChapter.vue'
const router = useRouter();
const route = useRoute();
const { editId } = route.query;  
const http = (request as any).teacherImageResourcePool;
var configuration: any = inject("configuration");
var updata = inject("updataNav") as Function;
updata({
  tabs: [{ name: "创建课程", componenttype: 0 }],
  showContent: true,
  componenttype: undefined,
  showNav: true,
});

var currentStep:Ref<number>=ref(0)
const last=(val:number)=>{
  currentStep.value=val
}
const next=(val:number)=>{
  if(val === 1){
    // formRef.value.validate()
  }
  currentStep.value=val
}
const cancel=()=>{
  router.go(-1)
}
//  步骤一
const formRef = ref();
const courseDirection:any=reactive([])
const vocationDirection:any=reactive([])
const formState = reactive<any>({
  name: '',
  description: '',
  is_public: 0,
  src: '',
  tags: [],
  cover: '',
  categoryText: ''
})
const rules = {
  name: [
    { required: true, message: `请输入名称`, trigger: "blur" },
    { max: 20, message: `名称最多20个字符`, trigger: "blur" },
  ],
  categoryText: [
    { required: true, message: "请选择数据集类型", trigger: "change" },
  ],
}
const dateChange=()=>{
  
}

// 步骤2

</script>
<style scoped lang="less">
.create-course-box{
  padding:40px;
  .create-steps-box {

  }
  .create-course-main{
    .info{
      padding: 60px;
      display: flex;
      justify-content: space-between;
      .left,.right{
        width: 40%;
      }
    }
    .info2{
      padding-top: 20px;
    }
  }
}
.first-step-btn{
  text-align:center;
  .ant-btn{
    margin:0 1rem;
  }
}
</style>

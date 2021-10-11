<template>
  <a-form layout="inline" :form="form">
    <a-form-item>
      <a-select  v-model:value="form.classId" @change="handleSearch">
        <a-select-option v-for="(item,index) in options" :key="index" :value="item.id">{{item.classname}}</a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item label="学号">
      <a-input v-model:value="form.username" @pressEnter="handleSearch"></a-input>
    </a-form-item>
    <a-form-item label="姓名">
      <a-input v-model:value="form.name" @pressEnter="handleSearch"></a-input>
    </a-form-item>
    <a-form-item>
      <a-button type="primary" @click="handleSearch">查询</a-button>
      <a-button type="primary" @click="hanldeClear">清空</a-button>
    </a-form-item>
  </a-form>
</template>
<script lang="ts">
import { defineComponent, onMounted, reactive, watch } from 'vue'
import request from 'src/api/index'
import {Ihttp} from '../../typings'
import { IBusinessResp} from 'src/typings/fetch.d';
interface Iform{
  classId: number | string,
  username: string,
  name: string
}
interface Ioptions{
  id: string,
  classname: string
}
export default defineComponent({
  props: ['courseId'],
  setup(props,{emit}) {
    const http=(request as Ihttp).teachCourse
    const form = reactive<Iform>({
      classId: '',
      username: '',
      name: ''
    })
    var options = reactive<Ioptions[]>([
      {
        id: '',
        classname: '全部班级'
      }
    ]);
    onMounted(()=>{
      getOptions(props.courseId)
    })
    function getOptions (val:any) {
      options.length = 1
      http.allClasses({param: {course_id:val}}).then((res:IBusinessResp) => {
        if (res && res.data.length > 0) {
          options.push(...res.data)
        }
      })
    }
    function handleSearch() {
      emit('search', form)
    }
    function hanldeClear() {
      form.classId = ''
      form.username = ''
      form.name = ''
      emit('search', form)
    }
    return {
      form,
      options,
      handleSearch,
      hanldeClear
    }
  },
})
</script>
<style lang="less" scoped>
.ant-form{
  .ant-form-item:first-child{
    width: 180px;
  }
  .ant-input{
    width: 120px;
  }
  .ant-btn{
    margin-right: 10px;
  }
}
</style>

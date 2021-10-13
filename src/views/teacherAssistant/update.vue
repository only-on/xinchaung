<template>
  <div class="update" v-layout-bg>
    <a-form
      ref="formRef"
      :model="formState"
      layout="vertical"
      :rules="rules"
    >
      <div class="left">
        <a-form-item label="帐号" name="username" required>
          <a-input v-model:value="formState.username" disabled/>
        </a-form-item>
        <a-form-item has-feedback label="密码" name="passWord" required>
          <a-input v-model:value="formState.passWord" type="password" autocomplete="off" :disabled="!reset" />
        </a-form-item>
        <a-form-item has-feedback label="确认密码" name="submitPass" required>
          <a-input v-model:value="formState.submitPass" type="password" autocomplete="off" :disabled="!reset" />
        </a-form-item>
        <div class="init">
          <a-checkbox v-model:checked="reset" @change="resetChange"></a-checkbox>
          <span>重置密码</span>
        </div>
        <a-form-item label="邮箱" name="email">
          <a-input v-model:value="formState.email" />
        </a-form-item>
      </div>
      <div class="right">
        <a-form-item label="姓名" name="name" required>
          <a-input v-model:value="formState.name" />
        </a-form-item>
        <a-form-item label="性别" name="sex">
          <a-select v-model:value="formState.sex" placeholder="请选择性别">
            <a-select-option value="">请选择</a-select-option>
            <a-select-option value="男">男</a-select-option>
            <a-select-option value="女">女</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="电话" name="phone">
          <a-input v-model:value="formState.phone" />
        </a-form-item>
        <a-form-item label="所属教师" name="teacher">
          <a-input v-model:value="formState.teacher" disabled/>
        </a-form-item>
        <a-form-item label="状态" name="status">
          <a-select v-model:value="formState.status" disabled>
            <a-select-option :value="1">开启</a-select-option>
            <a-select-option :value="0">关闭</a-select-option>
          </a-select>
        </a-form-item>
      </div>
    </a-form>
    <div class="footer">
      <a-button type="primary" @click="handleOk">确定</a-button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, toRefs, onMounted, provide, inject, watch, nextTick, PropType } from 'vue'
import { RuleObject } from 'ant-design-vue/es/form/interface';
import request from 'src/api/index'
import { IBusinessResp } from 'src/typings/fetch.d'
import { ITableList, IHttp } from './typings'
import { useRouter, useRoute } from 'vue-router'

export default defineComponent({
  name: '',
  components: {},
  emits: [],
  setup(props, {emit}) {
    var updata=inject('updataNav') as Function
    updata({tabs:[],navPosition:'outside',navType:false,showContent:true,backOff:true})

    const http = (request as IHttp).teacherAssistant
    const route = useRoute()
    const { id } = route.query
    console.log(id)
    let formState = reactive<ITableList>({
      id: 0,
      username: '',
      name:'',
      sex: '',
      phone: '',
      email: '',
      status: 0,
      teacher: '',
      createTime: '',
      updateTime: ''
    })
    function getAssistantDetail() {
      // http.getAssistantDetail().then((res: IBusinessResp) => {
      //   console.log(res)
      // })
      formState.id = 43
      formState.username = '大富豪'
      formState.name = '十大高手'
      formState.sex = '男'
      formState.phone = '987654'
      formState.email = '23456'
      formState.status = 0
      formState.teacher = 'vhg'
      formState.passWord = '2020-11-20'
      formState.submitPass = '2021-10-10'
    }
    onMounted(() => {
      getAssistantDetail()
    })
    let formRef = ref()
    const handleOk = () => {
      console.log(formRef.value)
      formRef.value.validate().then(() => {
        console.log(111)
      }).catch((err: any) => {
        console.log(err)
      })
    }
    let reset = ref<boolean>(false)
    const resetChange = () => {
      if (reset.value) {
        formState.passWord = ''
        formState.submitPass = ''
      } else {
        formState.passWord = '1q2w'
        formState.submitPass = '1q2w'
      }
    }

    let validatePass = async (rule: RuleObject, value: string) => {
      if (value === '') {
        return Promise.reject('Please input the password');
      } else {
        if (formState.submitPass !== '') {
          formRef.value.validateFields('checkPass');
        }
        return Promise.resolve();
      }
    }
    let validatePass2 = async (rule: RuleObject, value: string) => {
      if (value === '') {
        return Promise.reject('Please input the password again');
      } else if (value !== formState.passWord) {
        return Promise.reject("Two inputs don't match!");
      } else {
        return Promise.resolve();
      }
    }
    const rules = {
      username: [
        { required: true, message: '请输入帐号', trigger: 'change'},
        { min: 1, max: 10, message: '帐号长度为1-10个字符', trigger: 'change'},
      ],
      name: [
        { required: true, message: '请输入名称', trigger: 'change'},
        { min: 1, max: 10, message: '名称长度为1-10个字符', trigger: 'change'},
      ],
      passWord: [
        { required: true, message: '请输入密码', trigger: 'change' },
        { min: 1, max: 16, message: '名称长度为1-16个字符', trigger: 'change'},
        { validator: validatePass, message: '两次输入密码不一致', trigger: 'change' }
      ],
      submitPass: [
        { required: true, message: '请输入确认密码', trigger: 'change' },
        { min: 1, max: 16, message: '名称长度为1-16个字符', trigger: 'change'},
        { validator: validatePass2, message: '两次输入密码不一致', trigger: 'change' }
      ],
    }
    return {
      formRef,
      formState,
      handleOk,
      rules,
      reset,
      resetChange,
    }
  },
})
</script>

<style lang="less" scoped>
  .update {
    :deep(.ant-form) {
      display: flex;
      justify-content: flex-end;
      .left {
        margin-right: auto;
      }
      .ant-input {
        width: 590px;
      }
    }
    .footer {
      text-align: right;
      margin-right: 20px;
    }
  }
</style>

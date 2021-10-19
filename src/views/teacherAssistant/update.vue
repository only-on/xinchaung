<template>
  <div class="update" v-layout-bg>
    <a-form
      ref="formRef"
      :model="formState"
      layout="vertical"
      :rules="rules"
    >
      <div class="left">
        <a-form-item label="帐号" name="stu_no" required>
          <a-input v-model:value="formState.stu_no" disabled/>
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
        <a-form-item label="性别" name="gender">
          <a-select v-model:value="formState.gender" placeholder="请选择性别">
            <a-select-option value="">请选择</a-select-option>
            <a-select-option :value="0">男</a-select-option>
            <a-select-option :value="1">女</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="电话" name="phone_no">
          <a-input v-model:value="formState.phone_no" />
        </a-form-item>
        <a-form-item label="所属教师" name="teacher_name">
          <a-input v-model:value="formState.teacher_name" disabled/>
        </a-form-item>
        <a-form-item label="状态" name="active_status">
          <a-select v-model:value="formState.active_status" disabled>
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
  name: 'assistant-update',
  components: {},
  emits: [],
  setup(props, {emit}) {
    var updata=inject('updataNav') as Function
    updata({tabs:[],navPosition:'outside',navType:false,showContent:true,backOff:false})

    let router = useRouter()

    const http = (request as IHttp).teacherAssistant
    const route = useRoute()
    const { id } = route.query
    console.log(id)
    let formState = reactive({
      stu_no: '',
      name:'',
      gender: '',
      phone_no: '',
      email: '',
      active_status: 0,
      teacher_name: '',
      passWord: '**********',
      submitPass: '**********',
      created_at: '',
      updated_at: ''
    })
    function getAssistantDetail() {
      http.getAssistantDetail({urlParams: {id}}).then((res: IBusinessResp) => {
        console.log(res)
        let {data} = res
        formState = Object.assign(formState, {...data})
      })
    }
    onMounted(() => {
      getAssistantDetail()
    })
    let formRef = ref()
    const handleOk = () => {
      console.log(formRef.value)
      formRef.value.validate().then(() => {
        http.updateAssistant({
          param: {
            Assistant: {
              // username: formState.stu_no,
              password_hash: reset ? formState.passWord : '',
              userinitpassword: reset,
              email: formState.email
            },
            AssistantProfile: {
              name: formState.name,
              gender: formState.gender ? formState.gender : 0,
              phone: formState.phone_no,
            }
          },
          urlParams: {
            id
          }
        }).then((res: IBusinessResp) => {
          console.log(res)
          router.push('/teacher/assistantManager/view?id=' + id)
        })
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
          formRef.value.validateFields('submitPass');
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
    let validatePhone = async (rule: RuleObject, value: string) => {
      if (!value) return
      let tel = /^0\d{2,3}-?\d{7,8}$/
      let phone = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/
      if(value.length == 11 && phone.test(value)){//手机号码
        return Promise.resolve();
      }else if(value.length == 12 && value.indexOf("-") != -1 && tel.test(value)){//电话号码
        return Promise.resolve();
      }
      return Promise.reject('电话是无效的。');
    }
    let validateEmail = async (rule: RuleObject, value: string) => {
      if (!value) return
      let register = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/
      if (!register.test(value)) {
        return Promise.reject('邮箱是无效的。');
      } else {
        return Promise.resolve();
      }
    }
    const rules = {
      stu_no: [
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
      phone: [
        { validator: validatePhone, message: '电话是无效的。', trigger: 'blur' }
      ],
      email: [
        { validator: validateEmail, message: '邮箱是无效的。', trigger: 'blur' }
      ]
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

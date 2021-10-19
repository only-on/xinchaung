<template>
  <a-modal 
    :visible="isShow" 
    :title="(formState.id ? '编辑' : '添加') + '助教'" 
    :footer=null
    :width="600"
    @cancel="handleCancel"
  >
    <a-form
      ref="formRef"
      :model="formState"
      layout="vertical"
      :rules="rules"
    >
      <a-form-item label="帐号" name="username" required>
        <a-input v-model:value="formState.username" :disabled="formState.id"/>
      </a-form-item>
      <a-form-item label="姓名" name="name" required>
        <a-input v-model:value="formState.name" />
      </a-form-item>
      <a-form-item label="性别" name="sex">
        <a-select v-model:value="formState.gender" placeholder="请选择性别">
          <a-select-option value="">请选择</a-select-option>
          <a-select-option value="0">男</a-select-option>
          <a-select-option value="1">女</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="邮箱" name="email">
        <a-input v-model:value="formState.email" />
      </a-form-item>
      <a-form-item label="电话" name="phone">
        <a-input v-model:value="formState.phone" :maxlength="12" />
      </a-form-item>
      <div class="init" v-if="!formState.id">
        <span>使用初始密码</span>
        <a-checkbox v-model:checked="checked" @change="onChange"></a-checkbox>
        <span>(账号+1q2w)</span>
      </div>
      <a-form-item has-feedback label="密码" name="passWord" required>
        <a-input v-model:value="formState.passWord" type="password" autocomplete="off" :disabled="formState.id && !reset" />
      </a-form-item>
      <a-form-item has-feedback label="确认密码" name="submitPass" required>
        <a-input v-model:value="formState.submitPass" type="password" autocomplete="off" :disabled="formState.id && !reset" />
      </a-form-item>
      <div class="init" v-if="formState.id">
        <a-checkbox v-model:checked="reset" @change="resetChange"></a-checkbox>
        <span>重置密码</span>
      </div>
      <a-form-item label="所属教师" name="teacher" v-if="formState.id">
        <a-input v-model:value="formState.teacher_name" disabled/>
      </a-form-item>
      <a-form-item label="状态" name="status" v-if="formState.id">
        <a-select v-model:value="formState.status" disabled>
          <a-select-option :value="1">开启</a-select-option>
          <a-select-option :value="0">关闭</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item class="footer">
        <a-button @click="handleCancel">取消</a-button>
        <a-button type="primary" @click="handleOk">保存</a-button>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, toRefs, onMounted, provide, inject, watch, nextTick, PropType } from 'vue'
import { RuleObject } from 'ant-design-vue/es/form/interface';
import request from 'src/api/index'
import { IBusinessResp } from 'src/typings/fetch.d'
import { ITableList, IData, IHttp } from './typings'

export default defineComponent({
  name: '',
  components: {},
  props: {
    isShow: Boolean,
    formState: {
      type: Object as PropType<ITableList>,
      default: {}
    }
  },
  emits: ['update:isShow'],
  setup(props, {emit}) {
    var upTableList = inject('upTableList') as Function 
    const http = (request as IHttp).teacherAssistant
    let formRef = ref()
    let formState = reactive({
      username: '',
      name: '',
      gender: '',
      email: '',
      phone: '',
      passWord: '1q2w',
      submitPass: '1q2w',
      bind_status: ''
    })
    const handleOk = () => {
      console.log(formRef.value)
      formRef.value.validate().then(() => {
        http.addAssistant({
          param: {
            Assistant: {
              username: formState.username,
              password_hash: checked.value ? '' : formState.passWord,
              userinitpassword: checked.value,
              email: formState.email
            },
            AssistantProfile: {
              name: formState.name,
              gender: formState.gender ? formState.gender : 0,
              phone: formState.phone,
            }
          }
        }).then((res: IBusinessResp) => {
          emit('update:isShow', false)
          upTableList()
          checked.value = true
          formRef.value.resetFields()
        })  
      }).catch((err: any) => {
        console.log(err)
      })
    }
    const handleCancel = () =>{
      emit('update:isShow', false)
      checked.value = true
      formRef.value.resetFields()
    }
    let checked = ref<boolean>(true)
    const onChange = () => {
      if (checked.value) {
        formState.passWord = '1q2w'
        formState.submitPass = '1q2w'
      } else {
        formState.passWord = ''
        formState.submitPass = ''
      }
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
      phone: [
        { validator: validatePhone, message: '电话是无效的。', trigger: 'blur' }
      ],
      email: [
        { validator: validateEmail, message: '邮箱是无效的。', trigger: 'blur' }
      ]
    }
    return {
      formRef,
      // ...toRefs(props),
      formState,
      handleOk,
      handleCancel,
      onChange,
      checked,
      rules,
      reset,
      resetChange,
    }
  },
})
</script>

<style lang="less" scoped>
.footer {
  :deep(.ant-form-item-control-input-content) {
    display: flex;
    justify-content: flex-end;
    .ant-btn:first-child {
      margin-right: 10px;
    }
  }
}
</style>

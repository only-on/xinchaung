<template>
  <a-modal 
    :visible="isShow" 
    title="添加助教" 
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
        <a-input v-model:value="formState.username" />
      </a-form-item>
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
      <a-form-item label="邮箱" name="email">
        <a-input v-model:value="formState.email" />
      </a-form-item>
      <a-form-item label="电话" name="phone">
        <a-input v-model:value="formState.phone" />
      </a-form-item>
      <div class="init">
        <span>使用初始密码</span>
        <a-checkbox v-model:checked="checked" @change="onChange"></a-checkbox>
        <span>(账号+1q2w)</span>
      </div>
      <a-form-item has-feedback label="密码" name="passWord" required>
        <a-input v-model:value="formState.passWord" type="password" autocomplete="off" />
      </a-form-item>
      <a-form-item has-feedback label="确认密码" name="submitPass" required>
        <a-input v-model:value="formState.submitPass" type="password" autocomplete="off" />
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
import { ITableList } from './typings'
import { RuleObject } from 'ant-design-vue/es/form/interface';

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
  emits: ['update:isShow', 'update:formState'],
  setup(props, {emit}) {
    var upTableList = inject('upTableList') as Function 
    let formRef = ref()
    const handleOk = () => {
      upTableList()
      console.log(formRef.value)
      formRef.value.validate().then(() => {
        console.log(111)
      }).catch((err: any) => {
        console.log(err)
      })
    }
    const handleCancel = () =>{
      emit('update:isShow', false)
    }
    let checked = ref<boolean>(true)
    const onChange = () => {
      if (checked.value) {
        props.formState.passWord = '1q2w'
        props.formState.submitPass = '1q2w'
        emit('update:formState', props.formState)
      } else {
        props.formState.passWord = ''
        props.formState.submitPass = ''
        emit('update:formState', props.formState)
      }
    }

    let validatePass = async (rule: RuleObject, value: string) => {
      if (value === '') {
        return Promise.reject('Please input the password');
      } else {
        if (props.formState.submitPass !== '') {
          formRef.value.validateFields('checkPass');
        }
        return Promise.resolve();
      }
    }
    let validatePass2 = async (rule: RuleObject, value: string) => {
      if (value === '') {
        return Promise.reject('Please input the password again');
      } else if (value !== props.formState.passWord) {
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
      ...toRefs(props),
      // formState,
      handleOk,
      handleCancel,
      onChange,
      checked,
      rules,
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

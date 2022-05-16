<template>
        <div class="createStudent">
        <a-form
        ref="formRef"
        :model="formState"
        :label-col="{ span: 10 }"
        :wrapper-col="{ span: 24 }"
        labelAlign="left"
        :rules="rules"
        layout='vertical'
        >
      <div class="formBox">
        <div class="left">
          <a-form-item label="账号" name="username">
            <a-input
              v-model:value="formState.username"
              :disabled="editId ? true : false"
            />
          </a-form-item>
          <a-form-item label="姓名" name="name">
            <a-input v-model:value="formState.name" />
          </a-form-item>
          <a-form-item label="密码" name="password_hash">
            <a-input-password
              v-model:value="formState.password_hash"
              :disabled="InputPassword"
              :visibilityToggle="false"
            />
          </a-form-item>
          <a-form-item label="确认密码" name="repassword">
            <a-input-password
              v-model:value="formState.repassword"
              :disabled="InputPassword"
              :visibilityToggle="false"
            />
          </a-form-item>
          <a-form-item label="职称" name="professionalTitle">
            <a-input
              v-model:value="formState.professionalTitle"
            />
          </a-form-item>
        </div>
        <div class="right">
            <a-form-item label="性别" required name="gender">
                <a-radio-group v-model:value="formState.gender">
                    <a-radio :value="1">男</a-radio>
                    <a-radio :value="2">女</a-radio>
                 </a-radio-group>
           </a-form-item>
           <a-form-item label="学院" name="department">
            <a-input v-model:value="formState.department" />
          </a-form-item>
          <a-form-item label="手机" name="phone">
            <a-input v-model:value="formState.phone" />
          </a-form-item>
          <a-form-item label="邮箱" name="email">
            <a-input v-model:value="formState.email" />
          </a-form-item>
        </div>
      </div>
        </a-form>
        <div class="bottomBtn">
            <a-button class="cancel" @click="cancelSave">取消</a-button>
            <a-button type='primary' @click="saveInformation">保存</a-button>
        </div>
    </div>
</template>
<script lang="ts" setup>
    import { Modal, message } from "ant-design-vue";
    import {
      createVNode,
      defineComponent,
      ref,
      onMounted,
      reactive,
      toRefs,
      inject,
      watch,
      computed,
    } from "vue";
    import request from "src/api/index";
    import { useRouter, useRoute } from "vue-router";
    const http = (request as any).adminUserManagement;
    const router = useRouter();
    const route = useRoute();
     var updata = inject("updataNav") as Function;
        updata({
          tabs: [
            { name: "创建教师", componenttype: 0 }
          ],
          showContent: true,
          componenttype: undefined,
          showNav:true,
        });
        var formState:any= reactive({
      username: "",
      password_hash: "",
      repassword: "",
      professionalTitle:'',
      userinitpassword:false,
      department: "",
      grade: "",
      name: "",
      gender: 1,
      phone: "",
      email: "",
      status: "10",
      introduce: "",
      reset: false,
    });
    const formRef:any=ref()
    var editId:any = ref(0);
    const InputPassword = computed(() => {
      let sign = false;
    //   if (editId.value) {
    //     sign = formState.reset ? false : true;
    //   } else {
    //     sign = formState.userinitpassword ? true : false;
    //   }
      return sign;
    });
    const rules = {
      username: [
        { required: true, message: "请输入账号", trigger: "blur" },
        // {
        //   pattern: /^[_a-zA-Z0-9]{1,10}$/,
        //   message: "学号应为字母或数字，长度不超过10",
        //   trigger: "blur",
        // },
        // var reg = new RegExp('^[_a-zA-Z0-9]{1,30}$')
      ],
      name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
      password_hash: [
        { required: true, message: "请输入密码", trigger: "blur" },
      ],
      repassword: [
        { required: true, message: "请输入确认密码", trigger: "blur" },
      ],
      professionalTitle:[{ required: true, message: "请输入职称", trigger: "blur" }],
      department: [{ required: true, message: "请输入学院", trigger: "blur" }],
      email: [
        {
          pattern:
            /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/,
          message: "邮箱格式有误",
          trigger: "blur",
        },
      ],
      phone: [
        {
          pattern: /^(1(3|4|5|6|7|8|9)|9(2|8))\d{9}$/,
          message: "请输入正确的手机号",
          trigger: "blur",
        },
      ],
    };

    function saveInformation(){
        formRef.value
        .validate()
        .then(() => {
          if(formState.password_hash!==formState.repassword){
            message.warning('密码不一致！')
            return
          }
          let obj: any = {
          Teacher: {
            username: formState.username,
            email: formState.email,
            userinitpassword: editId.value ? false : formState.userinitpassword, // 编辑时默认false
            password_hash:formState.password_hash,
            repassword:formState.repassword
          },
          TeacherProfile: {
            department: formState.department,
            direct: formState.direct,
            course: formState.course,
            name: formState.name,
            gender: formState.gender,
            phone: formState.phone,
            status: formState.status,
            // introduce: formState.introduce,
          },
        };
          const promise = editId.value
          ? http.editTeacher({ urlParams: { id: editId.value }, param: { ...obj } })
          : http.createTeacher({ param: { ...obj } });
        promise.then((res:any) => {
          // initData();
          message.success(editId.value ? "编辑成功" : "创建成功");
          router.push({path: '/admin/adminUserManagement/teacherManagement'});
          formRef.value.resetFields();
          formState.reset = false;
          // visible.value = false;
        });
        })
        .catch((error:any) => {
          console.log('error', error);
        });
    }
    function cancelSave(){
        router.push({path: '/admin/adminUserManagement/teacherManagement'});
    }
    </script>

<style lang="less" scoped>
    .formBox {
      width: 100%;
      display: flex;
      justify-content: space-between;
      .left,
      .right {
        width: 46%;
      }
    }
    .createStudent {
        margin:100px;
    }
    .bottomBtn{
        margin-top: 40px;
        text-align: center;
        .cancel{
            margin-right: 20px;
        }
    }
    :deep(.ant-input){
        border-radius: 20px;
    }
    </style>
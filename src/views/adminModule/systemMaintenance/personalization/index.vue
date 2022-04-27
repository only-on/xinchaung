<template>
    <div class="personalization">
      <div class="name">
          <a-form layout='vertical'>
            <a-form-item label="系统名称" name='systemName' required>
            <a-input style="width:570px" v-model:value="systemName" placeholder="请在这里输入系统名称"/>
          </a-form-item>
          </a-form>
      </div>
      <div class="logo">
        <div>LOGO</div>
        <div class="upload-logo-box">
          <div class="upload-logo">
              <a-upload
                name="avatar"
                list-type="picture-card"
                class="avatar-uploader login-logo"
                :show-upload-list="false"
                :beforeUpload="logUploadBefore"
                accept='.jpg,.png'
              >
                <div 
                class="login_logo_bg" 
                :style="`background-image: url(${env? '/proxyPrefix' + systemBaseInfo.login_logo: systemBaseInfo.login_logo});`"></div>
                <div>
                  <span class="icon-huigun iconfont"></span>
                </div>
              </a-upload>
          </div>
          <div class="logo-size">60x60px</div>
          <div class="logo-hint">支持小于10k的png文件</div>
        </div>
      </div>
      <div class="themeStyle">
        <div class="tit">主题风格</div>
      </div> 
      <div class="loginScreen">
        <div class="tit">系统登录界面</div>
      </div>
    </div>
</template>
<script lang="ts" setup>
    import {
      defineComponent,
      ref,
      onMounted,
      reactive,
      inject
    } from "vue";
    const env = process.env.NODE_ENV == "development" ? true : false;
    var configuration: any = inject("configuration");
    var updata = inject("updataNav") as Function;
    updata({
      tabs: [
        { name: "个性化设置", componenttype: 0 }
      ],
      showContent: true,
      componenttype: undefined,
      showNav:true,
    });
    const systemName:any=ref('')
    const systemBaseInfo:any=reactive({
      login_logo:''
    })
    function logUploadBefore(){

    }
    function iconUploadBefore(){

    }
</script>
<style lang="less" scoped>
  .upload-logo-box {
          .logo-size{
            color: rgba(0, 0, 0, 0.25);
          }
          .logo-hint {
            font-size: 12px;
            color: rgba(0, 0, 0, 0.25);
            width: 140px;
            border-top: 1px dashed rgba(0, 0, 0, 0.25);
            margin-top: 10px;
            padding-top: 10px;
          }
          .login_logo_bg{
            width: 16px;
            height: 16px;
            background-repeat: no-repeat;
            background-size: 100% 100%;
          }  
        }
</style>
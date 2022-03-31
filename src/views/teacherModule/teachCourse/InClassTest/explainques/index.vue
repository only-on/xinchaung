<template>
  <div>
    <div class="modal-content">
      <a-form layout="vertical">
        <a-form-item required label="题目描述">
          <a-textarea></a-textarea>
        </a-form-item>
        <a-form-item required label="答案">
          <a-textarea></a-textarea>
        </a-form-item>
        <a-form-item required label="关键词">
          <a-textarea></a-textarea>
        </a-form-item>
        <a-form-item required label="分数">
          <a-input></a-input>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>
<style lang="less" scoped>
.radio_group {
  width: 100%;
}
.ant-checkbox-group {
  width: 100%;
}
.ant-input {
  border-radius: 18px;
}
</style>

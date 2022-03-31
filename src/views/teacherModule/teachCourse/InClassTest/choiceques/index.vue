<template>
  <div>
    <div class="modal-content">
      <a-form layout="vertical">
        <a-form-item required label="题目描述">
          <a-textarea></a-textarea>
        </a-form-item>
        <div>
          <a-radio-group class="radio_group">
            <a-checkbox-group name="checkboxgroup">
              <div class="option">
                <div class="option-item">
                  <a-form-item required :label="'选项A'">
                    <a-input></a-input>
                  </a-form-item>
                </div>
                <div class="setAnswer">
                  <a-radio>设为答案</a-radio>
                </div>
              </div>
              <div class="option">
                <div class="option-item">
                  <a-form-item required :label="'选项B'">
                    <a-input></a-input>
                  </a-form-item>
                </div>
                <div class="setAnswer">
                  <a-radio>设为答案</a-radio>
                </div>
              </div>
              <div class="option">
                <div class="option-item">
                  <a-form-item required :label="'选项C'">
                    <a-input></a-input>
                  </a-form-item>
                </div>
                <div class="setAnswer">
                  <a-radio>设为答案</a-radio>
                </div>
              </div>
              <div class="option">
                <div class="option-item">
                  <a-form-item required :label="'选项D'">
                    <a-input></a-input>
                  </a-form-item>
                </div>
                <div class="setAnswer">
                  <a-radio>设为答案</a-radio>
                </div>
              </div>
            </a-checkbox-group>
          </a-radio-group>
        </div>
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
.option {
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  .option-item {
    width: 80%;
  }
  .setAnswer {
    width: 105px;
    height: 34px;
    background: #f5f5f5;
    border-radius: 17px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding-left: 10px;
  }
}
.ant-input {
  border-radius: 18px;
}
</style>

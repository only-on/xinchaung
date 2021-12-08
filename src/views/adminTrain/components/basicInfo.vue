<template>
  <div class="basicInfo">
    <a-form layout="vertical">
      <a-form-item label="实训名称" name="name">
        <a-input :disabled="true"></a-input>
      </a-form-item>
      <div class="time">
        <a-form-item label="开始时间" name="start_times">
          <a-date-picker
            class="time"
            placeholder="开始日期"
            valueFormat="YYYY-MM-DD"
            :disabled="true"
          />
        </a-form-item>
        <a-form-item label="结束时间" name="end_times">
          <a-date-picker
            placeholder="结束日期"
            valueFormat="YYYY-MM-DD"
            :disabled="true"
          />
        </a-form-item>
      </div>
    </a-form>
  </div>
</template>
<style lang="less" scoped>
.basicInfo {
  width: 500px;
  margin: 0 auto;
  .time {
    display: flex;
    justify-content: space-between;
  }
}
</style>

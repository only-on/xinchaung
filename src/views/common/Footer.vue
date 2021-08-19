<template>
    <div class="footer-box">
        <div>暂时menu：<router-link to="/exam/list">考试管理</router-link><router-link to="/exam/look">查看成绩</router-link></div>
    </div>
</template>

<style lang="scss">
.footer-box{
    flex-shrink: 0;
    text-align: center;
    background: #fff;
    a{
        margin-left: 15px;
    }
}
</style>
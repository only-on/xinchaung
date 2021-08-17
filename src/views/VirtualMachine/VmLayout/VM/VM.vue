<template>
    <div class="vm-list-box scrollbar">
        <div class="vm-item" v-for="i in 5" :key="i">
            <h2 class="vm-title">远程连接</h2>
            <div class="vm-info">
                <div ><span>用户名：Username</span><span>密码：password</span></div>
                <div><span>IP：192.168.101.150</span><span>rdp端开：123456</span></div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    setup() {
        return {

        }
    },
})
</script>

<style lang="less">
.vm-list-box{

    .vm-item{
        height: 374px;
        background-image: url("../../../../assets/images/vm/kvm-computer.png");
        background-position: center bottom;
        background-repeat: no-repeat;
        background-color: linear-gradient(270deg,#ecf0ff 0%, #fdf5ff);
        margin-bottom: 20px;
    }
}
</style>

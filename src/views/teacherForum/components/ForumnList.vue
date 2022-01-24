<template>
	<div class="title">{{item.title}}</div>
	<div class="content" v-if="!isAllText">
		<span class="desc">{{item.desc}}</span>
		<span class="read-btn" @click="isAllText = true">阅读全文<i class="iconfont icon-zhankai"></i></span>
	</div>
	<div class="content" v-html="item.content" v-else></div>
	<div class="user-info">
		<img :src="item.userAvatar" alt="">
		<span class="user-name">{{item.userName}}</span>
		<span class="create-time">{{item.createTime}}</span>
		<span class="reply-num">{{item.replayNum}}</span>
		<span class="reply-btn" @click="isReply = !isReply">{{!isReply ? '回应' : '收起回应'}}</span>
	</div>
	<!--回应内容-->
	<div class="reply-box" v-if="isReply">
		<div class="reply-total">回应区 （522条）</div>
		<div class="reply-content">
			<reply-list :child="child"></reply-list>
			<div class="more">
				<span>加载更多</span>
			</div>
		</div>
		<div class="comment-box">
			<a-input v-model:value="replyContent" placeholder="请写下你的评论" />
			<span @click="submitReply">回应</span>
		</div>
	</div>
	<div class="bottom">
		<div class="left">
			<span>24</span>
			<span @click="isReply = !isReply">收起回应</span>
		</div>
		<div class="right">
			<span @click="isAllText = false">收起<i class="iconfont icon-zhankai"></i></span>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, reactive, Ref, inject, watch, toRefs } from 'vue'
import { useRouter, useRoute } from 'vue-router';
import ReplyList from './ReplyList.vue'
export default defineComponent({
  name: 'ForumnList',
	props: {
		item: {
			type: Object 
		}
	},
	components:{
		ReplyList
	},
	setup: (props, { emit }) => {
		let isAllText = ref<boolean>(false)
		let isReply = ref<boolean>(false)
		let child = ref<boolean>(true)
		let replyContent = ref<string>('')
		return {
			...toRefs(props),
			isAllText,
			isReply,
			child,
			replyContent,
		}
	}
})
</script>

<style lang="less" scoped>
.title {
	font-size: 16px;
	color: #33394b;
	font-weight: 700;
	margin-bottom: 8px;
}
.content {
	color: var(--black-65);
	line-height: 24px;
	.read-btn {
		color: var(--orange-1);
		margin-left: 12px;
		cursor: pointer;
		.iconfont {
			font-size: 14px;
			margin-left: 6px;
		}
	}
}
.user-info {
	color: var(--black-45);
	margin: 12px 0;
	img {
		width: 24px;
		height: 24px;
		border-radius: 50%;
		background: pink;
		margin-right: 6px;
	}
	.create-time {
		margin: 0 24px;
	}
	.reply-btn {
		color: var(--orange-1);
		margin-left: 3px;
		cursor: pointer;
	}
}
.reply-box {
	/*background: var(--lightgray-2);*/
	.reply-total {
		background: var(--lightgray-2);
		font-size: 16px;
		color: var(--black-65);
		padding: 12px 0 9px 20px;
		border-bottom: 1px solid var(--lightgray-4);
	}
	.reply-content {
		background: var(--lightgray-2);
		/*margin: 16px 20px;*/
		.more {
			padding: 19px 0 24px;
			text-align: center;
			span {
				display: inline-block;
				height: 34px;
				line-height: 34px;
				padding: 0 22px;
				border-radius: 18px;
				border: 1px solid var(--orange-1);
				color: var(--orange-1);
			}
		}
	}
	.comment-box {
		margin-top: 4px;
		padding: 21px 20px 23px 18px;
		background: var(--lightgray-2);
		display: flex;
		.ant-input {
			flex: 1;
			height: 34px;
    	border-radius: 17px;
		}
		span {
			cursor: pointer;
			margin-left: 16px;
			line-height: 34px;
			padding: 0 36px;
			border-radius: 17px;
			background: var(--orange-1);
			color: var(--white-100);
		}
	}
}
.bottom {
	line-height: 19px;
	display: flex;
	background: var(--white-100);
	box-shadow: 0px -2px 4px 0px rgba(0,0,0,0.07); 
	.right {
		color: var(--orange-1);
		margin-left: 12px;
		cursor: pointer;
		.iconfont {
			font-size: 14px;
			margin-left: 6px;
		}
	}
}
</style>
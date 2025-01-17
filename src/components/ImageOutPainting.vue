<template>
  <a-modal
    class="image-out-painting"
    v-model:visible="visible"
    title="AI 扩图"
    :footer="false"
    @cancel="closeModal"
  >
    <div style="margin-bottom: 16px;">
      <span>可用扩图额度：</span>
      <strong>{{ userQuota }}</strong>
    </div>
    <a-row gutter="16">
        <h4>原始图片</h4>
        <img :src="picture?.url" :alt="picture?.name" style="max-width: 100%" />
    </a-row>
    <div style="margin-bottom: 16px" />
    <a-flex gap="16" justify="center">
      <a-button type="primary" :loading="!!taskId" ghost
                @click="createTask">
        生成图片
      </a-button>
    </a-flex>
  </a-modal>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import {
  createPictureOutPaintingTaskUsingPost,

} from '@/api/pictureController'
import { message } from 'ant-design-vue'
import { getUserQuotaUsingGet } from '@/api/userController'

interface Props {   //定义父组件传递过来的属性 以及回调函数
  picture?: API.PictureVO
  spaceId?: number
  onSuccess?: (newPicture: API.PictureVO) => void
}
//定义属性
const props = defineProps<Props>()
// 用户扩图额度
const userQuota = ref<number | null>(null)
// 获取用户扩图额度
const fetchUserQuota = async () => {
  try {
    const res = await getUserQuotaUsingGet()
    if (res.data.code === 0 && res.data.data !== undefined) {
      userQuota.value = res.data.data
    }
  } catch (error) {
    console.error('获取用户扩图额度失败', error)
  }
}
onMounted(() => {
  fetchUserQuota() // 页面加载时立即获取一次额度
})

// 是否可见
const visible = ref(false)

// 打开弹窗
const openModal = () => {
  visible.value = true
}
// 关闭弹窗
const closeModal = () => {
  visible.value = false
}
// 暴露函数给父组件
defineExpose({
  openModal,
})
// 任务 id
let taskId = ref<string>()


//创建任务
const createTask = async () => {
  if (!props.picture?.id) {
    return
  }
  const res = await createPictureOutPaintingTaskUsingPost({  //调用后端创建任务请求，返回任务信息
    pictureId: props.picture.id,
    // 可以根据需要设置扩图参数，这里是扩图为2倍
    parameters: {
      xScale: 2,
      yScale: 2,
    },
  })
  if (res.data.code === 0) {
    message.success('AI生成中，可前往AI扩图记录中查看')
  } else {
    message.error('创建任务失败，' + res.data.message)
  }
}

</script>

<style scoped>

.image-out-painting {
  text-align: center;
}

</style>


<template>
  <div class="url-picture-upload">
    <a-input-group compact style="margin-bottom: 16px">
      <a-input v-model:value="fileUrl" style="width: calc(100% - 120px)" placeholder="请输入图片 URL" />
      <a-button type="primary" :loading="loading" @click="handleUpload" style="width: 120px">提交</a-button>
    </a-input-group>
    <div class="image-container">
      <img v-if="picture?.url" :src="picture?.url" alt="avatar" />
    </div>
  </div>
</template>


<script setup lang="ts">
import { ref } from 'vue'
import { uploadPictureByUrlUsingPost } from '@/api/pictureController'
import { message } from 'ant-design-vue'

interface Props {   //接收图片信息
  picture?: API.PictureVO
  spaceId?: number
  onSuccess?: (newPicture: API.PictureVO) => void
}

const props=defineProps<Props>()
const loading = ref<boolean>(false)
const fileUrl = ref<string>()

//上传 url
const handleUpload = async () => {
  loading.value = true
  try {
    const params: API.PictureUploadRequest = { fileUrl: fileUrl.value }
    params.spaceId = props.spaceId;
    if (props.picture) {  //2.外层通过list查询出来图片，则获取图片id，并在上面的img中显示
      params.id = props.picture.id
    }
    const res = await uploadPictureByUrlUsingPost(params) //1.上传成功后后端数据库有信息了
    if (res.data.code === 0 && res.data.data) {
      message.success('图片上传成功')
      // 将上传成功的图片信息传递给父组件
      props.onSuccess?.(res.data.data)
    } else {
      message.error('图片上传失败，' + res.data.message)
    }
  } catch (error) {
    message.error('图片上传失败')
  }
  loading.value = false
}
</script>


<style scoped>
.url-picture-upload {
  margin-bottom: 16px;
}

.image-container {
  text-align: center; /* 让 img 标签水平居中 */
  margin-top: 8px;    /* 可选：为图片添加顶部间距 */
}

.image-container img {
  max-width: 70%;
  max-height: 250px;
  display: inline-block; /* 确保 img 是行内块级元素 */
}

</style>

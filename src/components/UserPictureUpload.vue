<template>
  <div class="user-picture-upload">
    <a-upload
      list-type="picture-card"
      :show-upload-list="false"
      :custom-request="handleUpload"
      :before-upload="beforeUpload"
    >
      <div>
        <loading-outlined v-if="loading"></loading-outlined>
        <plus-outlined v-else></plus-outlined>
        <div class="ant-upload-text">点击或拖拽上传头像</div>
      </div>
    </a-upload>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import type { UploadProps } from 'ant-design-vue';
import { uploadUserPictureUsingPost } from '@/api/pictureController'

interface Props {
  pictureUrl?: API.UploadUserPictureResult;  //改成后端传来的对象
  onSuccess?: (newPictureUrl: API.UploadUserPictureResult) => void;
}

const props = defineProps<Props>();

// 上传前校验函数
const beforeUpload = (file: UploadProps['fileList'][number]) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('不支持上传该格式的图片，推荐 jpg 或 png');
    return false;
  }
  const isLt10M = file.size / 1024 / 1024 < 10;
  if (!isLt10M) {
    message.error('不能上传超过 10M 的图片');
    return false;
  }
  return true;
};

const loading = ref<boolean>(false);

// 上传
const handleUpload = async ({ file }: any) => {
  loading.value = true;
  try {
    const res = await uploadUserPictureUsingPost({},file);
    if (res.data.code === 0 && res.data.data) {
      message.success('头像上传成功');
      // 将上传成功的图片地址传递给父组件
      props.onSuccess?.(res.data.data);
    } else {
      message.error('头像上传失败，' + res.data.message);
    }
  } catch (error) {
    message.error('头像上传失败');
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
/* 继承原有样式 */
.user-picture-upload :deep(.ant-upload) {
  width: 100% !important;
  height: 100% !important;
  min-height: 152px;
  min-width: 152px;
}

.user-picture-upload img {
  max-width: 100%;
  max-height: 480px;
}

.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
</style>

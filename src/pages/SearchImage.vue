<template>
  <div id="searchImage">
    <a-flex>
      <h2>以图搜图</h2>
    </a-flex>
    <div class="search-main">
      <!-- 图片上传和预览 -->
      <div style="text-align: center; margin-top: 24px;">
        <a-upload
          :showUploadList="false"
          :beforeUpload="handleChange"
          accept="image/*"
          :multiple="false"
        >
          <a-button>
            <upload-outlined></upload-outlined>
            点击上传图片
          </a-button>
        </a-upload>
        <div v-if="dialogImageUrl" class="preview-image-container" style="margin-top: 8px;">
          <img :src="dialogImageUrl" alt="预览图片" style="max-width: 60%; border: 1px solid #e8e8e8;" />
        </div>
        <div class="upload-hint" style="margin-top: 8px; color: #999;">
          选择你要识别的图片（最大10MB）
        </div>

        <a-button @click="submitImage" type="primary" style="margin-top: 16px;" :disabled="!dialogImageUrl">
          提交
        </a-button>
      </div>
      <br>
      <!-- 搜索结果展示 -->
      <div v-if="haveSearched && resultImages.length === 0" style="text-align: center; margin-top: 24px;">

        <a-empty description="图库暂无相似图片"></a-empty>
      </div>
      <div v-else-if="resultImages.length > 0" class="search-result-container">
        <h3 style="margin-bottom: 16px;">搜索结果</h3>
        <a-row :gutter="[16, 16]" style="justify-content: center;">
          <a-col v-for="image in resultImages" :key="image.id" :span="6">
            <a-image :src="image.url" :preview="false" style="width: 100%; border: 1px solid #e8e8e8;" />
          </a-col>
        </a-row>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { message } from 'ant-design-vue';
import { UploadOutlined } from '@ant-design/icons-vue';
import { searchSimilarImagesUsingPost } from '@/api/pictureController';

// 响应式数据
const dialogImageUrl = ref('');
const imageList = ref<File[]>([]);
const haveSearched = ref(false);
const resultImages = ref([]);

// 方法定义
const handleChange = (file: File) => {
  if (file.size > 10 * 1024 * 1024) {
    message.error('图片大小不能超过10MB');
    return false;
  }
  imageList.value = [file];
  dialogImageUrl.value = URL.createObjectURL(file);
};

const submitImage = async () => {
  if (imageList.value.length === 0 || !dialogImageUrl.value) {
    message.warning("请选择一张图片");
    return;
  }

  let reqData = new FormData();
  reqData.append("imageFile", imageList.value[0]);

  try {
    // 确保直接使用FormData对象，避免额外的body参数干扰
    const res = await searchSimilarImagesUsingPost({}, imageList.value[0]);
    if (res.data.code === 0 && res.data.data) {
      resultImages.value = res.data.data;
      haveSearched.value = true;
      message.success("搜索成功");
    } else {
      message.error(`搜索失败：${res.data.message}`);
    }
  } catch (error) {
    console.error(error);
    message.error("网络异常，提交失败");
  }
};
</script>

<style scoped>

.search-result-container {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: center;
}
</style>

<template>
  <div id="userCenter">
    <a-row :gutter="[16, 16]" justify="center" align="middle">
      <!-- 用户信息 -->
      <a-col :sm="24" :md="24" :xl="24" id="user-info-card">
        <a-card title="用户信息" id="card-content">
          <a-descriptions :column="1" id="large-text" class="ant-text-center">
            <a-descriptions-item label="用户id">
              {{ loginUser.id }}
            </a-descriptions-item>
            <a-descriptions-item label="作者">
              <a-space>
                <a-avatar :size="50" :src="loginUser?.userAvatar" />
                <div>{{ loginUser?.userName }}</div>
              </a-space>
            </a-descriptions-item>
            <a-descriptions-item label="用户简介">
              {{ loginUser.userProfile?? '-' }}
            </a-descriptions-item>
            <a-descriptions-item label="用户角色">
              {{ loginUser.userRole }}
            </a-descriptions-item>
            <a-descriptions-item label="创建时间">
              {{ dayjs(loginUser.createTime).format('YYYY-MM-DD HH:mm:ss') }}
            </a-descriptions-item>
          </a-descriptions>
          <!-- 图片操作 -->
          <a-space wrap style="margin-top: 30px;">
            <a-button v-if="canEdit" type="default" @click="doEdit">
              编辑
              <template #icon>
                <EditOutlined />
              </template>
            </a-button>
          </a-space>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import { useLoginUserStore } from '@/stores/userloginUserStore';
import router from '@/router';
import dayjs from 'dayjs'

//编写权限判断逻辑，canEdit 的值为 true 表示有编辑和删除权限
const loginUserStore = useLoginUserStore();
const loginUser = loginUserStore.loginUser;
// 是否具有编辑权限
const canEdit = computed(() => {
  // 未登录不可编辑
  if (!loginUser.id) {
    return false;
  }
  return true;
});
// 编辑
const doEdit = () => {
  router.push('/add_user_picture');
};
</script>

<style scoped>
#user-info-card, #card-content {
  width: 100%;
  max-width: 80%; /* 或者其他合适的最大宽度 */
  margin: 0 auto; /* 水平居中 */
}
#userCenter #large-text {
  font-size: 30px; /* 100px可能过大，调整为更合适的大小 */
}
</style>

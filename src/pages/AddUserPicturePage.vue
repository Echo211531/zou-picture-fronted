<template>
  <div id="addUserPicturePage">
    <h2 style="margin-bottom: 16px">编辑用户信息</h2>
    <!-- 显示当前头像 -->
    <div v-if="latestAvatarUrl?.url" class="current-avatar">
      <img :src="latestAvatarUrl.url" alt="当前头像" />
    </div>
    <a-form layout="vertical" :model="userForm" @finish="handleSubmit">
      <a-form-item label="头像" name="userAvatar">
        <UserPictureUpload :picture="latestAvatarUrl" :onSuccess="onSuccess" />
      </a-form-item>
      <a-form-item label="用户名" name="userName">
        <a-input v-model:value="userForm.userName" placeholder="请输入用户名" />
      </a-form-item>
      <a-form-item label="简介" name="userProfile">
        <a-textarea
          v-model:value="userForm.userProfile"
          placeholder="请输入简介"
          :rows="2"
          autoSize
          allowClear
        />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit" style="width: 100%">保存</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { nextTick, reactive, ref } from 'vue'
import { useLoginUserStore } from '@/stores/userloginUserStore'

import { updateUserUsingPost } from '@/api/userController'
import { message } from 'ant-design-vue'
import router from '@/router'
import UserPictureUpload from '@/components/UserPictureUpload.vue'

// 获取用户信息store
const loginUserStore = useLoginUserStore()
const loginUser = loginUserStore.loginUser;

// 初始化用户表单数据
const userForm = reactive(<API.UserUpdateRequest>{
  id: loginUser.id,
  userAvatar: loginUser.userAvatar,
  userName: loginUser.userName,
  userProfile: loginUser.userProfile ,
  userRole:loginUser.userRole
})
// 在父组件中添加响应式变量 latestAvatarUrl，传入子组件的pictureUrl属性，子组件变化了，父组件会同步变化
const latestAvatarUrl = ref<API.UploadUserPictureResult | undefined>(userForm.userAvatar);

// 处理头像上传成功后的回调
//把子组件的url传给父组件
const onSuccess = (newAvatarUrl: API.UploadUserPictureResult) => {
  userForm.userAvatar = newAvatarUrl.url;  //发给后端更新字段用
  latestAvatarUrl.value = newAvatarUrl; // 更新最新头像URL
}

// 提交表单
const handleSubmit = async () => {
  const res = await updateUserUsingPost({ //异步获取后端更新后的数据
    ...userForm,
    userAvatar: String(userForm.userAvatar) // 确保它是字符串
  });

  if (res.data.code === 0 && res.data.data) {
    message.success('更新成功')
    // 更新成功后重写获取最新用户数据，并等待其完成
    await loginUserStore.fetchLoginUser();
    await nextTick();
    // 跳转回个人中心页
    router.push('/userCenter')
  } else {
    message.error('更新失败，' + res.data.message)
  }
}

</script>

<style scoped>
#addUserPicturePage {
  max-width: 720px;
  margin: 0 auto;
}
.current-avatar {
  text-align: center;
  margin-bottom: 20px;
}
/*响应式展示图片*/
.current-avatar img {
  max-width: 100%; /* 确保图片不会超出其容器 */
  height: auto; /* 保持宽高比 */
  border-radius: 50%; /* 圆形头像 */
  width: 100px; /* 设置最大宽度 */
}
</style>

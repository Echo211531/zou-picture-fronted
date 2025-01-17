<template>
  <div id="aiMessage">
    <h3 >
      AI扩图地址会过期，请尽快下载！！
    </h3>
    <a-table :columns="columns" :data-source="messageList" :loading="loading" row-key="id">
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'outputImageUrl'">
          <a-image :src="record.outputImageUrl" :width="120" />
        </template>
        <template v-else-if="column.dataIndex === 'endTime'">
          {{ dayjs(record.endTime).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
        <template v-else-if="column.key === 'action'">
          <a-space wrap>
            <a-button type="primary" @click="doDownload(record)">
              下载
              <template #icon>
                <DownloadOutlined />
              </template>
            </a-button>
            <a-button type="link" danger>
              <a-popconfirm
                title="确认删除图片吗?"
                ok-text="是"
                cancel-text="否"
                @confirm="deleteMessage(record.id)"
              >
                <a href="#">删除</a>
              </a-popconfirm>
            </a-button>
          </a-space>
        </template>
      </template>
    </a-table>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { message } from 'ant-design-vue';
import { deleteMessageUsingPost, listMessageUsingPost } from '@/api/messageController'
import { useLoginUserStore } from '@/stores/userloginUserStore'
import dayjs from 'dayjs'
import { downloadImage } from '@/utils'

const columns = [
  {
    title: '任务ID',
    dataIndex: 'taskId',
    key: 'taskId',
  },
  {
    title: '任务状态',
    dataIndex: 'taskStatus',
  },
  {
    title: 'AI扩图',
    dataIndex: 'outputImageUrl',
  },
  {
    title: '生成时间',
    dataIndex: 'endTime',
  },
  {
    title: '操作',
    key: 'action',
  },
];

const messageList = ref<API.Message[]>([]); // 修改为数组
// 处理下载，接收 record 参数
const doDownload = (record: API.Message) => {
  if (record.outputImageUrl) {
    downloadImage(record.outputImageUrl);
  }
};
const loading = ref(false);
const loginUser=useLoginUserStore()

// 获取AI扩图消息列表
const fetchMessageList = async () => {
  try {
    loading.value = true;
    const res = await listMessageUsingPost({
      userId: loginUser.loginUser.id
    });
    if (res.data.data) {
      messageList.value = res.data.data.records ?? []
    }
  } catch (error) {
    console.error('获取AI扩图消息列表失败', error);
    message.error('获取AI扩图消息列表失败');
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchMessageList(); // 页面加载时立即获取一次消息列表
});

// 删除AI扩图消息
const deleteMessage = async (id) => {
  try {
    const res = await deleteMessageUsingPost({
      id,
      userId: loginUser.loginUser.id
    });
    if (res.data.code === 0) {
      message.success('删除成功');
      await fetchMessageList(); // 刷新列表
    } else {
      message.error('删除失败，' + res.data.message);
    }
  } catch (error) {
    message.error('删除AI扩图消息失败');
  }
};

</script>

<style scoped>
.picture-search-form .ant-form-item {
  margin-top: 16px;
}
</style>

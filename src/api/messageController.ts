// @ts-ignore
/* eslint-disable */
import request from '@/request'

/** deleteMessage POST /api/ai/delete */
export async function deleteMessageUsingPost(
  body: API.MessageRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean_>('/api/ai/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** getAiMessage GET /api/ai/get */
export async function getAiMessageUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getAiMessageUsingGETParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseMessage_>('/api/ai/get', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  })
}

/** listMessage POST /api/ai/list */
export async function listMessageUsingPost(
  body: API.MessageRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePageMessage_>('/api/ai/list', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

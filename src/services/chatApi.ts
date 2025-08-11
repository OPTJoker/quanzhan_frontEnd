import axios from 'axios';
import type { APIResponse, Chat, Message, CreateChatRequest, SendMessageRequest } from '../types/api';

const API_BASE_URL = '/api/v1';

// 创建axios实例
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 响应拦截器处理错误
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export class ChatAPI {
  // 获取所有聊天
  static async getChats(): Promise<Chat[]> {
    const response = await apiClient.get<APIResponse<Chat[]>>('/chats');
    return response.data.data || [];
  }

  // 创建新聊天
  static async createChat(request: CreateChatRequest): Promise<Chat> {
    const response = await apiClient.post<APIResponse<Chat>>('/chats', request);
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Failed to create chat');
    }
    return response.data.data;
  }

  // 获取聊天历史
  static async getChatHistory(sessionId: string): Promise<Message[]> {
    const response = await apiClient.get<APIResponse<Chat>>(`/chats/${sessionId}`);
    return response.data.data?.messages || [];
  }

  // 发送消息
  static async sendMessage(sessionId: string, request: SendMessageRequest): Promise<Message> {
    const response = await apiClient.post<APIResponse<Message>>(`/chats/${sessionId}/messages`, request);
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Failed to send message');
    }
    return response.data.data;
  }

  // 健康检查
  static async healthCheck(): Promise<boolean> {
    try {
      const response = await axios.get('/health');
      return response.status === 200;
    } catch {
      return false;
    }
  }
}

export default ChatAPI;

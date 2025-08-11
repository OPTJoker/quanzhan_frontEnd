// API响应类型定义
export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

// 聊天相关类型
export interface Chat {
  id: number;
  session_id: string;
  title: string;
  created_at: string;
  updated_at: string;
  messages?: Message[];
}

export interface Message {
  id: number;
  chat_id: number;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

// 请求类型
export interface CreateChatRequest {
  title: string;
}

export interface SendMessageRequest {
  message: string;
}

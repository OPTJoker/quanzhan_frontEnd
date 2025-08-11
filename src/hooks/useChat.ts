import { useState, useCallback } from 'react';
import type { Chat, Message } from '../types/api';
import ChatAPI from '../services/chatApi';

export const useChat = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 加载所有聊天
  const loadChats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const chatList = await ChatAPI.getChats();
      setChats(chatList);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load chats');
    } finally {
      setLoading(false);
    }
  }, []);

  // 创建新聊天
  const createChat = useCallback(async (title: string) => {
    try {
      setLoading(true);
      setError(null);
      const newChat = await ChatAPI.createChat({ title });
      setChats(prev => [newChat, ...prev]);
      setCurrentChat(newChat);
      setMessages([]);
      return newChat;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create chat');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // 选择聊天并加载历史
  const selectChat = useCallback(async (chat: Chat) => {
    try {
      setLoading(true);
      setError(null);
      setCurrentChat(chat);
      
      const history = await ChatAPI.getChatHistory(chat.session_id);
      setMessages(history);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load chat history');
    } finally {
      setLoading(false);
    }
  }, []);

  // 发送消息
  const sendMessage = useCallback(async (content: string) => {
    if (!currentChat) {
      throw new Error('No chat selected');
    }

    try {
      setLoading(true);
      setError(null);

      // 添加用户消息到UI
      const userMessage: Message = {
        id: Date.now(), // 临时ID
        chat_id: currentChat.id,
        role: 'user',
        content,
        created_at: new Date().toISOString(),
      };
      setMessages(prev => [...prev, userMessage]);

      // 发送到后端
      const response = await ChatAPI.sendMessage(currentChat.session_id, { message: content });
      
      // 更新最后的用户消息和添加AI回复
      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = { ...userMessage, id: response.id };
        return updated;
      });

      // 重新加载聊天历史以获取AI回复
      const history = await ChatAPI.getChatHistory(currentChat.session_id);
      setMessages(history);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
      // 移除失败的消息
      setMessages(prev => prev.slice(0, -1));
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentChat]);

  // 清除错误
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    chats,
    currentChat,
    messages,
    loading,
    error,
    loadChats,
    createChat,
    selectChat,
    sendMessage,
    clearError,
  };
};

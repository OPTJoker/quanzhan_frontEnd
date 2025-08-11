import React from 'react';
import { List, Button, Card, Typography, Empty, Spin } from 'antd';
import { PlusOutlined, MessageOutlined } from '@ant-design/icons';
import type { Chat } from '../types/api';

const { Text } = Typography;

interface ChatListProps {
  chats: Chat[];
  currentChat: Chat | null;
  onSelectChat: (chat: Chat) => void;
  onCreateChat: () => void;
  loading: boolean;
}

export const ChatList: React.FC<ChatListProps> = ({
  chats,
  currentChat,
  onSelectChat,
  onCreateChat,
  loading,
}) => {
  return (
    <div style={{ height: '100%', minHeight: 0, display: 'flex', flexDirection: 'column' }}>
      {/* 头部 */}
      <div style={{ padding: '16px', borderBottom: '1px solid #e8e9ea' }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={onCreateChat}
          loading={loading}
          block
          size="large"
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            border: 'none',
            borderRadius: '8px',
            height: '44px',
            fontWeight: 500
          }}
        >
          新建聊天
        </Button>
      </div>

  {/* 聊天列表 */}
  <div style={{ flex: 1, minHeight: 0, height: '100%', overflow: 'auto', padding: '8px' }}>
        {loading && chats.length === 0 ? (
          <div style={{ padding: '40px 16px', textAlign: 'center' }}>
            <Spin size="large" />
            <Text style={{ display: 'block', marginTop: '16px', color: '#666' }}>
              加载中...
            </Text>
          </div>
        ) : chats.length === 0 ? (
          <Empty
            image={<MessageOutlined style={{ fontSize: '48px', color: '#d9d9d9' }} />}
            description={
              <div>
                <Text strong style={{ display: 'block', marginBottom: '8px' }}>
                  还没有聊天记录
                </Text>
                <Text type="secondary" style={{ fontSize: '14px' }}>
                  点击上方按钮开始新的AI对话
                </Text>
              </div>
            }
            style={{ marginTop: '60px' }}
          />
        ) : (
          chats.map((chat) => (
            <Card
              key={chat.id}
              hoverable
              onClick={() => onSelectChat(chat)}
              style={{
                marginBottom: '12px',
                borderRadius: '12px',
                border: currentChat?.id === chat.id 
                  ? '2px solid #667eea' 
                  : '1px solid #e8e9ea',
                background: currentChat?.id === chat.id 
                  ? 'linear-gradient(135deg, #f0f2ff 0%, #e6f7ff 100%)' 
                  : '#ffffff',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: currentChat?.id === chat.id 
                  ? '0 4px 12px rgba(102, 126, 234, 0.2)' 
                  : '0 2px 8px rgba(0,0,0,0.06)'
              }}
              bodyStyle={{ padding: '16px' }}
            >
              <div>
                <Text 
                  strong 
                  ellipsis 
                  style={{ 
                    fontSize: '15px',
                    color: currentChat?.id === chat.id ? '#1a1a1a' : '#262626',
                    display: 'block',
                    marginBottom: '8px'
                  }}
                >
                  {chat.title}
                </Text>
                <Text 
                  type="secondary" 
                  style={{ 
                    fontSize: '12px',
                    color: currentChat?.id === chat.id ? '#666' : '#8c8c8c'
                  }}
                >
                  {new Date(chat.updated_at).toLocaleDateString('zh-CN', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Text>
              </div>
              {currentChat?.id === chat.id && (
                <div 
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '6px',
                    height: '6px',
                    background: '#667eea',
                    borderRadius: '50%'
                  }}
                />
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

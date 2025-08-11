import React from 'react';
import { Avatar, Typography, Space, Spin, Empty } from 'antd';
import { UserOutlined, RobotOutlined } from '@ant-design/icons';
import type { Message } from '../types/api';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const { Text } = Typography;

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div style={{ 
      display: 'flex', 
      gap: '16px', 
      marginBottom: '24px',
      flexDirection: isUser ? 'row-reverse' : 'row',
      alignItems: 'flex-start'
    }}>
      {/* 头像 */}
      <Avatar
        size={44}
        icon={isUser ? <UserOutlined /> : <RobotOutlined />}
        style={{
          background: isUser 
            ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            : 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
          flexShrink: 0,
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
        }}
      />

      {/* 消息内容 */}
      <div style={{ 
        maxWidth: '70%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: isUser ? 'flex-end' : 'flex-start'
      }}>
        <div style={{
          padding: '16px 20px',
          borderRadius: '18px',
          background: isUser 
            ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            : '#ffffff',
          color: isUser ? '#ffffff' : '#1a1a1a',
          border: !isUser ? '1px solid #e8e9ea' : 'none',
          boxShadow: isUser 
            ? '0 4px 16px rgba(102, 126, 234, 0.3)'
            : '0 2px 8px rgba(0,0,0,0.08)',
          borderBottomRightRadius: isUser ? '6px' : '18px',
          borderBottomLeftRadius: !isUser ? '6px' : '18px',
          wordBreak: 'break-word',
          lineHeight: 1.6,
          fontSize: '15px',
          overflowX: 'auto'
        }}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              a: ({node, ...props}: any) => <a {...props} style={{ color: '#6366f1', textDecoration: 'underline' }} />,
              code: ({node, inline, ...props}: any) =>
                inline
                  ? <code style={{ background: '#f3f4f6', borderRadius: '4px', padding: '2px 4px', fontSize: '13px' }} {...props} />
                  : <pre style={{ background: '#f3f4f6', borderRadius: '8px', padding: '12px', fontSize: '13px', overflowX: 'auto' }}><code {...props} /></pre>,
              blockquote: ({node, ...props}: any) => <blockquote style={{ borderLeft: '4px solid #6366f1', background: '#f8fafc', margin: 0, padding: '8px 16px', color: '#555', fontStyle: 'italic' }} {...props} />,
              ul: ({node, ...props}: any) => <ul style={{ paddingLeft: '20px', margin: '8px 0' }} {...props} />,
              ol: ({node, ...props}: any) => <ol style={{ paddingLeft: '20px', margin: '8px 0' }} {...props} />,
              li: ({node, ...props}: any) => <li style={{ marginBottom: '4px' }} {...props} />,
              h1: ({node, ...props}: any) => <h1 style={{ fontSize: '1.3em', fontWeight: 700, margin: '12px 0 8px' }} {...props} />,
              h2: ({node, ...props}: any) => <h2 style={{ fontSize: '1.15em', fontWeight: 700, margin: '10px 0 6px' }} {...props} />,
              h3: ({node, ...props}: any) => <h3 style={{ fontSize: '1em', fontWeight: 700, margin: '8px 0 4px' }} {...props} />,
              p: ({node, ...props}: any) => <p style={{ margin: '8px 0' }} {...props} />,
            }}
          >
            {message.content}
          </ReactMarkdown>
        </div>
        {/* 时间戳 */}
        <Text 
          type="secondary" 
          style={{ 
            fontSize: '12px',
            marginTop: '8px',
            marginLeft: isUser ? '0' : '8px',
            marginRight: !isUser ? '0' : '8px'
          }}
        >
          {new Date(message.created_at).toLocaleTimeString('zh-CN', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
      </div>
    </div>
  );
};

interface MessageListProps {
  messages: Message[];
  loading: boolean;
}

export const MessageList: React.FC<MessageListProps> = ({ messages, loading }) => {
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  // 自动滚动到底部
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div style={{ 
      flex: 1,
      height: '100%',
      overflow: 'auto',
      padding: '24px',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
    }}>
      {messages.length === 0 ? (
        <div style={{ 
          height: '100%', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center' 
        }}>
          <Empty
            image={<RobotOutlined style={{ fontSize: '64px', color: '#d9d9d9' }} />}
            description={
              <div>
                <Text strong style={{ fontSize: '18px', display: 'block', marginBottom: '8px' }}>
                  开始新的对话
                </Text>
                <Text type="secondary" style={{ fontSize: '14px' }}>
                  向AI助手提问任何问题，开始一段有趣的智能对话
                </Text>
              </div>
            }
          />
        </div>
      ) : (
        <>
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
          
          {/* 加载指示器 */}
          {loading && (
            <div style={{ 
              display: 'flex', 
              gap: '16px', 
              marginBottom: '24px',
              alignItems: 'flex-start'
            }}>
              <Avatar
                size={44}
                icon={<RobotOutlined />}
                style={{
                  background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                  flexShrink: 0,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                }}
              />
              <div style={{
                padding: '16px 20px',
                borderRadius: '18px',
                background: '#ffffff',
                border: '1px solid #e8e9ea',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                borderBottomLeftRadius: '6px'
              }}>
                <Space>
                  <Spin size="small" />
                  <Text>AI正在思考中...</Text>
                </Space>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </>
      )}
    </div>
  );
};

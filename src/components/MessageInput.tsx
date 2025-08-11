import React, { useState } from 'react';
import { Input, Button, Space, Typography } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import type { KeyboardEvent } from 'react';

const { TextArea } = Input;
const { Text } = Typography;

interface MessageInputProps {
  onSendMessage: (message: string) => Promise<void>;
  disabled?: boolean;
  placeholder?: string;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  disabled = false,
  placeholder = "输入消息...",
}) => {
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    const trimmedMessage = message.trim();
    if (!trimmedMessage || sending || disabled) return;

    try {
      setSending(true);
      await onSendMessage(trimmedMessage);
      setMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      if (e.shiftKey) {
        // Shift+Enter 换行
        return;
      } else {
        // Enter 发送
        e.preventDefault();
        handleSend();
      }
    }
  };

  const isDisabled = disabled || sending || !message.trim();

  return (
    <div style={{ 
      padding: '20px 24px',
      background: 'rgba(255,255,255,0.9)',
      backdropFilter: 'blur(10px)'
    }}>
      <Space.Compact style={{ width: '100%', display: 'flex' }}>
        <TextArea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled || sending}
          autoSize={{ minRows: 1, maxRows: 4 }}
          style={{
            flex: 1,
            borderRadius: '20px',
            fontSize: '15px',
            lineHeight: '1.5',
            border: '2px solid #e8e9ea',
            boxShadow: 'none'
          }}
        />
        <Button
          type="primary"
          icon={<SendOutlined />}
          onClick={handleSend}
          disabled={isDisabled}
          loading={sending}
          size="large"
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            border: 'none',
            borderRadius: '20px',
            marginLeft: '12px',
            width: '56px',
            height: '56px',
            boxShadow: '0 4px 16px rgba(102, 126, 234, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        />
      </Space.Compact>
      
      <Text 
        type="secondary" 
        style={{ 
          fontSize: '12px',
          marginTop: '8px',
          display: 'block',
          textAlign: 'center'
        }}
      >
        {sending ? '发送中...' : 'Enter发送 • Shift+Enter换行'}
      </Text>
    </div>
  );
};

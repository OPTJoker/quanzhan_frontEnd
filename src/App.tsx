import { useEffect, useState } from 'react';
import { Layout, Badge, notification, Modal, Input, Button, Typography, Space, ConfigProvider, theme } from 'antd';
import { WifiOutlined, DisconnectOutlined, RobotOutlined, PlusOutlined } from '@ant-design/icons';
import { useChat } from './hooks/useChat';
import { ChatList } from './components/ChatList';
import { MessageList } from './components/MessageList';
import { MessageInput } from './components/MessageInput';
import ChatAPI from './services/chatApi';

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

function App() {
  const {
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
  } = useChat();

  const [isOnline, setIsOnline] = useState(true);
  const [showNewChatDialog, setShowNewChatDialog] = useState(false);
  const [newChatTitle, setNewChatTitle] = useState('');

  // 检查网络连接状态
  useEffect(() => {
    const checkConnection = async () => {
      const online = await ChatAPI.healthCheck();
      setIsOnline(online);
    };

    checkConnection();
    const interval = setInterval(checkConnection, 30000); // 每30秒检查一次

    return () => clearInterval(interval);
  }, []);

  // 初始加载聊天列表
  useEffect(() => {
    loadChats();
  }, [loadChats]);

  // 显示错误通知
  useEffect(() => {
    if (error) {
      notification.error({
        message: '错误',
        description: error,
        duration: 4.5,
      });
      clearError();
    }
  }, [error, clearError]);

  // 创建新聊天处理
  const handleCreateChat = () => {
    setShowNewChatDialog(true);
    setNewChatTitle('');
  };

  const confirmCreateChat = async () => {
    const title = newChatTitle.trim() || `聊天 ${new Date().toLocaleString('zh-CN')}`;
    try {
      await createChat(title);
      setShowNewChatDialog(false);
      setNewChatTitle('');
    } catch (error) {
      console.error('Failed to create chat:', error);
    }
  };

  const cancelCreateChat = () => {
    setShowNewChatDialog(false);
    setNewChatTitle('');
  };

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: '#6366f1',
          borderRadius: 12,
          colorBgContainer: '#ffffff',
          colorBgElevated: '#ffffff',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
          boxShadowSecondary: '0 2px 8px rgba(0, 0, 0, 0.06)',
        },
        components: {
          Layout: {
            bodyBg: '#f8fafc',
            headerBg: '#ffffff',
            siderBg: '#ffffff',
          },
          Button: {
            borderRadius: 12,
            controlHeight: 44,
          },
          Input: {
            borderRadius: 12,
            controlHeight: 44,
          },
          Card: {
            borderRadius: 16,
          },
          Modal: {
            borderRadius: 16,
          }
        }
      }}
    >
  <Layout style={{ height: '100vh', minHeight: 0 }}>
      {/* 顶部导航栏 */}
      <Header style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <Space align="center">
          <div style={{
            width: 40,
            height: 40,
            background: 'rgba(255,255,255,0.2)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <RobotOutlined style={{ fontSize: '20px', color: 'white' }} />
          </div>
          <Title level={3} style={{ color: 'white', margin: 0 }}>
            智能聊天助手
          </Title>
        </Space>
        
        <Badge 
          status={isOnline ? "success" : "error"} 
          text={
            <Text style={{ color: 'white' }}>
              {isOnline ? <WifiOutlined /> : <DisconnectOutlined />}
              {isOnline ? ' 在线' : ' 离线'}
            </Text>
          }
        />
      </Header>

  <Layout style={{ height: '100%' }}>
        {/* 左侧聊天列表 */}
        <Sider 
          width={320} 
          style={{ 
            background: '#f8f9fa',
            borderRight: '1px solid #e8e9ea'
          }}
        >
          <ChatList
            chats={chats}
            currentChat={currentChat}
            onSelectChat={selectChat}
            onCreateChat={handleCreateChat}
            loading={loading}
          />
        </Sider>

        {/* 右侧聊天区域 */}
  <Content style={{ background: '#ffffff', height: '100%', minHeight: 0 }}>
          {currentChat ? (
            <Layout style={{ height: '100%', minHeight: 0, background: 'transparent' }}>
              {/* 聊天头部 */}
              <Header style={{ 
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #d946ef 100%)',
                borderBottom: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                height: '88px',
                padding: '0 32px',
                boxShadow: '0 4px 20px rgba(99, 102, 241, 0.2), 0 1px 3px rgba(0,0,0,0.1)',
                position: 'relative',
                overflow: 'hidden'
              }}>
                {/* 动态背景装饰 */}
                <div style={{
                  position: 'absolute',
                  top: '-30%',
                  right: '-10%',
                  width: '150px',
                  height: '150px',
                  background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)',
                  borderRadius: '50%',
                  animation: 'float 6s ease-in-out infinite'
                }} />
                <div style={{
                  position: 'absolute',
                  bottom: '-30%',
                  left: '-5%',
                  width: '100px',
                  height: '100px',
                  background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)',
                  borderRadius: '50%',
                  animation: 'float 8s ease-in-out infinite reverse'
                }} />
                
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                    <div style={{
                      width: '8px',
                      height: '8px',
                      background: '#10b981',
                      borderRadius: '50%',
                      boxShadow: '0 0 12px rgba(16, 185, 129, 0.8)',
                      animation: 'pulse 2s ease-in-out infinite'
                    }} />
                    <Title level={3} style={{ 
                      margin: 0, 
                      color: 'white',
                      fontWeight: 700,
                      fontSize: '22px',
                      textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                      letterSpacing: '0.3px'
                    }}>
                      {currentChat.title}
                    </Title>
                  </div>
                  <Text style={{ 
                    fontSize: '13px',
                    color: 'rgba(255,255,255,0.85)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontWeight: 500
                  }}>
                    <RobotOutlined style={{ fontSize: '14px' }} />
                    智能对话中 • {new Date(currentChat.updated_at).toLocaleDateString('zh-CN', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </Text>
                </div>
                
                <div style={{ 
                  position: 'relative', 
                  zIndex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px'
                }}>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <Badge 
                      count={messages.length} 
                      style={{ 
                        backgroundColor: 'rgba(255,255,255,0.25)',
                        color: 'white',
                        fontSize: '11px',
                        fontWeight: 600,
                        border: '1px solid rgba(255,255,255,0.3)',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                      }}
                      overflowCount={99}
                    />
                    <Text style={{ 
                      color: 'rgba(255,255,255,0.8)', 
                      fontSize: '10px',
                      fontWeight: 500
                    }}>
                      消息数
                    </Text>
                  </div>
                  
                  <div style={{
                    padding: '8px 16px',
                    background: 'rgba(255,255,255,0.15)',
                    borderRadius: '24px',
                    backdropFilter: 'blur(15px)',
                    border: '1px solid rgba(255,255,255,0.25)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}>
                    <Text style={{ 
                      color: 'white', 
                      fontSize: '13px',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      <span style={{
                        width: '6px',
                        height: '6px',
                        background: '#fbbf24',
                        borderRadius: '50%',
                        animation: 'pulse 1.5s ease-in-out infinite'
                      }} />
                      AI 助手
                    </Text>
                  </div>
                </div>
              </Header>

              {/* 消息列表 */}
              <Content style={{ background: 'transparent', height: '100%', minHeight: 0 }}>
                <MessageList messages={messages} loading={loading} />
              </Content>

              {/* 消息输入 */}
              <div style={{ borderTop: '1px solid #e8e9ea' }}>
                <MessageInput
                  onSendMessage={sendMessage}
                  disabled={!isOnline || loading}
                  placeholder={!isOnline ? "连接断开，无法发送消息" : "输入消息..."}
                />
              </div>
            </Layout>
          ) : (
            // 无选中聊天时的欢迎页面
            <div style={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
            }}>
              <div style={{ textAlign: 'center', maxWidth: '500px', padding: '40px' }}>
                <div style={{
                  width: 80,
                  height: 80,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 24px',
                  boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)'
                }}>
                  <RobotOutlined style={{ fontSize: '36px', color: 'white' }} />
                </div>
                <Title level={2} style={{ marginBottom: '16px', color: '#1a1a1a' }}>
                  欢迎使用 AI 聊天助手
                </Title>
                <Text style={{ 
                  fontSize: '16px', 
                  color: '#666',
                  display: 'block',
                  marginBottom: '32px',
                  lineHeight: 1.6
                }}>
                  开始一段智能对话，探索AI的无限可能。<br />
                  选择已有聊天或创建新的对话开始使用。
                </Text>
                <Button 
                  type="primary" 
                  size="large"
                  icon={<PlusOutlined />}
                  onClick={handleCreateChat}
                  style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    border: 'none',
                    borderRadius: '12px',
                    height: '48px',
                    fontSize: '16px',
                    boxShadow: '0 4px 16px rgba(102, 126, 234, 0.3)'
                  }}
                >
                  开始新聊天
                </Button>
              </div>
            </div>
          )}
        </Content>
      </Layout>

      {/* 新建聊天对话框 */}
      <Modal
        title="创建新聊天"
        open={showNewChatDialog}
        onOk={confirmCreateChat}
        onCancel={cancelCreateChat}
        okText="创建"
        cancelText="取消"
        confirmLoading={loading}
        style={{ borderRadius: '12px' }}
      >
        <Input
          value={newChatTitle}
          onChange={(e) => setNewChatTitle(e.target.value)}
          placeholder="为你的聊天起个名字..."
          onPressEnter={confirmCreateChat}
          autoFocus
          style={{ borderRadius: '8px' }}
        />
      </Modal>
    </Layout>
    </ConfigProvider>
  );
}

export default App;

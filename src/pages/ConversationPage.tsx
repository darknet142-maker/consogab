import React from 'react';
import { useParams } from 'react-router-dom';
import { ChatLayout } from '@/features/chat/components/ChatLayout';

export const ConversationPage: React.FC = () => {
  const { conversationId } = useParams<{ conversationId: string }>();

  return (
    <div className="h-[calc(100vh-4rem)]">
      <ChatLayout initialConversationId={conversationId} />
    </div>
  );
};

export default ConversationPage;

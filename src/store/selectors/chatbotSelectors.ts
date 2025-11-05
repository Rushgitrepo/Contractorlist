import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../index';

// Base selector
const selectChatbotState = (state: RootState) => state.chatbot;

// Basic selectors
export const selectIsChatbotOpen = createSelector(
  [selectChatbotState],
  (chatbot) => chatbot.isOpen
);

export const selectMessages = createSelector(
  [selectChatbotState],
  (chatbot) => chatbot.messages
);

export const selectIsTyping = createSelector(
  [selectChatbotState],
  (chatbot) => chatbot.isTyping
);

export const selectChatbotLoading = createSelector(
  [selectChatbotState],
  (chatbot) => chatbot.isLoading
);

export const selectChatbotError = createSelector(
  [selectChatbotState],
  (chatbot) => chatbot.error
);

export const selectCurrentConversationId = createSelector(
  [selectChatbotState],
  (chatbot) => chatbot.currentConversationId
);

// Complex selectors
export const selectMessageCount = createSelector(
  [selectMessages],
  (messages) => messages.length
);

export const selectUserMessages = createSelector(
  [selectMessages],
  (messages) => messages.filter(message => !message.isBot)
);

export const selectBotMessages = createSelector(
  [selectMessages],
  (messages) => messages.filter(message => message.isBot)
);

export const selectLatestMessage = createSelector(
  [selectMessages],
  (messages) => messages[messages.length - 1] || null
);

export const selectLatestUserMessage = createSelector(
  [selectUserMessages],
  (userMessages) => userMessages[userMessages.length - 1] || null
);

export const selectLatestBotMessage = createSelector(
  [selectBotMessages],
  (botMessages) => botMessages[botMessages.length - 1] || null
);

export const selectConversationSummary = createSelector(
  [selectMessages, selectMessageCount],
  (messages, messageCount) => ({
    totalMessages: messageCount,
    userMessageCount: messages.filter(m => !m.isBot).length,
    botMessageCount: messages.filter(m => m.isBot).length,
    firstMessage: messages[0] || null,
    lastMessage: messages[messages.length - 1] || null,
    conversationStarted: messages.length > 1, // More than just the initial bot message
  })
);

export const selectChatbotStatus = createSelector(
  [selectIsChatbotOpen, selectIsTyping, selectChatbotLoading, selectChatbotError],
  (isOpen, isTyping, isLoading, error) => ({
    isOpen,
    isTyping,
    isLoading,
    hasError: !!error,
    error,
    isActive: isOpen && !error,
  })
);

export const selectMessagesByType = createSelector(
  [selectMessages, (_, type: string) => type],
  (messages, type) => messages.filter(message => message.type === type)
);

export const selectRecentMessages = createSelector(
  [selectMessages, (_, count: number = 10) => count],
  (messages, count) => messages.slice(-count)
);
import { render, screen, fireEvent } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Record from './record';
import type { ChatData } from '../../../types';
import type { ReactNode } from 'react';

/**
 * Mocks
 */

vi.mock('../../../hooks/useFocusTrap', () => ({
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  useFocusTrap: () => {},
}));

interface MockChatTileProps {
  chat?: {
    id: string;
    name?: string;
  };
  type?: 'add' | 'export-import';
  onClick?: () => void;
}

vi.mock('../../atoms/chat-tile/chat-tile', () => ({
  default: ({ chat, type, onClick }: MockChatTileProps): ReactNode => (
    <button
      onClick={onClick}
      data-testid={
        type === 'add'
          ? 'add-chat'
          : type === 'export-import'
            ? 'export-import'
            : `chat-${chat?.id}`
      }
    >
      {type ?? chat?.name}
    </button>
  ),
}));

/**
 * Data
 */

const chats: ChatData[] = [
  {
    id: '1',
    name: 'Chat 1',
    timestamp: '10:00',
    messages: [
      {
        id: 'm1',
        text: 'Chat 1',
        timestamp: '10:00',
        isStarred: true,
      },
    ],
  },
  {
    id: '2',
    name: 'Chat 2',
    timestamp: '11:00',
    messages: [
      {
        id: 'm2',
        text: 'Chat 2',
        timestamp: '11:00',
        isStarred: true,
      },
    ],
  },
];

/**
 * Tests
 */

describe('Record component', () => {
  const onCreateChat = vi.fn();
  const onSelectChat = vi.fn();
  const onDeleteChat = vi.fn();
  const onImportExport = vi.fn();
  const setMenuTriggerRef = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all chats', () => {
    render(
      <Record
        chats={chats}
        onCreateChat={onCreateChat}
        onSelectChat={onSelectChat}
        onDeleteChat={onDeleteChat}
        onImportExport={onImportExport}
        setMenuTriggerRef={setMenuTriggerRef}
      />
    );

    expect(screen.getByTestId('chat-1')).toBeInTheDocument();
    expect(screen.getByTestId('chat-2')).toBeInTheDocument();
  });

  it('calls onSelectChat when clicking a chat', () => {
    render(
      <Record
        chats={chats}
        onCreateChat={onCreateChat}
        onSelectChat={onSelectChat}
        onDeleteChat={onDeleteChat}
        onImportExport={onImportExport}
        setMenuTriggerRef={setMenuTriggerRef}
      />
    );

    fireEvent.click(screen.getByTestId('chat-1'));

    expect(onSelectChat).toHaveBeenCalledWith('1');
  });

  it('calls onCreateChat when clicking add chat', () => {
    render(
      <Record
        chats={chats}
        onCreateChat={onCreateChat}
        onSelectChat={onSelectChat}
        onDeleteChat={onDeleteChat}
        onImportExport={onImportExport}
        setMenuTriggerRef={setMenuTriggerRef}
      />
    );

    fireEvent.click(screen.getByTestId('add-chat'));

    expect(onCreateChat).toHaveBeenCalled();
  });

  it('calls onImportExport when clicking export/import', () => {
    render(
      <Record
        chats={chats}
        onCreateChat={onCreateChat}
        onSelectChat={onSelectChat}
        onDeleteChat={onDeleteChat}
        onImportExport={onImportExport}
        setMenuTriggerRef={setMenuTriggerRef}
      />
    );

    fireEvent.click(screen.getByTestId('export-import'));

    expect(onImportExport).toHaveBeenCalled();
  });

  it('renders add and export/import tiles', () => {
    render(
      <Record
        chats={chats}
        onCreateChat={onCreateChat}
        onSelectChat={onSelectChat}
        onDeleteChat={onDeleteChat}
        onImportExport={onImportExport}
        setMenuTriggerRef={setMenuTriggerRef}
      />
    );

    expect(screen.getByTestId('add-chat')).toBeInTheDocument();
    expect(screen.getByTestId('export-import')).toBeInTheDocument();
  });
});

import { render, screen, fireEvent } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import MessagesContainer from './messages-container';
import type { MessageData } from '../../../types';

/**
 * Mocks
 */

vi.mock('../../atoms/message/message', () => ({
  default: ({
    text,
    onOpenMenu,
  }: {
    text: string;
    onOpenMenu: (e: React.MouseEvent<HTMLParagraphElement>) => void;
  }) => (
    <p data-testid="message" onClick={(e) => onOpenMenu(e)}>
      {text}
    </p>
  ),
}));

vi.mock('../../atoms/date-badge/date-badge', () => ({
  default: ({ timestamp }: { timestamp: string }) => (
    <span data-testid="date-badge">{timestamp}</span>
  ),
}));

vi.mock('../../atoms/status-message/status-message', () => ({
  default: ({ type }: { type: string }) => (
    <div data-testid="status">{type}</div>
  ),
}));

/**
 * Data
 */

const messages: MessageData[] = [
  {
    id: '1',
    text: 'Hello',
    timestamp: '2024-01-01T10:00:00',
    isStarred: false,
  },
  {
    id: '2',
    text: 'World',
    timestamp: '2024-01-02T11:00:00',
    isStarred: true,
  },
];

/**
 * Tests
 */

describe('MessagesContainer', () => {
  const setOpenMenuId = vi.fn();
  const setMenuTriggerRef = vi.fn();
  const onCancelEditing = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders messages', () => {
    render(
      <MessagesContainer
        messages={messages}
        openMenuId=""
        setOpenMenuId={setOpenMenuId}
        setMenuTriggerRef={setMenuTriggerRef}
        messageToEdit={null}
        onCancelEditing={onCancelEditing}
        status={null}
        promptOffset={0}
      />
    );

    expect(screen.getAllByTestId('message')).toHaveLength(2);
  });

  it('renders date badges when date changes', () => {
    render(
      <MessagesContainer
        messages={messages}
        openMenuId=""
        setOpenMenuId={setOpenMenuId}
        setMenuTriggerRef={setMenuTriggerRef}
        messageToEdit={null}
        onCancelEditing={onCancelEditing}
        status={null}
        promptOffset={0}
      />
    );

    expect(screen.getAllByTestId('date-badge')).toHaveLength(2);
  });

  it('renders status message when status exists', () => {
    render(
      <MessagesContainer
        messages={messages}
        openMenuId=""
        setOpenMenuId={setOpenMenuId}
        setMenuTriggerRef={setMenuTriggerRef}
        messageToEdit={null}
        onCancelEditing={onCancelEditing}
        status="edited"
        promptOffset={0}
      />
    );

    expect(screen.getByTestId('status')).toBeInTheDocument();
  });

  it('prioritizes editing status when messageToEdit exists', () => {
    render(
      <MessagesContainer
        messages={messages}
        openMenuId=""
        setOpenMenuId={setOpenMenuId}
        setMenuTriggerRef={setMenuTriggerRef}
        messageToEdit={messages[0]}
        onCancelEditing={onCancelEditing}
        status="edited"
        promptOffset={0}
      />
    );

    expect(screen.getByText('editing')).toBeInTheDocument();
  });

  it('opens menu when clicking a message', () => {
    render(
      <MessagesContainer
        messages={messages}
        openMenuId=""
        setOpenMenuId={setOpenMenuId}
        setMenuTriggerRef={setMenuTriggerRef}
        messageToEdit={null}
        onCancelEditing={onCancelEditing}
        status={null}
        promptOffset={0}
      />
    );

    fireEvent.click(screen.getAllByTestId('message')[0]);

    expect(setOpenMenuId).toHaveBeenCalledWith('1');
    expect(setMenuTriggerRef).toHaveBeenCalled();
  });

  it('scrolls to bottom when messages change', () => {
    const scrollMock = vi.fn();

    Object.defineProperty(HTMLElement.prototype, 'scrollTop', {
      set: scrollMock,
    });

    render(
      <MessagesContainer
        messages={messages}
        openMenuId=""
        setOpenMenuId={setOpenMenuId}
        setMenuTriggerRef={setMenuTriggerRef}
        messageToEdit={null}
        onCancelEditing={onCancelEditing}
        status={null}
        promptOffset={0}
      />
    );

    expect(scrollMock).toHaveBeenCalled();
  });
});

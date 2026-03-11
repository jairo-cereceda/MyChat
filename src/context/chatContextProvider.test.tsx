import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useContext } from 'react';
import { ChatProvider, ChatContext } from './chatContextProvider';

vi.mock('../hooks/useChatPersistence', () => ({
  useChatPersistence: () => [[], vi.fn(), vi.fn()],
}));

const createChat = () => {
  fireEvent.click(screen.getByText('add-chat'));
};

const TestComponent = () => {
  const ctx = useContext(ChatContext)!;

  return (
    <>
      <button onClick={() => ctx.addNewChat()}>add-chat</button>

      <button onClick={() => ctx.addNewMessage('hello')}>add-message</button>

      <button
        onClick={() =>
          ctx.updateMessage('edited', {
            id: '1',
            text: 'hello',
            timestamp: '2024-01-01',
            isStarred: false,
          })
        }
      >
        update-message
      </button>

      <button onClick={() => ctx.deleteMessage('1')}>delete-message</button>

      <button
        onClick={() =>
          ctx.starMessage({
            id: '1',
            text: 'hello',
            timestamp: '2024-01-01',
            isStarred: false,
          })
        }
      >
        star-message
      </button>

      <div data-testid="activeChatId">{ctx.activeChatId}</div>

      <div data-testid="status">{ctx.status}</div>
    </>
  );
};

const renderProvider = () =>
  render(
    <ChatProvider>
      <TestComponent />
    </ChatProvider>
  );

describe('ChatProvider', () => {
  it('creates a new chat', () => {
    renderProvider();

    fireEvent.click(screen.getByText('add-chat'));

    expect(screen.getByTestId('activeChatId').textContent).not.toBe('');
  });

  it('creates a new message', () => {
    renderProvider();

    fireEvent.click(screen.getByText('add-message'));

    expect(screen.getByTestId('activeChatId').textContent).not.toBe('');
  });

  it('sets edited status when updating message', () => {
    renderProvider();

    createChat();

    fireEvent.click(screen.getByText('update-message'));

    expect(screen.getByTestId('status').textContent).toBe('edited');
  });

  it('sets deleted status when deleting message', () => {
    renderProvider();

    createChat();

    fireEvent.click(screen.getByText('delete-message'));

    expect(screen.getByTestId('status').textContent).toBe('deleted');
  });

  it('sets starred status when starring message', () => {
    renderProvider();

    createChat();

    fireEvent.click(screen.getByText('star-message'));

    expect(screen.getByTestId('status').textContent).toBe('starred');
  });
});

import { render, screen, fireEvent } from '@testing-library/react';
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import Prompt from './prompt';
import { type MessageData } from '../../../types';

beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(() => ({
      matches: false,
      media: '',
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
});

describe('Prompt component', () => {
  const onSendMessage = vi.fn();
  const onUpdateMessage = vi.fn();

  const inputRef = {
    current: document.createElement('textarea'),
  } as React.RefObject<HTMLTextAreaElement>;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the input and submit button', () => {
    render(
      <Prompt
        inputRef={inputRef}
        onSendMessage={onSendMessage}
        onUpdateMessage={onUpdateMessage}
        editingMessage={null}
      />
    );

    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('calls onSendMessage when submitting a new message', () => {
    render(
      <Prompt
        inputRef={inputRef}
        onSendMessage={onSendMessage}
        onUpdateMessage={onUpdateMessage}
        editingMessage={null}
      />
    );

    const input = screen.getByRole('textbox');

    fireEvent.change(input, { target: { value: 'Hello world' } });
    fireEvent.submit(input.closest('form')!);

    expect(onSendMessage).toHaveBeenCalledWith('Hello world');
  });

  it('calls onUpdateMessage when editing a message', () => {
    const message: MessageData = {
      id: '1',
      text: 'Old message',
      timestamp: '12:00',
      isStarred: true,
    };

    render(
      <Prompt
        inputRef={inputRef}
        onSendMessage={onSendMessage}
        onUpdateMessage={onUpdateMessage}
        editingMessage={message}
      />
    );

    const input = screen.getByRole('textbox');

    fireEvent.change(input, { target: { value: 'Updated message' } });
    fireEvent.submit(input.closest('form')!);

    expect(onUpdateMessage).toHaveBeenCalledWith('Updated message', message);
  });

  it('does not send empty messages', () => {
    render(
      <Prompt
        inputRef={inputRef}
        onSendMessage={onSendMessage}
        onUpdateMessage={onUpdateMessage}
        editingMessage={null}
      />
    );

    fireEvent.submit(screen.getByRole('textbox').closest('form')!);

    expect(onSendMessage).not.toHaveBeenCalled();
  });

  it('sends message on Enter key (desktop)', () => {
    render(
      <Prompt
        inputRef={inputRef}
        onSendMessage={onSendMessage}
        onUpdateMessage={onUpdateMessage}
        editingMessage={null}
      />
    );

    const input = screen.getByRole('textbox');

    fireEvent.change(input, { target: { value: 'Hello' } });

    fireEvent.keyDown(input, { key: 'Enter' });

    expect(onSendMessage).toHaveBeenCalledWith('Hello');
  });

  it('shows disabled overlay when isDisabled is true', () => {
    render(
      <Prompt
        inputRef={inputRef}
        onSendMessage={onSendMessage}
        onUpdateMessage={onUpdateMessage}
        editingMessage={null}
        isDisabled
      />
    );

    expect(screen.getByText('Mensajes destacados')).toBeInTheDocument();
  });

  it('disables submit button when input is empty', () => {
    render(
      <Prompt
        inputRef={inputRef}
        onSendMessage={onSendMessage}
        onUpdateMessage={onUpdateMessage}
        editingMessage={null}
      />
    );

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('enables submit button when input has text', () => {
    render(
      <Prompt
        inputRef={inputRef}
        onSendMessage={onSendMessage}
        onUpdateMessage={onUpdateMessage}
        editingMessage={null}
      />
    );

    const input = screen.getByRole('textbox');
    const button = screen.getByRole('button');

    fireEvent.change(input, { target: { value: 'Hello' } });

    expect(button).not.toBeDisabled();
  });
});

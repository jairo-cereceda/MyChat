// chat-tile.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import ChatTile from './chat-tile';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { ChatData } from '../../../types';

describe('ChatTile component', () => {
  let onClick: () => void;
  let onHide: () => void;
  let onDeleteChat: () => void;
  let setMenuTriggerRef: (el: HTMLElement | null) => void;

  beforeEach(() => {
    onClick = vi.fn();
    onHide = vi.fn();
    onDeleteChat = vi.fn();
    setMenuTriggerRef = vi.fn();
  });

  it('renders the "Add chat" button when type="add"', () => {
    render(<ChatTile type="add" onClick={onClick} onHide={onHide} />);
    expect(screen.getByText(/Añadir chat/i)).toBeInTheDocument();
  });

  it('calls onClick and onHide when "Add chat" button is clicked', () => {
    render(<ChatTile type="add" onClick={onClick} onHide={onHide} />);
    const button = screen.getByText(/Añadir chat/i);
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalled();
    expect(onHide).toHaveBeenCalled();
  });

  it('renders the "Export/Import Chats" button when type="export-import"', () => {
    render(
      <ChatTile
        type="export-import"
        onClick={onClick}
        setMenuTriggerRef={setMenuTriggerRef}
        onHide={onHide}
      />
    );
    expect(screen.getByText(/Exportar\/Importar Chats/i)).toBeInTheDocument();
  });

  it('calls setMenuTriggerRef and onClick when "Export/Import Chats" button is clicked', () => {
    render(
      <ChatTile
        type="export-import"
        onClick={onClick}
        setMenuTriggerRef={setMenuTriggerRef}
        onHide={onHide}
      />
    );
    const button = screen.getByText(/Exportar\/Importar Chats/i);
    fireEvent.click(button);
    expect(setMenuTriggerRef).toHaveBeenCalledWith(button);
    expect(onClick).toHaveBeenCalled();
  });

  const chat: ChatData = {
    id: '1',
    name: 'My Chat',
    messages: [],
    timestamp: Date.now() + '',
  };

  it('renders the chat name when type is undefined', () => {
    render(<ChatTile chat={chat} onHide={onHide} />);
    expect(screen.getByText('My Chat')).toBeInTheDocument();
  });

  it('renders default text when chat name is undefined', () => {
    const chat: ChatData = {
      id: '1',
      name: '',
      messages: [],
      timestamp: Date.now() + '',
    };
    render(<ChatTile chat={chat} onHide={onHide} />);
    expect(screen.getByText('Escribe algo...')).toBeInTheDocument();
  });

  it('calls onClick and onHide when main chat button is clicked', () => {
    render(<ChatTile chat={chat} onClick={onClick} onHide={onHide} />);
    const mainButton = screen.getByText('My Chat');
    fireEvent.click(mainButton);
    expect(onClick).toHaveBeenCalled();
    expect(onHide).toHaveBeenCalled();
  });

  it('calls onDeleteChat and setMenuTriggerRef when delete button is clicked', () => {
    render(
      <ChatTile
        chat={chat}
        onDeleteChat={onDeleteChat}
        setMenuTriggerRef={setMenuTriggerRef}
        onHide={onHide}
      />
    );
    const deleteButton = screen.getByLabelText(/Eliminar chat My Chat/i);
    fireEvent.click(deleteButton);
    expect(onDeleteChat).toHaveBeenCalled();
    expect(setMenuTriggerRef).toHaveBeenCalledWith(deleteButton);
  });
});

import { render, screen, fireEvent } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Header from './header';
import type { ChatData, MessageData } from '../../../types';

/**
 * Mocks
 */

vi.mock('../../../hooks/useFocusTrap', () => ({
  useFocusTrap: () => {},
}));

vi.mock('../../molecules/record/record', () => ({
  default: () => <div data-testid="record" />,
}));

interface MockHeaderButtonProps {
  ariaLabel?: string;
  onDelete?: () => void;
  onEdit?: () => void;
  onStar?: () => void;
  onClose?: () => void;
  onWatchStarred?: () => void;
}

vi.mock('../../atoms/header-button/header-button', () => ({
  default: ({
    ariaLabel,
    onDelete,
    onEdit,
    onStar,
    onClose,
    onWatchStarred,
  }: MockHeaderButtonProps) => (
    <button
      aria-label={ariaLabel}
      onClick={onDelete || onEdit || onStar || onClose || onWatchStarred}
    >
      {ariaLabel}
    </button>
  ),
}));

/**
 * Data
 */

const chats: ChatData[] = [
  {
    id: '1',
    timestamp: '10:00',
    name: 'Chat 1',
    messages: [
      {
        id: 'm1',
        text: 'Hello',
        timestamp: '10:00',
        isStarred: true,
      },
    ],
  },
];

const message: MessageData = {
  id: 'm1',
  text: 'Hello',
  timestamp: '10:00',
  isStarred: false,
};

/**
 * Tests
 */

describe('Header component', () => {
  const onCreateChat = vi.fn();
  const onSelectChat = vi.fn();
  const onDeleteChat = vi.fn();
  const onImportExport = vi.fn();
  const onDeleteMessage = vi.fn();
  const onEdit = vi.fn();
  const onStar = vi.fn();
  const onWatchStarred = vi.fn();
  const setOpenMenuId = vi.fn();
  const setMenuTriggerRef = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders chat name when not editing', () => {
    render(
      <Header
        chats={chats}
        chatName="My Chat"
        mode=""
        openMenuId=""
        selectedMessage={undefined}
        isStarredView={false}
        menuTriggerRef={null}
        setMenuTriggerRef={setMenuTriggerRef}
        onCreateChat={onCreateChat}
        onSelectChat={onSelectChat}
        onDeleteChat={onDeleteChat}
        onImportExport={onImportExport}
        onDeleteMessage={onDeleteMessage}
        onEdit={onEdit}
        onStar={onStar}
        onWatchStarred={onWatchStarred}
        setOpenMenuId={setOpenMenuId}
      />
    );

    expect(screen.getByText('My Chat')).toBeInTheDocument();
  });

  it('renders Record component when not editing', () => {
    render(
      <Header
        chats={chats}
        chatName="My Chat"
        mode=""
        openMenuId=""
        selectedMessage={undefined}
        isStarredView={false}
        menuTriggerRef={null}
        setMenuTriggerRef={setMenuTriggerRef}
        onCreateChat={onCreateChat}
        onSelectChat={onSelectChat}
        onDeleteChat={onDeleteChat}
        onImportExport={onImportExport}
        onDeleteMessage={onDeleteMessage}
        onEdit={onEdit}
        onStar={onStar}
        onWatchStarred={onWatchStarred}
        setOpenMenuId={setOpenMenuId}
      />
    );

    expect(screen.getByTestId('record')).toBeInTheDocument();
  });

  it('calls onWatchStarred when star view button clicked', () => {
    render(
      <Header
        chats={chats}
        chatName="My Chat"
        mode=""
        openMenuId=""
        selectedMessage={undefined}
        isStarredView={false}
        menuTriggerRef={null}
        setMenuTriggerRef={setMenuTriggerRef}
        onCreateChat={onCreateChat}
        onSelectChat={onSelectChat}
        onDeleteChat={onDeleteChat}
        onImportExport={onImportExport}
        onDeleteMessage={onDeleteMessage}
        onEdit={onEdit}
        onStar={onStar}
        onWatchStarred={onWatchStarred}
        setOpenMenuId={setOpenMenuId}
      />
    );

    fireEvent.click(screen.getByLabelText(/mostrar mensajes destacados/i));

    expect(onWatchStarred).toHaveBeenCalled();
  });

  it('renders editing menu when mode is editing', () => {
    render(
      <Header
        chats={chats}
        chatName="My Chat"
        mode="editing"
        openMenuId="m1"
        selectedMessage={message}
        isStarredView={false}
        menuTriggerRef={null}
        setMenuTriggerRef={setMenuTriggerRef}
        onCreateChat={onCreateChat}
        onSelectChat={onSelectChat}
        onDeleteChat={onDeleteChat}
        onImportExport={onImportExport}
        onDeleteMessage={onDeleteMessage}
        onEdit={onEdit}
        onStar={onStar}
        onWatchStarred={onWatchStarred}
        setOpenMenuId={setOpenMenuId}
      />
    );

    expect(screen.getByLabelText(/eliminar mensaje/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/editar mensaje/i)).toBeInTheDocument();
  });

  it('calls onDeleteMessage when delete button clicked', () => {
    render(
      <Header
        chats={chats}
        chatName="My Chat"
        mode="editing"
        openMenuId="m1"
        selectedMessage={message}
        isStarredView={false}
        menuTriggerRef={null}
        setMenuTriggerRef={setMenuTriggerRef}
        onCreateChat={onCreateChat}
        onSelectChat={onSelectChat}
        onDeleteChat={onDeleteChat}
        onImportExport={onImportExport}
        onDeleteMessage={onDeleteMessage}
        onEdit={onEdit}
        onStar={onStar}
        onWatchStarred={onWatchStarred}
        setOpenMenuId={setOpenMenuId}
      />
    );

    fireEvent.click(screen.getByLabelText(/eliminar mensaje/i));

    expect(onDeleteMessage).toHaveBeenCalledWith('m1');
  });

  it('calls onEdit when edit button clicked', () => {
    render(
      <Header
        chats={chats}
        chatName="My Chat"
        mode="editing"
        openMenuId="m1"
        selectedMessage={message}
        isStarredView={false}
        menuTriggerRef={null}
        setMenuTriggerRef={setMenuTriggerRef}
        onCreateChat={onCreateChat}
        onSelectChat={onSelectChat}
        onDeleteChat={onDeleteChat}
        onImportExport={onImportExport}
        onDeleteMessage={onDeleteMessage}
        onEdit={onEdit}
        onStar={onStar}
        onWatchStarred={onWatchStarred}
        setOpenMenuId={setOpenMenuId}
      />
    );

    fireEvent.click(screen.getByLabelText(/editar mensaje/i));

    expect(onEdit).toHaveBeenCalledWith(message);
  });

  it('calls onStar when star button clicked', () => {
    render(
      <Header
        chats={chats}
        chatName="My Chat"
        mode="editing"
        openMenuId="m1"
        selectedMessage={message}
        isStarredView={false}
        menuTriggerRef={null}
        setMenuTriggerRef={setMenuTriggerRef}
        onCreateChat={onCreateChat}
        onSelectChat={onSelectChat}
        onDeleteChat={onDeleteChat}
        onImportExport={onImportExport}
        onDeleteMessage={onDeleteMessage}
        onEdit={onEdit}
        onStar={onStar}
        onWatchStarred={onWatchStarred}
        setOpenMenuId={setOpenMenuId}
      />
    );

    fireEvent.click(screen.getByLabelText(/destacar mensaje/i));

    expect(onStar).toHaveBeenCalledWith(message);
  });

  it('closes menu on Escape key', () => {
    render(
      <Header
        chats={chats}
        chatName="My Chat"
        mode="editing"
        openMenuId="m1"
        selectedMessage={message}
        isStarredView={false}
        menuTriggerRef={null}
        setMenuTriggerRef={setMenuTriggerRef}
        onCreateChat={onCreateChat}
        onSelectChat={onSelectChat}
        onDeleteChat={onDeleteChat}
        onImportExport={onImportExport}
        onDeleteMessage={onDeleteMessage}
        onEdit={onEdit}
        onStar={onStar}
        onWatchStarred={onWatchStarred}
        setOpenMenuId={setOpenMenuId}
      />
    );

    fireEvent.keyDown(screen.getByRole('menu'), { key: 'Escape' });

    expect(setOpenMenuId).toHaveBeenCalledWith('');
  });
});

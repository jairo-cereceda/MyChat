import { render, screen, fireEvent, act } from '@testing-library/react';
import Message, { type MessageProps } from './message';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('Message component', () => {
  let baseProps: MessageProps;

  beforeEach(() => {
    vi.useFakeTimers();
    baseProps = {
      text: 'Hello\nWorld',
      timestamp: '12:34',
      isStarred: false,
      openMenuId: '',
      onOpenMenu: vi.fn(),
    };
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it('renders the text with line breaks', () => {
    render(<Message {...baseProps} />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
    expect(screen.getByText('World')).toBeInTheDocument();
  });

  it('renders the timestamp', () => {
    render(<Message {...baseProps} />);
    expect(screen.getByText('12:34')).toBeInTheDocument();
  });

  it('renders the star icon if isStarred is true', () => {
    render(<Message {...baseProps} isStarred />);
    expect(screen.getByTestId('star-icon')).toBeInTheDocument();
  });

  it('does not render the star icon if isStarred is false', () => {
    render(<Message {...baseProps} />);
    expect(screen.queryByTestId('star-icon')).toBeNull();
  });

  it('calls onOpenMenu on context menu', () => {
    render(<Message {...baseProps} />);
    const p = screen.getByText('Hello').closest('p')!;
    fireEvent.contextMenu(p);
    expect(baseProps.onOpenMenu).toHaveBeenCalledTimes(1);
  });

  it('calls onOpenMenu on keydown Enter, Space, ContextMenu', () => {
    baseProps.onOpenMenu = vi.fn();
    render(<Message {...baseProps} />);
    const p = screen.getByText('Hello').closest('p')!;

    fireEvent.keyDown(p, { key: 'Enter' });
    expect(baseProps.onOpenMenu).toHaveBeenCalledTimes(1);

    fireEvent.keyDown(p, { key: ' ' });
    expect(baseProps.onOpenMenu).toHaveBeenCalledTimes(2);

    fireEvent.keyDown(p, { key: 'ContextMenu' });
    expect(baseProps.onOpenMenu).toHaveBeenCalledTimes(3);
  });

  it('calls onOpenMenu after 500ms on touchstart', () => {
    render(<Message {...baseProps} />);
    const p = screen.getByText('Hello').closest('p')!;
    fireEvent.touchStart(p);
    act(() => vi.advanceTimersByTime(500));
    expect(baseProps.onOpenMenu).toHaveBeenCalledTimes(1);
  });

  it('cancels touchstart timer on touchend, touchmove, touchcancel', () => {
    render(<Message {...baseProps} />);
    const p = screen.getByText('Hello').closest('p')!;

    fireEvent.touchStart(p);
    fireEvent.touchEnd(p);
    act(() => vi.advanceTimersByTime(500));
    expect(baseProps.onOpenMenu).not.toHaveBeenCalled();

    fireEvent.touchStart(p);
    fireEvent.touchMove(p);
    act(() => vi.advanceTimersByTime(500));
    expect(baseProps.onOpenMenu).not.toHaveBeenCalled();

    fireEvent.touchStart(p);
    fireEvent.touchCancel(p);
    act(() => vi.advanceTimersByTime(500));
    expect(baseProps.onOpenMenu).not.toHaveBeenCalled();
  });
});

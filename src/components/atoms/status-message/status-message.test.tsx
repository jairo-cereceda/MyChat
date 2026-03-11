import { render, screen, fireEvent } from '@testing-library/react';
import StatusMessage, {
  type StatusMessageProps,
  STATUS_TEXT,
} from './status-message';
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches: true,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
});

describe('StatusMessage component', () => {
  const baseProps: StatusMessageProps = {
    type: 'editing',
    onCancelEditing: vi.fn(),
    promptOffset: 10,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('does not render if type is null', () => {
    render(<StatusMessage type={null} />);
    expect(screen.queryByText(/./)).toBeNull();
  });

  it('renders correct text for each type', () => {
    const types: StatusMessageProps['type'][] = [
      'editing',
      'edited',
      'deleted',
      'starred',
      'unstarred',
      'imported',
      'exported',
      'cannotShowStarred',
    ];

    types.forEach((t) => {
      render(<StatusMessage type={t} />);
      expect(
        screen.getByText(STATUS_TEXT[t as keyof typeof STATUS_TEXT])
      ).toBeInTheDocument();
    });
  });

  it('shows cancel button only for editing', () => {
    render(<StatusMessage type="editing" />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('does not show cancel button for other types', () => {
    render(<StatusMessage type="edited" />);
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('calls onCancelEditing when cancel button is clicked', () => {
    render(<StatusMessage {...baseProps} />);
    const btn = screen.getByRole('button');
    fireEvent.click(btn);
    expect(baseProps.onCancelEditing).toHaveBeenCalledTimes(1);
  });

  it('applies bottom style correctly when editing on mobile', () => {
    render(<StatusMessage {...baseProps} />);
    const div = screen.getByText(/Editando/).parentElement!;
    expect(div.style.bottom).toBe('62px');
  });
});

import { render, screen, fireEvent } from '@testing-library/react';
import HeaderButton from './header-button';
import { IoMdAddCircle } from 'react-icons/io';
import { describe, expect, it, vi } from 'vitest';

describe('HeaderButton', () => {
  it('renders the button with the correct aria-label', () => {
    render(<HeaderButton icon={IoMdAddCircle} ariaLabel="Add item" />);
    expect(
      screen.getByRole('button', { name: /Add item/i })
    ).toBeInTheDocument();
  });

  it('applies role prop if provided', () => {
    render(
      <HeaderButton icon={IoMdAddCircle} ariaLabel="Add item" role="menuitem" />
    );
    expect(screen.getByRole('menuitem')).toBeInTheDocument();
  });

  it('calls onDelete when clicked', () => {
    const onDelete = vi.fn();
    render(
      <HeaderButton
        icon={IoMdAddCircle}
        ariaLabel="Delete"
        onDelete={onDelete}
      />
    );
    const button = screen.getByRole('button', { name: /Delete/i });
    fireEvent.click(button);
    expect(onDelete).toHaveBeenCalled();
  });

  it('calls only the first available handler (onDelete over others)', () => {
    const onDelete = vi.fn();
    const onEdit = vi.fn();
    render(
      <HeaderButton
        icon={IoMdAddCircle}
        ariaLabel="Test"
        onDelete={onDelete}
        onEdit={onEdit}
      />
    );
    const button = screen.getByRole('button', { name: /Test/i });
    fireEvent.click(button);
    expect(onDelete).toHaveBeenCalled();
    expect(onEdit).not.toHaveBeenCalled();
  });

  it('applies popoverTarget if isPopoverOpener is true', () => {
    render(
      <HeaderButton icon={IoMdAddCircle} ariaLabel="Popover" isPopoverOpener />
    );
    const button = screen.getByRole('button', { name: /Popover/i });
    expect(button).toHaveAttribute('popoverTarget', 'record');
  });
});

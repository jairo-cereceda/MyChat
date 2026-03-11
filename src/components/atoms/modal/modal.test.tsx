import { render, screen, fireEvent } from '@testing-library/react';
import Modal, { type ModalProps } from './modal';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('Modal component', () => {
  let baseProps: ModalProps;
  let triggerRef: HTMLElement;

  beforeEach(() => {
    triggerRef = document.createElement('button');
    document.body.appendChild(triggerRef);

    baseProps = {
      text: 'Modal Title',
      children: <p>Modal content</p>,
      buttons: [
        {
          text: 'Confirm',
          onClick: vi.fn(),
          variant: 'primary',
          closeOnClick: true,
        },
        { text: 'Cancel', onClick: vi.fn(), variant: 'secondary' },
      ],
      closeModal: vi.fn(),
      menuTriggerRef: triggerRef,
    };
  });

  afterEach(() => {
    document.body.innerHTML = '';
    vi.clearAllMocks();
  });

  it('renders text, children, and buttons', () => {
    render(<Modal {...baseProps} />);
    expect(screen.getByText('Modal Title')).toBeInTheDocument();
    expect(screen.getByText('Modal content')).toBeInTheDocument();
    expect(screen.getByText('Confirm')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('calls button onClick when clicked', () => {
    render(<Modal {...baseProps} />);
    const confirmBtn = screen.getByText('Confirm');
    const cancelBtn = screen.getByText('Cancel');

    fireEvent.click(confirmBtn);
    expect(baseProps.buttons![0].onClick).toHaveBeenCalledTimes(1);
    expect(baseProps.closeModal).toHaveBeenCalledTimes(1);
    expect(document.activeElement).toBe(triggerRef);

    fireEvent.click(cancelBtn);
    expect(baseProps.buttons![1].onClick).toHaveBeenCalledTimes(1);
    expect(baseProps.closeModal).toHaveBeenCalledTimes(1);
  });

  it('calls closeModal and focuses triggerRef on Escape key', () => {
    render(<Modal {...baseProps} />);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(baseProps.closeModal).toHaveBeenCalledTimes(1);
    expect(document.activeElement).toBe(triggerRef);
  });

  it('renders correctly without text or children', () => {
    render(<Modal menuTriggerRef={triggerRef} />);
    expect(screen.queryByRole('heading')).toBeNull();
    expect(screen.queryByText('Modal content')).toBeNull();
  });

  it('applies primary and secondary button classes', () => {
    render(<Modal {...baseProps} />);
    const confirmBtn = screen.getByText('Confirm');
    const cancelBtn = screen.getByText('Cancel');

    expect(confirmBtn).toHaveClass('bg-detail');
    expect(cancelBtn).toHaveClass('bg-secondary');
  });
});

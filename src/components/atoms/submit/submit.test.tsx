import { render, screen } from '@testing-library/react';
import Submit from './submit';
import { describe, expect, it } from 'vitest';

describe('Submit component', () => {
  it('renders a button', () => {
    render(<Submit />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('sets correct aria-label and classes when disabled', () => {
    render(<Submit disabled />);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'Escribe un mensaje');
    expect(button).toHaveClass('bg-detail-disabled');
  });

  it('sets correct aria-label and classes when enabled', () => {
    render(<Submit disabled={false} />);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'Enviar mensaje');
    expect(button).toHaveClass('bg-detail');
  });
});

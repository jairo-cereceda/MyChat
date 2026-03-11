import { render, screen, fireEvent } from '@testing-library/react';
import Input from './input';
import { describe, vi, beforeEach, it, expect } from 'vitest';

describe('Input component', () => {
  const mockOnChange = vi.fn();
  const ref = { current: null };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders with the correct value', () => {
    render(<Input value="Hola" onChange={mockOnChange} inputRef={ref} />);
    expect(screen.getByRole('textbox')).toHaveValue('Hola');
  });

  it('calls onChange when typing', () => {
    render(<Input value="" onChange={mockOnChange} inputRef={ref} />);
    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: 'Test' },
    });
    expect(mockOnChange).toHaveBeenCalledWith('Test');
  });

  it('disables the textarea when isDisabled is true', () => {
    render(
      <Input value="" onChange={mockOnChange} inputRef={ref} isDisabled />
    );
    expect(screen.getByRole('textbox')).toBeDisabled();
  });
});

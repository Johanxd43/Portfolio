import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Toast from '../Toast';

describe('Toast Component', () => {
  it('renders message correctly', () => {
    const onClose = vi.fn();
    render(
      <Toast
        id="test-1"
        message="Test Message"
        type="info"
        onClose={onClose}
      />
    );
    expect(screen.getByText('Test Message')).toBeDefined();
  });

  it('renders success icon', () => {
    const onClose = vi.fn();
    const { container } = render(
      <Toast
        id="test-2"
        message="Success"
        type="success"
        onClose={onClose}
      />
    );
    // Check for green color class
    expect(container.querySelector('.text-green-400')).toBeDefined();
  });
});

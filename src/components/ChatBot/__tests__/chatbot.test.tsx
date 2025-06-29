import { describe, it, expect, vi } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ChatBot from '../ChatBot';
import { useHuggingFaceChat } from '../hooks/useHuggingFaceChat';

// Mock del hook
vi.mock('../hooks/useHuggingFaceChat', () => ({
  useHuggingFaceChat: vi.fn()
}));

describe('ChatBot', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
    // Mock por defecto del hook
    (useHuggingFaceChat as jest.Mock).mockReturnValue({
      processMessage: vi.fn().mockResolvedValue({
        response: 'Test response',
        suggestions: [{ text: 'Test suggestion', action: 'test' }]
      }),
      isProcessing: false,
      error: null,
      isInitialized: true,
      isUsingFallback: false
    });
  });

  it('should render loading state when not initialized', () => {
    (useHuggingFaceChat as jest.Mock).mockReturnValue({
      isInitialized: false,
      isUsingFallback: false,
      isProcessing: false,
      error: null
    });

    render(<ChatBot />);
    expect(screen.getByText('Inicializando Nova...')).toBeInTheDocument();
  });

  it('should render welcome message initially', async () => {
    render(<ChatBot />);
    
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    
    expect(screen.getByText(/¡Hola! 👋/)).toBeInTheDocument();
  });

  it('should handle message submission', async () => {
    const mockProcessMessage = vi.fn().mockResolvedValue({
      response: 'Test response',
      suggestions: [{ text: 'Test', action: 'test' }]
    });

    (useHuggingFaceChat as jest.Mock).mockReturnValue({
      processMessage: mockProcessMessage,
      isProcessing: false,
      error: null,
      isInitialized: true,
      isUsingFallback: false
    });

    render(<ChatBot />);

    const input = screen.getByPlaceholderText('Escribe tu mensaje...');
    
    await act(async () => {
      await user.type(input, 'test message');
      await user.keyboard('{Enter}');
    });

    expect(mockProcessMessage).toHaveBeenCalledWith('test message');
    expect(await screen.findByText('Test response')).toBeInTheDocument();
  });

  it('should handle suggestion clicks', async () => {
    const mockProcessMessage = vi.fn().mockResolvedValue({
      response: 'Suggestion response',
      suggestions: []
    });

    (useHuggingFaceChat as jest.Mock).mockReturnValue({
      processMessage: mockProcessMessage,
      isProcessing: false,
      error: null,
      isInitialized: true,
      isUsingFallback: false
    });

    render(<ChatBot />);

    await act(async () => {
      const suggestionButton = await screen.findByText('Experiencia');
      await user.click(suggestionButton);
    });

    expect(mockProcessMessage).toHaveBeenCalledWith('Experiencia');
  });

  it('should show error message on failure', async () => {
    const mockProcessMessage = vi.fn().mockRejectedValue(new Error('Test error'));

    (useHuggingFaceChat as jest.Mock).mockReturnValue({
      processMessage: mockProcessMessage,
      isProcessing: false,
      error: new Error('Test error'),
      isInitialized: true,
      isUsingFallback: false
    });

    render(<ChatBot />);

    const input = screen.getByPlaceholderText('Escribe tu mensaje...');
    
    await act(async () => {
      await user.type(input, 'test message');
      await user.keyboard('{Enter}');
    });

    expect(await screen.findByText(/ha ocurrido un error/)).toBeInTheDocument();
  });

  it('should handle minimize/maximize', async () => {
    render(<ChatBot />);
    
    await act(async () => {
      const minimizeButton = screen.getByLabelText('Minimizar chat');
      await user.click(minimizeButton);
    });
    
    expect(screen.queryByPlaceholderText('Escribe tu mensaje...')).not.toBeInTheDocument();
    
    await act(async () => {
      const maximizeButton = screen.getByRole('button');
      await user.click(maximizeButton);
    });
    
    expect(screen.getByPlaceholderText('Escribe tu mensaje...')).toBeInTheDocument();
  });
});
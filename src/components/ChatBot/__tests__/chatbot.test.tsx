import { describe, it, expect, vi } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import ChatBot from '../ChatBot';
import { useOpenRouterChat } from '../hooks/useOpenRouterChat';

// Mock del hook
vi.mock('../hooks/useOpenRouterChat', () => ({
  useOpenRouterChat: vi.fn()
}));

describe('ChatBot', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
    // Mock por defecto del hook
    (useOpenRouterChat as vi.Mock).mockReturnValue({
      processMessageStream: vi.fn((_msgs, _onChunk, onComplete) => {
        onComplete([{ text: 'Test suggestion', action: 'test' }]);
        return Promise.resolve();
      }),
      isProcessing: false,
      error: null,
      isInitialized: true,
    });
  });

  it('should render loading state when not initialized', () => {
    (useOpenRouterChat as vi.Mock).mockReturnValue({
      isInitialized: false,
      isProcessing: false,
      error: null
    });

    render(
      <MemoryRouter>
        <ChatBot />
      </MemoryRouter>
    );
    expect(screen.getByText('Inicializando Nova...')).toBeInTheDocument();
  });

  it('should render welcome message initially', async () => {
    render(
      <MemoryRouter>
        <ChatBot />
      </MemoryRouter>
    );
    
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    
    expect(screen.getByText(/¡Hola! 👋/)).toBeInTheDocument();
  });

  it('should handle message submission', async () => {
    const mockProcessMessageStream = vi.fn((_msgs, onChunk, onComplete) => {
      onChunk('Bot response');
      onComplete([{ text: 'Suggestion', action: 'test' }]);
      return Promise.resolve();
    });

    (useOpenRouterChat as vi.Mock).mockReturnValue({
      processMessageStream: mockProcessMessageStream,
      isProcessing: false,
      error: null,
      isInitialized: true,
    });

    render(
      <MemoryRouter>
        <ChatBot />
      </MemoryRouter>
    );

    const input = screen.getByPlaceholderText('Escribe tu mensaje...');
    
    await act(async () => {
      await user.type(input, 'test message');
      await user.keyboard('{Enter}');
    });

    expect(mockProcessMessageStream).toHaveBeenCalled();
    expect(await screen.findByText('Bot response')).toBeInTheDocument();
  });

  it('should handle suggestion clicks', async () => {
    const mockProcessMessageStream = vi.fn((_msgs, onChunk, onComplete) => {
      onChunk('Nueva respuesta');
      onComplete([]);
      return Promise.resolve();
    });

    (useOpenRouterChat as vi.Mock).mockReturnValue({
      processMessageStream: mockProcessMessageStream,
      isProcessing: false,
      error: null,
      isInitialized: true,
    });

    render(
      <MemoryRouter>
        <ChatBot />
      </MemoryRouter>
    );

    await act(async () => {
      const suggestionButton = await screen.findByText('Stack tecnológico');
      await user.click(suggestionButton);
    });

    expect(mockProcessMessageStream).toHaveBeenCalled();
  });

  it('should show error message on failure', async () => {
    const mockProcessMessageStream = vi.fn((_msgs, _onChunk, _onComplete, onError) => {
      onError(new Error('Test error'));
      return Promise.resolve(); // Resolving it here to prevent unhandled rejection during tests, the error is handled by the callback
    });

    (useOpenRouterChat as vi.Mock).mockReturnValue({
      processMessageStream: mockProcessMessageStream,
      isProcessing: false,
      error: new Error('Test error'),
      isInitialized: true,
    });

    render(
      <MemoryRouter>
        <ChatBot />
      </MemoryRouter>
    );

    const input = screen.getByPlaceholderText('Escribe tu mensaje...');
    
    await act(async () => {
      await user.type(input, 'test message');
      await user.keyboard('{Enter}');
    });

    expect(await screen.findByText(/ha ocurrido un error/)).toBeInTheDocument();
  });

  it('should handle minimize/maximize', async () => {
    render(
      <MemoryRouter>
        <ChatBot />
      </MemoryRouter>
    );
    
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
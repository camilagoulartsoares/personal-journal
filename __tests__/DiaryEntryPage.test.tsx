import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import DiaryEntryPage from '../app/diary/[date]/page'
import { useParams, useRouter } from 'next/navigation'

// Mocks
jest.mock('next/navigation', () => ({
  useParams: jest.fn(),
  useRouter: jest.fn()
}))

jest.mock('../app/utils/indexedDb', () => ({
  salvarEntrada: jest.fn(),
  buscarEntrada: jest.fn()
}))

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn()
  }
}))

import { salvarEntrada, buscarEntrada } from '../app/utils/indexedDb'
import { toast } from 'react-toastify'

describe('DiaryEntryPage', () => {
  let pushMock: jest.Mock

  beforeEach(() => {
    pushMock = jest.fn()
    ;(useParams as jest.Mock).mockReturnValue({ date: '2025-08-10' })
    ;(useRouter as jest.Mock).mockReturnValue({ push: pushMock })
    ;(buscarEntrada as jest.Mock).mockResolvedValue(null) // sempre resolve algo
    jest.clearAllMocks()
  })

  it('renderiza a data formatada no título', () => {
    render(<DiaryEntryPage />)
    const title = screen.getByRole('heading')
    // Verifica conteúdo sem depender do fuso horário
    expect(title.textContent).toMatch(/2025/)
    expect(title.textContent?.toLowerCase()).toMatch(/agosto/)
  })

  it('carrega entrada existente ao montar', async () => {
    ;(buscarEntrada as jest.Mock).mockResolvedValue({
      id: '2025-08-10',
      texto: 'Texto salvo'
    })

    render(<DiaryEntryPage />)

    await waitFor(() => {
      expect(buscarEntrada).toHaveBeenCalledWith('2025-08-10')
      expect(screen.getByDisplayValue('Texto salvo')).toBeInTheDocument()
    })
  })

  it('salva entrada e mostra toast', async () => {
    ;(buscarEntrada as jest.Mock).mockResolvedValue(null)
    ;(salvarEntrada as jest.Mock).mockResolvedValue(undefined)

    render(<DiaryEntryPage />)

    const textarea = screen.getByPlaceholderText('Escreva sua entrada aqui...')
    fireEvent.change(textarea, { target: { value: 'Minha nova entrada' } })

    const botaoSalvar = screen.getByRole('button', { name: /salvar entrada/i })
    fireEvent.click(botaoSalvar)

    await waitFor(() => {
      expect(salvarEntrada).toHaveBeenCalledWith({
        id: '2025-08-10',
        texto: 'Minha nova entrada'
      })
      expect(toast.success).toHaveBeenCalledWith('Entrada salva com sucesso!')
    })
  })

  it('volta para o diário ao clicar no botão de voltar', () => {
    render(<DiaryEntryPage />)
    const botaoVoltar = screen.getByRole('button', { name: /voltar ao diário/i })
    fireEvent.click(botaoVoltar)
    expect(pushMock).toHaveBeenCalledWith('/diary')
  })
})

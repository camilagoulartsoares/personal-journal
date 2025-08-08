// Mock do useRouter
jest.mock('next/navigation', () => ({
  useRouter: jest.fn()
}))

// Mock do módulo indexedDb
jest.mock('../app/utils/indexedDb', () => ({
  buscarTodasEntradas: jest.fn()
}))

import { buscarTodasEntradas } from '../app/utils/indexedDb'
import { useRouter } from 'next/navigation'
import { render, screen } from '@testing-library/react'
import DiaryListPage from '../app/diary/page'

describe('DiaryListPage', () => {
  beforeEach(() => {
    // Mock do router
    ;(useRouter as jest.Mock).mockReturnValue({
      push: jest.fn()
    })

    // Mock inicial da função
    ;(buscarTodasEntradas as jest.Mock).mockResolvedValue({
      '2025-08-01': 'Minha entrada de teste'
    })
  })

  it('renderiza o título', async () => {
    render(<DiaryListPage />)
    expect(await screen.findByText('Meu Diário')).toBeInTheDocument()
  })

  it('mostra entrada existente', async () => {
    render(<DiaryListPage />)
    expect(await screen.findByText('Entrada existente')).toBeInTheDocument()
  })

  it('mostra "Clique para escrever" se não tiver entrada', async () => {
    ;(buscarTodasEntradas as jest.Mock).mockResolvedValue({})
    render(<DiaryListPage />)
    expect(await screen.findAllByText('Clique para escrever')).not.toHaveLength(0)
  })
})

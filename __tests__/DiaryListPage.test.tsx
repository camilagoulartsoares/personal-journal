import { render, screen } from '@testing-library/react'
import DiaryListPage from '../app/diary/page'
import * as indexedDb from '../app/utils/indexedDb'
import { useRouter } from 'next/navigation'

// Mock do useRouter
jest.mock('next/navigation', () => ({
  useRouter: jest.fn()
}))

describe('DiaryListPage', () => {
  beforeEach(() => {
    // Mock do router
    ;(useRouter as jest.Mock).mockReturnValue({
      push: jest.fn()
    })

    // Mock da função buscarTodasEntradas
    jest.spyOn(indexedDb, 'buscarTodasEntradas').mockResolvedValue({
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
    ;(indexedDb.buscarTodasEntradas as jest.Mock).mockResolvedValue({})
    render(<DiaryListPage />)
    expect(await screen.findAllByText('Clique para escrever')).not.toHaveLength(0)
  })
})

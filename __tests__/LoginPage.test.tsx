import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import LoginPage from '../app/login/page'
import { useRouter } from 'next/navigation'

// Mock do useRouter
jest.mock('next/navigation', () => ({
  useRouter: jest.fn()
}))

// Mock do módulo de autenticação
jest.mock('../app/utils/auth', () => ({
  savePassword: jest.fn(),
  getSavedPassword: jest.fn(),
  isAuthenticated: jest.fn()
}))

import { savePassword, getSavedPassword, isAuthenticated } from '../app/utils/auth'

describe('LoginPage', () => {
  let pushMock: jest.Mock

  beforeEach(() => {
    pushMock = jest.fn()
    ;(useRouter as jest.Mock).mockReturnValue({ push: pushMock })
    jest.clearAllMocks()
  })

  it('fluxo de criação de senha com sucesso', async () => {
    ;(getSavedPassword as jest.Mock).mockReturnValue(null)

    render(<LoginPage />)

    const senhaInput = screen.getByPlaceholderText('Sua senha secreta')
    const confirmarInput = screen.getByPlaceholderText('Confirme sua senha')
    const botao = screen.getByRole('button', { name: /criar senha/i })

    fireEvent.change(senhaInput, { target: { value: '1234' } })
    fireEvent.change(confirmarInput, { target: { value: '1234' } })
    fireEvent.click(botao)

    expect(savePassword).toHaveBeenCalledWith('1234')

    // Aguarda o router.push ser chamado
    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith('/diary')
    })
  })

  it('mostra alerta se senhas não coincidem na criação', () => {
    window.alert = jest.fn()
    ;(getSavedPassword as jest.Mock).mockReturnValue(null)

    render(<LoginPage />)

    const senhaInput = screen.getByPlaceholderText('Sua senha secreta')
    const confirmarInput = screen.getByPlaceholderText('Confirme sua senha')
    const botao = screen.getByRole('button', { name: /criar senha/i })

    fireEvent.change(senhaInput, { target: { value: '1234' } })
    fireEvent.change(confirmarInput, { target: { value: '9999' } })
    fireEvent.click(botao)

    expect(window.alert).toHaveBeenCalledWith('As senhas não coincidem.')
    expect(savePassword).not.toHaveBeenCalled()
    expect(pushMock).not.toHaveBeenCalled()
  })

  it('fluxo de login com senha correta', async () => {
    ;(getSavedPassword as jest.Mock).mockReturnValue('hash-existente')
    ;(isAuthenticated as jest.Mock).mockResolvedValue(true)

    render(<LoginPage />)

    const senhaInput = screen.getByPlaceholderText('Sua senha secreta')
    const botao = screen.getByRole('button', { name: /entrar/i })

    fireEvent.change(senhaInput, { target: { value: '1234' } })
    fireEvent.click(botao)

    expect(isAuthenticated).toHaveBeenCalledWith('1234')

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith('/diary')
    })
  })

  it('fluxo de login com senha incorreta', async () => {
    window.alert = jest.fn()
    ;(getSavedPassword as jest.Mock).mockReturnValue('hash-existente')
    ;(isAuthenticated as jest.Mock).mockResolvedValue(false)

    render(<LoginPage />)

    const senhaInput = screen.getByPlaceholderText('Sua senha secreta')
    const botao = screen.getByRole('button', { name: /entrar/i })

    fireEvent.change(senhaInput, { target: { value: 'errada' } })
    fireEvent.click(botao)

    expect(isAuthenticated).toHaveBeenCalledWith('errada')

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Senha incorreta.')
    })
    expect(pushMock).not.toHaveBeenCalled()
  })
})

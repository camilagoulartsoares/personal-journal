import '@testing-library/jest-dom'

// Mock do AOS para evitar erros nos testes
jest.mock('aos', () => ({
  init: jest.fn()
}))

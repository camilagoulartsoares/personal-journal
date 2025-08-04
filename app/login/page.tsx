'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { savePassword, getSavedPassword, isAuthenticated } from '../utils/auth'
import styles from '../styles/login.module.css'

export default function LoginPage() {
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const router = useRouter()

    const existing = getSavedPassword()
    const isCreating = !existing

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()

        if (isCreating) {
            if (!password || !confirmPassword) {
                alert('Preencha todos os campos')
                return
            }

            if (password !== confirmPassword) {
                alert('As senhas não coincidem.')
                return
            }

            await savePassword(password)
            router.push('/diary')
        } else {
            const match = await isAuthenticated(password)
            if (match) {
                router.push('/diary')
            } else {
                alert('Senha incorreta.')
            }
        }
    }


    return (
        <div className={styles.page}>
            <form className={styles.card} onSubmit={handleSubmit}>
                <h1 className={styles.title}>
                    {isCreating ? 'Criar Senha' : 'Digite sua Senha'}
                </h1>
                <p className={styles.description}>
                    {isCreating
                        ? 'Defina uma senha para proteger seu diário.'
                        : 'Acesse seu diário com sua senha secreta.'}
                </p>

                <label className={styles.label}>Senha</label>
                <input
                    type="password"
                    placeholder="Sua senha secreta"
                    className={styles.input}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                {isCreating && (
                    <>
                        <label className={styles.label}>Confirmar Senha</label>
                        <input
                            type="password"
                            placeholder="Confirme sua senha"
                            className={styles.input}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </>
                )}

                <button type="submit" className={styles.button}>
                    {isCreating ? 'Criar Senha' : 'Entrar'}
                </button>
            </form>
        </div>
    )
}

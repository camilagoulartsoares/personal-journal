'use client'

import React from 'react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { savePassword, getSavedPassword } from '../utils/auth'
import styles from '../styles/login.module.css'

export default function LoginPage() {
  const [password, setPassword] = useState('')
  const router = useRouter()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const existing = getSavedPassword()
    if (existing) {
      if (password === existing) {
        router.push('/diary')
      } else {
        alert('Incorrect password.')
      }
    } else {
      savePassword(password)
      router.push('/diary')
    }
  }

  return (
    <main className={styles.container}>
<h1 className={styles.title}>Your Personal Journal</h1>

<form className={styles.form} onSubmit={handleSubmit}>
  <input
    className={styles.input}
    type="password"
    placeholder="Enter your password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
  />
  <button className={styles.button} type="submit">Enter</button>
</form>

    </main>
  )
}

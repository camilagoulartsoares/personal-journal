'use client'

import { useEffect, useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import styles from '../../styles/diary-entry.module.css'
import { toast } from 'react-toastify'

export default function DiaryEntryPage() {
  const { date } = useParams()
  const router = useRouter()
  const [text, setText] = useState('')
  const isMounted = useRef(true)

  useEffect(() => {
    return () => {
      isMounted.current = false
    }
  }, [])

  useEffect(() => {
    if (typeof date === 'string') {
      const saved = localStorage.getItem('diary-all-entries')
      if (saved) {
        const parsed = JSON.parse(saved)
        setText(parsed[date] || '')
      }
    }
  }, [date])

  function formatDateLabel(dateString: string) {
    const d = new Date(dateString)
    return d.toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  function handleSave() {
    if (typeof date !== 'string') return

    const saved = localStorage.getItem('diary-all-entries')
    const entries = saved ? JSON.parse(saved) : {}

    const updated = {
      ...entries,
      [date]: text
    }

    localStorage.setItem('diary-all-entries', JSON.stringify(updated))

    if (isMounted.current) {
      toast.success('Entrada salva com sucesso!')
    }
  }

  if (typeof date !== 'string') return null

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>{formatDateLabel(date)}</h1>

      <button className={styles.backButton} onClick={() => router.push('/diary')}>
        Voltar ao Diário
      </button>

      <label className={styles.label}>Entrada para {date}</label>
      <textarea
        className={styles.textarea}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Escreva sua entrada aqui..."
      />

      <button className={styles.saveButton} onClick={handleSave}>
        Salvar Entrada
      </button>
    </div>
  )
}

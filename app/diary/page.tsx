'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from '../styles/diary.module.css'

export default function DiaryListPage() {
  const [entries, setEntries] = useState<{ [date: string]: string }>({})
  const router = useRouter()

  useEffect(() => {
    const saved = localStorage.getItem('diary-all-entries')
    if (saved) {
      setEntries(JSON.parse(saved))
    }
  }, [])

  function formatDateLabel(dateString: string) {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  function handleClick(date: string) {
    router.push(`/diary/${date}`)
  }

  const sortedDates = Object.keys(entries).sort((a, b) => b.localeCompare(a))

  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - i)
    return d.toISOString().split('T')[0]
  })

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.title}>Meu Diário</h1>
      <div className={styles.grid}>
        {last30Days.map((date) => (
          <div key={date} className={styles.card} onClick={() => handleClick(date)}>
            <h3>{formatDateLabel(date)}</h3>
            {entries[date] ? (
              <>
                <p>Entrada existente</p>
                <p>{entries[date].slice(0, 100)}</p>
              </>
            ) : (
              <p>Clique para escrever</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

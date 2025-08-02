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

  function getAllDaysOfCurrentMonthOrdered() {
    const now = new Date()
    const today = now.toISOString().split('T')[0]
    const year = now.getFullYear()
    const month = now.getMonth()
    const daysInMonth = new Date(year, month + 1, 0).getDate()

    const past: string[] = []
    const future: string[] = []

    for (let day = 1; day <= daysInMonth; day++) {
      const d = new Date(year, month, day)
      const formatted = d.toISOString().split('T')[0]

      if (formatted < today) {
        past.push(formatted)
      } else if (formatted > today) {
        future.push(formatted)
      }
    }

    return [today, ...past.reverse(), ...future]
  }

  function handleClick(date: string) {
    router.push(`/diary/${date}`)
  }

  const days = getAllDaysOfCurrentMonthOrdered()

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.title}>Meu Diário</h1>
      <div className={styles.grid}>
        {days.map((date) => (
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

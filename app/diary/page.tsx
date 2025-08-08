'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from '../styles/diary.module.css'
import { buscarTodasEntradas } from '../utils/indexedDb'

import AOS from 'aos'
import 'aos/dist/aos.css'

export default function DiaryListPage() {
  const [entries, setEntries] = useState<{ [date: string]: string }>({})
  const router = useRouter()

  useEffect(() => {
    buscarTodasEntradas().then((todas) => {
      setEntries(todas)
    })

   
    AOS.init({
      duration: 800,  
      easing: 'ease-out-cubic',
      once: true      
    })
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

  const today = new Date().toISOString().split('T')[0]
  const days = getAllDaysOfCurrentMonthOrdered()

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.title}>Meu Diário</h1>
      <div className={styles.grid}>
        {days.map((date, index) => {
          const isToday = date === today
          const hasEntry = !!entries[date]

          return (
            <div
              key={date}
              className={`${styles.card} ${isToday ? styles.today : ''} ${hasEntry ? styles.hasEntry : ''}`}
              onClick={() => handleClick(date)}
              data-aos="fade-up"
              data-aos-delay={index * 50} // efeito em cascata
            >
              <h3>{formatDateLabel(date)}</h3>
              {hasEntry ? (
                <>
                  <p>Entrada existente</p>
                  <p>{entries[date].slice(0, 100)}</p>
                </>
              ) : (
                <p>Clique para escrever</p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

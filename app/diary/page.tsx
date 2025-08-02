'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getSavedPassword } from '../utils/auth'
import styles from '../styles/diary.module.css'

export default function DiaryPage() {
  const router = useRouter()
  const [text, setText] = useState('')
  const [selectedDate, setSelectedDate] = useState(getToday())
  const [allEntries, setAllEntries] = useState<{ [date: string]: string }>({})

  useEffect(() => {
    const password = getSavedPassword()
    if (!password) {
      router.push('/login')
    }

    const stored = localStorage.getItem('diary-all-entries')
    if (stored) {
      const parsed = JSON.parse(stored)
      setAllEntries(parsed)
      if (parsed[selectedDate]) {
        setText(parsed[selectedDate])
      }
    }
  }, [router, selectedDate])

  function getToday() {
    return new Date().toISOString().split('T')[0]
  }

  function handleSave() {
    const updated = {
      ...allEntries,
      [selectedDate]: text
    }
    setAllEntries(updated)
    localStorage.setItem('diary-all-entries', JSON.stringify(updated))
    alert('Saved successfully.')
  }

  function handleSelectDate(date: string) {
    setSelectedDate(date)
    setText(allEntries[date] || '')
  }

  const savedDates = Object.keys(allEntries).sort((a, b) => b.localeCompare(a))

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>My Journal</h1>

      <div className={styles.sidebar}>
        {savedDates.map((date) => (
          <button
            key={date}
            className={`${styles.dateButton} ${selectedDate === date ? styles.active : ''}`}
            onClick={() => handleSelectDate(date)}
          >
            {date}
          </button>
        ))}
      </div>

      <div className={styles.editor}>
        <textarea
          className={styles.textarea}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write something..."
        />
        <button className={styles.saveButton} onClick={handleSave}>
          Save
        </button>
      </div>
    </main>
  )
}

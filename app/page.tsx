'use client'
import React from 'react'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getSavedPassword } from './utils/auth'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    const password = getSavedPassword()
    if (password) {
      router.push('/diary')
    } else {
      router.push('/login')
    }
  }, [router])

  return null
}

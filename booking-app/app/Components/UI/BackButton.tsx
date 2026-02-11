'use client'

import { useRouter } from 'next/navigation'
import Button from '../UI/Button'

export default function BackButton() {
  const router = useRouter()
  
  return (
    <Button 
      className='cursor-pointer'
      variant="primary" 
      onClick={() => router.back()} 
    >
      Quay Lại
    </Button>
  )
}
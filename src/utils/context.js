import { useState } from 'react'

export const Context = () => {
  const [message, setMessage] = useState()
  const [operation, setOperation] = useState()

  return {
    message,
    setMessage,
    operation,
    setOperation,
  }
}

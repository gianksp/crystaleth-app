import { useState } from 'react'

export const Context = () => {
  const [message, setMessage] = useState()
  const [operation, setOperation] = useState()
  const [available, setAvailable] = useState()
  const [staked, setStaked] = useState()
  const [crystals, setCrystals] = useState()

  return {
    message,
    setMessage,
    operation,
    setOperation,
    staked,
    setStaked,
    available,
    setAvailable,
    crystals,
    setCrystals,
  }
}

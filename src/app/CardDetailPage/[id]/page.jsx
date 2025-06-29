'use client'
import { useParams } from 'next/navigation'
import React from 'react'

export default function CardDetaipagePage() {
    const {id} = useParams();
  return (
    <div>
        {id}
    </div>
  )
}

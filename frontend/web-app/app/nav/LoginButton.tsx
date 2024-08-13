'use client'

import { Button } from 'flowbite-react'
import { signIn } from 'next-auth/react'
import React from 'react'

export default function LoginButton() {
  return (
    <Button outline onClick={() => signIn('id-server', {callbackUrl: '/'}, {prompt: 'login'})}>
        Login
    </Button>
  )
}

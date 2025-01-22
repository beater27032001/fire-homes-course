"use client"

import { Button } from "./ui/button"
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import { auth } from "@/firebase/client"

export default function ContinueWithGoogleButton() {
  return (
    <Button onClick={() => {
      const provider = new GoogleAuthProvider()
      signInWithPopup(auth, provider)
    }
    }>
      ContinueWithGoogle
    </Button>
  )
}
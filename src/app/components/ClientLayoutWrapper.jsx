'use client'

import { usePathname } from 'next/navigation'
import NavBar from './NavBar/NavBar'
import Footer from './Footer/Footer'


export default function ClientLayoutWrapper({ children }) {
  const pathname = usePathname()
  const hideLayout = ['/register', '/Login'].includes(pathname)

  return (
    <>
      {!hideLayout && <NavBar />}
      <main>
      <div className="min-h-[calc(100dvh-300px)]">
        {children}
      </div>
      </main>
      {!hideLayout && (
       <div id="footer">
      <Footer/>
      </div>
      )}
    </>
  )
}

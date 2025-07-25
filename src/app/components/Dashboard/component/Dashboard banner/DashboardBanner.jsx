import ButtonBorder from '@/app/components/Buttons/Button_border/ButtonBorder'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

export default function DashboardBanner() {
  const pathname = usePathname();

  const handleSafeClick = (e, href) => {
    if(pathname === href){
      e.preventDefault();
    }
    if(onclose) onclose();
  }
  return (
    <>
        <div className="flex items-center justify-baseline mx-auto mt-10 flex-wrap">
                <h1 className="text-3xl md:mr-36 mr-10">
                    Your Blogs
                </h1>

                <div className="w-fit">
                    <Link href={'/components/BlogContainer'} onClick={(e) => handleSafeClick(e, "components/BlogContainer")}>
                    <ButtonBorder>
                        Write a blog
                    </ButtonBorder></Link>
                </div>

       </div>
    </>
  )
}

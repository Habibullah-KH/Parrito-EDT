import ButtonBorder from '@/app/components/Buttons/Button_border/ButtonBorder'
import Link from 'next/link'
import React from 'react'

export default function DashboardNavbar() {
  return (
    <>
        <div className="w-full overflow-x-auto mt-6 flex justify-center">
               <div className="flex gap-4 whitespace-nowrap">
               
                <div>
                    <Link className="flex gap-3" href={'/'}>
                    <ButtonBorder>Drafts</ButtonBorder>
                    <p>0</p></Link>
                </div>

                <div >
                    <Link className="flex gap-3" href={'/'}>
                    <ButtonBorder>Published</ButtonBorder>
                    <p>0</p></Link>
                </div>

                <div >
                    <Link className="flex gap-3" href={'/'}>
                    <ButtonBorder>Responsed</ButtonBorder>
                    <p>0</p></Link>
                </div>

               </div>
</div>
    </>
  )
}

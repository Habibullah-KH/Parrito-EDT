"use client"
import './navbar.css'
import ButtonBorder from '../Buttons/Button_border/ButtonBorder'
import { useState } from 'react';
import ThemeSwap from '../Buttons/Theme_swap/ThemeSwap'
import { useTheme } from '../Theme/useTheme'
import Logo from '../Logo/Logo';
import ProfileIcon from '../Buttons/Profile_button/ProfileIcon';
import Dropdown from '../Dropdown/Dropdown';
import Link from 'next/link';

export default function NavBar(){

    const {swapTheme} = useTheme();

    const [navDrop, setNavDrop] = useState(false);
    const handleDropdown = () => {
        setNavDrop(!navDrop);
    };
return(
    <>
    <div className='p-3 sticky top-0 backdrop-blur z-50'>
    <div 
    className='flex justify-center  md:justify-around items-center max-w-[95%] mx-auto'>
     {/*Name container*/}
     <div className='mb-3'>
     <Link href={"/"}>
        <Logo/>
     </Link>
     </div>
     {/*Name container end*/}

{/*button + theme container*/}

<div className='flex items-center absolute right-5 md:static'>
     {/*theme section start*/}
     <div 
     className='ml-7 text-xl flex'
     onClick={swapTheme}
     >
     <ThemeSwap/>
     </div>
     {/*theme section end*/}

{/*dropdown section start*/}
<div className='relative'>
    <div 
    className='flex ml-5'
    onClick={handleDropdown}
    ><ProfileIcon/></div>
 {/*dropdown swapwe end*/}

 <div className=
{`dropdown_container backdrop-blur-2xl 
${navDrop ? 'top-[50px]':'-top-[590px]'}
`}>
   <Dropdown/>        
</div>
</div>
</div>{/*button + theme container end*/}

    </div>
    </div> {/*parent container end*/}

    </>
)
};
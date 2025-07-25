"use client"
import './navbar.css'
import ButtonBorder from '../Buttons/Button_border/ButtonBorder'
import { useEffect, useRef, useState } from 'react';
import ThemeSwap from '../Buttons/Theme_swap/ThemeSwap'
import { useTheme } from '../Theme/useTheme'
import Logo from '../Logo/Logo';
import ProfileIcon from '../Buttons/Profile_button/ProfileIcon';
import Dropdown from '../Dropdown/Dropdown';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function NavBar(){
    const {data : session, status} = useSession();
    const {swapTheme, darkMode} = useTheme();

    const [navDrop, setNavDrop] = useState(false);
    const dropdownRef = useRef(null); // dropdown container
    const triggerRef = useRef(null);  // icon/button that toggles dropdown
    const handleDropdown = () => {
        setNavDrop(!navDrop);
    };

// Close dropdown if click is outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target)
      ) {
        setNavDrop(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

return(
    <>
    <div className={`
    ${darkMode === 'enabled' ? "dropdown_black" : "dropdown_white" }
    p-3 sticky top-0 z-50 `}>

    <div 
    className='flex justify-center items-center md:justify-around max-w-[95%] mx-auto'>

     {/*Name container*/}
     <div className=''>
     <Link href={"/"}>
        <Logo/>
     </Link>
     </div>
     {/*Name container end*/}

{/*button + theme container*/}

{/*search system*/}
<div>

</div>

<div className='flex items-center absolute right-5 md:static'>
     {/*theme section start*/}
     <div 
     className='ml-7 mr-4 text-xl flex'
     onClick={swapTheme}
     >
     <ThemeSwap/>
     </div>
     {/*theme section end*/}

{/*dropdown section start*/}
{status === "authenticated" ? (
  <div className='relative'>
    <div 
      className='flex ml-5'
      onClick={handleDropdown}
      ref={triggerRef}
    >
      <ProfileIcon />
    </div>

    {/* Dropdown Swap */}
    <div className={`dropdown_container
    ${darkMode === 'enabled' ? "dropdown_black" : "dropdown_white" }
  ${navDrop ? 'top-[50px]' : '-top-[590px]'}`}
  ref={dropdownRef}
  >
  <Dropdown onClose={() => setNavDrop(false)} />
</div>

  </div>
) : (
  <Link href={"/register"}>
    <ButtonBorder>Sign up</ButtonBorder>
  </Link>
)}



</div>{/*button + theme container end*/}

    </div>
    </div> {/*parent container end*/}

    </>
)
};
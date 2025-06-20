"use client"
import { useState } from 'react';
import './logo.css'
export default function Logo(){
    const[clickCount, setClickCount]=useState(null);
    const[activated, setActivated] = useState(false);
    function clicks(){
        if(clickCount + 1 === 9){
            setActivated(true)
        }
        setClickCount(prev => prev + 1)
        if(activated){
            return alert ('admin');
        }
    }

    return(
        <>
            <div> {/*parent container start*/}
        <div className='logo_container'>
        <h1 className='logo_first_name'>Paritto</h1>
        </div>
            </div> {/*parent container end*/}
        </>

    );
}
import './profileIcon.css'
import { CgProfile } from "react-icons/cg";

export default function ProfileIcon(){
        
    return(
        <>
        <div className=' iconContainer text-2xl'>
      <button>
       <CgProfile />
      </button>  
        </div>
        </>
    );
}
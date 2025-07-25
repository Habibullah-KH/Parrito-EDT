import Link from "next/link";
import ButtonBorder from "../Buttons/Button_border/ButtonBorder";
import { useSession, signOut } from "next-auth/react";
import { RiHomeLine } from "react-icons/ri";
import { RiProfileLine } from "react-icons/ri";
import { MdOutlineSpaceDashboard } from "react-icons/md";
import { IoBookmarksOutline } from "react-icons/io5";
import { usePathname } from "next/navigation";


export default function Dropdown({ onClose }) {
  const { status } = useSession();
  const pathname = usePathname();

  const isActive = (path) => pathname === path;

  const handleSafeClick = (e, href) => {
    if (pathname === href){
      e.preventDefault();
    }
    if (onClose) onClose();
  };

  return (
    <div className="flex flex-col gap-5 justify-between p-2 rounded-xl">
      <ul>

        <li>
          <Link href="/" onClick={(e) => handleSafeClick(e, "/")}>
          <div className={isActive("/") ? "opacity-50" : ""}>
            
            <ButtonBorder>
            <div className="flex items-center gap-2">
            <RiHomeLine /> Home
            </div>
            </ButtonBorder>

          </div>
          </Link>
        </li>

        {/* Show only if authenticated */}
        {status === "authenticated" && (
          <>
          <li>
          <div className={isActive("/library") ? "opacity-50" : ""}>
              <ButtonBorder>
             <div className="flex items-center gap-2">
            <IoBookmarksOutline /> library
            </div>
              </ButtonBorder>
          </div>
         </li>

            <li>
            <div className={isActive("/UserProfile") ? "opacity-50" : ""}>
              <Link href="/UserProfile" onClick={(e) => handleSafeClick(e, "/UserProfile")}>

              <ButtonBorder>
             <div className="flex items-center gap-2">
            <RiProfileLine /> Profile
            </div>
              </ButtonBorder>

              </Link>
            </div>
            </li>

            <li>
            <div className={isActive("/components/Dashboard") ? "opacity-50" : ""}>
              <Link href="/components/Dashboard" onClick={(e) => handleSafeClick(e, "/components/Dashboard")}>

              <ButtonBorder>
            <div className="flex items-center gap-2">
            <MdOutlineSpaceDashboard /> Dashboard
            </div>
              </ButtonBorder>
              </Link>
            </div>
            </li>
          </>
        )}
      </ul> 

      {/* Sign Out only if authenticated */}
      {status === "authenticated" && (
        <button
          className="text-sm text-left"
          onClick={() => {
            signOut();
            handleClose();
          }}
        >
          <ButtonBorder>Sign out</ButtonBorder>
        </button>
      )}
    </div>
  );
}

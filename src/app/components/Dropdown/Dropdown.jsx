import Link from "next/link";
import ButtonFill from "../Buttons/Button_fill/ButtonFill";
import ButtonBorder from "../Buttons/Button_border/ButtonBorder";
import { useSession, signOut } from "next-auth/react";

export default function Dropdown({ onClose }) {
  const { status } = useSession();

  const handleClose = () => {
    if (onClose) onClose();
  };

  return (
    <div className="flex flex-col gap-5 justify-between p-2 rounded-xl">
      <ul>
        <li>
          <Link href="#footer" onClick={handleClose}>
            <ButtonFill>Help</ButtonFill>
          </Link>
        </li>
        <li>
          <Link href="/" onClick={handleClose}>
            <ButtonFill>Home</ButtonFill>
          </Link>
        </li>

        {/* Show only if authenticated */}
        {status === "authenticated" && (
          <>
            <li>
              <Link href="/UserProfile" onClick={handleClose}>
                <ButtonFill>Profile</ButtonFill>
              </Link>
            </li>
            <li>
              <Link href="components/BlogContainer" onClick={handleClose}>
                <ButtonFill>Dashboard</ButtonFill>
              </Link>
            </li>
          </>
        )}
      </ul>

      {/* Sign Out only if authenticated */}
      {status === "authenticated" && (
        <button
          className="text-sm"
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

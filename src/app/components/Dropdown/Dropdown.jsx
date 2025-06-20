import Link from "next/link";
import ButtonFill from "../Buttons/Button_fill/ButtonFill"; // Make sure this is imported
import ButtonBorder from "../Buttons/Button_border/ButtonBorder";

export default function Dropdown() {
  return (
    <>
    <div className="flex flex-col gap-5 justify-between p-2 rounded-xl backdrop-blur">
    <ul>
      <li>
        <Link href="#about">
          <ButtonFill>Profile</ButtonFill>
        </Link>
      </li>
      <li>
        <Link href="#project">
          <ButtonFill>Dashboard</ButtonFill>
        </Link>
      </li>
      <li>
        <Link href="#footer">
          <ButtonFill>Help</ButtonFill>
        </Link>
      </li>
    </ul>

    <div className="text-sm">
            <ButtonBorder>
                Sign out
            </ButtonBorder>
    </div>
    </div>
    </>


  );
}

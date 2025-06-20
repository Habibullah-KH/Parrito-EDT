import { FaGithub, FaLinkedin } from "react-icons/fa";
import Logo from "../Logo/Logo";
import "./footer.css"
export default function Footer() {
  return (
    <footer className="footer_container py-10 mt-10">
      <div className="max-w-7xl mx-auto px-4 flex flex-col items-center gap-4 text-center">
        <div className="text-2xl font-bold">
          <Logo />
        </div>
        <p className="text-sm">
          Thank you for visiting. Let’s connect and build something beautiful.
        </p>
        <div className="flex gap-4 text-xl">
          <a
            href="https://github.com/Habibullah-KH"
            target="_blank"
            rel="noopener noreferrer"
            className="text_hover transition"
          >
            <FaGithub />
          </a>
          <a
            href="https://www.linkedin.com/in/habibullah-khandokar/"
            target="_blank"
            rel="noopener noreferrer"
            className="text_hover transition"
          >
            <FaLinkedin />
          </a>
        </div>
      </div>
    </footer>
  );
}

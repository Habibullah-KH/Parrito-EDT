import './themeSwap.css';
import { MdOutlineDarkMode } from "react-icons/md";
import { FiSun } from "react-icons/fi";
import { useTheme } from '../../Theme/useTheme';

export default function ThemeSwap() {
  const { darkMode, swapTheme } = useTheme();

  const isDark = darkMode === 'enabled';

  return (
    <button
      className={`ThemeSwap-button ${isDark ? 'active' : ''}`}
      onClick={swapTheme}
    >
      <span className="icon moon-icon">
        <MdOutlineDarkMode size={25} />
      </span>
      <span className="icon sun-icon">
        <FiSun size={25} />
      </span>
    </button>
  );
}

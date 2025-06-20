import { useTheme } from '../../Theme/useTheme';
import './buttonBorder.css'
export default function ButtonBorder({ children }) {
    const {darkMode} = useTheme();
    return (
        <button className={`${darkMode === 'enabled' ? "btn-border_dark" : "btn-border" }`}>
            {children}
        </button>
    );
}
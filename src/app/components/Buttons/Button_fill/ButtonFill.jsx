import { useTheme } from '../../Theme/useTheme';
import './buttonFill.css'
export default function ButtonFill({children}){
        const {darkMode} = useTheme();
    return(
        <>
        <div className={`${darkMode === 'enabled' ? "button_container_dark" : "button_container" }`}>
        {children}
        </div>
        </>
    );
}
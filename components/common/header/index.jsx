
import { basePath } from '../../../next.config';
import styles from './styles.module.css';

export default function Header() {
    return (
        <header className={styles['header']}>
            <img src={basePath + '/images/logo.png'} alt='Bastián Paredes' className={styles['logo']}/>
            <h1 className={styles['header-tittle']}>Chat global</h1>
        </header>
    )
}

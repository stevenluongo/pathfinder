import styles from "../styles/nav.module.scss";
import KeyboardArrowDown from "@material-ui/icons/KeyboardArrowDown";
import ReactSlider from 'react-slider'

function SideNav () {
    return (
        <div className={styles.sidenav}>
            <div className={styles.algorithm}>
                <h5>Algorithm</h5>
                <span>Dijkstra<KeyboardArrowDown/></span>
            </div>
            <div className={styles.nodes}>
                <h5>Nodes</h5>
                <h6>Main</h6>
                <div className={styles.container}>
                    <span>Start</span>
                    <span>Finish</span>
                </div>
                <h6>Secondary</h6>
                <div className={styles.container}>
                    <span>Wall</span>
                </div>
            </div>
            <div className={styles.settings}>
                <h5>Settings</h5>
                <h6>Speed</h6>
                <div className={styles.slider}>
                <div className={styles.sliderIcon}/>
                <ReactSlider
                    defaultValue={15}
                    className={styles.horizontalSlider}
                    thumbClassName={styles.sliderThumb}
                    min={10}
                    max={40}
                />
                <div className={styles.sliderIcon}/>
                </div>
            </div>
            <div className={styles.colors}>
                <h5>Colors</h5>
                <h6>Start Node</h6>
                <span className={styles.container}>
                    <div className={styles.colorPicker} style={{background: "rgb(85, 206, 150)"}}/>
                    <input type="text" placeholder="#00223e"/>
                </span>
                <h6>Finish Node</h6>
                <span className={styles.container}>
                    <div className={styles.colorPicker} style={{background: "rgb(241, 91, 71)"}}/>
                    <input type="text" placeholder="#00223e"/>
                </span>
                <h6>Wall Node</h6>
                <span className={styles.container}>
                    <div className={styles.colorPicker} style={{background: "#003549"}}/>
                    <input type="text" placeholder="#00223e"/>
                </span>
            </div>
        </div>
    )
}

export default SideNav;
import classes from './footer.module.css'

export function Footer() {
    return (
        <footer className={classes.footr}>
            <p>20XX-2026. All copyrights reserved.</p>
            <div className={classes.btns}>
                <button type="button">About us</button>
                <button type="button">Feedback</button>
            </div>
        </footer>
    )
}
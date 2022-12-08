import Link from "next/link";
import { Component, ReactNode } from "react";

import styles from "../styles/components/Navbar.module.scss";

export default class Navbar extends Component {
    public render(): ReactNode {
        return (
            <div id={styles["navbar"]}>
                <Link href="/">Home</Link>
            </div>
        );
    }
}
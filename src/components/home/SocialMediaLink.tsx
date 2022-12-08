import Image from "next/image";
import Link from "next/link";
import { Component, ReactNode } from "react";

import styles from "../../styles/components/SocialMediaLink.module.scss";

interface Props {
    name: string;
    link: string;
    icon: any;
}

export default class SocialMediaLink extends Component<Props> {
    public render(): ReactNode {
        return (
            <Link href={this.props.link}>
                <div className={styles["social-link"]}>
                    <Image src={this.props.icon} alt={this.props.name.toLowerCase() + "-image"}></Image>
                    <span>{this.props.name}</span>
                </div>
            </Link>
        );
    }
}
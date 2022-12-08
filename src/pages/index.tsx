import Head from "next/head";
import { Component, ReactNode } from "react";

import githubLogo from "../../public/images/github.png";

import imageGenIcon from "../../public/images/image_gen.svg";
import spotifyLogo from "../../public/images/spotify.svg";
import youtubeLogo from "../../public/images/youtube.svg";

import motds from "../../public/motds.json";
import SocialMediaLink from "../components/home/SocialMediaLink";

import styles from "../styles/Home.module.scss";

interface State {
    motd: string;
}

export default class HomePage extends Component<{}, State> {
    constructor(props: {}) {
        super(props);

        this.state = {
            motd: "\xa0"
        };
    }

    public render(): ReactNode {
        return (
            <>
                <Head>
                    <title>zani.wtf</title>
                    <meta name="title" content="zani.wtf"/>
                    <meta name="description" content="zani's tools, blog, links and more."/>
                    <meta name="keywords"
                          content="free, ai, art, ai art, image, generator, anime, ai image, anime image, anime image gen, gen, imagine, blog, zani, wtf, zani wtf" />
                    <meta name="robots" content="index, follow"/>
                    <meta name="language" content="English"/>
                    <meta name="revisit-after" content="5 days"/>
                </Head>
                <div id="screen-center-aligner">
                    <div id={styles["links"]}>
                        <h1 id={styles["intro"]}>hi my name is <span
                            className={styles["text-highlight"]}>zani</span> and...</h1>
                        <p id={styles["motd"]}>{this.state.motd}</p>
                        <SocialMediaLink name={"Youtube"} link={"https://youtube.com/@zani_wtf"}
                                         icon={youtubeLogo}></SocialMediaLink>
                        <SocialMediaLink name={"Github"} link={"https://github.com/zxnii"}
                                         icon={githubLogo}></SocialMediaLink>
                        <SocialMediaLink name={"Spotify"}
                                         link={"https://open.spotify.com/user/9vnu2jmnvaweqa4mgmgthfvhy"}
                                         icon={spotifyLogo}></SocialMediaLink>
                        <div className={styles["separator"]}></div>
                        <SocialMediaLink name={"AI Image Gen"} link={"/image_gen"}
                                         icon={imageGenIcon}></SocialMediaLink>
                    </div>
                </div>
            </>
        );
    }

    public componentDidMount(): void {
        this.setState({
            motd: motds[Math.min(Math.floor(Math.random() * motds.length), motds.length - 1)]
        });
    }
}
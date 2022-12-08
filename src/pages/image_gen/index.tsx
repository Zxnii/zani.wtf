import Head from "next/head";
import Link from "next/link";
import { Component, ReactNode, SyntheticEvent } from "react";
import DefaultPage from "../../components/DefaultPage";
import GalleryImage from "../../components/image_gen/GalleryImage";

import styles from "../../styles/image_gen/ImageGen.module.scss"
import Util from "../../util/Util";

interface State {
    isLoadingGallery: boolean,
    isLoading: boolean,
    isLoaded: boolean,
    hasLoadedGallery: boolean,
    canLoadMoreGallery: boolean,
    error?: string,
    src: string,
    galleryEntries: { id: string, tags: string[] }[]
}

export default class ImageGen extends Component<{}, State> {
    private genWebsocket?: WebSocket;

    constructor(props: {}) {
        super(props);

        this.state = {
            isLoadingGallery: false,
            isLoading: false,
            isLoaded: false,
            hasLoadedGallery: false,
            canLoadMoreGallery: true,
            error: undefined,
            src: "",
            galleryEntries: []
        };
    }

    public render(): ReactNode {
        return (
            <>
                <Head>
                    <title>AI Image Generation</title>
                    <meta name="title" content="AI Anime Image Generation — zani.wtf"/>
                    <meta name="description" content="An easy to use, always free, AI anime generator."/>
                    <meta name="keywords"
                          content="free, ai, art, ai art, image, generator, anime, ai image, anime image, anime image gen, gen, imagine"/>
                    <meta name="robots" content="index, follow"/>
                    <meta name="language" content="English"/>
                    <meta name="revisit-after" content="5 days"/>
                </Head>
                <DefaultPage>
                    <div id={styles["screen-center-aligner"]}>
                        <div id={styles["imagine-container"]}>
                            <input type="text"
                                   id={styles["imagine-prompt"]}
                                   className={this.state.isLoading ? styles["disabled"] : ""}
                                   disabled={this.state.isLoading}
                                   placeholder={this.state.isLoading ? "Generating image, hold tight." : "Enter a prompt"}
                                   onKeyDown={this.onInput.bind(this)}
                                   onKeyUp={this.onInput.bind(this)}/>
                            {this.state.isLoading || this.state.isLoaded ?
                                <div id={styles["imagine-result-container"]}>
                                    {this.state.isLoaded ?
                                        <img id={styles["imagine-result"]} src={this.state.src} alt=""></img> : null}
                                </div> : null}
                        </div>
                        <div id={styles["gallery-box"]}>
                            <h1>AI Gallery</h1>
                            {!this.state.hasLoadedGallery ?
                                <>
                                    <p>The gallery contains unmoderated, potentially 18+ and or offensive content.</p>
                                </> : <ul id={styles["gallery-images"]}>
                                    {
                                        this.state.galleryEntries.map((entry, index) => {
                                            return (<GalleryImage id={entry.id} key={index}></GalleryImage>);
                                        })
                                    }
                                </ul>
                            }
                            {this.state.canLoadMoreGallery ?
                                <button className={styles["gallery-button"]}
                                        onClick={this.loadGallery.bind(this)}>{this.state.isLoadingGallery ? "Loading.." : "Load"}</button> :
                                null
                            }
                        </div>
                        <p id={styles["credit"]}>Images generated by <Link
                            href="https://discord.com/oauth2/authorize?client_id=533357091424043050&scope=bot&permissions=274877959232">Vivy</Link>
                        </p>
                    </div>
                </DefaultPage>
            </>
        );
    }

    private onInput(event: SyntheticEvent): void {
        const nativeEvent = event.nativeEvent as KeyboardEvent;
        const target = nativeEvent.target as HTMLInputElement;

        const value = target.value.trim();

        if (nativeEvent.code === "Enter" && value !== "" && !this.state.isLoading) {
            this.genWebsocket = new WebSocket(Util.isDevEnv() && process.env.OFFICIAL === "true" ? "ws://localhost:3001/ws" : "wss://api.zani.wtf/ws");

            this.setState({
                isLoading: true,
                isLoaded: false
            });

            this.genWebsocket.addEventListener("error", (err) => {
                this.setState({
                    isLoading: false,
                    isLoaded: false
                });
            });

            target.value = "";

            this.genWebsocket.addEventListener("open", async () => {
                this.sendMessage({ command: "gen_image", prompt: value });

                const result = await this.awaitMessage<{ src: string }>();

                if (!("src" in result)) {
                    this.setState({
                        isLoading: false
                    });
                } else {
                    this.setState({
                        isLoaded: true,
                        isLoading: false,
                        src: result.src
                    });
                }
            });

            this.genWebsocket.addEventListener("close", async () => {
                if (!this.state.isLoaded) {
                    this.setState({
                        isLoading: false
                    });
                }
            });
        }
    }

    private sendMessage(message: string | ArrayBuffer | { [key: string | number]: any }): void {
        this.genWebsocket?.send(typeof message === "string" || (typeof message === "object" && message instanceof ArrayBuffer) ? message : JSON.stringify(message));
    }

    private awaitMessage<T>(): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            const listener = async (event: MessageEvent): Promise<void> => {
                let data = event.data as Blob | string;
                let message: string;

                if (typeof data === "string") {
                    message = data;
                } else {
                    message = await data.text();
                }

                try {
                    const deserialized = JSON.parse(message);

                    this.genWebsocket?.removeEventListener("message", listener);

                    resolve(deserialized as T);
                } catch {
                    this.genWebsocket?.removeEventListener("message", listener);

                    resolve(message as T);
                }
            }

            this.genWebsocket?.addEventListener("error", (err) => {
                reject(err);
            });

            this.genWebsocket?.addEventListener("message", listener);
        });
    }

    private async loadGallery(): Promise<void> {
        if (!this.state.isLoadingGallery) {
            this.setState({
                isLoadingGallery: true
            });

            try {
                const response = await fetch(`${Util.getApiUrl()}/gallery?limit=20&offset=${Math.max(0, this.state.galleryEntries.length - 1)}`);
                const data = await response.json();

                this.setState({
                    isLoadingGallery: false,
                    hasLoadedGallery: true,
                    canLoadMoreGallery: data.length === 20,
                    galleryEntries: [...this.state.galleryEntries, ...data]
                });
            } catch {
                this.setState({
                    isLoadingGallery: false
                });
            }
        }
    }
}
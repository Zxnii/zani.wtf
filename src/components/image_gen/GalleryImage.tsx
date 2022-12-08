import classNames from "classnames";
import { Component, ReactNode } from "react";

import styles from "../../styles/image_gen/ImageGen.module.scss";
import Util from "../../util/Util";

interface Props {
    entry: { id: string, tags: string[], nsfw: boolean }
}

interface State {
    opened: boolean
}

export default class GalleryImage extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            opened: false
        };
    }

    public render(): ReactNode {
        return (
            <div
                onClick={this.toggleOpen.bind(this)}
                className={classNames(styles["gallery-image"], { [styles["nsfw"]]: this.props.entry.nsfw && !this.state.opened }, { [styles["opened"]]: this.state.opened })}>
                <img src={`${Util.getApiUrl()}/gallery/image/${this.props.entry.id}`} alt={this.props.entry.id}></img>
                {
                    this.props.entry.nsfw && !this.state.opened ? (
                        <div className={styles["nsfw-warning"]}>
                            <span>NSFW</span>
                        </div>) : null
                }
                {
                    this.state.opened ? (
                        <div className={styles["opened-meta"]}>
                            <p><b>Prompt: </b>{this.props.entry.tags.join(", ")}</p>
                            <p><b>NSFW: </b>{this.props.entry.nsfw ? "True" : "False"}</p>
                        </div>
                    ) : null
                }
            </div>
        );
    }

    private toggleOpen(): void {
        this.setState({
            opened: !this.state.opened
        });
    }
}
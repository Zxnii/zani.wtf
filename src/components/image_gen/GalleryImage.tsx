import { Component, ReactNode } from "react";

import styles from "../../styles/image_gen/ImageGen.module.scss";
import Util from "../../util/Util";

interface Props {
    id: string
}

export default class GalleryImage extends Component<Props> {
    public render(): ReactNode {
        return (
            <div className={styles["gallery-image"]}>
                <img src={`${Util.getApiUrl()}/gallery/image/${this.props.id}`} alt={this.props.id}></img>
            </div>
        );
    }
}
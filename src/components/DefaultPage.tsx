import { Component, ReactNode } from "react";
import Navbar from "./Navbar";

interface Props {
    children?: JSX.Element | JSX.Element[];
}

export default class DefaultPage extends Component<Props> {
    public render(): ReactNode {
        return (
            <>
                <Navbar></Navbar>
                {this.props.children}
            </>
        );
    }
}
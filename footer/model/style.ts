import {Styled} from "@miniskylab/antimatter-framework";
import {LabelStyle} from "@miniskylab/antimatter-label";
import {FooterProps} from "./props";

export type FooterStyle = (footerProps: Styled<FooterProps>) => {
    Root?: LabelStyle
};
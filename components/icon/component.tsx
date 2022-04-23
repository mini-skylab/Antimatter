import React from "react";
import {Props} from "./model";
import * as Variant from "./variant";

/**
 * <p style="color: #9B9B9B; font-style: italic">(no description available)</p>
 */
export function Component(props: Props): JSX.Element
{
    const {
        variant = Variant.Default,
        className = String.EMPTY,
        iconName,
        style,
        onClick,
        onPointerDown
    } = props;

    return (
        <div
            className={`${className} ${variant[iconName]}`}
            onClick={onClick ? onClick : undefined}
            style={style}
            onPointerDown={onPointerDown ? onPointerDown : undefined}
        />
    );
}
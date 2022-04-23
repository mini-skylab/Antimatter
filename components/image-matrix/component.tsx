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
        images = []
    } = props;

    return (
        <div className={variant["image-matrix"]}>
            {images.map((x, i) => (
                <img
                    key={i}
                    className={variant["image-matrix__image"]}
                    src={x.url.original}
                    alt={x.altText}
                />
            ))}
        </div>
    );
}

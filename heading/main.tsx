import {useComputedStyle} from "@miniskylab/antimatter-framework";
import {HighlightedParagraph} from "@miniskylab/antimatter-highlighted-paragraph";
import {Label} from "@miniskylab/antimatter-label";
import {View} from "@miniskylab/antimatter-view";
import React, {JSX, useMemo} from "react";
import {HeadingContext, HeadingProps} from "./models";
import * as Variant from "./variants";

/**
 * <p style="color: #9B9B9B; font-style: italic">(no description available)</p>
 */
export function Heading({
    style = Variant.Default,
    title,
    subTitle
}: HeadingProps): JSX.Element
{
    const props: Required<HeadingProps> = {
        style, title, subTitle
    };

    const context = useMemo<HeadingContext>(
        () => ({props}),
        [...Object.values(props)]
    );

    const computedStyle = useComputedStyle(style, props);

    return (
        <HeadingContext.Provider value={context}>
            <View style={computedStyle.Root}>
                <Label style={computedStyle.Title}>{title}</Label>
                <View style={computedStyle.Hr}/>
                {subTitle && (<HighlightedParagraph style={computedStyle.SubTitle} content={subTitle}/>)}
            </View>
        </HeadingContext.Provider>
    );
}

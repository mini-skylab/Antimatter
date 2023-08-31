import {Icon} from "@miniskylab/antimatter-icon";
import {Label} from "@miniskylab/antimatter-label";
import {View} from "@miniskylab/antimatter-view";
import React, {JSX, useMemo} from "react";
import {HighlightedParagraphContext, HighlightedParagraphProps} from "./model";
import * as Variant from "./variant";

/**
 * <p style="color: #9B9B9B; font-style: italic">(no description available)</p>
 */
export function HighlightedParagraph({
    style = Variant.Default,
    icon,
    title,
    content
}: HighlightedParagraphProps): JSX.Element
{
    const props: Required<HighlightedParagraphProps> = {
        style, icon, title, content
    };

    const context = useMemo<HighlightedParagraphContext>(
        () => ({props}),
        [...Object.values(props)]
    );

    const {style: _, ...propsWithoutStyle} = props;
    const computedStyle = style(propsWithoutStyle);

    return (
        <HighlightedParagraphContext.Provider value={context}>
            <View style={computedStyle.Root}>
                {(icon || title) && (
                    <View style={computedStyle.TitleContainer}>
                        {icon && <Icon style={computedStyle.TitleIcon} name={icon}/>}
                        {title && <Label style={computedStyle.TitleLabel}>{title}</Label>}
                    </View>
                )}
                {(icon || title) && content && <View style={computedStyle.Gap}/>}
                {content && <Label style={computedStyle.Content}>{content}</Label>}
            </View>
        </HighlightedParagraphContext.Provider>
    );
}
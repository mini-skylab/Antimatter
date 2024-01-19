import {Button} from "@miniskylab/antimatter-button";
import {AllPropertiesMustPresent, EMPTY_STRING, isEnvironment, Ts, useComputedStyle} from "@miniskylab/antimatter-framework";
import React, {JSX, useEffect, useMemo, useState} from "react";
import {DownloadButtonContext, DownloadButtonProps, DownloadButtonState} from "./models";
import * as Variant from "./variants";

/**
 * <p style="color: #9B9B9B; font-style: italic">(no description available)</p>
 */
export function DownloadButton({
    style = Variant.Default,
    href = EMPTY_STRING,
    label = EMPTY_STRING,
    icon,
    fileName,
    disabled = false
}: DownloadButtonProps): JSX.Element
{
    if (!isEnvironment("Web"))
    {
        throw new Error("<DownloadButton/> can only be used inside web environment");
    }

    const props: AllPropertiesMustPresent<DownloadButtonProps> = {
        style, href, label, icon, fileName, disabled
    };

    const [state, setState] = useState<DownloadButtonState>({
        blobURL: href,
        disabled: true
    });

    const context = useMemo<DownloadButtonContext>(
        () => ({props, state}),
        [...Object.values(props), ...Object.values(state)]
    );

    Ts.Error.throwIfNullOrUndefined(style);
    const computedStyle = useComputedStyle(style, props, state);

    useEffect(() =>
    {
        (async function ()
        {
            if (state.disabled)
            {
                const response = await fetch(href);
                const blobURL = URL.createObjectURL(await response.blob());

                setState(prevState => ({
                    ...prevState,
                    blobURL,
                    disabled: false
                }));
            }
        })();
    }, []);

    return (
        <DownloadButtonContext.Provider value={context}>
            <Button
                style={computedStyle}
                label={label}
                icon={icon}
                onPress={onPress}
                disabled={disabled || state.disabled}
            />
        </DownloadButtonContext.Provider>
    );

    function onPress(): void
    {
        const hidden_a = document.createElement("a");
        hidden_a.style.display = "none";
        hidden_a.setAttribute("href", state.blobURL);
        hidden_a.setAttribute("download", fileName);
        hidden_a.setAttribute("target", "_self");

        document.body.appendChild(hidden_a);
        hidden_a.click();
        document.body.removeChild(hidden_a);
    }
}

import {Icon} from "@miniskylab/antimatter-icon";
import {Label} from "@miniskylab/antimatter-label";
import React from "react";
import {ButtonProps, Target} from "./model";

/**
 * <p style="color: #9B9B9B; font-style: italic">(no description available)</p>
 */
export function Button({
    className,
    label,
    target = Target.SameFrame,
    disabled = false,
    href,
    icon,
    onClick,
    onPointerDown
}: ButtonProps): JSX.Element
{
    return (
        <a
            target={target}
            href={disabled ? undefined : href}
            rel={target === Target.NewWindowOrTab ? "noopener" : undefined}
            className={`${className}${disabled ? "--Disabled" : String.EMPTY}`}
            onClick={!disabled && onClick ? onClick : undefined}
            onPointerDown={onPointerDown}
        >
            {icon && <Icon className={"Button-Icon"} name={icon}/>}
            {label && <Label className={"Button-Label"} text={label}/>}
        </a>
    );
}

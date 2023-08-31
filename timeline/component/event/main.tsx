import {DateFormat, EMPTY_STRING, GregorianCalendar, TimeUnit} from "@miniskylab/antimatter-framework";
import {Icon, IconName} from "@miniskylab/antimatter-icon";
import {Image} from "@miniskylab/antimatter-image";
import {Label} from "@miniskylab/antimatter-label";
import {View} from "@miniskylab/antimatter-view";
import React, {JSX, useMemo} from "react";
import {EventContext, Props, RowContext} from "./model";

/**
 * <p style="color: #9B9B9B; font-style: italic">(no description available)</p>
 */
export function Component({
    style,
    index,
    name = EMPTY_STRING,
    image,
    description = EMPTY_STRING,
    icon,
    startDate,
    endDate,
    isOnGoing = false,
    location = EMPTY_STRING,
    minimumTimeUnit = TimeUnit.Month
}: Props): JSX.Element
{
    const props: Required<Props> = {
        style, index, name, image, description, icon, startDate, endDate, isOnGoing, location, minimumTimeUnit
    };

    const context = useMemo<EventContext>(
        () => ({props}),
        [...Object.values(props)]
    );

    const {style: _, ...propsWithoutStyle} = props;
    const computedStyle = style(propsWithoutStyle);

    return (
        <EventContext.Provider value={context}>
            <View style={computedStyle.Root}>
                <Icon style={computedStyle.Icon} name={icon}/>
                <View style={computedStyle.TriangleArrow}/>
                <Label style={computedStyle.Name}>{name}</Label>
                <View style={computedStyle.Hr}/>
                {image && <Image style={computedStyle.Image} source={image}/>}
                <RowContext.Provider value={"time"}>
                    <View style={computedStyle.Row}>
                        <Icon style={computedStyle.BulletinIcon} name={IconName.Clock}/>
                        <Label style={computedStyle.StartDate}>
                            {GregorianCalendar.toString(startDate, DateFormat.Long, minimumTimeUnit)}
                        </Label>
                        {(isOnGoing || endDate) && <Icon style={computedStyle.ArrowRightIcon} name={IconName.ArrowRight}/>}
                        {
                            isOnGoing && <Label style={computedStyle.EndDate}>Now</Label>
                            ||
                            endDate && (
                                <Label style={computedStyle.EndDate}>
                                    {GregorianCalendar.toString(endDate, DateFormat.Long, minimumTimeUnit)}
                                </Label>
                            )
                        }
                    </View>
                </RowContext.Provider>
                {(isOnGoing || endDate) && (
                    <RowContext.Provider value={"duration"}>
                        <View style={computedStyle.Row}>
                            <Icon style={computedStyle.BulletinIcon} name={IconName.History}/>
                            <Label style={computedStyle.Duration}>
                                {GregorianCalendar.getTimeDuration(startDate, isOnGoing ? new Date() : endDate, minimumTimeUnit)}
                            </Label>
                        </View>
                    </RowContext.Provider>
                )}
                <RowContext.Provider value={"location"}>
                    <View style={computedStyle.Row}>
                        <Icon style={computedStyle.BulletinIcon} name={IconName.Location}/>
                        {location && <Label style={computedStyle.Location}>{location}</Label>}
                    </View>
                </RowContext.Provider>
                <RowContext.Provider value={"description"}>
                    <View style={computedStyle.Row}>
                        <Icon style={computedStyle.BulletinIcon} name={IconName.Pen}/>
                        {description && <Label style={computedStyle.Description}>{description}</Label>}
                    </View>
                </RowContext.Provider>
            </View>
        </EventContext.Provider>
    );
}
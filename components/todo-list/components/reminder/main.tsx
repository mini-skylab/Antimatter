import {Button} from "@miniskylab/antimatter-button";
import {DropdownMenu, DropdownMenuProps, MenuItemStatus} from "@miniskylab/antimatter-dropdown-menu";
import {
    type AllPropertiesMustPresent,
    DateFormat,
    EMPTY_STRING,
    GregorianCalendar,
    isNotNullAndUndefined,
    isNullOrUndefined,
    TimeUnit,
    Ts,
    useComponentContext,
    useComputedStyle
} from "@miniskylab/antimatter-framework";
import {Icon} from "@miniskylab/antimatter-icon";
import {InputField} from "@miniskylab/antimatter-input-field";
import {ProgressStripes} from "@miniskylab/antimatter-motion-graphics";
import {NumericInputField} from "@miniskylab/antimatter-numeric-input-field";
import {Pressable} from "@miniskylab/antimatter-pressable";
import {Text} from "@miniskylab/antimatter-text";
import {Status as ToggleStatus, Toggle} from "@miniskylab/antimatter-toggle";
import {DefaultIconSet} from "@miniskylab/antimatter-typography";
import {View} from "@miniskylab/antimatter-view";
import React, {forwardRef, JSX, MutableRefObject, useImperativeHandle, useMemo, useRef, useState} from "react";
import {Mode, Status, TagMetadata, TagStatus} from "./enums";
import {type Props, type Ref, ReminderContext, type State} from "./models";
import * as Service from "./services";

export const Component = forwardRef(function Component(
    {
        style,
        id,
        mode = Mode.ReadOnly,
        name = EMPTY_STRING,
        recurrencePattern = EMPTY_STRING,
        recurrencePatternPlaceholder = EMPTY_STRING,
        notificationInterval,
        notificationIntervalPlaceholder = EMPTY_STRING,
        tags = {},
        maxSelectedTagCount = 2,
        showProgressStripes,
        toBeDeleted,
        status = Status.Draft,
        dueDate,
        computedDueDate,
        modifiedDate,
        createdDate,
        onPress,
        onChange
    }: Props,
    ref: MutableRefObject<Ref>
): JSX.Element | null
{
    const props: AllPropertiesMustPresent<Props> = {
        style, id, name, recurrencePattern, recurrencePatternPlaceholder, notificationInterval, notificationIntervalPlaceholder, tags,
        maxSelectedTagCount, showProgressStripes, toBeDeleted, status, dueDate, computedDueDate, modifiedDate, createdDate, mode, onPress,
        onChange
    };

    const [state, setState] = useState<State>({
        toBeDone: false
    });

    const rootContainerRef = useRef<Pressable<Ref>>(null);

    const today = new Date();
    const formattedDueDate = useMemo(() => getFormattedDueDate(), [dueDate, computedDueDate]);
    const dueDuration = Service.getDueDuration(today, dueDate ?? computedDueDate);
    const formattedDueDuration = useMemo(() => getFormattedDueDuration(), [dueDuration]);
    const isSuspended = useMemo(() => Service.isSuspended(status), [status]);
    const isCompleted = useMemo(() => Service.isCompleted(computedDueDate, dueDate, status), [computedDueDate, dueDate, status]);
    const isDue = useMemo(() => !isCompleted && dueDuration === 0, [isCompleted, dueDuration]);
    const isOverdue = useMemo(() => !isCompleted && isNotNullAndUndefined(dueDuration) && dueDuration < 0, [isCompleted, dueDuration]);

    const context = useComponentContext<ReminderContext>({props, state, extra: {isDue, isOverdue, isCompleted}});

    Ts.Error.throwIfNullOrUndefined(style);
    const {computedStyle} = useComputedStyle(style, props);

    useImperativeHandle(ref, () => ({
        flashHighlight: rootContainerRef.current?.flashHighlight,
        editModeExpandHeight: rootContainerRef.current?.editModeExpandHeight,
        notificationModeExpandHeight: rootContainerRef.current?.notificationModeExpandHeight,
        contractHeight: rootContainerRef.current?.contractHeight,
        collapseHeight: rootContainerRef.current?.collapseHeight
    }), []);

    if (mode !== Mode.Draft && mode !== Mode.Edit && state.toBeDone)
    {
        setState({toBeDone: false});
        return null;
    }

    return (
        <ReminderContext.Provider value={context}>
            <Pressable ref={rootContainerRef} style={computedStyle.Root} onPress={onPress} disabled={toBeDeleted}>
                {showProgressStripes && (<ProgressStripes style={computedStyle.ProgressStripes} msAnimationDuration={500}/>)}
                <Icon style={computedStyle.Icon} name={getIcon()} pointerEvents={"none"}/>
                <View style={computedStyle.NameTagAndDeadlineContainer}>
                    {renderName()}
                    {formattedDueDate && (<>
                        <Icon style={computedStyle.DueDateIcon} name={DefaultIconSet.Calendar}/>
                        <Text style={computedStyle.DueDate}>{formattedDueDate}</Text>
                    </>)}
                    {formattedDueDuration && (<>
                        <Icon style={computedStyle.DueDurationIcon} name={DefaultIconSet.History}/>
                        <Text style={computedStyle.DueDuration}>{formattedDueDuration}</Text>
                    </>)}
                    {renderTags()}
                </View>
                {(mode === Mode.Draft || mode === Mode.Edit) && renderExpansionArea()}
            </Pressable>
        </ReminderContext.Provider>
    );

    function getIcon(): DefaultIconSet
    {
        return isCompleted
            ? DefaultIconSet.CheckMarkInsideCircle
            : dueDuration === 0
                ? DefaultIconSet.Alarm
                : isNotNullAndUndefined(dueDuration) && dueDuration < 0
                    ? DefaultIconSet.Fire
                    : isNotNullAndUndefined(dueDuration) && dueDuration > 0
                        ? DefaultIconSet.Notification
                        : DefaultIconSet.NoSound;
    }

    function getDropdownMenuItems(): NonNullable<DropdownMenuProps["menuItems"]>
    {
        const dropdownMenuItems: DropdownMenuProps["menuItems"] = {};
        const selectedTagCount = Object.values(tags).filter(x => x.status === TagStatus.Selected).length;
        const mutuallyExclusiveTagSelected = Object.values(tags)
            .some(x => x.metadata?.has(TagMetadata.MutuallyExclusive) && x.status === TagStatus.Selected);

        Object.keys(tags).forEach(tagId =>
        {
            const tag = tags[tagId];
            const maxSelectedTagCountReached = selectedTagCount >= maxSelectedTagCount;
            const mutuallyExclusiveTagDisabled = tag.metadata?.has(TagMetadata.MutuallyExclusive) && selectedTagCount > 0;
            const mappedMenuItemStatus = tag.status === undefined && (maxSelectedTagCountReached || mutuallyExclusiveTagSelected)
                ? MenuItemStatus.Hidden
                : tag.status === undefined && mutuallyExclusiveTagDisabled
                    ? MenuItemStatus.Disabled
                    : Ts.Enum.getValue(MenuItemStatus, Ts.Enum.getName(TagStatus, tag.status));

            const context: string[] = [];
            if (tag.metadata?.has(TagMetadata.HighlightTarget))
            {
                context.push(TagMetadata.HighlightTarget);
            }

            dropdownMenuItems[tagId] = {
                displayText: tag.name,
                status: mappedMenuItemStatus,
                context
            };
        });

        return dropdownMenuItems;
    }

    function getFormattedDueDate(): string
    {
        const copiedDueDate = mode === Mode.Draft || mode === Mode.Edit
            ? computedDueDate ?? dueDate
            : dueDate ?? computedDueDate;

        return copiedDueDate
            ? GregorianCalendar.toString(copiedDueDate, DateFormat.Short, TimeUnit.Day).replaceAll("/", ".")
            : "No due date";
    }

    function getFormattedDueDuration(): string | undefined
    {
        return isNullOrUndefined(dueDuration)
            ? undefined
            : dueDuration === 0
                ? "Today"
                : dueDuration > 0
                    ? dueDuration === 1 ? "Tomorrow" : `In ${dueDuration} days`
                    : Math.abs(dueDuration) === 1 ? "Yesterday" : `${Math.abs(dueDuration)} days ago`;
    }

    function renderName(): JSX.Element
    {
        return (
            mode === Mode.Draft || mode === Mode.Edit
                ? <InputField
                    style={computedStyle.NameInputField}
                    placeholder={"Reminder Name"}
                    value={name}
                    autoFocus={true}
                    onChangeText={onNameChange}
                />
                : <Text style={computedStyle.NameText} numberOfLines={1} pointerEvents={"none"}>{name}</Text>
        );
    }

    function renderTags(): JSX.Element
    {
        const dropdownMenuItems = getDropdownMenuItems();
        if (mode === Mode.Draft || mode === Mode.Edit)
        {
            return (
                <DropdownMenu
                    style={computedStyle.TagSelector}
                    isOpen={true}
                    menuItems={dropdownMenuItems}
                    enableMenuHorizontalScrolling={true}
                    onMenuItemPress={onTagChange}
                />
            );
        }
        else
        {
            const dropdownMenuItemValues = Object.keys(dropdownMenuItems);
            return (
                <View style={computedStyle.TagContainer} pointerEvents={"none"}>
                    {
                        [...Object.keys(tags).filter(x => tags[x].status === TagStatus.Selected)]
                            .sort((a, b) => dropdownMenuItemValues.indexOf(a) - dropdownMenuItemValues.indexOf(b))
                            .map(tagId => (
                                <Text key={tagId} style={computedStyle.Tag} pointerEvents={"none"}>{tags[tagId].name ?? tagId}</Text>
                            ))
                    }
                </View>
            );
        }
    }

    function renderExpansionArea(): JSX.Element
    {
        return (
            <View style={computedStyle.ExpansionArea}>
                <InputField
                    style={computedStyle.RecurrencePatternInputField}
                    placeholder={recurrencePatternPlaceholder}
                    value={recurrencePattern}
                    onChangeText={onRecurrencePatternChange}
                />
                <NumericInputField
                    style={computedStyle.NotificationIntervalNumericInputField}
                    minValue={1}
                    maxValue={8800}
                    maximumFractionDigitCount={0}
                    selectTextOnFocus={true}
                    placeholder={notificationIntervalPlaceholder}
                    defaultValue={notificationInterval}
                    keyboardType={"number-pad"}
                    onChange={onNotificationIntervalChange}
                />
                <Toggle
                    style={computedStyle.SuspenseToggle}
                    icon={DefaultIconSet.Pause}
                    status={isSuspended ? ToggleStatus.Checked : ToggleStatus.Unchecked}
                    onChange={onSuspenseToggleStatusChange}
                />
                <Toggle
                    style={computedStyle.SnoozeToggle}
                    icon={DefaultIconSet.CheckMarkInsideCircle}
                    status={state.toBeDone ? ToggleStatus.Checked : ToggleStatus.Unchecked}
                    disabled={!isDue && !isOverdue}
                    onChange={onSnoozeToggleStatusChange}
                />
                <Button style={computedStyle.DismissButton} label={state.toBeDone ? "Done" : "Snooze"}/>
            </View>
        );
    }

    function onNameChange(newText: string): void
    {
        onChange?.({
            name: newText,
            recurrencePattern,
            notificationInterval,
            tags,
            status,
            modifiedDate,
            createdDate
        });
    }

    function onTagChange(pressedTagId: string): void
    {
        const pressedTag = tags[pressedTagId];
        const pressedTagNewStatus = pressedTag.status === TagStatus.Selected
            ? undefined
            : pressedTag.status === undefined
                ? TagStatus.Selected
                : pressedTag.status;

        onChange?.({
            name,
            recurrencePattern,
            notificationInterval,
            tags: {
                ...tags,
                [pressedTagId]: {
                    ...pressedTag,
                    status: pressedTagNewStatus,
                    order: pressedTagNewStatus === TagStatus.Selected
                        ? Object.values(tags).filter(x => x.status === TagStatus.Selected).length + 1
                        : undefined
                }
            },
            status,
            modifiedDate,
            createdDate
        });
    }

    function onRecurrencePatternChange(newText: string): void
    {
        onChange?.({
            name,
            recurrencePattern: newText,
            notificationInterval,
            tags,
            status,
            modifiedDate,
            createdDate
        });
    }

    function onNotificationIntervalChange(newValue: number | undefined): void
    {
        onChange?.({
            name,
            recurrencePattern,
            notificationInterval: newValue,
            tags,
            status,
            modifiedDate,
            createdDate
        });
    }

    function onSuspenseToggleStatusChange(newStatus: ToggleStatus): void
    {
        onChange?.({
            name,
            recurrencePattern,
            notificationInterval,
            tags,
            status: newStatus === ToggleStatus.Checked ? Status.Suspended : Status.Scheduled,
            modifiedDate,
            createdDate
        });
    }

    function onSnoozeToggleStatusChange(newStatus: ToggleStatus): void
    {
        setState({toBeDone: newStatus === ToggleStatus.Checked});
    }
});

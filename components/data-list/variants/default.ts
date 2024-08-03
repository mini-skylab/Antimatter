import {ButtonContextHook, ButtonStyle, ButtonVariant} from "@miniskylab/antimatter-button";
import {Color} from "@miniskylab/antimatter-color-scheme";
import {Layer, useEnvironment} from "@miniskylab/antimatter-framework";
import {IconStyle, IconVariant} from "@miniskylab/antimatter-icon";
import {PressableContextHook, PressableStyle} from "@miniskylab/antimatter-pressable";
import {ScrollViewStyle, ScrollViewVariant} from "@miniskylab/antimatter-scroll-view";
import {TextStyle, TextVariant} from "@miniskylab/antimatter-text";
import {ViewStyle, ViewVariant} from "@miniskylab/antimatter-view";
import {useEffect, useState} from "react";
import ReactNative, {Keyboard} from "react-native";
import {DisplayPanelTheme, Mode} from "../enums";
import {DataListAnimationHook, DataListContextHook} from "../hooks";
import {type DataListStyle} from "../models";

const DataList__Root: ViewStyle = function (viewProps)
{
    return {
        ...ViewVariant.Default(viewProps),
        flex: 1,
        alignSelf: "stretch",
        justifyContent: "flex-start",
        minWidth: 300,
        maxWidth: undefined,
        height: "auto",
        marginTop: 5
    };
};

const DataList__DisplayPanel: ViewStyle = function (viewProps)
{
    return {
        ...ViewVariant.Default(viewProps),
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        height: 58.4,
        backgroundColor: Color.Background,
        animations: [
            () => DataListAnimationHook.useDisplayPanelFadeOutAnimation()
        ]
    };
};

const DataList__DisplayIcon: IconStyle = function (iconProps)
{
    const dataListContext = DataListContextHook.useDataListContext();

    const isAnimationPlaying = dataListContext.props.displayPanel?.isIconAnimationPlaying;
    const theme = dataListContext.props.displayPanel?.theme;

    return {
        ...IconVariant.Default(iconProps),
        height: 30,
        marginTop: 2,
        fontSize: 22,
        animations: [
            () => DataListAnimationHook.useDisplayIconAnimation(isAnimationPlaying)
        ],
        color: theme === DisplayPanelTheme.Negative
            ? Color.Negative
            : theme === DisplayPanelTheme.Cautious
                ? Color.Warning
                : theme === DisplayPanelTheme.Positive
                    ? Color.Positive
                    : theme === DisplayPanelTheme.Highlighted
                        ? Color.Primary
                        : Color.Neutral
    };
};

const DataList__DisplayMessage: TextStyle = function (textProps)
{
    const dataListContext = DataListContextHook.useDataListContext();

    const theme = dataListContext.props.displayPanel?.theme;

    return {
        ...TextVariant.Default(textProps),
        flex: 1,
        justifyContent: "flex-start",
        fontSize: 18,
        fontWeight: "bold",
        color: theme === DisplayPanelTheme.Negative
            ? Color.Negative
            : theme === DisplayPanelTheme.Cautious
                ? Color.Warning
                : theme === DisplayPanelTheme.Positive
                    ? Color.Positive
                    : theme === DisplayPanelTheme.Highlighted
                        ? Color.Primary
                        : Color.Neutral
    };
};

const DataList__ControlPanel: ViewStyle = function (viewProps)
{
    return {
        ...ViewVariant.Default(viewProps),
        flexDirection: "row",
        alignSelf: "stretch",
        height: 58.4,
        justifyContent: "space-around",
        backgroundColor: Color.Background
    };
};

const DataList__Button1__Root: PressableStyle = function (pressableProps, pressableState)
{
    const buttonContext = ButtonContextHook.useButtonContext();

    const inheritedStyle = ButtonVariant.OutlinedRectangular(buttonContext.props).Root(pressableProps, pressableState);

    return {
        ...inheritedStyle,
        flexDirection: "column",
        minWidth: 100,
        height: "100%",
        paddingLeft: 0,
        paddingRight: 0,
        paddingTop: 5,
        paddingBottom: 4,
        borderWidth: 0,
        backgroundColor: Color.Transparent
    };
};

const DataList__Button1__Icon: IconStyle = function (iconProps)
{
    const buttonContext = ButtonContextHook.useButtonContext();
    const dataListContext = DataListContextHook.useDataListContext();
    const pressableContext = PressableContextHook.usePressableContext();

    const isDraftMode = dataListContext.props.mode === Mode.Draft;
    const isEditMode = dataListContext.props.mode === Mode.Edit;
    const isDeleteMode = dataListContext.props.mode === Mode.Delete;

    const inheritedStyle = ButtonVariant.OutlinedRectangular(buttonContext.props).Icon(iconProps);

    return {
        ...inheritedStyle,
        flexGrow: 1,
        fontSize: 28,
        color: pressableContext.state.pressed
            ? Color.Gray
            : pressableContext.state.hovered
                ? Color.White
                : isDraftMode || isEditMode
                    ? Color.Primary
                    : isDeleteMode
                        ? Color.Tomato
                        : Color.Neutral
    };
};

const DataList__Button1__Label: TextStyle = function (textProps)
{
    const buttonContext = ButtonContextHook.useButtonContext();
    const dataListContext = DataListContextHook.useDataListContext();
    const pressableContext = PressableContextHook.usePressableContext();

    const isDraftMode = dataListContext.props.mode === Mode.Draft;
    const isEditMode = dataListContext.props.mode === Mode.Edit;
    const isDeleteMode = dataListContext.props.mode === Mode.Delete;

    const inheritedStyle = ButtonVariant.OutlinedRectangular(buttonContext.props).Label(textProps);

    return {
        ...inheritedStyle,
        lineHeight: 15,
        marginTop: 3,
        paddingVertical: 0,
        paddingHorizontal: 0,
        fontSize: 12,
        fontWeight: "bold",
        color: pressableContext.state.pressed
            ? Color.Gray
            : pressableContext.state.hovered
                ? Color.White
                : isDraftMode || isEditMode
                    ? Color.Primary
                    : isDeleteMode
                        ? Color.Tomato
                        : Color.Neutral
    };
};

const DataList__Button1: ButtonStyle = function (buttonProps)
{
    return {
        ...ButtonVariant.OutlinedRectangular(buttonProps),
        Root: DataList__Button1__Root,
        Icon: DataList__Button1__Icon,
        Label: DataList__Button1__Label
    };
};

const DataList__Button2__Root: PressableStyle = function (pressableProps, pressableState)
{
    const dataListContext = DataListContextHook.useDataListContext();

    const isDraftMode = dataListContext.props.mode === Mode.Draft;
    const isReadOnlyMode = dataListContext.props.mode === Mode.ReadOnly;

    return {
        ...DataList__Button1__Root(pressableProps, pressableState),
        opacity: 1,
        paddingLeft: 15,
        paddingRight: 15,
        backgroundColor: isDraftMode
            ? Color.Primary
            : isReadOnlyMode
                ? Color.Neutral
                : Color.Transparent
    };
};

const DataList__Button2__Icon: IconStyle = function (iconProps)
{
    const dataListContext = DataListContextHook.useDataListContext();
    const pressableContext = PressableContextHook.usePressableContext();

    const isDraftMode = dataListContext.props.mode === Mode.Draft;
    const isEditMode = dataListContext.props.mode === Mode.Edit;
    const isDeleteMode = dataListContext.props.mode === Mode.Delete;
    const isReadOnlyMode = dataListContext.props.mode === Mode.ReadOnly;

    return {
        ...DataList__Button1__Icon(iconProps),
        color: pressableContext.state.pressed
            ? Color.Gray
            : pressableContext.state.hovered
                ? Color.White
                : isDraftMode || isReadOnlyMode
                    ? Color.Background
                    : isEditMode
                        ? Color.Primary
                        : isDeleteMode
                            ? Color.Tomato
                            : Color.Neutral
    };
};

const DataList__Button2__Label: TextStyle = function (textProps)
{
    const dataListContext = DataListContextHook.useDataListContext();
    const pressableContext = PressableContextHook.usePressableContext();

    const isDraftMode = dataListContext.props.mode === Mode.Draft;
    const isEditMode = dataListContext.props.mode === Mode.Edit;
    const isDeleteMode = dataListContext.props.mode === Mode.Delete;
    const isReadOnlyMode = dataListContext.props.mode === Mode.ReadOnly;

    return {
        ...DataList__Button1__Label(textProps),
        color: pressableContext.state.pressed
            ? Color.Gray
            : pressableContext.state.hovered
                ? Color.White
                : isDraftMode || isReadOnlyMode
                    ? Color.Background
                    : isEditMode
                        ? Color.Primary
                        : isDeleteMode
                            ? Color.Tomato
                            : Color.Neutral
    };
};

const DataList__Button2: ButtonStyle = function (buttonProps)
{
    return {
        ...DataList__Button1(buttonProps),
        Root: DataList__Button2__Root,
        Icon: DataList__Button2__Icon,
        Label: DataList__Button2__Label
    };
};

const DataList__Button3__Icon: IconStyle = function (iconProps)
{
    const pressableContext = PressableContextHook.usePressableContext();

    return {
        ...DataList__Button1__Icon(iconProps),
        color: pressableContext.state.pressed
            ? Color.Gray
            : pressableContext.state.hovered
                ? Color.White
                : Color.Neutral
    };
};

const DataList__Button3__Label: TextStyle = function (textProps)
{
    const pressableContext = PressableContextHook.usePressableContext();

    return {
        ...DataList__Button1__Label(textProps),
        color: pressableContext.state.pressed
            ? Color.Gray
            : pressableContext.state.hovered
                ? Color.White
                : Color.Neutral
    };
};

const DataList__Button3: ButtonStyle = function (buttonProps)
{
    return {
        ...DataList__Button1(buttonProps),
        Icon: DataList__Button3__Icon,
        Label: DataList__Button3__Label
    };
};

const DataList__ItemContainer: ScrollViewStyle = function (scrollViewProps)
{
    let mobileAppStyle: ReactNative.ViewStyle = {};
    if (useEnvironment("MobileApp"))
    {
        const [keyboardIsVisible, setKeyboardIsVisible] = useState(false);
        useEffect(() =>
        {
            const keyboardShowListener = Keyboard.addListener("keyboardWillShow", () => { setKeyboardIsVisible(true); });
            const keyboardHideListener = Keyboard.addListener("keyboardWillHide", () => { setKeyboardIsVisible(false); });
            return () =>
            {
                keyboardShowListener.remove();
                keyboardHideListener.remove();
            };
        });

        mobileAppStyle = {paddingBottom: keyboardIsVisible ? 79 : 45};
    }

    return {
        ...ScrollViewVariant.Default(scrollViewProps),
        ...mobileAppStyle,
        alignSelf: "stretch",
        paddingTop: 2
    };
};

const DataList__TopHr: ViewStyle = function (viewProps)
{
    return {
        ...ViewVariant.Default(viewProps),
        position: "absolute",
        top: 58.4,
        width: "100%",
        height: 2,
        zIndex: Layer.Lower,
        backgroundColor: Color.Neutral
    };
};

const DataList__BottomHr: ViewStyle = function (viewProps)
{
    const isRunningOnMobileApp = useEnvironment("MobileApp");

    return {
        ...DataList__TopHr(viewProps),
        top: undefined,
        bottom: -0.4,
        ...isRunningOnMobileApp && {backgroundColor: Color.Transparent}
    };
};

export const Default: DataListStyle = function ()
{
    return {
        Root: DataList__Root,
        DisplayPanel: DataList__DisplayPanel,
        DisplayIcon: DataList__DisplayIcon,
        DisplayMessage: DataList__DisplayMessage,
        ControlPanel: DataList__ControlPanel,
        Button1: DataList__Button1,
        Button2: DataList__Button2,
        Button3: DataList__Button3,
        ItemContainer: DataList__ItemContainer,
        TopHr: DataList__TopHr,
        BottomHr: DataList__BottomHr
    };
};

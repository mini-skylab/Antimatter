import {
    GestureResponderEvent,
    LayoutChangeEvent,
    NativeSyntheticEvent,
    TextInputFocusEventData,
    TextInputKeyPressEventData,
    TextInputSelectionChangeEventData
} from "react-native";

export type Modify<T, R> = Omit<T, keyof R> & R;

export type PointerEvents = "none" | "box-none" | "box-only" | "auto";
export type LayoutChangeEventHandler = (event: LayoutChangeEvent) => void;
export type TextInputFocusEventHandler = (event: NativeSyntheticEvent<TextInputFocusEventData>) => void;
export type TextInputKeyPressEventHandler = (event: NativeSyntheticEvent<TextInputKeyPressEventData>) => void;
export type TextInputSelectionChangeEventHandler = (event: NativeSyntheticEvent<TextInputSelectionChangeEventData>) => void;
export type GestureResponderEventHandler = (event: GestureResponderEvent) => void;
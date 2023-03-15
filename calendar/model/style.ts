import {OmitStyle} from "@miniskylab/antimatter-framework";
import {ViewStyle} from "react-native";
import {Control, DateView, Header, MonthView, YearView} from "../components";
import {CalendarProps} from "./props";
import {CalendarState} from "./state";

export type CalendarStyle = (
    calendarProps: OmitStyle<CalendarProps>,
    calendarState: CalendarState
) => {
    Root?: ViewStyle;
    Header?: Header.Style;
    DateView?: DateView.Style;
    MonthView?: MonthView.Style;
    YearView?: YearView.Style;
    Control?: Control.Style;
};

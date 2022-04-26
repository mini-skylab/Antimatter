import {
    ComponentVariant,
    ControlVariant,
    DateViewVariant,
    HeaderVariant,
    MonthViewVariant,
    Props as CalendarProps,
    Variant as CalendarVariant,
    YearViewVariant
} from "@miniskylab/antimatter-calendar";
import {SerializedProps} from "@miniskylab/antimatter-deserializer-model";
import {Modify} from "@miniskylab/antimatter-typescript";

export type Props = SerializedProps<CalendarProps, {
    readonly variant?: keyof typeof CalendarVariant;
    readonly componentVariant?: Modify<ComponentVariant, {
        readonly header?: keyof typeof HeaderVariant;
        readonly dateView?: keyof typeof DateViewVariant;
        readonly monthView?: keyof typeof MonthViewVariant;
        readonly yearView?: keyof typeof YearViewVariant;
        readonly control?: keyof typeof ControlVariant;
    }>;
    readonly selectedDate?: string;
}>;
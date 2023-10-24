import {EMPTY_STRING, MAX, MIN, Sb, withValidation} from "@miniskylab/antimatter-framework";
import {useArgs} from "@storybook/preview-api";
import type {Meta, StoryObj} from "@storybook/react";
import React, {useRef} from "react";
import {NumericInputField} from "../main";
import {NumericInputFieldProps} from "../models";
import * as Variant from "./variants";

const NumericInputFieldWithValidation = withValidation(NumericInputField, NumericInputFieldProps);
export default {
    component: NumericInputField,
    title: "Components/Numeric Input Field",
    render: args =>
    {
        const [, setArgs] = useArgs<NumericInputFieldProps>();
        const ref = useRef<{
            subKey?: number;
            defaultValue?: number;
            updateViaOnChange?: boolean;
        }>({});

        let nextAutoFocus = args.autoFocus;
        let nextSubKey = ref.current.subKey;
        if (args.defaultValue !== ref.current.defaultValue && !ref.current.updateViaOnChange)
        {
            nextAutoFocus = false;
            nextSubKey = Date.now();
        }

        ref.current.subKey = nextSubKey;
        ref.current.updateViaOnChange = false;
        ref.current.defaultValue = args.defaultValue;

        return (
            <NumericInputFieldWithValidation
                {...args}
                key={Sb.useNewKeyIfAnyOfTheseChanges([args.style, args.autoFocus, nextSubKey])}
                defaultValue={args.defaultValue || args.defaultValue === 0 ? args.defaultValue : undefined}
                autoFocus={nextAutoFocus}
                onChange={value =>
                {
                    ref.current.updateViaOnChange = true;
                    setArgs({defaultValue: value ?? EMPTY_STRING as unknown as number});
                }}
            />
        );
    }
} satisfies Meta<typeof NumericInputField>;
type Story = StoryObj<typeof NumericInputField>;

export const Playground: Story = {
    argTypes: {
        style: Sb.styleSelector(Variant),
        onBlur: Sb.locked,
        onFocus: Sb.locked,
        onKeyPress: Sb.locked,
        onChange: Sb.locked
    },
    args: {
        style: Sb.getVariantName(Variant, Variant.FixedWidth),
        placeholder: "Placeholder",
        autoFocus: false,
        treatEmptyInputAsZero: false,
        showPlusSymbolForPositiveNumber: false,
        minValue: MIN,
        maxValue: MAX,
        maximumFractionDigits: 20,
        maximumDigitCount: MAX
    }
};

export const Prefilled: Story = {
    args: {
        style: Variant.FixedWidth,
        defaultValue: 123456.789
    }
};

export const Placeholder: Story = {
    args: {
        style: Variant.FixedWidth,
        placeholder: "Placeholder"
    }
};

export const ExplicitPlusSymbol: Story = {
    args: {
        style: Variant.FixedWidth,
        showPlusSymbolForPositiveNumber: true,
        defaultValue: 123456789
    }
};

export const Range: Story = {
    args: {
        style: Variant.FixedWidth,
        placeholder: "From -100 to 100",
        minValue: -100,
        maxValue: 100
    }
};

export const DigitCount: Story = {
    args: {
        style: Variant.FixedWidth,
        placeholder: "No more than 5 digits",
        maximumDigitCount: 5
    }
};

export const FractionDigitCount: Story = {
    args: {
        style: Variant.FixedWidth,
        placeholder: "Ex: 0.12345",
        maximumFractionDigits: 5
    }
};
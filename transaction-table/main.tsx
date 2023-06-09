import {Button} from "@miniskylab/antimatter-button";
import {Calendar} from "@miniskylab/antimatter-calendar";
import {DatePicker} from "@miniskylab/antimatter-date-picker";
import {DateFormat, Enum, ScreenSize, useScreenSize} from "@miniskylab/antimatter-framework";
import {IconName} from "@miniskylab/antimatter-icon";
import {ScrollView} from "@miniskylab/antimatter-scroll-view";
import {View} from "@miniskylab/antimatter-view";
import React, {JSX, useMemo, useState} from "react";
import {Summary, TransactionRecord} from "./component";
import {ControlButtonTypeContext, HrPositionContext, TransactionTableContext, TransactionTableProps} from "./model";
import {ControlButton, ControlPanel} from "./type";
import * as Variant from "./variant";

/**
 * <p style="color: #9B9B9B; font-style: italic">(no description available)</p>
 */
export function TransactionTable({
    style = Variant.Default,
    transactions = {},
    selectedDate = new Date(),
    selectedTransaction,
    mode = TransactionRecord.Mode.ReadOnly,
    onChangeTransaction,
    onSelectDate,
    onSelectTransaction,
    onAddNewTransaction,
    onSaveTransaction,
    onDeleteTransaction,
    onSwitchMode,
    onCancel
}: TransactionTableProps): JSX.Element
{
    const props: Required<TransactionTableProps> = {
        style, transactions, selectedDate, selectedTransaction, mode, onChangeTransaction, onSelectDate, onSelectTransaction, onSwitchMode,
        onAddNewTransaction, onSaveTransaction, onDeleteTransaction, onCancel
    };

    const context = useMemo<TransactionTableContext>(
        () => ({props}),
        [...Object.values(props)]
    );

    const {style: _, ...propsWithoutStyle} = props;
    const computedStyle = style(propsWithoutStyle);

    const [datePickerIsOpened, setDatePickerIsOpened] = useState(false);
    const isLargeScreen = useScreenSize(ScreenSize.Large);

    return (
        <TransactionTableContext.Provider value={context}>
            <View style={computedStyle.Root}>
                {renderDateSelector()}
                <View style={computedStyle.TransactionDetails}>
                    {renderControlPanel()}
                    <HrPositionContext.Provider value={"top"}>
                        <View style={computedStyle.Hr}/>
                    </HrPositionContext.Provider>
                    <ScrollView
                        style={computedStyle.TransactionContainer}
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                    >
                        {renderTransactions()}
                        {mode !== TransactionRecord.Mode.Draft && renderAddNewButton()}
                    </ScrollView>
                    <HrPositionContext.Provider value={"bottom"}>
                        <View style={computedStyle.Hr}/>
                    </HrPositionContext.Provider>
                    <Summary.Component
                        style={computedStyle.Summary}
                        expenseLabel={"TOTAL EXPENSES:"}
                        expenseAmount={getTotalExpense()}
                        incomeLabel={"TOTAL INCOME:"}
                        incomeAmount={getTotalIncome()}
                    />
                </View>
            </View>
        </TransactionTableContext.Provider>
    );

    function getControlPanel(): ControlPanel
    {
        switch (mode)
        {
            case TransactionRecord.Mode.Draft:
                return {
                    modeButton: {disabled: true, icon: IconName.Quill, text: "Draft-Mode"},
                    actionButton: {icon: IconName.FloppyDisk, text: "Save", onPress: onSaveTransaction},
                    cancelButton: {icon: IconName.XMarkInsideCircle, text: "Cancel", onPress: onCancel}
                };

            case TransactionRecord.Mode.Edit:
                return {
                    modeButton: {icon: IconName.Quill, text: "Edit-Mode", onPress: switchMode},
                    actionButton: {icon: IconName.FloppyDisk, text: "Save", onPress: onSaveTransaction},
                    cancelButton: {icon: IconName.XMarkInsideCircle, text: "Cancel", onPress: onCancel}
                };

            case TransactionRecord.Mode.Delete:
                return {
                    modeButton: {icon: IconName.Fire, text: "Delete-Mode", onPress: switchMode},
                    actionButton: {icon: IconName.TrashCan, text: "Delete", onPress: onDeleteTransaction},
                    cancelButton: {icon: IconName.XMarkInsideCircle, text: "Cancel", onPress: onCancel}
                };

            default:
            case TransactionRecord.Mode.ReadOnly:
                return {
                    modeButton: {disabled: true, icon: IconName.Eye, text: "Read-Only"},
                    actionButton: {disabled: true, icon: IconName.FloppyDisk, text: "Save"},
                    cancelButton: {disabled: true, icon: IconName.XMarkInsideCircle, text: "Cancel"}
                };
        }
    }

    function getAddNewButton(): ControlButton
    {
        switch (mode)
        {
            case TransactionRecord.Mode.ReadOnly:
                return {icon: IconName.PlusCircle, onPress: onAddNewTransaction};

            default:
                return {disabled: true, icon: IconName.NotAllowed};
        }
    }

    function getTransactionMode(transactionId: string): TransactionRecord.Mode
    {
        return transactionId === selectedTransaction?.id
            ? mode
            : TransactionRecord.Mode.ReadOnly;
    }

    function isIncome(transaction: TransactionRecord.TransactionData): boolean
    {
        return Object.values(transaction.labels)
            .some(
                label => label.status === TransactionRecord.TransactionLabelStatus.Selected
                         &&
                         label.type === TransactionRecord.TransactionLabelType.Income
            );
    }

    function getTotalIncome(): number
    {
        let totalIncome = 0;
        Object.values(transactions)
            .filter(transaction => isIncome(transaction))
            .forEach(transaction => { totalIncome += transaction.amount; });

        return totalIncome;
    }

    function getTotalExpense(): number
    {
        let totalExpense = 0;
        Object.values(transactions)
            .filter(transaction => !isIncome(transaction))
            .forEach(transaction => { totalExpense += transaction.amount; });

        return totalExpense;
    }

    function byDate(transactionIdA: string, transactionIdB: string): number
    {
        const transactionA = transactions[transactionIdA];
        const transactionB = transactions[transactionIdB];

        const executedDateComparisonResult = transactionA.executedDate.getTime() - transactionB.executedDate.getTime();
        if (executedDateComparisonResult !== 0)
        {
            return executedDateComparisonResult;
        }

        return transactionA.createdDate.getTime() - transactionB.createdDate.getTime();
    }

    function renderDateSelector(): JSX.Element
    {
        return isLargeScreen
            ? <Calendar
                style={computedStyle.Calendar}
                selectedDate={selectedDate}
                onSelectedDateChange={onSelectDate}
            />
            : <DatePicker
                style={computedStyle.DatePicker}
                selectedDate={selectedDate}
                dateFormat={DateFormat.Full}
                calendarIsOpen={datePickerIsOpened}
                onSelectedDateChange={newlySelectedDate =>
                {
                    setDatePickerIsOpened(false);
                    newlySelectedDate && onSelectDate?.(newlySelectedDate);
                }}
                onAddonPress={() => { setDatePickerIsOpened(!datePickerIsOpened); }}
            />;
    }

    function renderControlPanel(): JSX.Element
    {
        const {actionButton, modeButton, cancelButton} = getControlPanel();
        return (
            <View style={computedStyle.ControlPanel}>
                <ControlButtonTypeContext.Provider value={"action"}>
                    <Button
                        style={computedStyle.ControlButton}
                        icon={actionButton.icon}
                        label={actionButton.text}
                        disabled={actionButton.disabled}
                        onPress={actionButton.onPress}
                    />
                </ControlButtonTypeContext.Provider>
                <ControlButtonTypeContext.Provider value={"mode"}>
                    <Button
                        style={computedStyle.ControlButton}
                        icon={modeButton.icon}
                        label={modeButton.text}
                        disabled={modeButton.disabled}
                        onPress={modeButton.onPress}
                    />
                </ControlButtonTypeContext.Provider>
                <ControlButtonTypeContext.Provider value={"cancel"}>
                    <Button
                        style={computedStyle.ControlButton}
                        icon={cancelButton.icon}
                        label={cancelButton.text}
                        disabled={cancelButton.disabled}
                        onPress={cancelButton.onPress}
                    />
                </ControlButtonTypeContext.Provider>
            </View>
        );
    }

    function renderTransactions(): JSX.Element[]
    {
        const transactionIds = Object.keys(transactions).sort(byDate);
        if (mode === TransactionRecord.Mode.Draft && selectedTransaction)
        {
            transactionIds.push(selectedTransaction.id);
        }

        return transactionIds.map(transactionId =>
        {
            const transactionMode = getTransactionMode(transactionId);
            const transactionData = transactionMode === TransactionRecord.Mode.Edit || transactionMode === TransactionRecord.Mode.Draft
                ? selectedTransaction.data
                : transactions[transactionId];

            return (
                <TransactionRecord.Component
                    {...transactionData}
                    key={transactionId}
                    id={transactionId}
                    style={computedStyle.TransactionRecord}
                    mode={transactionMode}
                    labels={transactionData.labels}
                    onPress={mode === TransactionRecord.Mode.ReadOnly ? () => { onSelectTransaction(transactionId); } : undefined}
                    onChange={newTransactionData => { onChangeTransaction(newTransactionData); }}
                />
            );
        });
    }

    function renderAddNewButton(): JSX.Element
    {
        const addNewButton = getAddNewButton();
        return (
            <Button
                style={computedStyle.AddNewButton}
                icon={addNewButton.icon}
                disabled={addNewButton.disabled}
                onPress={addNewButton.onPress}
            />
        );
    }

    function switchMode(): void
    {
        switch (mode)
        {
            case TransactionRecord.Mode.ReadOnly:
                onSwitchMode(TransactionRecord.Mode.Draft);
                break;

            case TransactionRecord.Mode.Edit:
                onSwitchMode(TransactionRecord.Mode.Delete);
                break;

            case TransactionRecord.Mode.Delete:
                onSwitchMode(TransactionRecord.Mode.Edit);
                break;

            default:
                throw new Error(`No valid mode to switch to from mode "${Enum.getName(TransactionRecord.Mode, mode)}"`);
        }
    }
}
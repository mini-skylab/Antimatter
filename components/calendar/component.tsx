import {ComponentStyles} from "@miniskylab/antimatter-component";
import {Transition} from "@miniskylab/antimatter-transition";
import {Char, Decade, GregorianCalendar} from "@miniskylab/antimatter-typescript";
import React from "react";
import {Control, DateView, Header, MonthView, YearView} from "./components";
import {canNavigateBackward, canNavigateForward} from "./helper";
import {Props, State, TimeFrame, TransitionDirection, View} from "./model";
import * as CalendarVariant from "./variant";

/**
 * <p style="color: #9B9B9B; font-style: italic">(no description available)</p>
 */
export class Component extends React.Component<Props, State>
{
    static defaultProps: Partial<Props> = {
        variant: CalendarVariant.Default
    };

    constructor(props: Props)
    {
        super(props);

        const selectedDate = props.selectedDate ? new Date(props.selectedDate) : new Date();
        selectedDate.setDate(1);
        selectedDate.setHours(0, 0, 0, 0);

        this.state = {
            view: View.Date,
            transitionDirection: TransitionDirection.None,
            timeFrame: {
                monthAndYear: selectedDate,
                decade: GregorianCalendar.getDecade(selectedDate.getFullYear())
            }
        };
    }

    render(): JSX.Element
    {
        return (
            <div className={this.props.variant["calendar"]} tabIndex={-1} onBlur={this.props.onBlur}>
                {this.renderHeader()}
                {this.renderView()}
                {this.renderControls()}
            </div>
        );
    }

    private getHeadline(): string
    {
        switch (this.state.view)
        {
            case View.Date:
            {
                const date = this.state.timeFrame.monthAndYear;

                return `${GregorianCalendar.getFullMonthName(date.getMonth())}${Char.space}${Char.space}${date.getFullYear()}`;
            }

            case View.Month:
            {
                return `${this.state.timeFrame.monthAndYear.getFullYear()}`;
            }

            case View.Year:
            {
                const decadeFirstYear = this.state.timeFrame.decade;
                const decadeLastYear = decadeFirstYear + GregorianCalendar.YEAR_COUNT_IN_DECADE - 1;

                return `${decadeFirstYear} - ${decadeLastYear}`;
            }
        }
    }

    private getHeaderVariant(): ComponentStyles
    {
        if (this.props.componentVariant.header)
        {
            return this.props.componentVariant.header;
        }

        switch (this.props.variant)
        {
            case CalendarVariant.Default:
                return Header.Variant.Default;

            case CalendarVariant.Mini:
                return Header.Variant.Mini;

            case CalendarVariant.Sesquialteral:
                return Header.Variant.Sesquialteral;
        }
    }

    private renderHeader(): JSX.Element
    {
        return (
            <Header.Component
                variant={this.getHeaderVariant()}
                headline={this.getHeadline()}
                onPrevClick={
                    canNavigateBackward(this.state.view, this.state.timeFrame)
                        ? () => { this.navigate(TransitionDirection.Backward); }
                        : undefined
                }
                onHeadlineClick={
                    this.state.view < View.Year
                        ? () => { this.zoomOut(); }
                        : undefined
                }
                onNextClick={
                    canNavigateForward(this.state.view, this.state.timeFrame)
                        ? () => { this.navigate(TransitionDirection.Forward); }
                        : undefined
                }
            />
        );
    }

    private getDateViewVariant(): ComponentStyles
    {
        if (this.props.componentVariant.dateView)
        {
            return this.props.componentVariant.dateView;
        }

        switch (this.props.variant)
        {
            case CalendarVariant.Default:
                return DateView.Variant.Default;

            case CalendarVariant.Mini:
                return DateView.Variant.Mini;

            case CalendarVariant.Sesquialteral:
                return DateView.Variant.Sesquialteral;
        }
    }

    private getMonthViewVariant(): ComponentStyles
    {
        if (this.props.componentVariant.monthView)
        {
            return this.props.componentVariant.monthView;
        }

        switch (this.props.variant)
        {
            case CalendarVariant.Default:
                return MonthView.Variant.Default;

            case CalendarVariant.Mini:
                return MonthView.Variant.Mini;

            case CalendarVariant.Sesquialteral:
                return MonthView.Variant.Sesquialteral;
        }
    }

    private getYearViewVariant(): ComponentStyles
    {
        if (this.props.componentVariant.yearView)
        {
            return this.props.componentVariant.yearView;
        }

        switch (this.props.variant)
        {
            case CalendarVariant.Default:
                return YearView.Variant.Default;

            case CalendarVariant.Mini:
                return YearView.Variant.Mini;

            case CalendarVariant.Sesquialteral:
                return YearView.Variant.Sesquialteral;
        }
    }

    private renderView(): JSX.Element
    {
        return (
            <Transition
                childIdentifier={`${this.state.view}-${this.state.timeFrame.monthAndYear}-${this.state.timeFrame.decade}`}
                classNames={{
                    enter: this.props.variant[`calendar__transition--${this.state.transitionDirection}-in-start`],
                    enterActive: this.props.variant[`calendar__transition--${this.state.transitionDirection}-in-in-progress`],
                    exit: this.props.variant[`calendar__transition--${this.state.transitionDirection}-out-start`],
                    exitActive: this.props.variant[`calendar__transition--${this.state.transitionDirection}-out-in-progress`]
                }}
            >
                {
                    this.state.view === View.Date &&
                    (
                        <DateView.Component
                            variant={this.getDateViewVariant()}
                            selectedDate={this.props.selectedDate}
                            displayingMonth={this.state.timeFrame.monthAndYear}
                            onDateClick={this.onDateClick.bind(this)}
                        />
                    ) || this.state.view === View.Month &&
                    (
                        <MonthView.Component
                            variant={this.getMonthViewVariant()}
                            displayingYear={this.state.timeFrame.monthAndYear.getFullYear()}
                            onMonthClick={this.onMonthClick.bind(this)}
                        />
                    ) || this.state.view === View.Year &&
                    (
                        <YearView.Component
                            variant={this.getYearViewVariant()}
                            displayingDecade={this.state.timeFrame.decade}
                            onYearClick={this.onYearClick.bind(this)}
                        />
                    )
                }
            </Transition>
        );
    }

    private renderControls(): JSX.Element
    {
        return (
            <Control.Component
                variant={this.props.componentVariant.controls}
                onTodayButtonClick={
                    this.state.view !== View.Date || !this.isWithinTimeFrame(new Date())
                        ? () => { this.goToToday(); }
                        : null
                }
                onSelectionButtonClick={
                    this.props.selectedDate && (this.state.view !== View.Date || !this.isWithinTimeFrame(this.props.selectedDate))
                        ? () => { this.goToSelectedDate(); }
                        : null
                }
            />
        );
    }

    private zoomIn(timeFrame: TimeFrame): void
    {
        if (this.state.view === View.Date)
        {
            return;
        }

        this.setState({
            transitionDirection: TransitionDirection.Outward,
            view: this.state.view - 1,
            timeFrame
        });
    }

    private zoomOut(): void
    {
        if (this.state.view === View.Year)
        {
            return;
        }

        this.setState({
            transitionDirection: TransitionDirection.Inward,
            view: this.state.view + 1
        });
    }

    private navigate(direction: TransitionDirection): void
    {
        const canNavigate = (
            (direction === TransitionDirection.Forward && canNavigateForward(this.state.view, this.state.timeFrame))
            ||
            (direction === TransitionDirection.Backward && canNavigateBackward(this.state.view, this.state.timeFrame))
        );

        if (!canNavigate)
        {
            return;
        }

        let decade: Decade;
        const monthAndYear = new Date(this.state.timeFrame.monthAndYear);

        switch (this.state.view)
        {
            case View.Date:
            {
                const monthStep = direction === TransitionDirection.Forward ? 1 : -1;
                monthAndYear.setMonth(monthAndYear.getMonth() + monthStep);
                decade = GregorianCalendar.getDecade(monthAndYear.getFullYear());

                break;
            }

            case View.Month:
            {
                const yearStep = direction === TransitionDirection.Forward ? 1 : -1;
                monthAndYear.setFullYear(monthAndYear.getFullYear() + yearStep);
                decade = GregorianCalendar.getDecade(monthAndYear.getFullYear());

                break;
            }

            case View.Year:
            {
                const decadeStep = direction === TransitionDirection.Forward
                    ? GregorianCalendar.YEAR_COUNT_IN_DECADE
                    : -1 * GregorianCalendar.YEAR_COUNT_IN_DECADE;

                decade = (GregorianCalendar.getDecade(monthAndYear.getFullYear()) + decadeStep) as Decade;
                monthAndYear.setFullYear(decade, 0, 1);

                break;
            }
        }

        this.setState({
            transitionDirection: direction,
            timeFrame: {monthAndYear, decade}
        });
    }

    private goToToday(): void
    {
        const thisMonth = new Date();
        thisMonth.setDate(1);
        thisMonth.setHours(0, 0, 0, 0);

        this.setState({
            view: View.Date,
            transitionDirection: this.getTransitionDirection(thisMonth),
            timeFrame: {
                monthAndYear: thisMonth,
                decade: GregorianCalendar.getDecade(thisMonth.getFullYear())
            }
        });
    }

    private goToSelectedDate(): void
    {
        if (!this.props.selectedDate)
        {
            return;
        }

        this.setState({
            view: View.Date,
            transitionDirection: this.getTransitionDirection(this.props.selectedDate),
            timeFrame: {
                monthAndYear: this.props.selectedDate,
                decade: GregorianCalendar.getDecade(this.props.selectedDate.getFullYear())
            }
        });
    }

    private getTransitionDirection(toDate: Date): TransitionDirection
    {
        return this.state.view > View.Date
            ? TransitionDirection.Outward
            : toDate < this.state.timeFrame.monthAndYear
                ? TransitionDirection.Backward
                : TransitionDirection.Forward;
    }

    private isWithinTimeFrame(date: Date): boolean
    {
        const dateViewData = DateView.getData(this.state.timeFrame.monthAndYear);
        return dateViewData.flat().filter(x => GregorianCalendar.isEqualDate(x, date))?.length > 0;
    }

    private onDateClick(date: Date): void
    {
        this.props.onChange?.(
            GregorianCalendar.isEqualDate(date, this.props.selectedDate)
                ? undefined
                : date
        );
    }

    private onMonthClick(month: Date): void
    {
        this.zoomIn({
            monthAndYear: month,
            decade: GregorianCalendar.getDecade(month.getFullYear())
        });
    }

    private onYearClick(year: number): void
    {
        this.zoomIn({
            monthAndYear: new Date(year, 0, 1),
            decade: GregorianCalendar.getDecade(year)
        });
    }
}
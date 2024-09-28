import {ControlStatus, Mode, PendingStatus, Status} from "../enums";
import {StateMachine} from "./state-machine";

describe("completing a reminder", () =>
{
    it("works correctly when the reminder is due", () =>
    {
        // Arrange
        const stateMachine = new StateMachine({
            recurrencePattern: `0 0 0 25 2 ? 1993`,
            originalDueDate: new Date(1993, 1, 25),
            dueDate: new Date(1993, 1, 25),
            today: new Date(1993, 1, 25),
            originalStatus: Status.Scheduled,
            status: Status.Scheduled,
            mode: Mode.Edit
        });

        // Check preconditions
        let derivedProperties = stateMachine.getDerivedProperties();
        expect(derivedProperties.isDue).toBe(true);

        // Act
        stateMachine.toggleRescheduleForward(ControlStatus.Highlighted);

        // Assert
        derivedProperties = stateMachine.getDerivedProperties();
        expect(derivedProperties.recurrencePatternInputFieldStatus).toBe(ControlStatus.Available);
        expect(derivedProperties.rescheduleForwardToggleStatus).toBe(ControlStatus.Highlighted);
        expect(derivedProperties.rescheduleBackwardToggleStatus).toBe(ControlStatus.Disabled);
        expect(derivedProperties.suspenseToggleStatus).toBe(ControlStatus.Disabled);
        expect(derivedProperties.pendingStatus).toBe(PendingStatus.ToBeCompleted);
        expect(derivedProperties.formattedDueDuration).toBeUndefined();
        expect(derivedProperties.formattedDueDate).toBe("Completed");
        expect(derivedProperties.dueDuration).toBeUndefined();
        expect(derivedProperties.isOverdue).toBe(false);
        expect(derivedProperties.isDue).toBe(false);
    });

    it("works correctly when the reminder is overdue", () =>
    {
        // Arrange
        const stateMachine = new StateMachine({
            recurrencePattern: `0 0 0 25 2 ? 1993`,
            originalDueDate: new Date(1993, 1, 25),
            dueDate: new Date(1993, 1, 25),
            today: new Date(1993, 1, 26),
            originalStatus: Status.Scheduled,
            status: Status.Scheduled,
            mode: Mode.Edit
        });

        // Check preconditions
        let derivedProperties = stateMachine.getDerivedProperties();
        expect(derivedProperties.isOverdue).toBe(true);

        // Act
        stateMachine.toggleRescheduleForward(ControlStatus.Highlighted);

        // Assert
        derivedProperties = stateMachine.getDerivedProperties();
        expect(derivedProperties.recurrencePatternInputFieldStatus).toBe(ControlStatus.Available);
        expect(derivedProperties.rescheduleForwardToggleStatus).toBe(ControlStatus.Highlighted);
        expect(derivedProperties.rescheduleBackwardToggleStatus).toBe(ControlStatus.Disabled);
        expect(derivedProperties.suspenseToggleStatus).toBe(ControlStatus.Disabled);
        expect(derivedProperties.pendingStatus).toBe(PendingStatus.ToBeCompleted);
        expect(derivedProperties.formattedDueDuration).toBeUndefined();
        expect(derivedProperties.formattedDueDate).toBe("Completed");
        expect(derivedProperties.dueDuration).toBeUndefined();
        expect(derivedProperties.isOverdue).toBe(false);
        expect(derivedProperties.isDue).toBe(false);
    });

    it("works correctly when the reminder is not due or overdue", () =>
    {
        // Arrange
        const stateMachine = new StateMachine({
            recurrencePattern: `0 0 0 25 2 ? 1993`,
            originalDueDate: new Date(1993, 1, 25),
            dueDate: new Date(1993, 1, 25),
            today: new Date(1993, 1, 24),
            originalStatus: Status.Scheduled,
            status: Status.Scheduled,
            mode: Mode.Edit
        });

        // Check preconditions
        let derivedProperties = stateMachine.getDerivedProperties();
        expect(derivedProperties.isOverdue).toBe(false);
        expect(derivedProperties.isDue).toBe(false);

        // Act
        stateMachine.toggleRescheduleForward(ControlStatus.Highlighted);

        // Assert
        derivedProperties = stateMachine.getDerivedProperties();
        expect(derivedProperties.recurrencePatternInputFieldStatus).toBe(ControlStatus.Available);
        expect(derivedProperties.rescheduleForwardToggleStatus).toBe(ControlStatus.Highlighted);
        expect(derivedProperties.rescheduleBackwardToggleStatus).toBe(ControlStatus.Disabled);
        expect(derivedProperties.suspenseToggleStatus).toBe(ControlStatus.Disabled);
        expect(derivedProperties.pendingStatus).toBe(PendingStatus.ToBeCompleted);
        expect(derivedProperties.formattedDueDuration).toBeUndefined();
        expect(derivedProperties.formattedDueDate).toBe("Completed");
        expect(derivedProperties.dueDuration).toBeUndefined();
        expect(derivedProperties.isOverdue).toBe(false);
        expect(derivedProperties.isDue).toBe(false);
    });
});

describe("rescheduling a reminder forward", () =>
{
    it("works correctly when the reminder is due", () =>
    {
        // Arrange
        const stateMachine = new StateMachine({
            recurrencePattern: `0 0 0 25 * ? *`,
            originalDueDate: new Date(1993, 1, 25),
            dueDate: new Date(1993, 1, 25),
            today: new Date(1993, 1, 25),
            originalStatus: Status.Scheduled,
            status: Status.Scheduled,
            mode: Mode.Edit
        });

        // Check preconditions
        let derivedProperties = stateMachine.getDerivedProperties();
        expect(derivedProperties.isDue).toBe(true);

        // Act
        stateMachine.toggleRescheduleForward(ControlStatus.Highlighted);

        // Assert
        derivedProperties = stateMachine.getDerivedProperties();
        expect(derivedProperties.recurrencePatternInputFieldStatus).toBe(ControlStatus.Available);
        expect(derivedProperties.rescheduleForwardToggleStatus).toBe(ControlStatus.Highlighted);
        expect(derivedProperties.rescheduleBackwardToggleStatus).toBe(ControlStatus.Disabled);
        expect(derivedProperties.suspenseToggleStatus).toBe(ControlStatus.Disabled);
        expect(derivedProperties.pendingStatus).toBe(PendingStatus.ToBeRescheduledForward);
        expect(derivedProperties.formattedDueDuration).toBe("In 28 days");
        expect(derivedProperties.formattedDueDate).toBe("25.03.1993");
        expect(derivedProperties.dueDuration).toBe(28);
        expect(derivedProperties.isOverdue).toBe(false);
        expect(derivedProperties.isDue).toBe(false);
    });

    it("works correctly when the reminder is overdue", () =>
    {
        // Arrange
        const stateMachine = new StateMachine({
            recurrencePattern: `0 0 0 25 * ? *`,
            originalDueDate: new Date(1993, 1, 25),
            dueDate: new Date(1993, 1, 25),
            today: new Date(1993, 1, 26),
            originalStatus: Status.Scheduled,
            status: Status.Scheduled,
            mode: Mode.Edit
        });

        // Check preconditions
        let derivedProperties = stateMachine.getDerivedProperties();
        expect(derivedProperties.isOverdue).toBe(true);

        // Act
        stateMachine.toggleRescheduleForward(ControlStatus.Highlighted);

        // Assert
        derivedProperties = stateMachine.getDerivedProperties();
        expect(derivedProperties.recurrencePatternInputFieldStatus).toBe(ControlStatus.Available);
        expect(derivedProperties.rescheduleForwardToggleStatus).toBe(ControlStatus.Highlighted);
        expect(derivedProperties.rescheduleBackwardToggleStatus).toBe(ControlStatus.Disabled);
        expect(derivedProperties.suspenseToggleStatus).toBe(ControlStatus.Disabled);
        expect(derivedProperties.pendingStatus).toBe(PendingStatus.ToBeRescheduledForward);
        expect(derivedProperties.formattedDueDuration).toBe("In 27 days");
        expect(derivedProperties.formattedDueDate).toBe("25.03.1993");
        expect(derivedProperties.dueDuration).toBe(27);
        expect(derivedProperties.isOverdue).toBe(false);
        expect(derivedProperties.isDue).toBe(false);
    });

    it("works correctly when the reminder is not due or overdue", () =>
    {
        // Arrange
        const stateMachine = new StateMachine({
            recurrencePattern: `0 0 0 25 * ? *`,
            originalDueDate: new Date(1993, 1, 25),
            dueDate: new Date(1993, 1, 25),
            today: new Date(1993, 1, 24),
            originalStatus: Status.Scheduled,
            status: Status.Scheduled,
            mode: Mode.Edit
        });

        // Check preconditions
        let derivedProperties = stateMachine.getDerivedProperties();
        expect(derivedProperties.isOverdue).toBe(false);
        expect(derivedProperties.isDue).toBe(false);

        // Act
        stateMachine.toggleRescheduleForward(ControlStatus.Highlighted);

        // Assert
        derivedProperties = stateMachine.getDerivedProperties();
        expect(derivedProperties.recurrencePatternInputFieldStatus).toBe(ControlStatus.Available);
        expect(derivedProperties.rescheduleForwardToggleStatus).toBe(ControlStatus.Highlighted);
        expect(derivedProperties.rescheduleBackwardToggleStatus).toBe(ControlStatus.Disabled);
        expect(derivedProperties.suspenseToggleStatus).toBe(ControlStatus.Disabled);
        expect(derivedProperties.pendingStatus).toBe(PendingStatus.ToBeRescheduledForward);
        expect(derivedProperties.formattedDueDuration).toBe("In 29 days");
        expect(derivedProperties.formattedDueDate).toBe("25.03.1993");
        expect(derivedProperties.dueDuration).toBe(29);
        expect(derivedProperties.isOverdue).toBe(false);
        expect(derivedProperties.isDue).toBe(false);
    });

    it("completes the reminder if there are no future due dates", () =>
    {
        // Arrange
        const stateMachine = new StateMachine({
            recurrencePattern: `0 0 0 25 2 ? 1993`,
            originalDueDate: new Date(1993, 1, 25),
            dueDate: new Date(1993, 1, 25),
            today: new Date(1993, 1, 28),
            originalStatus: Status.Scheduled,
            status: Status.Scheduled,
            mode: Mode.Edit
        });

        // Act
        stateMachine.toggleRescheduleForward(ControlStatus.Highlighted);

        // Assert
        const derivedProperties = stateMachine.getDerivedProperties();
        expect(derivedProperties.recurrencePatternInputFieldStatus).toBe(ControlStatus.Available);
        expect(derivedProperties.rescheduleForwardToggleStatus).toBe(ControlStatus.Highlighted);
        expect(derivedProperties.rescheduleBackwardToggleStatus).toBe(ControlStatus.Disabled);
        expect(derivedProperties.suspenseToggleStatus).toBe(ControlStatus.Disabled);
        expect(derivedProperties.pendingStatus).toBe(PendingStatus.ToBeCompleted);
        expect(derivedProperties.formattedDueDuration).toBeUndefined();
        expect(derivedProperties.formattedDueDate).toBe("Completed");
        expect(derivedProperties.dueDuration).toBeUndefined();
        expect(derivedProperties.isOverdue).toBe(false);
        expect(derivedProperties.isDue).toBe(false);
    });
});

describe("rescheduling a reminder backward", () =>
{
    it("works correctly when the reminder is due", () =>
    {
        // Arrange
        const stateMachine = new StateMachine({
            recurrencePattern: `0 0 0 25 * ? *`,
            originalDueDate: new Date(1993, 1, 25),
            dueDate: new Date(1993, 1, 25),
            today: new Date(1993, 1, 25),
            originalStatus: Status.Scheduled,
            status: Status.Scheduled,
            mode: Mode.Edit
        });

        // Check preconditions
        let derivedProperties = stateMachine.getDerivedProperties();
        expect(derivedProperties.isDue).toBe(true);

        // Act
        stateMachine.toggleRescheduleBackward(ControlStatus.Highlighted);

        // Assert
        derivedProperties = stateMachine.getDerivedProperties();
        expect(derivedProperties.recurrencePatternInputFieldStatus).toBe(ControlStatus.Available);
        expect(derivedProperties.rescheduleBackwardToggleStatus).toBe(ControlStatus.Highlighted);
        expect(derivedProperties.rescheduleForwardToggleStatus).toBe(ControlStatus.Disabled);
        expect(derivedProperties.suspenseToggleStatus).toBe(ControlStatus.Disabled);
        expect(derivedProperties.pendingStatus).toBe(PendingStatus.ToBeRescheduledBackward);
        expect(derivedProperties.formattedDueDuration).toBe("31 days ago");
        expect(derivedProperties.formattedDueDate).toBe("25.01.1993");
        expect(derivedProperties.dueDuration).toBe(-31);
        expect(derivedProperties.isOverdue).toBe(true);
        expect(derivedProperties.isDue).toBe(false);
    });

    it("works correctly when the reminder is overdue", () =>
    {
        // Arrange
        const stateMachine = new StateMachine({
            recurrencePattern: `0 0 0 25 * ? *`,
            originalDueDate: new Date(1993, 1, 25),
            dueDate: new Date(1993, 1, 25),
            today: new Date(1993, 1, 26),
            originalStatus: Status.Scheduled,
            status: Status.Scheduled,
            mode: Mode.Edit
        });

        // Check preconditions
        let derivedProperties = stateMachine.getDerivedProperties();
        expect(derivedProperties.isOverdue).toBe(true);

        // Act
        stateMachine.toggleRescheduleBackward(ControlStatus.Highlighted);

        // Assert
        derivedProperties = stateMachine.getDerivedProperties();
        expect(derivedProperties.recurrencePatternInputFieldStatus).toBe(ControlStatus.Available);
        expect(derivedProperties.rescheduleBackwardToggleStatus).toBe(ControlStatus.Highlighted);
        expect(derivedProperties.rescheduleForwardToggleStatus).toBe(ControlStatus.Disabled);
        expect(derivedProperties.suspenseToggleStatus).toBe(ControlStatus.Disabled);
        expect(derivedProperties.pendingStatus).toBe(PendingStatus.ToBeRescheduledBackward);
        expect(derivedProperties.formattedDueDuration).toBe("32 days ago");
        expect(derivedProperties.formattedDueDate).toBe("25.01.1993");
        expect(derivedProperties.dueDuration).toBe(-32);
        expect(derivedProperties.isOverdue).toBe(true);
        expect(derivedProperties.isDue).toBe(false);
    });

    it("works correctly when the reminder is not due or overdue", () =>
    {
        // Arrange
        const stateMachine = new StateMachine({
            recurrencePattern: `0 0 0 25 * ? *`,
            originalDueDate: new Date(1993, 1, 25),
            dueDate: new Date(1993, 1, 25),
            today: new Date(1993, 1, 24),
            originalStatus: Status.Scheduled,
            status: Status.Scheduled,
            mode: Mode.Edit
        });

        // Check preconditions
        let derivedProperties = stateMachine.getDerivedProperties();
        expect(derivedProperties.isOverdue).toBe(false);
        expect(derivedProperties.isDue).toBe(false);

        // Act
        stateMachine.toggleRescheduleBackward(ControlStatus.Highlighted);

        // Assert
        derivedProperties = stateMachine.getDerivedProperties();
        expect(derivedProperties.recurrencePatternInputFieldStatus).toBe(ControlStatus.Available);
        expect(derivedProperties.rescheduleBackwardToggleStatus).toBe(ControlStatus.Highlighted);
        expect(derivedProperties.rescheduleForwardToggleStatus).toBe(ControlStatus.Disabled);
        expect(derivedProperties.suspenseToggleStatus).toBe(ControlStatus.Disabled);
        expect(derivedProperties.pendingStatus).toBe(PendingStatus.ToBeRescheduledBackward);
        expect(derivedProperties.formattedDueDuration).toBe("30 days ago");
        expect(derivedProperties.formattedDueDate).toBe("25.01.1993");
        expect(derivedProperties.dueDuration).toBe(-30);
        expect(derivedProperties.isOverdue).toBe(true);
        expect(derivedProperties.isDue).toBe(false);
    });

    it("works correctly when there are no past due dates", () =>
    {
        // Arrange
        const stateMachine = new StateMachine({
            recurrencePattern: `0 0 0 25 2 ? 1993`,
            originalDueDate: new Date(1993, 1, 25),
            dueDate: new Date(1993, 1, 25),
            today: new Date(1993, 1, 28),
            originalStatus: Status.Scheduled,
            status: Status.Scheduled,
            mode: Mode.Edit
        });

        // Act
        stateMachine.toggleRescheduleBackward(ControlStatus.Highlighted);

        // Assert
        const derivedProperties = stateMachine.getDerivedProperties();
        expect(derivedProperties.recurrencePatternInputFieldStatus).toBe(ControlStatus.Available);
        expect(derivedProperties.rescheduleBackwardToggleStatus).toBe(ControlStatus.Highlighted);
        expect(derivedProperties.rescheduleForwardToggleStatus).toBe(ControlStatus.Disabled);
        expect(derivedProperties.suspenseToggleStatus).toBe(ControlStatus.Disabled);
        expect(derivedProperties.pendingStatus).toBe(PendingStatus.ToBeRescheduledBackward);
        expect(derivedProperties.formattedDueDuration).toBeUndefined();
        expect(derivedProperties.formattedDueDate).toBe("No due date");
        expect(derivedProperties.dueDuration).toBeUndefined();
        expect(derivedProperties.isOverdue).toBe(false);
        expect(derivedProperties.isDue).toBe(false);
    });
});

describe("suspending a reminder", () =>
{
    it("works correctly when the reminder is due", () =>
    {
        // Arrange
        const stateMachine = new StateMachine({
            recurrencePattern: `0 0 0 25 * ? *`,
            originalDueDate: new Date(1993, 1, 25),
            dueDate: new Date(1993, 1, 25),
            today: new Date(1993, 1, 25),
            originalStatus: Status.Scheduled,
            status: Status.Scheduled,
            mode: Mode.Edit
        });

        // Check preconditions
        let derivedProperties = stateMachine.getDerivedProperties();
        expect(derivedProperties.isDue).toBe(true);

        // Act
        stateMachine.toggleSuspense(ControlStatus.Highlighted);

        // Assert
        derivedProperties = stateMachine.getDerivedProperties();
        expect(derivedProperties.recurrencePatternInputFieldStatus).toBe(ControlStatus.Available);
        expect(derivedProperties.rescheduleBackwardToggleStatus).toBe(ControlStatus.Disabled);
        expect(derivedProperties.rescheduleForwardToggleStatus).toBe(ControlStatus.Disabled);
        expect(derivedProperties.suspenseToggleStatus).toBe(ControlStatus.Highlighted);
        expect(derivedProperties.pendingStatus).toBe(PendingStatus.ToBeSuspended);
        expect(derivedProperties.formattedDueDuration).toBeUndefined();
        expect(derivedProperties.formattedDueDate).toBe("Suspended");
        expect(derivedProperties.dueDuration).toBeUndefined();
        expect(derivedProperties.isOverdue).toBe(false);
        expect(derivedProperties.isDue).toBe(false);
    });

    it("works correctly when the reminder is overdue", () =>
    {
        // Arrange
        const stateMachine = new StateMachine({
            recurrencePattern: `0 0 0 25 * ? *`,
            originalDueDate: new Date(1993, 1, 25),
            dueDate: new Date(1993, 1, 25),
            today: new Date(1993, 1, 26),
            originalStatus: Status.Scheduled,
            status: Status.Scheduled,
            mode: Mode.Edit
        });

        // Check preconditions
        let derivedProperties = stateMachine.getDerivedProperties();
        expect(derivedProperties.isOverdue).toBe(true);

        // Act
        stateMachine.toggleSuspense(ControlStatus.Highlighted);

        // Assert
        derivedProperties = stateMachine.getDerivedProperties();
        expect(derivedProperties.recurrencePatternInputFieldStatus).toBe(ControlStatus.Available);
        expect(derivedProperties.rescheduleBackwardToggleStatus).toBe(ControlStatus.Disabled);
        expect(derivedProperties.rescheduleForwardToggleStatus).toBe(ControlStatus.Disabled);
        expect(derivedProperties.suspenseToggleStatus).toBe(ControlStatus.Highlighted);
        expect(derivedProperties.pendingStatus).toBe(PendingStatus.ToBeSuspended);
        expect(derivedProperties.formattedDueDuration).toBeUndefined();
        expect(derivedProperties.formattedDueDate).toBe("Suspended");
        expect(derivedProperties.dueDuration).toBeUndefined();
        expect(derivedProperties.isOverdue).toBe(false);
        expect(derivedProperties.isDue).toBe(false);
    });

    it("works correctly when the reminder is not due or overdue", () =>
    {
        // Arrange
        const stateMachine = new StateMachine({
            recurrencePattern: `0 0 0 25 * ? *`,
            originalDueDate: new Date(1993, 1, 25),
            dueDate: new Date(1993, 1, 25),
            today: new Date(1993, 1, 24),
            originalStatus: Status.Scheduled,
            status: Status.Scheduled,
            mode: Mode.Edit
        });

        // Check preconditions
        let derivedProperties = stateMachine.getDerivedProperties();
        expect(derivedProperties.isOverdue).toBe(false);
        expect(derivedProperties.isDue).toBe(false);

        // Act
        stateMachine.toggleSuspense(ControlStatus.Highlighted);

        // Assert
        derivedProperties = stateMachine.getDerivedProperties();
        expect(derivedProperties.recurrencePatternInputFieldStatus).toBe(ControlStatus.Available);
        expect(derivedProperties.rescheduleBackwardToggleStatus).toBe(ControlStatus.Disabled);
        expect(derivedProperties.rescheduleForwardToggleStatus).toBe(ControlStatus.Disabled);
        expect(derivedProperties.suspenseToggleStatus).toBe(ControlStatus.Highlighted);
        expect(derivedProperties.pendingStatus).toBe(PendingStatus.ToBeSuspended);
        expect(derivedProperties.formattedDueDuration).toBeUndefined();
        expect(derivedProperties.formattedDueDate).toBe("Suspended");
        expect(derivedProperties.dueDuration).toBeUndefined();
        expect(derivedProperties.isOverdue).toBe(false);
        expect(derivedProperties.isDue).toBe(false);
    });
});
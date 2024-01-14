import {isString, registerDecorator, ValidationOptions} from "class-validator";
import {ErrorMessages} from "../error-messages";

export function IsString(validationOptions?: ValidationOptions)
{
    return function (objectContainingThisProperty: object, thisPropertyName: string): void
    {
        registerDecorator({
            name: "IsString",
            target: objectContainingThisProperty.constructor,
            propertyName: thisPropertyName,
            options: validationOptions,
            validator: {
                validate(thisPropertyValue: unknown) { return isString(thisPropertyValue); },
                defaultMessage() { return ErrorMessages.MustBeString; }
            }
        });
    };
}

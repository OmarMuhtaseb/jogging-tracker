import {registerDecorator, ValidationArguments, ValidationOptions} from 'class-validator';
import {Types} from 'mongoose';

export function IsObjectId(property?: string, validationOptions?: ValidationOptions) {
    return function(object: any, propertyName: string) {
        registerDecorator({
            name: 'IsObjectId',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [property],
            options: validationOptions,
            validator: {
                validate(value: any, args: ValidationArguments) {
                    return Types.ObjectId.isValid(value) &&
                        (new Types.ObjectId(value)).toString() === value;
                },
                defaultMessage(validationArguments?: ValidationArguments): string {
                    return `${validationArguments?.property} must be a single String of 24 hex characters`;
                },
            },
        });
    };
}

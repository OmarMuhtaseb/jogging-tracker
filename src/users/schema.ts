import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Role} from '@toptal/libs-auth';
import {BaseModel} from '@toptal/libs-db';

@Schema({timestamps: true})
export class User extends BaseModel {
    @Prop({required: true})
    email: string;

    @Prop({required: true})
    name: string;

    @Prop({required: true})
    password: string;

    @Prop({required: true})
    roles: Role[];
}

export const UserSchema = SchemaFactory.createForClass(User);

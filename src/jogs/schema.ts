import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {BaseModel} from '@toptal/libs-db';


@Schema({timestamps: true})
export class Jog extends BaseModel {
    @Prop({required: true})
    user: string;

    @Prop({required: true})
    distance: number;

    @Prop({required: true})
    date: Date;

    @Prop({required: true})
    time: number;

    @Prop({required: true})
    location: string;

    @Prop({required: true})
    weather: string;
}

export const JogSchema = SchemaFactory.createForClass(Jog);

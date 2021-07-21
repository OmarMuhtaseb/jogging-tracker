import {NotFoundException} from '@nestjs/common';
import {FilterQuery, Model, model, Schema} from 'mongoose';
import {BaseModel} from './schema';
import Pagination = Repository.Pagination;

export class Repository<T extends BaseModel> {
    private readonly table: string;
    public readonly model: Model<T>;
    private static readonly DEFAULT_SKIP = 0;
    private static readonly DEFAULT_LIMIT = 10;

    constructor(tableName: string, private readonly schema: Schema, indexes: {fields: any; options?: any}[] = []) {
        this.table = tableName;

        indexes.forEach(index => {
            this.schema.index(index.fields, index.options);
        });

        this.model = model<T>(tableName, this.schema);
    }

    public async create(data: Partial<T>): Promise<T> {
        return await this.model.create(data);
    }

    public async findById(id: string, options?: Repository.Options): Promise<T> {
        const entity = await this.model
            .findById(id)
            .select(options?.select)
            .populate(options?.populate);

        if (!entity) {
            throw new NotFoundException(`${this.table} with ${id} Not Found`);
        }

        return entity;
    }

    public async findOne(filters: FilterQuery<T>, options?: Repository.Options): Promise<T> {
        return this.model
            .findOne(filters)
            .select(options?.select)
            .populate(options?.populate);
    }

    public async updateById(id: string, fields: Partial<T>): Promise<T> {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const entity = await this.model.findByIdAndUpdate(id, {$set: fields}, {new: true});

        if (!entity) {
            throw new NotFoundException(`${this.table} with ${id} Not Found`);
        }

        return entity;
    }

    public async deleteById(id: string): Promise<T> {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const entity = await this.model.findByIdAndDelete(id);

        if (!entity) {
            throw new NotFoundException(`${this.table} with ${id} Not Found`);
        }

        return entity;
    }

    public async list(options: Pagination): Promise<{data: T[], total: number}> {
        const result = await this.model.aggregate([
            {
                $facet: {
                    data: [
                        {$skip: options.skip || Repository.DEFAULT_SKIP},
                        {$limit: options.limit || Repository.DEFAULT_LIMIT},
                    ],
                    total: [{$count: 'total'}],
                },
            },
        ]);

        const {total = 0} = result[0].total[0] || {};

        return {
            total: total,
            data: result[0].data,
        };

    }

    public async existsById(id: string): Promise<boolean> {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return await this.model.exists({_id: id});
    }

    public async exists(filters: FilterQuery<T>): Promise<boolean> {
        return await this.model.exists(filters);
    }
}

// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace Repository {
    export type Options = {
        shouldExist?: boolean;
        populate?: string[];
        select?: string[];
    };

    export type Pagination = {
        limit?: number;
        skip?: number;
    }
}

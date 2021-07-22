import {Injectable} from '@nestjs/common';
import {Repository} from '@toptal/libs-db';
import {Jog, JogSchema, WeeklyReport} from './schema';

@Injectable()
export class JogsRepository extends Repository<Jog> {
    constructor() {
        super('Jog', JogSchema);
    }

    public async generateReport(from: string, to: string, userId?: string): Promise<WeeklyReport[]> {
        const result = await this.model.aggregate([
            {
                $match: {
                    date: {$gte: from || '2000-01-01', $lt: to || '3000-01-01'},
                    ...(!!userId && {user: userId}),
                },
            },
            {
                $project: {
                    projectedDate: {
                        $dateFromString: {
                            dateString: '$date',
                        },
                    },
                    time: 1,
                    distance: 1,
                },
            },
            {
                $project: {
                    year: {$year: '$projectedDate'},
                    week: {$week: '$projectedDate'},
                    time: 1,
                    distance: 1,
                },
            },
            {
                $group: {
                    _id: {
                        year: '$year',
                        week: '$week',
                    },
                    avgDistance: {$avg: '$distance'},
                    avgTime: {$avg: '$time'},
                    totalDistance: {$sum: '$distance'},
                    totalTime: {$sum: '$time'},
                },
            },
        ]);

        return result.map((record: {
            _id: {year: number, week: number},
            avgDistance: number, avgTime: number, totalDistance: number, totalTime: number
        }) => ({
            year: record._id.year,
            week: record._id.week,
            avgDistance: record.avgDistance,
            avgTime: record.avgTime,
            avgSpeed: record.totalTime > 0 ? Math.round(record.totalDistance / record.totalTime) : 0,
            totalTime: record.totalTime,
            totalDistance: record.totalDistance,
        }));
    }
}

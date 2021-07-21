import {Injectable} from '@nestjs/common';
import got from 'got';

@Injectable()
export class HelpersService {
    public async getWeather(location: string, date: string): Promise<string> {
        const response = await got.get('http://api.weatherstack.com/current', {
            responseType: 'json',
            searchParams: {
                access_key: '89e02fa3789f3da00fb76850f028f369',
                query: location,
                historical_date: date,
            }
        });

        return response.body['current']['weather_descriptions'][0];
    }
}

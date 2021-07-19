import {JogDto} from './dto';
import {Jog} from './schema';

export class JogsMapper {
    public static toJogDto(jog: Jog): JogDto {
        return {
            id: jog._id,
            user: jog.user,
            date: jog.date,
            distance: jog.distance,
            location: jog.location,
            time: jog.time,
            weather: jog.weather,
            createdAt: jog.createdAt,
        };
    }

    public static toJogDtos(jogs: Jog[]): JogDto[] {
        return jogs.map(jog => this.toJogDto(jog));
    }
}

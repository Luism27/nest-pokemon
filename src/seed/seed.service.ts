import { Injectable } from '@nestjs/common';
import { PokeResponse } from './interfaces/poke-response.interface';
import { PokemonService } from '../pokemon/pokemon.service';
import { CreatePokemonDto } from '../pokemon/dto/create-pokemon.dto';
import { AxiosAdapter } from '../common/adapters/axios.adapter';
@Injectable()
export class SeedService {
  constructor(
    private readonly pokemonService: PokemonService,
    private readonly http: AxiosAdapter,
  ){}
  async executeSeed(){
    const r = await this.pokemonService.deleteAll();
    const data = await this.http.get<PokeResponse>("https://pokeapi.co/api/v2/pokemon?limit=650")
    const dataTransform: CreatePokemonDto[] = data.results.map(({name, url})=>{
      const seg = url.split("/");
      const no = +seg[seg.length - 2]
      return {name: name.toLowerCase(), no}
    })
    const res = await this.pokemonService.createMany(dataTransform);
    return res;
  }
}

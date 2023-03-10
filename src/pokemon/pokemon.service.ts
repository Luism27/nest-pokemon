import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { isValidObjectId, Model } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { ConfigService } from '@nestjs/config';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { InjectModel } from '@nestjs/mongoose';
import { PaginationDto } from '../common/dto/pagination.dto';

@Injectable()
export class PokemonService {
  private defaultLimit: number;

  constructor (
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,

    private readonly configService: ConfigService,

  ){
    this.defaultLimit = configService.get<number>('defaultLimit');
  }

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLowerCase();
    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto);
      return pokemon;
    } catch (error) {
      this.handleException(error)
    }
  }

  async createMany(data: CreatePokemonDto[]){
    try {
      const pokemones = await this.pokemonModel.insertMany(data);
      return {
        msg: ` ${data.length} pokemones creados correctamente `,
        pokemones,
      }
    } catch (error) {
      this.handleException(error)
    }
  }

  findAll(paginationDto: PaginationDto) {
    const {limit = this.defaultLimit, offset = 0} = paginationDto;
    return this.pokemonModel.find()
    .limit(limit)
    .skip(offset)
    .sort({
      no: 1
    })
    .select('-__v');
  }

  async findOne(term: string) {
    let pokemon: Pokemon;

    if(!isNaN(+term)){
      pokemon = await this.pokemonModel.findOne({no: term});
    }
    // Mongo Id
    if(!pokemon && isValidObjectId(term))
      pokemon = await this.pokemonModel.findById(term)

    // name
    if(!pokemon)
      pokemon = await this.pokemonModel.findOne({name: term.toLowerCase().trim()})

    if(!pokemon)
      throw new NotFoundException(`Pokemon with id/name/no ${term} not found`)

    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    const pokemon = await this.findOne(term);
    if(updatePokemonDto.name)
      updatePokemonDto.name = updatePokemonDto.name.toLowerCase();

    try {
      await pokemon.updateOne(updatePokemonDto)
      return {...pokemon.toJSON(), ...updatePokemonDto};
    } catch (error) {
      this.handleException(error)
    }

  }

  async remove(id: string) {
    const res = await this.pokemonModel.findByIdAndDelete(id);
    if(!res)
      throw new BadRequestException(`${id} not found on db`);
    return res;
  }

  async deleteAll(){
    await this.pokemonModel.deleteMany({});
    return true
  }

  private handleException(error: any){
    if(error.code === 11000){
      throw new BadRequestException(`Pokemon exists in db ${JSON.stringify( error.keyValue )}`)
    }
    console.log('error ', error)
    throw new InternalServerErrorException(`Can't update Pokemon - check server error`)
  }
}

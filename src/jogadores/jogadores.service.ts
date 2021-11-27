import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CriarJogadorDto } from './dtos/criar-jogador.dto';
import { Jogador } from './interfaces/jogador.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class JogadoresService {
  constructor(
    @InjectModel('Jogador') private readonly jogadorModel: Model<Jogador>,
  ) {}

  async criarJogador(criarJogadorDto: CriarJogadorDto): Promise<Jogador> {
    const { email } = criarJogadorDto;

    const jogador = await this.jogadorModel.findOne({ email }).exec();

    if (jogador) throw new BadRequestException('Jogador ja cadastrado');

    return await this._criar(criarJogadorDto);
  }

  async atualizarJogador(
    _id: string,
    criarJogadorDto: CriarJogadorDto,
  ): Promise<Jogador> {
    const jogador = await this.jogadorModel.findOne({ _id }).exec();

    if (!jogador) throw new NotFoundException('Jogador não encontrado');

    return await this._atualizar(criarJogadorDto);
  }

  async consultarTodosJogadores(): Promise<Jogador[]> {
    return this.jogadorModel.find().exec();
  }

  async consultarJogadorPeloId(_id: string): Promise<Jogador> {
    const jogador = await this.jogadorModel.findOne({ _id }).exec();

    if (!jogador) throw new NotFoundException('Jogador não encontrado');

    return jogador;
  }

  async deletarJogador(_id: string): Promise<any> {
    const jogadorEncontrado = await this.jogadorModel.findOne({ _id }).exec();

    if (!jogadorEncontrado)
      throw new NotFoundException('Jogador não encontrado');

    return this.jogadorModel.deleteOne({ _id }).exec();
  }

  private async _criar(criarJogadorDto: CriarJogadorDto): Promise<Jogador> {
    const jogadorCriado = new this.jogadorModel(criarJogadorDto);

    return await jogadorCriado.save();
  }

  private async _atualizar(criarJogadorDto: CriarJogadorDto): Promise<Jogador> {
    const { email } = criarJogadorDto;

    const jogadorAtualizado = await this.jogadorModel
      .findOneAndUpdate(
        {
          email,
        },
        { $set: criarJogadorDto },
      )
      .exec();

    return jogadorAtualizado;
  }
}

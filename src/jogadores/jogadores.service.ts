import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CriarJogadorDto } from './dtos/criar-jogador.dto';
import { Jogador } from './interfaces/jogador.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class JogadoresService {
  constructor(
    @InjectModel('Jogador') private readonly jogadorModel: Model<Jogador>,
  ) {}

  async criarAtualizarJogador(
    criarJogadorDto: CriarJogadorDto,
  ): Promise<Jogador> {
    const { email } = criarJogadorDto;

    const jogador = await this.jogadorModel.findOne({ email }).exec();

    if (jogador) {
      return await this.atualizar(criarJogadorDto);
    }

    return await this.criar(criarJogadorDto);
  }

  async consultarTodosJogadores(): Promise<Jogador[]> {
    return this.jogadorModel.find().exec();
  }

  async consultarJogadorPorEmail(email: string): Promise<Jogador> {
    const jogador = await this.jogadorModel.findOne({ email }).exec();

    if (!jogador) throw new NotFoundException('Jogador não encontrado');

    return jogador;
  }

  async deletarJogador(email: string): Promise<any> {
    const jogadorEncontrado = await this.jogadorModel.findOne({ email }).exec();

    if (!jogadorEncontrado)
      throw new NotFoundException('Jogador não encontrado');

    return this.jogadorModel.remove({ email }).exec();
  }

  private async criar(criarJogadorDto: CriarJogadorDto): Promise<Jogador> {
    const jogadorCriado = new this.jogadorModel(criarJogadorDto);

    return await jogadorCriado.save();
  }

  private atualizar(criarJogadorDto: CriarJogadorDto): Promise<Jogador> {
    const { email } = criarJogadorDto;

    return this.jogadorModel
      .findOneAndUpdate(
        {
          email,
        },
        { $set: criarJogadorDto },
      )
      .exec();
  }
}

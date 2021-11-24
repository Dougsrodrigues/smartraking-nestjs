import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CriarJogadorDto } from './dtos/criar-jogador.dto';
import { Jogador } from './interfaces/jogador.interface';
import { v4 as uuidV4 } from 'uuid';

@Injectable()
export class JogadoresService {
  private jogadores: Jogador[] = [];

  private readonly logger = new Logger(JogadoresService.name);

  async criarAtualizarJogador(criarJogadorDto: CriarJogadorDto): Promise<void> {
    const { email } = criarJogadorDto;

    const jogador = await this.jogadores.find(
      (jogador) => jogador.email === email,
    );

    if (jogador) {
      return await this.atualizar(jogador, criarJogadorDto);
    }

    await this.criar(criarJogadorDto);
  }

  async consultarTodosJogadores(): Promise<Jogador[]> {
    return await this.jogadores;
  }

  async consultarJogadorPorEmail(email: string): Promise<Jogador> {
    const jogador = await this.jogadores.find(
      (jogador) => jogador.email === email,
    );

    if (!jogador) throw new NotFoundException('Jogador não encontrado');

    return jogador;
  }

  async deletarJogador(email: string): Promise<void> {
    const jogadorEncontrado = await this.jogadores.find(
      (jogador) => jogador.email === email,
    );

    if (!jogadorEncontrado)
      throw new NotFoundException('Jogador não encontrado');

    this.jogadores = this.jogadores.filter(
      (jogador) => jogador.email !== email,
    );
  }

  private criar(criarJogadorDto: CriarJogadorDto): void {
    const { email, telefoneCelular, nome } = criarJogadorDto;

    const jogador: Jogador = {
      _id: uuidV4(),
      nome,
      telefoneCelular,
      email,
      posicaoRanking: 1,
      ranking: 'A',
      urlFotoJogador: '',
    };
    this.logger.log(
      `Service: Criando o jogador ${JSON.stringify(criarJogadorDto)}`,
    );
    this.jogadores.push(jogador);
  }

  private atualizar(
    jogadorEncontrado: Jogador,
    criarJogadorDto: CriarJogadorDto,
  ): void {
    const { nome } = criarJogadorDto;

    jogadorEncontrado.nome = nome;
  }
}

import { Injectable, Logger } from '@nestjs/common';
import { CriarJogadorDto } from './dtos/criar-jogador.dto';
import { Jogador } from './interfaces/jogador.interface';
import { v4 as uuidV4 } from 'uuid';

@Injectable()
export class JogadoresService {
  private jogadores: Jogador[] = [];

  private readonly logger = new Logger(JogadoresService.name);

  async criarAtualizarJogador(criarJogadorDto: CriarJogadorDto): Promise<void> {
    this.criar(criarJogadorDto);
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
}

import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JogadoresService } from 'src/jogadores/jogadores.service';
import { AtualizarCategoriaDto } from './dtos/atualizar-categoria.dto';
import { CriarCategoriaDto } from './dtos/criar-categoria.dto';
import { Categoria } from './interfaces/categorias.interface';

@Injectable()
export class CategoriasService {
  constructor(
    @InjectModel('Categoria')
    private readonly categoriaModel: Model<Categoria>,

    private readonly jogadoresService: JogadoresService,
  ) {}

  async criarCategoria(
    criarCategoriaDto: CriarCategoriaDto,
  ): Promise<Categoria> {
    const { categoria } = criarCategoriaDto;

    const hasCategoria = await this.categoriaModel.findOne({ categoria });

    if (hasCategoria) throw new BadRequestException('Categoria já existe');

    const newCategoria = new this.categoriaModel(criarCategoriaDto);

    return await newCategoria.save();
  }

  async consultarCategorias(): Promise<Categoria[]> {
    return await this.categoriaModel.find().populate('jogadores').exec();
  }

  async consultarCategoriaPeloId(categoria: string): Promise<Categoria> {
    const hasCategoria = await this.categoriaModel
      .findOne({ categoria })
      .exec();

    if (!hasCategoria) throw new BadRequestException('Categoria não existe');

    return hasCategoria;
  }

  async atualizarCategoria(
    categoria: string,
    atualizarCategoriaDto: AtualizarCategoriaDto,
  ): Promise<void> {
    const hasCategoria = await this.categoriaModel
      .findOne({ categoria })
      .exec();

    if (!hasCategoria) throw new BadRequestException('Categoria não existe');

    await this.categoriaModel
      .findOneAndUpdate({ categoria }, { $set: atualizarCategoriaDto })
      .exec();
  }

  async atribuirCategoriaJogador(params: string[]): Promise<void> {
    const categoria = params['categoria'];
    const idJogador = params['idJogador'];

    const hasCategoria = await this.categoriaModel
      .findOne({ categoria })
      .exec();

    await this.jogadoresService.consultarJogadorPeloId(idJogador);

    const jogadorJaCadastradoNaCategoria = await this.categoriaModel
      .find({ categoria })
      .where('jogadores')
      .in(idJogador)
      .exec();

    if (!hasCategoria) throw new BadRequestException('Categoria não existe');

    if (jogadorJaCadastradoNaCategoria)
      throw new BadRequestException('Jogador já cadastrado na categoria');

    hasCategoria.jogadores.push(idJogador);

    await this.categoriaModel
      .findOneAndUpdate(
        {
          categoria,
        },
        {
          $set: hasCategoria,
        },
      )
      .exec();
  }
}

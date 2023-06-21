import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Repository, FindOptionsWhere, ILike } from 'typeorm';
import {
  CreateCareerDto,
  UpdateCareerDto,
  FilterCareerDto,
  PaginationDto,
} from '@core/dto';

import { ServiceResponseHttpModel } from '@shared/models';
import { RepositoryEnum } from '@shared/enums';
import { ListaEntity } from '../entities/lista.entity';
import { InstitutionsService } from './institutions.service';
import { CataloguesService } from './catalogues.service';

@Injectable()
export class ListasService {
  constructor(
    @Inject(RepositoryEnum.LISTA_REPOSITORY)
    private listaRepository: Repository<ListaEntity>,
    private institutionService: InstitutionsService,
    private cataloguesService: CataloguesService
  ) {}

  async catalogue(): Promise<ServiceResponseHttpModel> {
    const response = await this.listaRepository.findAndCount({
      relations: ['institution', 'modality', 'state', 'type'],
      take: 1000,
    });

    return {
      pagination: {
        totalItems: response[1],
        limit: 10,
      },
      data: response[0],
    };
  }

  async create(payload: any): Promise<ServiceResponseHttpModel> {
    const newLista = this.listaRepository.create(payload);


    const listaCreated = await this.listaRepository.save(newLista);

    return { data: listaCreated };
  }

  async findAll(params?: FilterCareerDto): Promise<ServiceResponseHttpModel> {
    //Pagination & Filter by search
    if (params?.limit > 0 && params?.page >= 0) {
      return await this.paginateAndFilter(params);
    }

    //Filter by other field

    //All
    const data = await this.listaRepository.findAndCount({
      relations: ['institution', 'modality', 'state', 'type'],
    });

    return { pagination: { totalItems: data[1], limit: 10 }, data: data[0] };
  }

  async findOne(id: string): Promise<any> {
    const lista = await this.listaRepository.findOne({
      relations: ['institution', 'modality', 'state', 'type'],
      where: {
        id,
      },
    });

    if (!lista) {
      throw new NotFoundException(`La lista con el:  ${id} no se encontro`);
    }
    return { data: lista };
  }

  async update(
    id: string,
    payload: any,
  ): Promise<ServiceResponseHttpModel> {
    const lista = await this.listaRepository.findOneBy({ id });
    if (!lista) {
      throw new NotFoundException(`La lista con el id:  ${id} no se encontro`);
    }
    this.listaRepository.merge(lista, payload);
    const listaUpdated = await this.listaRepository.save(lista);
    return { data: listaUpdated };
  }

  async remove(id: string): Promise<ServiceResponseHttpModel> {
    const lista = await this.listaRepository.findOneBy({ id });

    if (!lista) {
      throw new NotFoundException(`La lista con el id:  ${id} no se encontro`);
    }

    const listaEliminada = await this.listaRepository.softRemove(lista);

    return { data: listaEliminada };
  }

  async removeAll(payload: any[]): Promise<ServiceResponseHttpModel> {
    const listasEliminada = await this.listaRepository.softRemove(payload);
    return { data: listasEliminada };
  }

  private async paginateAndFilter(
    params: FilterCareerDto,
  ): Promise<ServiceResponseHttpModel> {
    let where:
      | FindOptionsWhere<ListaEntity>
      | FindOptionsWhere<ListaEntity>[];
    where = {};
    let { page, search } = params;
    const { limit } = params;

    if (search) {
      search = search.trim();
      page = 0;
      where = [];
      where.push({ nombreLista: ILike(`%${search}%`) });
      where.push({ tipoLista: ILike(`%${search}%`) });
      where.push({ imagen: ILike(`%${search}%`) });
      where.push({ color: ILike(`%${search}%`) });
    }

    const response = await this.listaRepository.findAndCount({
      relations: ['institution', 'modality', 'state', 'type'],
      where,
      take: limit,
      skip: PaginationDto.getOffset(limit, page),
    });

    return {
      pagination: { limit, totalItems: response[1] },
      data: response[0],
    };
  }
}

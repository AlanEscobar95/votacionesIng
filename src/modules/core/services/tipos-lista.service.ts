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
import { TipoListaEntity } from '../entities/tipo-lista.entity';
import { InstitutionsService } from './institutions.service';
import { CataloguesService } from './catalogues.service';

@Injectable()
export class TiposListasService {
  constructor(
    @Inject(RepositoryEnum.TIPO_LISTA_REPOSITORY)
    private tipoListaRepository: Repository<TipoListaEntity>,
    private institutionService: InstitutionsService,
    private cataloguesService: CataloguesService
  ) {}

  async catalogue(): Promise<ServiceResponseHttpModel> {
    const response = await this.tipoListaRepository.findAndCount({
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
    const newTipolista = this.tipoListaRepository.create(payload);

    // newTipolista.institution = await this.institutionService.findOne(
    //   payload.institution.id,
    // );

    /*newTipolista.modality = await this.cataloguesService.findOne(
      payload.modality.id,
    );

    newTipolista.state = await this.cataloguesService.findOne(payload.state.id);

    newTipolista.type = await this.cataloguesService.findOne(payload.type.id);*/

    const careerCreated = await this.tipoListaRepository.save(newTipolista);

    return { data: careerCreated };
  }

  async findAll(params?: FilterCareerDto): Promise<ServiceResponseHttpModel> {
    //Pagination & Filter by search
    if (params?.limit > 0 && params?.page >= 0) {
      return await this.paginateAndFilter(params);
    }

    //Filter by other field

    //All
    const data = await this.tipoListaRepository.findAndCount({
      relations: ['institution', 'modality', 'state', 'type'],
    });

    return { pagination: { totalItems: data[1], limit: 10 }, data: data[0] };
  }

  async findOne(id: string): Promise<any> {
    const career = await this.tipoListaRepository.findOne({
      relations: ['institution', 'modality', 'state', 'type'],
      where: {
        id,
      },
    });

    if (!career) {
      throw new NotFoundException(`El tipo de lista con id:  ${id} no se encontro`);
    }
    return { data: career };
  }

  async update(
    id: string,
    payload: any,
  ): Promise<ServiceResponseHttpModel> {
    const career = await this.tipoListaRepository.findOneBy({ id });
    if (!career) {
      throw new NotFoundException(`El tipo de lista con id:  ${id} no se encontro`);
    }
    this.tipoListaRepository.merge(career, payload);
    const careerUpdated = await this.tipoListaRepository.save(career);
    return { data: careerUpdated };
  }

  async remove(id: string): Promise<ServiceResponseHttpModel> {
    const career = await this.tipoListaRepository.findOneBy({ id });

    if (!career) {
      throw new NotFoundException(`El tipo de lista con id:  ${id} no se encontro`);
    }

    const careerDeleted = await this.tipoListaRepository.softRemove(career);

    return { data: careerDeleted };
  }

  async removeAll(payload: TipoListaEntity[]): Promise<ServiceResponseHttpModel> {
    const careersDeleted = await this.tipoListaRepository.softRemove(payload);
    return { data: careersDeleted };
  }

  private async paginateAndFilter(
    params: FilterCareerDto,
  ): Promise<ServiceResponseHttpModel> {
    let where:
      | FindOptionsWhere<TipoListaEntity>
      | FindOptionsWhere<TipoListaEntity>[];
    where = {};
    let { page, search } = params;
    const { limit } = params;

    if (search) {
      search = search.trim();
      page = 0;
      where = [];
      where.push({ nombreTipoLista: ILike(`%${search}%`) });
    }

    const response = await this.tipoListaRepository.findAndCount({
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

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
import { CronogramaEntity } from '../entities/cronograma.entity';
import { InstitutionsService } from './institutions.service';
import { CataloguesService } from './catalogues.service';

@Injectable()
export class CronogramasService {
  constructor(
    @Inject(RepositoryEnum.CRONOGRAMA_REPOSITORY)
    private cronogramaRepository: Repository<CronogramaEntity>,
    private institutionService: InstitutionsService,
    private cataloguesService: CataloguesService
  ) {}

  async catalogue(): Promise<ServiceResponseHttpModel> {
    const response = await this.cronogramaRepository.findAndCount({
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
    const nuevoCronograma = this.cronogramaRepository.create(payload);

    // newCareer.institution = await this.institutionService.findOne(
    //   payload.institution.id,
    // );

    /*newCareer.modality = await this.cataloguesService.findOne(
      payload.modality.id,
    );

    newCareer.state = await this.cataloguesService.findOne(payload.state.id);

    newCareer.type = await this.cataloguesService.findOne(payload.type.id);*/

    const cronogramaCreado = await this.cronogramaRepository.save(nuevoCronograma);

    return { data: cronogramaCreado };
  }

  async findAll(params?: any): Promise<ServiceResponseHttpModel> {
    //Pagination & Filter by search
    if (params?.limit > 0 && params?.page >= 0) {
      return await this.paginateAndFilter(params);
    }

    //Filter by other field

    //All
    const data = await this.cronogramaRepository.findAndCount({
      relations: ['institution', 'modality', 'state', 'type'],
    });

    return { pagination: { totalItems: data[1], limit: 10 }, data: data[0] };
  }

  async findOne(id: string): Promise<any> {
    const cronograma = await this.cronogramaRepository.findOne({
      relations: ['institution', 'modality', 'state', 'type'],
      where: {
        id,
      },
    });

    if (!cronograma) {
      throw new NotFoundException(`El cronograma con el id:  ${id} no se encontro`);
    }
    return { data: cronograma};
  }

  async update(
    id: string,
    payload: any,
  ): Promise<ServiceResponseHttpModel> {
    const cronograma = await this.cronogramaRepository.findOneBy({ id });
    if (!cronograma) {
      throw new NotFoundException(`La carrera con id:  ${id} no se encontro`);
    }
    this.cronogramaRepository.merge(cronograma, payload);
    const cronogramaActualizado = await this.cronogramaRepository.save(cronograma);
    return { data: cronogramaActualizado };
  }

  async remove(id: string): Promise<ServiceResponseHttpModel> {
    const cronograma = await this.cronogramaRepository.findOneBy({ id });

    if (!cronograma) {
      throw new NotFoundException(`El cronograma con el id:  ${id} no se encontro`);
    }

    const cronogramaEliminado = await this.cronogramaRepository.softRemove(cronograma);

    return { data: cronogramaEliminado };
  }

  async removeAll(payload: CronogramaEntity[]): Promise<ServiceResponseHttpModel> {
    const cronogramasEliminados = await this.cronogramaRepository.softRemove(payload);
    return { data: cronogramasEliminados };
  }

  private async paginateAndFilter(
    params: FilterCareerDto, 
  ): Promise<ServiceResponseHttpModel> {
    let where:
      | FindOptionsWhere<CronogramaEntity>
      | FindOptionsWhere<CronogramaEntity>[];
    where = {};
    let { page, search } = params;
    const { limit } = params;

    if (search) {
      search = search.trim();
      page = 0;
      where = [];
      where.push({ nombreCronograma: ILike(`%${search}%`) });
      where.push({ encargadoCronograma: ILike(`%${search}%`) });
      where.push({ fechaInicio: ILike(`%${search}%`) });
      where.push({ fechaFinalizacion: ILike(`%${search}%`) });
      where.push({ periodoLectivo: ILike(`%${search}%`) });
    }

    const response = await this.cronogramaRepository.findAndCount({
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

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
import { PeriodoLectivoEntity } from '../entities/periodo-lectivo.entity';
import { InstitutionsService } from './institutions.service';
import { CataloguesService } from './catalogues.service';

@Injectable()
export class PeriodosLectivosService {
  constructor(
    @Inject(RepositoryEnum.PERIODO_LECTIVO_REPOSITORY)
    private periodoLectivoRepository: Repository<PeriodoLectivoEntity>,
    private institutionService: InstitutionsService,
    private cataloguesService: CataloguesService
  ) {}

  async catalogue(): Promise<ServiceResponseHttpModel> {
    const response = await this.periodoLectivoRepository.findAndCount({
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
    const nuevoPeriodo = this.periodoLectivoRepository.create(payload);

    // newCareer.institution = await this.institutionService.findOne(
    //   payload.institution.id,
    // );

    /*newCareer.modality = await this.cataloguesService.findOne(
      payload.modality.id,
    );

    newCareer.state = await this.cataloguesService.findOne(payload.state.id);

    newCareer.type = await this.cataloguesService.findOne(payload.type.id);*/

    const periodoCreado = await this.periodoLectivoRepository.save(nuevoPeriodo);

    return { data: periodoCreado };
  }

  async findAll(params?: any): Promise<ServiceResponseHttpModel> {
    //Pagination & Filter by search
    if (params?.limit > 0 && params?.page >= 0) {
      return await this.paginateAndFilter(params);
    }

    //Filter by other field

    //All
    const data = await this.periodoLectivoRepository.findAndCount({
      relations: ['institution', 'modality', 'state', 'type'],
    });

    return { pagination: { totalItems: data[1], limit: 10 }, data: data[0] };
  }

  async findOne(id: string): Promise<any> {
    const periodo = await this.periodoLectivoRepository.findOne({
      relations: ['institution', 'modality', 'state', 'type'],
      where: {
        id,
      },
    });

    if (!periodo) {
      throw new NotFoundException(`El periodo con el id:  ${id} no se encontro`);
    }
    return { data: periodo };
  }

  async update(
    id: string,
    payload: any,
  ): Promise<ServiceResponseHttpModel> {
    const periodo = await this.periodoLectivoRepository.findOneBy({ id });
    if (!periodo) {
      throw new NotFoundException(`El periodo con el id:  ${id} no se encontro`);
    }
    this.periodoLectivoRepository.merge(periodo, payload);
    const periodoActualizado = await this.periodoLectivoRepository.save(periodo);
    return { data: periodoActualizado };
  }

  async remove(id: string): Promise<ServiceResponseHttpModel> {
    const periodo = await this.periodoLectivoRepository.findOneBy({ id });

    if (!periodo) {
      throw new NotFoundException(`El periodo con el id:  ${id} no se encontro`);
    }

    const periodoEliminado= await this.periodoLectivoRepository.softRemove(periodo);

    return { data: periodoEliminado};
  }

  async removeAll(payload: PeriodoLectivoEntity[]): Promise<ServiceResponseHttpModel> {
    const periodosEliminados = await this.periodoLectivoRepository.softRemove(payload);
    return { data: periodosEliminados };
  }

  private async paginateAndFilter(
    params: FilterCareerDto,
  ): Promise<ServiceResponseHttpModel> {
    let where:
      | FindOptionsWhere<PeriodoLectivoEntity>
      | FindOptionsWhere<PeriodoLectivoEntity>[];
    where = {};
    let { page, search } = params;
    const { limit } = params;

    if (search) {
      search = search.trim();
      page = 0;
      where = [];
      where.push({ nombrePeriodo: ILike(`%${search}%`) });
    }

    const response = await this.periodoLectivoRepository.findAndCount({
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

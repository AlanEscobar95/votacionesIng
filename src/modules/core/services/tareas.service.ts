import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Repository, FindOptionsWhere, ILike } from 'typeorm';
import {
  CreateCareerDto,
  UpdateCareerDto,
  FilterCareerDto,
  PaginationDto,
} from '@core/dto';
import { TareaEntity } from '@core/entities';
import { ServiceResponseHttpModel } from '@shared/models';
import { RepositoryEnum } from '@shared/enums';
import { InstitutionsService } from './institutions.service';
import { CataloguesService } from './catalogues.service';

@Injectable()
export class TareasService {
  constructor(
    @Inject(RepositoryEnum.TAREA_REPOSITORY)
    private tareaRepository: Repository<TareaEntity>,
    private institutionService: InstitutionsService,
    private cataloguesService: CataloguesService
  ) {}

  async catalogue(): Promise<ServiceResponseHttpModel> {
    const response = await this.tareaRepository.findAndCount({
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
    const newtarea = this.tareaRepository.create(payload);

    // newtarea.institution = await this.institutionService.findOne(
    //   payload.institution.id,
    // );

    /*newtarea.modality = await this.cataloguesService.findOne(
      payload.modality.id,
    );

    newtarea.state = await this.cataloguesService.findOne(payload.state.id);

    newtarea.type = await this.cataloguesService.findOne(payload.type.id);*/

    const tareaCreated = await this.tareaRepository.save(newtarea);

    return { data: tareaCreated };
  }

  async findAll(params?: any): Promise<ServiceResponseHttpModel> {
    //Pagination & Filter by search
    if (params?.limit > 0 && params?.page >= 0) {
      return await this.paginateAndFilter(params);
    }

    //Filter by other field

    //All
    const data = await this.tareaRepository.findAndCount({
      relations: ['institution', 'modality', 'state', 'type'],
    });

    return { pagination: { totalItems: data[1], limit: 10 }, data: data[0] };
  }

  async findOne(id: string): Promise<any> {
    const tarea = await this.tareaRepository.findOne({
      relations: ['institution', 'modality', 'state', 'type'],
      where: {
        id,
      },
    });

    if (!tarea) {
      throw new NotFoundException(`La tarea con id:  ${id} no se encontro`);
    }
    return { data: tarea };
  }

  async update(
    id: string,
    payload: any,
  ): Promise<ServiceResponseHttpModel> {
    const tarea = await this.tareaRepository.findOneBy({ id });
    if (!tarea) {
      throw new NotFoundException(`La tarea con id:  ${id} no se encontro`);
    }
    this.tareaRepository.merge(tarea, payload);
    const tareaUpdated = await this.tareaRepository.save(tarea);
    return { data: tareaUpdated };
  }

  async remove(id: string): Promise<ServiceResponseHttpModel> {
    const tarea = await this.tareaRepository.findOneBy({ id });

    if (!tarea) {
      throw new NotFoundException(`La tarea con id:  ${id} no se encontro`);
    }

    const tareaDeleted = await this.tareaRepository.softRemove(tarea);

    return { data: tareaDeleted };
  }

  async removeAll(payload: TareaEntity[]): Promise<ServiceResponseHttpModel> {
    const tareasDeleted = await this.tareaRepository.softRemove(payload);
    return { data: tareasDeleted };
  }

  private async paginateAndFilter(
    params: any,
  ): Promise<ServiceResponseHttpModel> {
    let where:
      | FindOptionsWhere<TareaEntity>
      | FindOptionsWhere<TareaEntity>[];
    where = {};
    let { page, search } = params;
    const { limit } = params;

    if (search) {
      search = search.trim();
      page = 0;
      where = [];
      where.push({ nombreTarea: ILike(`%${search}%`) });
    }
    const response = await this.tareaRepository.findAndCount({
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

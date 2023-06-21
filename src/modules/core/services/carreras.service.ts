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
import { CarreraEntity } from '../entities/carrera.entity';
import { InstitutionsService } from './institutions.service';
import { CataloguesService } from './catalogues.service';

@Injectable()
export class CarrerasService {
  constructor(
    @Inject(RepositoryEnum.CARRERA_REPOSITORY)
    private carreraRepository: Repository<CarreraEntity>,
    private institutionService: InstitutionsService,
    private cataloguesService: CataloguesService
  ) {}

  async catalogue(): Promise<ServiceResponseHttpModel> {
    const response = await this.carreraRepository.findAndCount({
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
    const nuevaCarrera = this.carreraRepository.create(payload);

    // newCareer.institution = await this.institutionService.findOne(
    //   payload.institution.id,
    // );

    /*newCareer.modality = await this.cataloguesService.findOne(
      payload.modality.id,
    );

    newCareer.state = await this.cataloguesService.findOne(payload.state.id);

    newCareer.type = await this.cataloguesService.findOne(payload.type.id);*/

    const carreraCreada = await this.carreraRepository.save(nuevaCarrera);

    return { data: carreraCreada};
  }

  async findAll(params?: any): Promise<ServiceResponseHttpModel> {
    //Pagination & Filter by search
    if (params?.limit > 0 && params?.page >= 0) {
      return await this.paginateAndFilter(params);
    }

    //Filter by other field

    //All
    const data = await this.carreraRepository.findAndCount({
      relations: ['institution', 'modality', 'state', 'type'],
    });

    return { pagination: { totalItems: data[1], limit: 10 }, data: data[0] };
  }

  async findOne(id: string): Promise<any> {
    const carrera = await this.carreraRepository.findOne({
      relations: ['institution', 'modality', 'state', 'type'],
      where: {
        id,
      },
    });

    if (!carrera) {
      throw new NotFoundException(`La carrera con el id:  ${id} no se encontro`);
    }
    return { data: carrera };
  }

  async update(
    id: string,
    payload: any,
  ): Promise<ServiceResponseHttpModel> {
    const carrera = await this.carreraRepository.findOneBy({ id });
    if (!carrera) {
      throw new NotFoundException(`La carrera con el id:  ${id} no se encontro`);
    }
    this.carreraRepository.merge(carrera, payload);
    const carreraActualizada = await this.carreraRepository.save(carrera);
    return { data: carreraActualizada };
  }

  async remove(id: string): Promise<ServiceResponseHttpModel> {
    const carrera = await this.carreraRepository.findOneBy({ id });

    if (!carrera) {
      throw new NotFoundException(`La carrera con el id:  ${id} no se encontro`);
    }

    const carreraEliminada = await this.carreraRepository.softRemove(carrera);

    return { data: carreraEliminada };
  }

  async removeAll(payload: CarreraEntity[]): Promise<ServiceResponseHttpModel> {
    const carrerarsEliminadas = await this.carreraRepository.softRemove(payload);
    return { data: carrerarsEliminadas};
  }

  private async paginateAndFilter(
    params: FilterCareerDto,
  ): Promise<ServiceResponseHttpModel> {
    let where:
      | FindOptionsWhere<CarreraEntity>
      | FindOptionsWhere<CarreraEntity>[];
    where = {};
    let { page, search } = params;
    const { limit } = params;

    if (search) {
      search = search.trim();
      page = 0;
      where = [];
      where.push({ nombreCarrera: ILike(`%${search}%`) });
    }

    const response = await this.carreraRepository.findAndCount({
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

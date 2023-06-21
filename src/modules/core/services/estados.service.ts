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
import { EstadoEntity } from '../entities/estado.entity';
import { InstitutionsService } from './institutions.service';
import { CataloguesService } from './catalogues.service';

@Injectable()
export class EstadosService {
  constructor(
    @Inject(RepositoryEnum.ESTADO_REPOSITORY)
    private estadoRepository: Repository<EstadoEntity>,
    private institutionService: InstitutionsService,
    private cataloguesService: CataloguesService
  ) {}

  async catalogue(): Promise<ServiceResponseHttpModel> {
    const response = await this.estadoRepository.findAndCount({
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

  async create(payload:any): Promise<ServiceResponseHttpModel> {
    const nuevoEstado = this.estadoRepository.create(payload);

    // newCareer.institution = await this.institutionService.findOne(
    //   payload.institution.id,
    // );

    /*newCareer.modality = await this.cataloguesService.findOne(
      payload.modality.id,
    );

    newCareer.state = await this.cataloguesService.findOne(payload.state.id);

    newCareer.type = await this.cataloguesService.findOne(payload.type.id);*/

    const estadoCreado = await this.estadoRepository.save(nuevoEstado);

    return { data: estadoCreado };
  }

  async findAll(params?: any): Promise<ServiceResponseHttpModel> {
    //Pagination & Filter by search
    if (params?.limit > 0 && params?.page >= 0) {
      return await this.paginateAndFilter(params);
    }

    //Filter by other field

    //All
    const data = await this.estadoRepository.findAndCount({
      relations: ['institution', 'modality', 'state', 'type'],
    });

    return { pagination: { totalItems: data[1], limit: 10 }, data: data[0] };
  }

  async findOne(id: string): Promise<any> {
    const estado = await this.estadoRepository.findOne({
      relations: ['institution', 'modality', 'state', 'type'],
      where: {
        id,
      },
    });

    if (!estado) {
      throw new NotFoundException(`La carrera con id:  ${id} no se encontro`);
    }
    return { data: estado };
  }

  async update(
    id: string,
    payload: any,
  ): Promise<ServiceResponseHttpModel> {
    const estado = await this.estadoRepository.findOneBy({ id });
    if (!estado) {
      throw new NotFoundException(`El estado con el id:  ${id} no se encontro`);
    }
    this.estadoRepository.merge(estado, payload);
    const estadoActualizado = await this.estadoRepository.save(estado);
    return { data: estadoActualizado };
  }

  async remove(id: string): Promise<ServiceResponseHttpModel> {
    const estado = await this.estadoRepository.findOneBy({ id });

    if (!estado) {
      throw new NotFoundException(`El estado con el id:  ${id} no se encontro`);
    }

    const estadoEliminado = await this.estadoRepository.softRemove(estado);

    return { data: estadoEliminado };
  }

  async removeAll(payload: EstadoEntity[]): Promise<ServiceResponseHttpModel> {
    const estadosEliminados = await this.estadoRepository.softRemove(payload);
    return { data:estadosEliminados };
  }

  private async paginateAndFilter(
    params: FilterCareerDto,
  ): Promise<ServiceResponseHttpModel> {
    let where:
      | FindOptionsWhere<EstadoEntity>
      | FindOptionsWhere<EstadoEntity>[];
    where = {};
    let { page, search } = params;
    const { limit } = params;

    if (search) {
      search = search.trim();
      page = 0;
      where = [];
      where.push({ nombreEstado: ILike(`%${search}%`) });
    }

    const response = await this.estadoRepository.findAndCount({
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

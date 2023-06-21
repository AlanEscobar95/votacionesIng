import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import {
  CreateCareerDto,
  UpdateCareerDto,
  FilterCareerDto,
  PaginationDto,
} from '@core/dto';
import { ServiceResponseHttpModel } from '@shared/models';
import { RepositoryEnum } from '@shared/enums';
import { RolEntity } from '../entities/rol.entity';
import { CataloguesService } from './catalogues.service';
import { InstitutionsService } from './institutions.service';

@Injectable()
export class RolesService {
  constructor(
    @Inject(RepositoryEnum.ROL_REPOSITORY)
    private rolRepository: Repository<RolEntity>,
    private institutionService: InstitutionsService,
    private cataloguesService: CataloguesService
  ) {}

  async catalogue(): Promise<ServiceResponseHttpModel> {
    const response = await this.rolRepository.findAndCount({
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
    const nuevoRol = this.rolRepository.create(payload);

    // newCareer.institution = await this.institutionService.findOne(
    //   payload.institution.id,
    // );

    /*newCareer.modality = await this.cataloguesService.findOne(
      payload.modality.id,
    );

    newCareer.state = await this.cataloguesService.findOne(payload.state.id);

    newCareer.type = await this.cataloguesService.findOne(payload.type.id);*/

    const rolCreado = await this.rolRepository.save(nuevoRol);

    return { data: rolCreado };
  }

  async findAll(params?: any): Promise<ServiceResponseHttpModel> {
    //Pagination & Filter by search
    if (params?.limit > 0 && params?.page >= 0) {
      return await this.paginateAndFilter(params);
    }

    //Filter by other field

    //All
    const data = await this.rolRepository.findAndCount({
      relations: ['institution', 'modality', 'state', 'type'],
    });

    return { pagination: { totalItems: data[1], limit: 10 }, data: data[0] };
  }

  async findOne(id: string): Promise<any> {
    const rol = await this.rolRepository.findOne({
      relations: ['institution', 'modality', 'state', 'type'],
      where: {
        id,
      },
    });

    if (!rol) {
      throw new NotFoundException(`El rol con el id:  ${id} no se encontro`);
    }
    return { data: rol };
  }

  async update(
    id: string,
    payload: any,
  ): Promise<ServiceResponseHttpModel> {
    const rol = await this.rolRepository.findOneBy({ id });
    if (!rol) {
      throw new NotFoundException(`El rol con el id:  ${id} no se encontro`);
    }
    this.rolRepository.merge(rol, payload);
    const rolActualizado = await this.rolRepository.save(rol);
    return { data: rolActualizado };
  }

  async remove(id: string): Promise<ServiceResponseHttpModel> {
    const rol = await this.rolRepository.findOneBy({ id });

    if (!rol) {
      throw new NotFoundException(`El rol con el id:  ${id} no se encontro`);
    }

    const rolEliminado = await this.rolRepository.softRemove(rol);

    return { data: rolEliminado};
  }

  async removeAll(payload: RolEntity[]): Promise<ServiceResponseHttpModel> {
    const rolesEliminados = await this.rolRepository.softRemove(payload);
    return { data: rolesEliminados };
  }

  private async paginateAndFilter(
    params: FilterCareerDto,
  ): Promise<ServiceResponseHttpModel> {
    let where:
      | FindOptionsWhere<RolEntity>
      | FindOptionsWhere<RolEntity>[];
    where = {};
    let { page, search } = params;
    const { limit } = params;

    if (search) {
      search = search.trim();
      page = 0;
      where = [];
      where.push({ nombreRol: ILike(`%${search}%`) });
    }

    const response = await this.rolRepository.findAndCount({
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

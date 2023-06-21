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
import { CargoEntity } from '../entities/cargo.entity';
import { InstitutionsService } from './institutions.service';
import { CataloguesService } from './catalogues.service';

@Injectable()
export class CargosService {
  constructor(
    @Inject(RepositoryEnum.CARGO_REPOSITORY)
    private cargoRepository: Repository<CargoEntity>,
    private institutionService: InstitutionsService,
    private cataloguesService: CataloguesService
  ) {}

  async catalogue(): Promise<ServiceResponseHttpModel> {
    const response = await this.cargoRepository.findAndCount({
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
    const nuevoCargo = this.cargoRepository.create(payload);

    // newCareer.institution = await this.institutionService.findOne(
    //   payload.institution.id,
    // );

    /*newCareer.modality = await this.cataloguesService.findOne(
      payload.modality.id,
    );

    newCareer.state = await this.cataloguesService.findOne(payload.state.id);

    newCareer.type = await this.cataloguesService.findOne(payload.type.id);*/

    const cargoCreado = await this.cargoRepository.save(nuevoCargo);

    return { data: cargoCreado };
  }

  async findAll(params?: any): Promise<ServiceResponseHttpModel> {
    //Pagination & Filter by search
    if (params?.limit > 0 && params?.page >= 0) {
      return await this.paginateAndFilter(params);
    }

    //Filter by other field

    //All
    const data = await this.cargoRepository.findAndCount({
      relations: ['institution', 'modality', 'state', 'type'],
    });

    return { pagination: { totalItems: data[1], limit: 10 }, data: data[0] };
  }

  async findOne(id: string): Promise<any> {
    const cargo = await this.cargoRepository.findOne({
      relations: ['institution', 'modality', 'state', 'type'],
      where: {
        id,
      },
    });

    if (!cargo) {
      throw new NotFoundException(`El cargo con el id:  ${id} no se encontro`);
    }
    return { data: cargo };
  }

  async update(
    id: string,
    payload: any,
  ): Promise<ServiceResponseHttpModel> {
    const cargo = await this.cargoRepository.findOneBy({ id });
    if (!cargo) {
      throw new NotFoundException(`El cargo con el id:  ${id} no se encontro`);
    }
    this.cargoRepository.merge(cargo, payload);
    const cargoActualizado = await this.cargoRepository.save(cargo);
    return { data: cargoActualizado };
  }

  async remove(id: string): Promise<ServiceResponseHttpModel> {
    const cargo = await this.cargoRepository.findOneBy({ id });

    if (!cargo) {
      throw new NotFoundException(`El cargo con el id:  ${id} no se encontro`);
    }

    const cargoEliminado = await this.cargoRepository.softRemove(cargo);

    return { data: cargoEliminado };
  }

  async removeAll(payload: CargoEntity[]): Promise<ServiceResponseHttpModel> {
    const cargosEliminados = await this.cargoRepository.softRemove(payload);
    return { data: cargosEliminados };
  }

  private async paginateAndFilter(
    params: FilterCareerDto,
  ): Promise<ServiceResponseHttpModel> {
    let where:
      | FindOptionsWhere<CargoEntity>
      | FindOptionsWhere<CargoEntity>[];
    where = {};
    let { page, search } = params;
    const { limit } = params;

    if (search) {
      search = search.trim();
      page = 0;
      where = [];
      where.push({ nombreCargo: ILike(`%${search}%`) });
    }

    const response = await this.cargoRepository.findAndCount({
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

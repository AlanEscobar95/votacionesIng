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
import { CandidatoEntity } from '../entities/candidato.entity';
import { CataloguesService } from './catalogues.service';
import { InstitutionsService } from './institutions.service';

@Injectable()
export class CandidatosService {
  constructor(
    @Inject(RepositoryEnum.CANDIDATO_REPOSITORY)
    private candidatoRepository: Repository<CandidatoEntity>,
    private institutionService: InstitutionsService,
    private cataloguesService: CataloguesService
  ) {}

  async catalogue(): Promise<ServiceResponseHttpModel> {
    const response = await this.candidatoRepository.findAndCount({
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
    const nuevoCandidato = this.candidatoRepository.create(payload);

    // newCareer.institution = await this.institutionService.findOne(
    //   payload.institution.id,
    // );

    /*newCareer.modality = await this.cataloguesService.findOne(
      payload.modality.id,
    );

    newCareer.state = await this.cataloguesService.findOne(payload.state.id);

    newCareer.type = await this.cataloguesService.findOne(payload.type.id);*/

    const candidatoCreado = await this.candidatoRepository.save(nuevoCandidato);

    return { data: candidatoCreado };
  }

  async findAll(params?: any): Promise<ServiceResponseHttpModel> { //FilterCareerDto
    //Pagination & Filter by search
    if (params?.limit > 0 && params?.page >= 0) {
      return await this.paginateAndFilter(params);
    }

    //Filter by other field

    //All
    const data = await this.candidatoRepository.findAndCount({
      relations: ['institution', 'modality', 'state', 'type'],
    });

    return { pagination: { totalItems: data[1], limit: 10 }, data: data[0] };
  }

  async findOne(id: string): Promise<any> {
    const candidato = await this.candidatoRepository.findOne({
      relations: ['institution', 'modality', 'state', 'type'],
      where: {
        id,
      },
    });

    if (!candidato) {
      throw new NotFoundException(`El candidato con el id:  ${id} no se encontro`);
    }
    return { data: candidato };
  }

  async update(
    id: string,
    payload: any, //UpdateCareerDto,
  ): Promise<ServiceResponseHttpModel> {
    const candidato = await this.candidatoRepository.findOneBy({ id });
    if (!candidato) {
      throw new NotFoundException(`El candidato con el:  ${id} no se encontro`);
    }
    this.candidatoRepository.merge(candidato, payload);
    const candidatoActualizado = await this.candidatoRepository.save(candidato);
    return { data: candidatoActualizado };
  }

  async remove(id: string): Promise<ServiceResponseHttpModel> {
    const candidato = await this.candidatoRepository.findOneBy({ id });

    if (!candidato) {
      throw new NotFoundException(`El candidato con el id:  ${id} no se encontro`);
    }

    const candidatoEliminado = await this.candidatoRepository.softRemove(candidato);

    return { data: candidatoEliminado };
  }

  async removeAll(payload: CandidatoEntity[]): Promise<ServiceResponseHttpModel> {
    const candidatosEliminado = await this.candidatoRepository.softRemove(payload);
    return { data: candidatosEliminado };
  }

  private async paginateAndFilter(
    params: FilterCareerDto,
  ): Promise<ServiceResponseHttpModel> {
    let where:
      | FindOptionsWhere<CandidatoEntity>
      | FindOptionsWhere<CandidatoEntity>[];
    where = {};
    let { page, search } = params;
    const { limit } = params;

    if (search) {
      search = search.trim();
      page = 0;
      where = [];
      where.push({ nombre: ILike(`%${search}%`) });
      where.push({ apellido: ILike(`%${search}%`) });
      where.push({ carreraId: ILike(`%${search}%`) });
      where.push({ cargoId: ILike(`%${search}%`) });
    }

    const response = await this.candidatoRepository.findAndCount({
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

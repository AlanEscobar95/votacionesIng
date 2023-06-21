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
import { VotoEntity } from '../entities/voto.entity';
import { InstitutionsService } from './institutions.service';
import { CataloguesService } from './catalogues.service';

@Injectable()
export class VotosService {
  constructor(
    @Inject(RepositoryEnum.VOTO_REPOSITORY)
    private votoRepository: Repository<VotoEntity>,
    private institutionService: InstitutionsService,
    private cataloguesService: CataloguesService
  ) {}

  async catalogue(): Promise<ServiceResponseHttpModel> {
    const response = await this.votoRepository.findAndCount({
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
    const nuevoVoto = this.votoRepository.create(payload);

    // newCareer.institution = await this.institutionService.findOne(
    //   payload.institution.id,
    // );

   /* nuevoVoto.modality = await this.cataloguesService.findOne(
      payload.modality.id,
    );

    nuevoVoto.state = await this.cataloguesService.findOne(payload.state.id);

    nuevoVoto.type = await this.cataloguesService.findOne(payload.type.id);*/

    const votoCreado = await this.votoRepository.save(nuevoVoto);

    return { data: votoCreado };
  }

  async findAll(params?: any): Promise<ServiceResponseHttpModel> {
    //Pagination & Filter by search
    if (params?.limit > 0 && params?.page >= 0) {
      return await this.paginateAndFilter(params);
    }

    //Filter by other field

    //All
    const data = await this.votoRepository.findAndCount({
      relations: ['institution', 'modality', 'state', 'type'],
    });

    return { pagination: { totalItems: data[1], limit: 10 }, data: data[0] };
  }

  async findOne(id: string): Promise<any> {
    const voto = await this.votoRepository.findOne({
      relations: ['institution', 'modality', 'state', 'type'],
      where: {
        id,
      },
    });

    if (!voto) {
      throw new NotFoundException(`El voto con el id:  ${id} no se encontro`);
    }
    return { data: voto };
  }

  async update(
    id: string,
    payload: any,
  ): Promise<ServiceResponseHttpModel> {
    const voto = await this.votoRepository.findOneBy({ id });
    if (!voto) {
      throw new NotFoundException(`El voto con el id:  ${id} no se encontro`);
    }
    this.votoRepository.merge(voto, payload);
    const votoActualizado = await this.votoRepository.save(voto);
    return { data: votoActualizado };
  }

  async remove(id: string): Promise<ServiceResponseHttpModel> {
    const voto = await this.votoRepository.findOneBy({ id });

    if (!voto) {
      throw new NotFoundException(`El voto con el :  ${id} no se encontro`);
    }

    const votoELiminado = await this.votoRepository.softRemove(voto);

    return { data: votoELiminado };
  }

  async removeAll(payload: VotoEntity[]): Promise<ServiceResponseHttpModel> {
    const votosEliminados = await this.votoRepository.softRemove(payload);
    return { data: votosEliminados};
  }

  private async paginateAndFilter(
    params: FilterCareerDto,
  ): Promise<ServiceResponseHttpModel> {
    let where:
      | FindOptionsWhere<VotoEntity>
      | FindOptionsWhere<VotoEntity>[];
    where = {};
    let { page, search } = params;
    const { limit } = params;

    if (search) {
      search = search.trim();
      page = 0;
      where = [];
      where.push({ listaId: ILike(`%${search}%`) });
      where.push({ candidatoId: ILike(`%${search}%`) });
    }

    const response = await this.votoRepository.findAndCount({
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

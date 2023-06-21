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
import { UsuarioEntity } from '../entities/usuario.entity';
import { InstitutionsService } from './institutions.service';
import { CataloguesService } from './catalogues.service';

@Injectable()
export class UsuariosService {
  constructor(
    @Inject(RepositoryEnum.USUARIO_REPOSITORY)
    private usuarioRepository: Repository<UsuarioEntity>,
    private institutionService: InstitutionsService,
    private cataloguesService: CataloguesService
  ) {}

  async catalogue(): Promise<ServiceResponseHttpModel> {
    const response = await this.usuarioRepository.findAndCount({
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
    const nuevoUsuario = this.usuarioRepository.create(payload);

    // newCareer.institution = await this.institutionService.findOne(
    //   payload.institution.id,
    // );

    /*newCareer.modality = await this.cataloguesService.findOne(
      payload.modality.id,
    );

    newCareer.state = await this.cataloguesService.findOne(payload.state.id);

    newCareer.type = await this.cataloguesService.findOne(payload.type.id);*/

    const usuarioCreado= await this.usuarioRepository.save(nuevoUsuario);

    return { data: usuarioCreado };
  }

  async findAll(params?: any): Promise<ServiceResponseHttpModel> {
    //Pagination & Filter by search
    if (params?.limit > 0 && params?.page >= 0) {
      return await this.paginateAndFilter(params);
    }

    //Filter by other field

    //All
    const data = await this.usuarioRepository.findAndCount({
      relations: ['institution', 'modality', 'state', 'type'],
    });

    return { pagination: { totalItems: data[1], limit: 10 }, data: data[0] };
  }

  async findOne(id: string): Promise<any> {
    const usuario = await this.usuarioRepository.findOne({
      relations: ['institution', 'modality', 'state', 'type'],
      where: {
        id,
      },
    });

    if (!usuario) {
      throw new NotFoundException(`El usuario con el id:  ${id} no se encontro`);
    }
    return { data: usuario };
  }

  async update(
    id: string,
    payload: any,
  ): Promise<ServiceResponseHttpModel> {
    const usuario = await this.usuarioRepository.findOneBy({ id });
    if (!usuario) {
      throw new NotFoundException(`El usuario con el id:  ${id} no se encontro`);
    }
    this.usuarioRepository.merge(usuario, payload);
    const usuarioActualizado = await this.usuarioRepository.save(usuario);
    return { data: usuarioActualizado};
  }

  async remove(id: string): Promise<ServiceResponseHttpModel> {
    const usuario = await this.usuarioRepository.findOneBy({ id });

    if (!usuario) {
      throw new NotFoundException(`El usuario con el id:  ${id} no se encontro`);
    }

    const usuarioEliminado = await this.usuarioRepository.softRemove(usuario);

    return { data: usuarioEliminado};
  }

  async removeAll(payload: UsuarioEntity[]): Promise<ServiceResponseHttpModel> {
    const usuariosEliminados = await this.usuarioRepository.softRemove(payload);
    return { data: usuariosEliminados };
  }

  private async paginateAndFilter(
    params: FilterCareerDto,
  ): Promise<ServiceResponseHttpModel> {
    let where:
      | FindOptionsWhere<UsuarioEntity>
      | FindOptionsWhere<UsuarioEntity>[];
    where = {};
    let { page, search } = params;
    const { limit } = params;

    if (search) {
      search = search.trim();
      page = 0;
      where = [];
      where.push({ nombreUsuario: ILike(`%${search}%`) });
      where.push({ apellidoUsuario: ILike(`%${search}%`) });
      where.push({ cargoUsuario: ILike(`%${search}%`) });
    }

    const response = await this.usuarioRepository.findAndCount({
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

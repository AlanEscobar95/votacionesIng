import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CreateCareerDto, UpdateCareerDto, FilterCareerDto } from '@core/dto';
import { ResponseHttpModel } from '@shared/models';
import { RolEntity } from '../entities/rol.entity';
import { RolesService } from '../services/roles.service';

@ApiTags('Roles')
@Controller('roles')
export class RolesController {
  constructor(private rolesService: RolesService) {}

  @ApiOperation({ summary: 'Catalogo de Roles' })
  @Get('catalogue')
  @HttpCode(HttpStatus.OK)
  async catalogue(): Promise<ResponseHttpModel> {
    const serviceResponse = await this.rolesService.catalogue();

    return {
      data: serviceResponse.data,
      pagination: serviceResponse.pagination,
      message: `Catalogo de Roles Ej: Administrador, Candidatos,Votantes`,
      title: `Catalogo de Roles`,
    };
  }

  @ApiOperation({ summary: 'Crear Roles' })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() payload: any): Promise<ResponseHttpModel> {
    const serviceResponse = await this.rolesService.create(payload);

    return {
      data: serviceResponse.data,
      message: 'El rol a sido creado',
      title: 'Creación de Roles',
    };
  }

  @ApiOperation({ summary: 'Encontrar todos los roles' })
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() params: any): Promise<ResponseHttpModel> {
    const serviceResponse = await this.rolesService.findAll(params);

    return {
      data: serviceResponse.data,
      pagination: serviceResponse.pagination,
      message: 'Encontrar todos los roles',
      title: 'Exito',
    };
  }

  @ApiOperation({ summary: 'Encontrar un Rol' })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ResponseHttpModel> {
    const serviceResponse = await this.rolesService.findOne(id);

    return {
      data: serviceResponse.data,
      message: `Encontrar un Rol`,
      title: `Exito`,
    };
  }

  @ApiOperation({ summary: 'Actualizar Roles' })
  @Put(':id')
  @HttpCode(HttpStatus.CREATED)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() payload: any,
  ): Promise<ResponseHttpModel> {
    const serviceResponse = await this.rolesService.update(id, payload);
    return {
      data: serviceResponse.data,
      message: `Los roles fueron actualizados`,
      title: `Actualización de Roles`,
    };
  }

  @ApiOperation({ summary: 'Eliminacón de un rol' })
  @Delete(':id')
  @HttpCode(HttpStatus.CREATED)
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ResponseHttpModel> {
    const serviceResponse = await this.rolesService.remove(id);
    return {
      data: serviceResponse.data,
      message: `El rol a sido eliminado`,
      title: `Eliminación de Roles`,
    };
  }

  @ApiOperation({ summary: 'Eliminar todos los roles' })
  @Patch('remove-all')
  @HttpCode(HttpStatus.CREATED)
  async removeAll(@Body() payload: RolEntity[]): Promise<ResponseHttpModel> {
    const serviceResponse = await this.rolesService.removeAll(payload);

    return {
      data: serviceResponse.data,
      message: `Todos los roles fueron eliminados`,
      title: `Eliminación de todos los roles`,
    };
  }
}

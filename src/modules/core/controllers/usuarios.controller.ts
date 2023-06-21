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
import { UsuarioEntity } from '../entities/usuario.entity';
import { UsuariosService } from '../services/usuarios.service';

@ApiTags('Usuarios')
@Controller('usuarios')
export class UsuariosController {
  constructor(private usuariosService: UsuariosService) {}

  @ApiOperation({ summary: 'Catalogo de Usuarios' })
  @Get('catalogue')
  @HttpCode(HttpStatus.OK)
  async catalogue(): Promise<ResponseHttpModel> {
    const serviceResponse = await this.usuariosService.catalogue();

    return {
      data: serviceResponse.data,
      pagination: serviceResponse.pagination,
      message: `Catalogo de Usuarios`,
      title: `Catalogo de Usuarios`,
    };
  }

  @ApiOperation({ summary: 'Creación de Usuarios' })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() payload: any): Promise<ResponseHttpModel> {
    const serviceResponse = await this.usuariosService.create(payload);

    return {
      data: serviceResponse.data,
      message: 'El usuario fue creado',
      title: 'Creación de Usuario',
    };
  }

  @ApiOperation({ summary: 'Encontrar todos los usuarios' })
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() params: any): Promise<ResponseHttpModel> {
    const serviceResponse = await this.usuariosService.findAll(params);

    return {
      data: serviceResponse.data,
      pagination: serviceResponse.pagination,
      message: 'Encontrar todos los usuarios',
      title: 'Exito',
    };
  }

  @ApiOperation({ summary: 'Encontrar Usuario' })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ResponseHttpModel> {
    const serviceResponse = await this.usuariosService.findOne(id);

    return {
      data: serviceResponse.data,
      message: `Encontrar un solo usuario`,
      title: `Exito`,
    };
  }

  @ApiOperation({ summary: 'Actualizar Usuario' })
  @Put(':id')
  @HttpCode(HttpStatus.CREATED)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() payload: any,
  ): Promise<ResponseHttpModel> {
    const serviceResponse = await this.usuariosService.update(id, payload);
    return {
      data: serviceResponse.data,
      message: `El usuario a sido actualizado`,
      title: `Actualizar usuario`,
    };
  }

  @ApiOperation({ summary: 'Eliminar Usuario' })
  @Delete(':id')
  @HttpCode(HttpStatus.CREATED)
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ResponseHttpModel> {
    const serviceResponse = await this.usuariosService.remove(id);
    return {
      data: serviceResponse.data,
      message: `El usuario a sido eliminado`,
      title: `Eliminación de usuario`,
    };
  }

  @ApiOperation({ summary: 'Eliminar todos los usuarios' })
  @Patch('remove-all')
  @HttpCode(HttpStatus.CREATED)
  async removeAll(@Body() payload: UsuarioEntity[]): Promise<ResponseHttpModel> {
    const serviceResponse = await this.usuariosService.removeAll(payload);

    return {
      data: serviceResponse.data,
      message: `Los usuarios han sido eliminados`,
      title: `Eliminación de usuarios`,
    };
  }
}

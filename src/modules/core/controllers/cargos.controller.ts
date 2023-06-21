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
import { CargoEntity } from '../entities/cargo.entity';
import { CargosService } from '../services/cargos.service';


@ApiTags('Cargos')
@Controller('cargos')
export class CargosController {
  constructor(private cargosService: CargosService) {}

  @ApiOperation({ summary: 'Catalogo de Cargos' })
  @Get('catalogue')
  @HttpCode(HttpStatus.OK)
  async catalogue(): Promise<ResponseHttpModel> {
    const serviceResponse = await this.cargosService.catalogue();

    return {
      data: serviceResponse.data,
      pagination: serviceResponse.pagination,
      message: `Catalogo de Cargos`,
      title: `Catalogo de Cargos`,
    };
  }

  @ApiOperation({ summary: 'Crear Catalogos' })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() payload: any): Promise<ResponseHttpModel> {
    const serviceResponse = await this.cargosService.create(payload);

    return {
      data: serviceResponse.data,
      message: 'Cargo creado exitosamente',
      title: 'Cargo creado',
    };
  }

  @ApiOperation({ summary: 'Encontrar todos los cargos' })
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() params: any): Promise<ResponseHttpModel> {
    const serviceResponse = await this.cargosService.findAll(params);

    return {
      data: serviceResponse.data,
      pagination: serviceResponse.pagination,
      message: 'Encuentra todos los cargos',
      title: 'Exitoso',
    };
  }

  @ApiOperation({ summary: 'Encontrar un cargo' })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ResponseHttpModel> {
    const serviceResponse = await this.cargosService.findOne(id);

    return {
      data: serviceResponse.data,
      message: `Encontrar un cargo`,
      title: `Exito`,
    };
  }

  @ApiOperation({ summary: 'Actualizar Cargo' })
  @Put(':id')
  @HttpCode(HttpStatus.CREATED)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() payload: any,
  ): Promise<ResponseHttpModel> {
    const serviceResponse = await this.cargosService.update(id, payload);
    return {
      data: serviceResponse.data,
      message: `Cargo actualizado exitosamente`,
      title: `Cargo Actualizado`,
    };
  }

  @ApiOperation({ summary: 'Eliminar Cargo' })
  @Delete(':id')
  @HttpCode(HttpStatus.CREATED)
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ResponseHttpModel> {
    const serviceResponse = await this.cargosService.remove(id);
    return {
      data: serviceResponse.data,
      message: `Cargo eliminado exitosamente`,
      title: `Cargo Eliminado`,
    };
  }

  @ApiOperation({ summary: 'Eliminar todos los cargos' })
  @Patch('remove-all')
  @HttpCode(HttpStatus.CREATED)
  async removeAll(@Body() payload: CargoEntity[]): Promise<ResponseHttpModel> {
    const serviceResponse = await this.cargosService.removeAll(payload);

    return {
      data: serviceResponse.data,
      message: `Cargos eliminados exitosamente`,
      title: `Cargos Eliminados`,
    };
  }
}

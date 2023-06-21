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
import { ListasService } from '../services/listas.service';
import { ListaEntity } from '../entities/lista.entity';

@ApiTags('Listas')
@Controller('listas')
export class ListasController {
  constructor(private listasService: ListasService) {}

  @ApiOperation({ summary: 'Catalogo de Listas' })
  @Get('catalogue')
  @HttpCode(HttpStatus.OK)
  async catalogue(): Promise<ResponseHttpModel> {
    const serviceResponse = await this.listasService.catalogue();

    return {
      data: serviceResponse.data,
      pagination: serviceResponse.pagination,
      message: `Catalogo de Listas`,
      title: `Catalogo de Listas`,
    };
  }

  @ApiOperation({ summary: 'Crear Listas' })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() payload: any): Promise<ResponseHttpModel> {
    const serviceResponse = await this.listasService.create(payload);

    return {
      data: serviceResponse.data,
      message: 'La lista a sido creada',
      title: 'Creacion de Lista',
    };
  }

  @ApiOperation({ summary: 'Encontrar todas las listas' })
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() params: any): Promise<ResponseHttpModel> {
    const serviceResponse = await this.listasService.findAll(params);

    return {
      data: serviceResponse.data,
      pagination: serviceResponse.pagination,
      message: 'Encontrar todas las listas',
      title: 'Exito',
    };
  }

  @ApiOperation({ summary: 'Encontrar una Lista' })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ResponseHttpModel> {
    const serviceResponse = await this.listasService.findOne(id);

    return {
      data: serviceResponse.data,
      message: `Encontrar una Lista`,
      title: `Exito`,
    };
  }

  @ApiOperation({ summary: 'Actualizar Lista' })
  @Put(':id')
  @HttpCode(HttpStatus.CREATED)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() payload: any,
  ): Promise<ResponseHttpModel> {
    const serviceResponse = await this.listasService.update(id, payload);
    return {
      data: serviceResponse.data,
      message: `Lista Actualizada`,
      title: `Actualizacion de Lista`,
    };
  }

  @ApiOperation({ summary: 'Eliminar Lista' })
  @Delete(':id')
  @HttpCode(HttpStatus.CREATED)
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ResponseHttpModel> {
    const serviceResponse = await this.listasService.remove(id);
    return {
      data: serviceResponse.data,
      message: `La Lista a sido eliminada`,
      title: `Eliminación de Lista`,
    };
  }

  @ApiOperation({ summary: 'Eliminar todas las listas' })
  @Patch('remove-all')
  @HttpCode(HttpStatus.CREATED)
  async removeAll(@Body() payload: ListaEntity[]): Promise<ResponseHttpModel> {
    const serviceResponse = await this.listasService.removeAll(payload);

    return {
      data: serviceResponse.data,
      message: `Las listas han sido eliminadas`,
      title: `Eliminación de Listas`,
    };
  }
}

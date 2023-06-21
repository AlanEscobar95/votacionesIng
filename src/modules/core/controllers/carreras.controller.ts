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
import { CarreraEntity } from '../entities/carrera.entity';
import { CarrerasService } from '../services/carreras.service';

@ApiTags('Carreras')
@Controller('carreras')
export class CarrerasController {
  constructor(private carrerasService: CarrerasService) {}

  @ApiOperation({ summary: 'Catalogo de Carreras' })
  @Get('catalogue')
  @HttpCode(HttpStatus.OK)
  async catalogue(): Promise<ResponseHttpModel> {
    const serviceResponse = await this.carrerasService.catalogue();

    return {
      data: serviceResponse.data,
      pagination: serviceResponse.pagination,
      message: `Catalogo de Carreras`,
      title: `Catalgo de Carreras`,
    };
  }

  @ApiOperation({ summary: 'Crear Carreras' })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() payload: any): Promise<ResponseHttpModel> {
    const serviceResponse = await this.carrerasService.create(payload);

    return {
      data: serviceResponse.data,
      message: 'Carrera creada exitosamente',
      title: 'Carrera Creada',
    };
  }

  @ApiOperation({ summary: 'Encontrar todas las carreras' })
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() params: any): Promise<ResponseHttpModel> {
    const serviceResponse = await this.carrerasService.findAll(params);

    return {
      data: serviceResponse.data,
      pagination: serviceResponse.pagination,
      message: 'Encontrar todas las carreras',
      title: 'Exitoso',
    };
  }

  @ApiOperation({ summary: 'Econtrar Carrera' })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ResponseHttpModel> {
    const serviceResponse = await this.carrerasService.findOne(id);

    return {
      data: serviceResponse.data,
      message: `Encontrar una Carrera`,
      title: `Exitoso`,
    };
  }

  @ApiOperation({ summary: 'Actualizar Carrera' })
  @Put(':id')
  @HttpCode(HttpStatus.CREATED)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() payload: any,
  ): Promise<ResponseHttpModel> {
    const serviceResponse = await this.carrerasService.update(id, payload);
    return {
      data: serviceResponse.data,
      message: `Carrera Actualizada`,
      title: `Actualizar Carrera`,
    };
  }

  @ApiOperation({ summary: 'Eliminar Carrera' })
  @Delete(':id')
  @HttpCode(HttpStatus.CREATED)
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ResponseHttpModel> {
    const serviceResponse = await this.carrerasService.remove(id);
    return {
      data: serviceResponse.data,
      message: `Carrera Eliminada`,
      title: `Eliminar Carrera`,
    };
  }

  @ApiOperation({ summary: 'Eliminar Carreras' })
  @Patch('remove-all')
  @HttpCode(HttpStatus.CREATED)
  async removeAll(@Body() payload: CarreraEntity[]): Promise<ResponseHttpModel> {
    const serviceResponse = await this.carrerasService.removeAll(payload);

    return {
      data: serviceResponse.data,
      message: `Carreras Eliminadas`,
      title: `Eliminar Carreras`,
    };
  }
}

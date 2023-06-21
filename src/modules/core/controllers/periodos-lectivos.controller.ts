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
import { PeriodoLectivoEntity } from '../entities/periodo-lectivo.entity';
import { PeriodosLectivosService } from '../services/periodos-lectivos.service';


@ApiTags('Peridos')
@Controller('periodos')
export class PeriodosLectivosController {
  constructor(private periodosLectivosService: PeriodosLectivosService) {}

  @ApiOperation({ summary: 'Catalogo de Periodos Lectivos' })
  @Get('catalogue')
  @HttpCode(HttpStatus.OK)
  async catalogue(): Promise<ResponseHttpModel> {
    const serviceResponse = await this.periodosLectivosService.catalogue();

    return {
      data: serviceResponse.data,
      pagination: serviceResponse.pagination,
      message: `Catalogo de Periodos Lectivos`,
      title: `Catalogo de Periodos Lectivos`,
    };
  }

  @ApiOperation({ summary: 'Crear Periodos Lectivos' })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() payload: any): Promise<ResponseHttpModel> {
    const serviceResponse = await this.periodosLectivosService.create(payload);

    return {
      data: serviceResponse.data,
      message: 'Creacion de Periodos Lectivos',
      title: 'Periodos Lectivos creados',
    };
  }

  @ApiOperation({ summary: 'Encontrar todos los periodos lectivos' })
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() params: any): Promise<ResponseHttpModel> {
    const serviceResponse = await this.periodosLectivosService.findAll(params);

    return {
      data: serviceResponse.data,
      pagination: serviceResponse.pagination,
      message: 'Encontrar todos los periodos lectivos',
      title: 'Exito',
    };
  }

  @ApiOperation({ summary: 'Encontrar Carrera' })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ResponseHttpModel> {
    const serviceResponse = await this.periodosLectivosService.findOne(id);

    return {
      data: serviceResponse.data,
      message: `Encontrar un periodo lectivo`,
      title: `Exito`,
    };
  }

  @ApiOperation({ summary: 'Actualizar una lista' })
  @Put(':id')
  @HttpCode(HttpStatus.CREATED)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() payload: any,
  ): Promise<ResponseHttpModel> {
    const serviceResponse = await this.periodosLectivosService.update(id, payload);
    return {
      data: serviceResponse.data,
      message: `El periodo lectivo fue actualizado`,
      title: `Actualizacion de Periodo Lectivo`,
    };
  }

  @ApiOperation({ summary: 'Eliminación de Periodo Lectivo' })
  @Delete(':id')
  @HttpCode(HttpStatus.CREATED)
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ResponseHttpModel> {
    const serviceResponse = await this.periodosLectivosService.remove(id);
    return {
      data: serviceResponse.data,
      message: `El periodo lectivo fue eliminado`,
      title: `Eliminación de Periodo Lectivo`,
    };
  }

  @ApiOperation({ summary: 'Borrar todos los periodos lectivos' })
  @Patch('remove-all')
  @HttpCode(HttpStatus.CREATED)
  async removeAll(@Body() payload: PeriodoLectivoEntity[]): Promise<ResponseHttpModel> {
    const serviceResponse = await this.periodosLectivosService.removeAll(payload);

    return {
      data: serviceResponse.data,
      message: `Los periodos lectivos fueron eliminados`,
      title: `Eliminación de todos los periodos lectivos`,
    };
  }
}

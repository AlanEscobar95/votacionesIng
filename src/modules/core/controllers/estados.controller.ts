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
import { EstadoEntity } from '../entities/estado.entity';
import { EstadosService } from '../services/estados.service';

@ApiTags('Estados')
@Controller('estados')
export class EstadosController {
  constructor(private estadosService: EstadosService) {}

  @ApiOperation({ summary: 'Catalogo de Estados' })
  @Get('catalogue')
  @HttpCode(HttpStatus.OK)
  async catalogue(): Promise<ResponseHttpModel> {
    const serviceResponse = await this.estadosService.catalogue();

    return {
      data: serviceResponse.data,
      pagination: serviceResponse.pagination,
      message: `Catalogo de Estados`,
      title: `Catalogo de Estados`,
    };
  }

  @ApiOperation({ summary: 'Crear Estados' })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() payload: any): Promise<ResponseHttpModel> {
    const serviceResponse = await this.estadosService.create(payload);

    return {
      data: serviceResponse.data,
      message: 'Estados creados',
      title: 'Creacion de Estados',
    };
  }

  @ApiOperation({ summary: 'Encontrar todos los estados' })
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() params: any): Promise<ResponseHttpModel> {
    const serviceResponse = await this.estadosService.findAll(params);

    return {
      data: serviceResponse.data,
      pagination: serviceResponse.pagination,
      message: 'Encontrar todos los estados',
      title: 'Exitoso',
    };
  }

  @ApiOperation({ summary: 'Encontrar Estado' })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ResponseHttpModel> {
    const serviceResponse = await this.estadosService.findOne(id);

    return {
      data: serviceResponse.data,
      message: `Encontrar Estado`,
      title: `Exito`,
    };
  }

  @ApiOperation({ summary: 'Actualizar Estado' })
  @Put(':id')
  @HttpCode(HttpStatus.CREATED)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() payload: any,
  ): Promise<ResponseHttpModel> {
    const serviceResponse = await this.estadosService.update(id, payload);
    return {
      data: serviceResponse.data,
      message: `Estado actualizado`,
      title: `Actualizar Estado`,
    };
  }

  @ApiOperation({ summary: 'Eliminar Estado' })
  @Delete(':id')
  @HttpCode(HttpStatus.CREATED)
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ResponseHttpModel> {
    const serviceResponse = await this.estadosService.remove(id);
    return {
      data: serviceResponse.data,
      message: `Estado eliminado`,
      title: `Eliminar Estados`,
    };
  }

  @ApiOperation({ summary: 'Eliminar Estados' })
  @Patch('remove-all')
  @HttpCode(HttpStatus.CREATED)
  async removeAll(@Body() payload: EstadoEntity[]): Promise<ResponseHttpModel> {
    const serviceResponse = await this.estadosService.removeAll(payload);

    return {
      data: serviceResponse.data,
      message: `Eliminar todos los estados`,
      title: `Eliminar estados`,
    };
  }
}

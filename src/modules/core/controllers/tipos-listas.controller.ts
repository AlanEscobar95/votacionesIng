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
import { TipoListaEntity } from '../entities/tipo-lista.entity';
import { TiposListasService } from '../services/tipos-lista.service';

@ApiTags('Tipos de Listas')
@Controller('tipos-listas')
export class TiposListasController {
  constructor(private tiposListasService: TiposListasService) {}

  @ApiOperation({ summary: 'Catalogo del tipo de listas' })
  @Get('catalogue')
  @HttpCode(HttpStatus.OK)
  async catalogue(): Promise<ResponseHttpModel> {
    const serviceResponse = await this.tiposListasService.catalogue();

    return {
      data: serviceResponse.data,
      pagination: serviceResponse.pagination,
      message: `Catalogo del tipo de listas Ej: Docentes,Alumnos`,
      title: `Catalogo de los tipos de listas`,
    };
  }

  @ApiOperation({ summary: 'Creación de Tipos de Listas' })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() payload: any): Promise<ResponseHttpModel> {
    const serviceResponse = await this.tiposListasService.create(payload);

    return {
      data: serviceResponse.data,
      message: 'Tipo de Lista creada',
      title: 'Creación de Tipo de Lista',
    };
  }

  @ApiOperation({ summary: 'Encontrar todas los tipos de listas' })
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() params: any): Promise<ResponseHttpModel> {
    const serviceResponse = await this.tiposListasService.findAll(params);

    return {
      data: serviceResponse.data,
      pagination: serviceResponse.pagination,
      message: 'Encontrar todas los tipos de listas',
      title: 'Exito',
    };
  }

  @ApiOperation({ summary: 'Encontrar un tipo de lista' })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ResponseHttpModel> {
    const serviceResponse = await this.tiposListasService.findOne(id);

    return {
      data: serviceResponse.data,
      message: `Encontrar un tipo de lista`,
      title: `Exito`,
    };
  }

  @ApiOperation({ summary: 'Actualizar Tipo de Lista' })
  @Put(':id')
  @HttpCode(HttpStatus.CREATED)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() payload: any,
  ): Promise<ResponseHttpModel> {
    const serviceResponse = await this.tiposListasService.update(id, payload);
    return {
      data: serviceResponse.data,
      message: `El tipo de lista a sido actualizado`,
      title: `Actualización de tipo de lista`,
    };
  }

  @ApiOperation({ summary: 'Eliminar un tipo de lista' })
  @Delete(':id')
  @HttpCode(HttpStatus.CREATED)
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ResponseHttpModel> {
    const serviceResponse = await this.tiposListasService.remove(id);
    return {
      data: serviceResponse.data,
      message: `Tipo de lista eliminada`,
      title: `Eliminación de un solo tipo de lista`,
    };
  }

  @ApiOperation({ summary: 'Eliminar todos los tipos de listas' })
  @Patch('remove-all')
  @HttpCode(HttpStatus.CREATED)
  async removeAll(@Body() payload: TipoListaEntity[]): Promise<ResponseHttpModel> {
    const serviceResponse = await this.tiposListasService.removeAll(payload);

    return {
      data: serviceResponse.data,
      message: `Eliminación de todos los tipos de lista`,
      title: `Eliminar todos los tipos de lista`,
    };
  }
}

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
import { CronogramaEntity } from '../entities/cronograma.entity';
import { CronogramasService } from '../services/cronogramas.service';

@ApiTags('Cronogramas')
@Controller('cronogramas')
export class CronogramasController {
  constructor(private cronogramasService: CronogramasService) {}

  @ApiOperation({ summary: 'Catalogo de Carreras' })
  @Get('catalogue')
  @HttpCode(HttpStatus.OK)
  async catalogue(): Promise<ResponseHttpModel> {
    const serviceResponse = await this.cronogramasService.catalogue();

    return {
      data: serviceResponse.data,
      pagination: serviceResponse.pagination,
      message: `Catalogo de Carreras`,
      title: `Catalogo de Carreras`,
    };
  }

  @ApiOperation({ summary: 'Crear Cronograma' })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() payload: any): Promise<ResponseHttpModel> {
    const serviceResponse = await this.cronogramasService.create(payload);

    return {
      data: serviceResponse.data,
      message: 'Crear Cronograma exitosamente',
      title: 'Crear Cronograma',
    };
  }

  @ApiOperation({ summary: 'Encontrar todos los Cronogramas' })
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() params: any): Promise<ResponseHttpModel> {
    const serviceResponse = await this.cronogramasService.findAll(params);

    return {
      data: serviceResponse.data,
      pagination: serviceResponse.pagination,
      message: 'Encontrar todos los Cronogramas',
      title: 'Exitoso',
    };
  }

  @ApiOperation({ summary: 'Encontrar Cronograma' })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ResponseHttpModel> {
    const serviceResponse = await this.cronogramasService.findOne(id);

    return {
      data: serviceResponse.data,
      message: `Encontrar un Cronograma`,
      title: `Exito`,
    };
  }

  @ApiOperation({ summary: 'Actualizar Cronograma' })
  @Put(':id')
  @HttpCode(HttpStatus.CREATED)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() payload: any,
  ): Promise<ResponseHttpModel> {
    const serviceResponse = await this.cronogramasService.update(id, payload);
    return {
      data: serviceResponse.data,
      message: `Cronogroma actualizado`,
      title: `Actualizar Cronograma`,
    };
  }

  @ApiOperation({ summary: 'Eliminar Cronograma' })
  @Delete(':id')
  @HttpCode(HttpStatus.CREATED)
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ResponseHttpModel> {
    const serviceResponse = await this.cronogramasService.remove(id);
    return {
      data: serviceResponse.data,
      message: `El cronograma a sido eliminado`,
      title: `Eliminar Cronograma`,
    };
  }

  @ApiOperation({ summary: 'Eliminar Cronogramas' })
  @Patch('remove-all')
  @HttpCode(HttpStatus.CREATED)
  async removeAll(@Body() payload: CronogramaEntity[]): Promise<ResponseHttpModel> {
    const serviceResponse = await this.cronogramasService.removeAll(payload);

    return {
      data: serviceResponse.data,
      message: `Los cronogramas han sido eliminados`,
      title: `Cronogramas Eliminados`,
    };
  }
}

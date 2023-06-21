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
import { CandidatoEntity} from '@core/entities';
import { ResponseHttpModel } from '@shared/models';
import { CandidatosService } from '../services/candidatos.service';

@ApiTags('Candidatos')
@Controller('candidatos')
export class CandidatosController {
  constructor(private candidatosService: CandidatosService) {}

  @ApiOperation({ summary: 'Catalogo de Candidatos' })
  @Get('catalogue')
  @HttpCode(HttpStatus.OK)
  async catalogue(): Promise<ResponseHttpModel> {
    const serviceResponse = await this.candidatosService.catalogue();

    return {
      data: serviceResponse.data,
      pagination: serviceResponse.pagination,
      message: `Catalogo de Candidatos`,
      title: `Catalogo de Candidatos`,
    };
  }

  @ApiOperation({ summary: 'Crear Candidatos' })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() payload: any): Promise<ResponseHttpModel> { 
    const serviceResponse = await this.candidatosService.create(payload);

    return {
      data: serviceResponse.data,
      message: 'Candidato creado exitosamente',
      title: 'Crear Candidato',
    };
  }

  @ApiOperation({ summary: 'Encontrar todos los candidatos' })
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() params: any): Promise<ResponseHttpModel> {
    const serviceResponse = await this.candidatosService.findAll(params);

    return {
      data: serviceResponse.data,
      pagination: serviceResponse.pagination,
      message: 'Encontrar todos los candidatos',
      title: 'Exito',
    };
  }

  @ApiOperation({ summary: 'Encontrar Candidatos' })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ResponseHttpModel> {
    const serviceResponse = await this.candidatosService.findOne(id);

    return {
      data: serviceResponse.data,
      message: `Encontrar Candidato`,
      title: `Exito`,
    };
  }

  @ApiOperation({ summary: 'Actualizar Candidato' })
  @Put(':id')
  @HttpCode(HttpStatus.CREATED)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() payload: any,
  ): Promise<ResponseHttpModel> {
    const serviceResponse = await this.candidatosService.update(id, payload);
    return {
      data: serviceResponse.data,
      message: `Candidato Actualizado`,
      title: `Actualizar Candidato`,
    };
  }

  @ApiOperation({ summary: 'Eliminar Candidato' })
  @Delete(':id')
  @HttpCode(HttpStatus.CREATED)
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ResponseHttpModel> {
    const serviceResponse = await this.candidatosService.remove(id);
    return {
      data: serviceResponse.data,
      message: `Candidato Eliminado`,
      title: `Eliminar Candidato`,
    };
  }

  @ApiOperation({ summary: 'Eliminar Todos los Candidatos' })
  @Patch('remove-all')
  @HttpCode(HttpStatus.CREATED)
  async removeAll(@Body() payload: CandidatoEntity[]): Promise<ResponseHttpModel> {
    const serviceResponse = await this.candidatosService.removeAll(payload);

    return {
      data: serviceResponse.data,
      message: `Todos los candidatos han sido eliminados`,
      title: `Candidatos Eliminados`,
    };
  }
}

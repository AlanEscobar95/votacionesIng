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
import { VotosService } from '../services/votos.service';
import { VotoEntity } from '../entities/voto.entity';

@ApiTags('Votos')
@Controller('votos')
export class VotosController {
  constructor(private votosService: VotosService) {}

  @ApiOperation({ summary: 'Catalogo de Votos' })
  @Get('catalogue')
  @HttpCode(HttpStatus.OK)
  async catalogue(): Promise<ResponseHttpModel> {
    const serviceResponse = await this.votosService.catalogue();

    return {
      data: serviceResponse.data,
      pagination: serviceResponse.pagination,
      message: `Catalogo de Votos Ej: Lista #1 = 1 , Nulo = 2`,
      title: `Catalogo de Votos`,
    };
  }

  @ApiOperation({ summary: 'Creación de Votos' })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() payload: any): Promise<ResponseHttpModel> {
    const serviceResponse = await this.votosService.create(payload);

    return {
      data: serviceResponse.data,
      message: 'El voto a sido creado',
      title: 'Creación de Votos',
    };
  }

  @ApiOperation({ summary: 'Encontrar todos los votos' })
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() params: any): Promise<ResponseHttpModel> {
    const serviceResponse = await this.votosService.findAll(params);

    return {
      data: serviceResponse.data,
      pagination: serviceResponse.pagination,
      message: 'Encontrar todos los votos',
      title: 'Exito',
    };
  }

  @ApiOperation({ summary: 'Encontrar Voto' })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ResponseHttpModel> {
    const serviceResponse = await this.votosService.findOne(id);

    return {
      data: serviceResponse.data,
      message: `Encontrar un voto`,
      title: `Exito`,
    };
  }

  @ApiOperation({ summary: 'Actualizar Voto' })
  @Put(':id')
  @HttpCode(HttpStatus.CREATED)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() payload: any,
  ): Promise<ResponseHttpModel> {
    const serviceResponse = await this.votosService.update(id, payload);
    return {
      data: serviceResponse.data,
      message: `El voto a sido actualizado`,
      title: `Actualización de Voto`,
    };
  }

  @ApiOperation({ summary: 'Eliminar Voto' })
  @Delete(':id')
  @HttpCode(HttpStatus.CREATED)
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ResponseHttpModel> {
    const serviceResponse = await this.votosService.remove(id);
    return {
      data: serviceResponse.data,
      message: `El voto a sido eliminado`,
      title: `Eliminación de voto`,
    };
  }

  @ApiOperation({ summary: 'Eliminar todos los votos' })
  @Patch('remove-all')
  @HttpCode(HttpStatus.CREATED)
  async removeAll(@Body() payload: VotoEntity[]): Promise<ResponseHttpModel> {
    const serviceResponse = await this.votosService.removeAll(payload);

    return {
      data: serviceResponse.data,
      message: `Los votos han sido eliminados`,
      title: `Eliminación de todos los votos`,
    };
  }
}

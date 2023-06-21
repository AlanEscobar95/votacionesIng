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
import { TareaEntity } from '../entities/tarea.entity';
import { TareasService } from '../services/tareas.service';

@ApiTags('Tareas')
@Controller('tareas')
export class TareasController {
  constructor(private tareasService: TareasService) {}

  @ApiOperation({ summary: 'Catalogo de Tareas' })
  @Get('catalogue')
  @HttpCode(HttpStatus.OK)
  async catalogue(): Promise<ResponseHttpModel> {
    const serviceResponse = await this.tareasService.catalogue();

    return {
      data: serviceResponse.data,
      pagination: serviceResponse.pagination,
      message: `Catalogo de Tareas`,
      title: `Catalogo de Tareas`,
    };
  }

  @ApiOperation({ summary: 'Creación de Tareas' })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() payload: any): Promise<ResponseHttpModel> {
    const serviceResponse = await this.tareasService.create(payload);

    return {
      data: serviceResponse.data,
      message: 'Tarea crada',
      title: 'Cración de Tareas',
    };
  }

  @ApiOperation({ summary: 'Encontrar todas las tareas' })
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() params: any): Promise<ResponseHttpModel> {
    const serviceResponse = await this.tareasService.findAll(params);

    return {
      data: serviceResponse.data,
      pagination: serviceResponse.pagination,
      message: 'Encontrar todas las tareas',
      title: 'Exito',
    };
  }

  @ApiOperation({ summary: 'Encontrar Tarea' })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ResponseHttpModel> {
    const serviceResponse = await this.tareasService.findOne(id);

    return {
      data: serviceResponse.data,
      message: `Tarea Encontrada`,
      title: `Exito`,
    };
  }

  @ApiOperation({ summary: 'Actualizar Tarea' })
  @Put(':id')
  @HttpCode(HttpStatus.CREATED)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() payload: any,
  ): Promise<ResponseHttpModel> {
    const serviceResponse = await this.tareasService.update(id, payload);
    return {
      data: serviceResponse.data,
      message: `La tarea a sido actualizada`,
      title: `Actualización de Tarea`,
    };
  }

  @ApiOperation({ summary: 'Eliminar Tarea' })
  @Delete(':id')
  @HttpCode(HttpStatus.CREATED)
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ResponseHttpModel> {
    const serviceResponse = await this.tareasService.remove(id);
    return {
      data: serviceResponse.data,
      message: `La tarea a sido eliminada`,
      title: `Eliminación de Tarea`,
    };
  }

  @ApiOperation({ summary: 'Eliminar todas las tareas' })
  @Patch('remove-all')
  @HttpCode(HttpStatus.CREATED)
  async removeAll(@Body() payload: TareaEntity[]): Promise<ResponseHttpModel> {
    const serviceResponse = await this.tareasService.removeAll(payload);

    return {
      data: serviceResponse.data,
      message: `Las tareas han sido eliminadas`,
      title: `Eliminación de todas las tareas`,
    };
  }
}

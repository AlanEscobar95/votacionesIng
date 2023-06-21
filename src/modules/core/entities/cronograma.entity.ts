/*==================CRONOGRAMA-ENTITY==============*/
import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
  } from 'typeorm';
  
  @Entity('cronogramas', { schema: 'core' })
  export class CronogramaEntity {
    /* Metodos */
    @CreateDateColumn({
      name: 'created_at',
      type: 'timestamptz',
      default: () => 'CURRENT_TIMESTAMP',
      comment: 'Fecha de creacion del candidato',
      })
      createdAt: Date;
    
    @UpdateDateColumn({
      name: 'updated_at', // Nombre de la columna en la base de datos
      type: 'timestamptz',
      default: () => 'CURRENT_TIMESTAMP',
      comment: 'Fecha de actualizacion de los candidatos',
    })
    updatedAt: Date;

    @DeleteDateColumn({
        name: 'deleted_at',
        type: 'timestamptz',
        default: () => 'CURRENT_TIMESTAMP',
        comment: 'Fecha en la que se elimina el candidato',
      })
      deleteAt: Date;
    /* Fin Metodos */

    /* Definicion de campos de la tabla */
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
  
    /*Campo Nombre del Cronograma*/
    @Column({
        name: 'nombre',
        type: 'varchar',
        comment: 'Nombre del Cronograma',
      })
      nombreCronograma: string;


      /*Campo Nombre del Cronograma*/
    @Column({
        name: 'encargado',
        type: 'varchar',
        comment: 'Nombre del Encargado de realizar las tareas',
      })
      encargadoCronograma: string;

      /*Campo FechaInicio*/
    @Column({
        name: 'fecha_inicio',
        type: 'date',
        comment: 'Nombre del Canditado a postularse',
      })
      fechaInicio: string;

      /*Campo Fecha de Finalización*/
    @Column({
        name: 'fecha_finalizacion',
        type: 'date',
        comment: 'Fecha de finalizacion del cronograma',
      })
      fechaFinalizacion: string;

      /*Campo Periodo Lectivo*/
      @Column({
        name: 'periodo_lectivo',
        type: 'date',
        comment: 'Periodo Lectivo al que pertenece el cronograma',
      })
      periodoLectivo: string;
      
  }
  
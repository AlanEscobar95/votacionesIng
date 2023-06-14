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
    @PrimaryGeneratedColumn() /*('uuid') Permite crear un id alfanúmerico*/ 
    id: string;
  
  
    /*Campo Nombre del Cronograma*/
    @Column({
        name: 'nombre_cronograma',
        type: 'varchar',
        comment: 'Nombre del Cronograma',
      })
      nombreCronograma: string;


      /*Campo Nombre del Cronograma*/
    @Column({
        name: 'encargado_cronograma',
        type: 'varchar',
        comment: 'Nombre del Canditado a postularse',
      })
      encargadoCronograma: string;

      /*Campo fechaIni*/
    @Column({
        name: 'fechaIni_cronograma',
        type: 'date',
        comment: 'Nombre del Canditado a postularse',
      })
      fechaIniCronograma: string;

      /*Campo fechaFin*/
    @Column({
        name: 'fechaFin_cronograma',
        type: 'date',
        comment: 'Fecha de finalizacion del cronograma',
      })
      fechaFinCronograma: string;
      
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
  
  }
  
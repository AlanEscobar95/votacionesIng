/*==================CARRERA-ENTITY==============*/
import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
  } from 'typeorm';
  
  @Entity('carreras', { schema: 'core' })
    export class CarreraEntity {
      @PrimaryGeneratedColumn('uuid')
      id: string;
  
      /*Metodos*/
      @CreateDateColumn({
        name: 'created_at',
        type: 'timestamptz',
        default: () => 'CURRENT_TIMESTAMP',
        comment: 'Fecha de creación del carrera',
        })
        createdAt: Date;
      
      @UpdateDateColumn({
        name: 'updated_at', // Nombre de la columna en la base de datos
        type: 'timestamptz',
        default: () => 'CURRENT_TIMESTAMP',
        comment: 'Fecha de actualizaciòn de los carrera',
      })
      updatedAt: Date;
  
      @DeleteDateColumn({
          name: 'deleted_at',
          type: 'timestamptz',
          default: () => 'CURRENT_TIMESTAMP',
          comment: 'Fecha en la que se elimina el carrera',
        })
        deleteAt: Date;
      /*Fin Metodos*/
      
      /*Declaracion de campos de la tabla*/
      /*Campo Nombre del Carrera*/
      @Column({
          name: 'nombre_carrera',
          type: 'varchar',
          comment: 'Nombre de la carrera',
        })
        nombreCarrera: string;
  }
  
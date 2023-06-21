/*==================ROL-ENTITY==============*/
import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
  } from 'typeorm';
  
  @Entity('roles', { schema: 'core' })
    export class RolEntity {

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
    
    
      /*Campo Nombre del Rol*/
      @Column({
          name: 'nombre_rol',
          type: 'varchar',
          comment: 'Nombre del Rol',
        })
        nombreRol: string;
  
  }
  
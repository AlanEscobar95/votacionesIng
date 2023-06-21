/*==================ESRADO-ENTITY==============*/
import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
  } from 'typeorm';
  
  @Entity('estados', { schema: 'core' })
  export class EstadoEntity {
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
  
  
    /*Campo Nombre del Estado*/
    @Column({
        name: 'nombre_estado',
        type: 'varchar',
        comment: 'Nombre del Estado',
      })
      nombreEstado: string;
  }
  
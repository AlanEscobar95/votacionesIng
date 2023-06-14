/*==================TIPO-LISTA-ENTITY==============*/
import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
  } from 'typeorm';
  
  @Entity('tipos_listas', { schema: 'core' })
  export class TipoListaEntity {
    @PrimaryGeneratedColumn() /*('uuid') Permite crear un id alfanúmerico*/ 
    id: string;
  
  
    /*Campo Nombre de los tipos de Listas*/
    @Column({
        name: 'nombre_tipo_lista',
        type: 'varchar',
        comment: 'Nombre de los tipos de Listas',
      })
      nombreTipoLista: string;

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
  
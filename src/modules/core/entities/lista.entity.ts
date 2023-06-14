/*==================LISTAS-ENTITY==============*/
import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
  } from 'typeorm';
  
  @Entity('listas', { schema: 'core' })
  export class ListaEntity {
    @PrimaryGeneratedColumn() /*('uuid') Permite crear un id alfanúmerico*/ 
    id: string;
  
  
    /*Campo Nombre de la lista*/
    @Column({
        name: 'nombre_lista',
        type: 'varchar',
        comment: 'Nombre de la lista',
      })
      nombreLista: string;
    
      /*Campo Tipo de Lista*/
      @Column({
        name: 'tipo_lista',
        type: 'varchar',
        comment: 'Tipo del Lista',
      })
      TipoLista: string;

      /*Campo de la imagen de la Lista*/
    @Column({
        name: 'imagen',
        type: 'character varying',
        comment: 'Imagen de la lista',
      })
      imagen: string;

      /*Campo Color de la Lista*/
      @Column({
        name: 'color',
        type: 'varchar',
        comment: 'Color de la Lista',
      })
      color: string;
      
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
  
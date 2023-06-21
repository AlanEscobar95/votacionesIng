/*==================VOTO-ENTITY==============*/
import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
  } from 'typeorm';
  
  @Entity('votos', { schema: 'core' })
  export class VotoEntity {
    /*Metodos*/
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
  
    /*Fin de Metodos*/
    
    /*Declaracion de los campos de la tabla*/
    @PrimaryGeneratedColumn('uuid') 
    id: string;
 
    /*Campo Id de la tabla Listas*/
    @Column({
        name: 'lista_id',
        type: 'varchar',
        comment: 'Id de la tabla Listas',
      })
      listaId: string;

      /*Campo Id de la tabla Candidatos*/
    @Column({
        name: 'candidato_id',
        type: 'varchar',
        comment: 'Id de la tabla Candidatos',
      })
      candidatoId: string;
  }

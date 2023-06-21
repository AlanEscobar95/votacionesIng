/*==================CANDIDATO-ENTITY==============*/
import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
  } from 'typeorm';
  
  @Entity('candidatos', { schema: 'core' })
  export class CandidatoEntity {
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
      comment: 'Fecha de actualizacion del candidato',
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
    
    /* Declaracion de campos de la tabla */
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    /*Campo Nombre del Canditado*/
    @Column({
        name: 'nombre_candidato',
        type: 'varchar',
        comment: 'Nombre del Canditado a postularse',
      })
      nombre: string;

     /*Campo Apellido del Candidato*/
     @Column({
        name: 'apellido_candidato',
        type: 'varchar',
        length:50,
        comment: 'Apellido del candidato a postularse',
      })
      apellido: string;
      
     /*Campo Cargo del Candidato*/
    @Column({
      name: 'cargo_id',
      type: 'int',
      comment: 'Cargo del candidato dentro de la lista',
    })
    cargoId: string;

    /*Campo carrera del Candidato*/
    @Column({
        name: 'carrera_id',
        type: 'int',
        comment: 'Carrera que se encuentra cursando el candidato de lista',
      })
      carreraId: string;
  }
  
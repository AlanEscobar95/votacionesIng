/*==================TIPO-USUARIO-ENTITY==============*/
import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
  } from 'typeorm';
  
  @Entity('tipos_usuarios', { schema: 'core' })
  export class TipoUsuarioEntity {
    @PrimaryGeneratedColumn() /*('uuid') Permite crear un id alfanúmerico*/ 
    id: string;
  
  
    /*Campo Nombre del tipo de usuario*/
    @Column({
        name: 'nombre_tipo_usuario',
        type: 'varchar',
        comment: 'Nombre del Tipo Usuario',
      })
      nombreTipoUsuario: string;

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
  
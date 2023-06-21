/*==================USUARIO-ENTITY==============*/
import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
  } from 'typeorm';
  
  @Entity('usuarios', { schema: 'core' })
  export class UsuarioEntity {
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
    /*Fin de Metodos */

    /*Declaracion de campos de la tabla*/
    @PrimaryGeneratedColumn('uuid') 
    id: string;
  
  
    /*Campo Nombre de los usuarios*/
    @Column({
        name: 'nombre_usuario',
        type: 'varchar',
        comment: 'Nombre de los usuarios',
      })
      nombreUsuario: string;

      /*Campo Apellido de los usuarios*/
    @Column({
        name: 'apellido_usuario',
        type: 'varchar',
        comment: 'Apellido de los usuarios',
      })
      apellidoUsuario: string;
      
      /*Campo de tipo de usuario*/
    @Column({
        name: 'cargo',
        type: 'varchar',
        comment: 'Cargo de los usuarios',
      })
      cargoUsuario: string;
}
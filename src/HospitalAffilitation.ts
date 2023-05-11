import { PrimaryGeneratedColumn, Column, Entity, BaseEntity, ManyToOne, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";

@Entity()
export class hospitalAffilitation extends BaseEntity {
    @PrimaryGeneratedColumn()
    dateOfAffilitation!: Date;
    
    }

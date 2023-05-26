import { PrimaryGeneratedColumn, Column, Entity, BaseEntity, ManyToOne, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { Prescription } from "./Prescription";

@Entity()
export class Drug extends BaseEntity {

    @PrimaryGeneratedColumn()
    id!: number
    
    @Column("varchar", { length: 200 })
    drugName!: string
   
    @Column("varchar", { length: 200 })
    sideEffects!: string
    
    @Column("varchar", { length: 200 })
    benefits!: string

    @Column("int", {unique: true })
    prescriptionId!: number

    @OneToMany(() => Prescription, prescription => prescription.drug)
    prescription!: Prescription[];    
    
}

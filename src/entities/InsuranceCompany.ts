import { PrimaryGeneratedColumn, Column, Entity, BaseEntity, ManyToOne, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { Patient } from "./Patient";

@Entity()
export class InsuranceCompany extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number
    
    @Column("varchar", { length: 200 })
    insuranceCompanyName!: string
   
    @Column("varchar", { length: 50 })
    insuranceCompanyPhone!: string

    @Column("int", { unique: true })
    patientId!: number

    @OneToMany(() => Patient, patient => patient.insuranceCompany)
    patients!: Patient[];
    
}

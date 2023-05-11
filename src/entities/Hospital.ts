import { PrimaryGeneratedColumn, Column, Entity, BaseEntity, ManyToOne, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToMany } from "typeorm";
import { Doctor } from "./Doctor";
import { DoctorHistory } from "./DoctorHistory";

@Entity()
export class Hospital extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number
    
    @Column("varchar", { length: 50 })
    hospitalName!: string
   
    @Column("varchar", { length: 200 })
    address!: string
    
    @Column("varchar", { length: 50 })
    phone!: string

    @Column("int", { unique: true })
    doctorId!: number

    @Column("int", { unique: true })
    doctorHistoryId!: number

    @OneToMany(() => Doctor, doctor => doctor.hospitals)
    doctors!: Doctor[]

    @OneToMany(() => DoctorHistory, doctorHistory => doctorHistory.hospitals)
    doctorHistory!: DoctorHistory[]
    
}

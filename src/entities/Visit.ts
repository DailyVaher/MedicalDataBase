import { PrimaryGeneratedColumn, Column, Entity, BaseEntity, OneToMany, CreateDateColumn, UpdateDateColumn, OneToOne, ManyToOne } from "typeorm";
import { Patient } from "./Patient";
import { Doctor } from "./Doctor";

@Entity()
export class Visit extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number

    @Column("int", { unique: true })
    patientId!: number
    
    @Column("int", { unique: true })
    doctorId!: number
   
    @Column("{type: 'number', nullable: true}")
    dateOfVisit!: number

    @Column("varchar", { length: 200, nullable: true})
    initialVisit!: boolean

    @Column("varchar", { length: 200, nullable: true})
    followUpVisit!: boolean

    @Column("varchar", { length: 200, nullable: true})
    routineVisit!: boolean

    @Column("varchar", { length: 200, nullable: true})
    homeVisit!: boolean

    @Column("varchar", { length: 200, nullable: true})
    symptoms!: string
    
    @Column("varchar", { length: 200, nullable: true})
    diagnosis!: string

    @Column("varchar", { length: 200, nullable: true})
    treatmentInstructions!: string

    @ManyToOne(() => Patient, patient => patient.visits)
    patient!: Patient

    @ManyToOne(() => Doctor, doctor => doctor.visits)
    doctor!: Doctor
    
}

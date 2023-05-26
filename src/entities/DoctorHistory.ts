import { Entity, PrimaryColumn, Column, BaseEntity, ManyToOne } from "typeorm"
import { Doctor } from "./Doctor"
import { Patient } from "./Patient"

@Entity()
export class DoctorHistory extends BaseEntity {

  @PrimaryColumn({type: "bigint"})
  startDate!: number

  @Column("int", { unique: true })
  doctorId!: number

  @Column("int", { unique: true })
  hospitalId!: number

  @Column({type: "bigint", nullable: true})
  endDate!: number | undefined  

  @Column("varchar", { length: 200, nullable: true })
  reasonForLeaving!: string 

  @ManyToOne(() => Doctor, doctor => doctor.doctorHistory)
  doctor!: Doctor

  @ManyToOne(() => Patient, patient => patient.doctorHistory)
  patient!: Patient

}
  

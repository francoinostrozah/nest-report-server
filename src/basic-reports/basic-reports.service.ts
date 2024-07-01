import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { PrismaClient, continents } from '@prisma/client';
import { PrinterService } from 'src/printer/printer.service';
import {
  getCountriesReport,
  getEmploymentLetter,
  getEmploymentLetterById,
  getHelloWorldReport,
} from 'src/reports';

@Injectable()
export class BasicReportsService extends PrismaClient implements OnModuleInit {
  constructor(private readonly printerService: PrinterService) {
    super();
  }

  async onModuleInit() {
    await this.$connect();
  }

  hello() {
    const docDefinition = getHelloWorldReport({ name: 'Hoid' });

    return this.printerService.createPdf(docDefinition);
  }

  employmentLetter() {
    const docDefinition = getEmploymentLetter();

    return this.printerService.createPdf(docDefinition);
  }

  async employmentLetterById(employeeId: number) {
    const employee = await this.employees.findUnique({
      where: { id: employeeId },
    });

    if (!employee) {
      throw new NotFoundException(`Employee with id ${employeeId} not found`);
    }

    const docDefinition = getEmploymentLetterById({
      employerName: 'Hoid',
      employerPosition: 'Gerente de RRHH',
      employeeName: employee.name,
      employeePosition: employee.position,
      employeeStartDate: employee.start_date,
      employeeHours: employee.hours_per_day,
      employeeWorkSchedule: employee.work_schedule,
      employerCompany: 'Tucan Code Corp.',
    });

    return this.printerService.createPdf(docDefinition);
  }

  async getCountriesReport(continent: continents) {
    const countries = await this.countries.findMany({
      where: { local_name: { not: null }, continent: continent },
    });
    const docDefinition = getCountriesReport({ countries });

    return this.printerService.createPdf(docDefinition);
  }
}

import { Response } from 'express';
import { Controller, Get, Param, Res } from '@nestjs/common';
import { continents } from '@prisma/client';
import { BasicReportsService } from './basic-reports.service';

@Controller('basic-reports')
export class BasicReportsController {
  constructor(private readonly basicReportsService: BasicReportsService) {}

  @Get()
  hello(@Res() response: Response) {
    const pdfDoc = this.basicReportsService.hello();

    response.setHeader('Content-Type', 'application/jpdf');

    pdfDoc.pipe(response);
    pdfDoc.end();
  }

  @Get('employment-letter')
  employmentLetter(@Res() response: Response) {
    const pdfDoc = this.basicReportsService.employmentLetter();

    response.setHeader('Content-Type', 'application/jpdf');
    pdfDoc.info.Title = 'Employment-Letter';
    pdfDoc.pipe(response);
    pdfDoc.end();
  }

  @Get('employment-letter/:employeeId')
  async employmentLetterById(
    @Res() response: Response,
    @Param('employeeId') employeeId: string,
  ) {
    const pdfDoc =
      await this.basicReportsService.employmentLetterById(+employeeId);

    response.setHeader('Content-Type', 'application/jpdf');
    pdfDoc.info.Title = 'Employment-Letter';
    pdfDoc.pipe(response);
    pdfDoc.end();
  }

  @Get('countries/:continent')
  async getCountriesReport(
    @Res() response: Response,
    @Param('continent') continent: continents,
  ) {
    const pdfDoc = await this.basicReportsService.getCountriesReport(continent);

    response.setHeader('Content-Type', 'application/jpdf');
    pdfDoc.info.Title = 'Countries-report';
    pdfDoc.pipe(response);
    pdfDoc.end();
  }
}

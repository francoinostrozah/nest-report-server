import { Content, ContextPageSize } from 'pdfmake/interfaces';

export const footerSection = (
  currentPage: number,
  pageCount: number,
  pageSize: ContextPageSize,
): Content => {
  return {
    text: `Página ${currentPage.toString()} of ${pageCount}`,
    alignment: 'right',
    margin: [0, 10, 35, 0],
    style: {
      bold: true,
      fontSize: 12,
    },
  };
};

import type {
  Content,
  StyleDictionary,
  TDocumentDefinitions,
} from 'pdfmake/interfaces';
import { CurrencyFormatter, DateFormatter } from 'src/helpers';

export interface CompleteOrder {
  order_id: number;
  customer_id: number;
  order_date: Date;
  customers: Customers;
  order_details: OrderDetail[];
}

export interface Customers {
  customer_id: number;
  customer_name: string;
  contact_name: string;
  address: string;
  city: string;
  postal_code: string;
  country: string;
}

export interface OrderDetail {
  order_detail_id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  products: Products;
}

export interface Products {
  product_id: number;
  product_name: string;
  category_id: number;
  unit: string;
  price: string;
}

interface ReportOptions {
  title?: string;
  subTitle?: string;
  data: CompleteOrder;
}

const logo: Content = {
  image: 'src/assets/tucan-banner.png',
  width: 100,
  height: 30,
  margin: [10, 20],
};

const styles: StyleDictionary = {
  header: {
    fontSize: 20,
    bold: true,
    margin: [0, 30, 0, 0],
  },
  subHeader: {
    fontSize: 16,
    bold: true,
    margin: [0, 20, 0, 0],
  },
};

export const getOrderReport = (
  options: ReportOptions,
): TDocumentDefinitions => {
  const { title, subTitle, data } = options;
  const { customers, order_details, order_id, order_date } = data;

  const subTotal = order_details.reduce(
    (acc, detail) => acc + +detail.products.price * detail.quantity,
    0,
  );

  const total = subTotal * 1.15;

  const docDefinition: TDocumentDefinitions = {
    styles: styles,
    header: logo,
    pageMargins: [40, 60, 40, 60],
    content: [
      {
        text: 'Tucan Code',
        style: 'header',
      },

      {
        columns: [
          {
            text: '15 Montgomery Str, Suite 100, \nOttawa ON K2Y 9X1, CANADA \n BN: 12783671823 \n https://devtalles.com',
          },
          {
            text: [
              {
                text: `Recibo N° ${order_id} \n`,
                bold: true,
              },
              `Fecha del recibo: ${DateFormatter.getDDMMMMYYYY(order_date)} \nPagar antes de: ${DateFormatter.getDDMMMMYYYY(new Date())}\n`,
            ],
            alignment: 'right',
          },
        ],
      },

      { qr: 'https://devtalles.com', fit: 75, alignment: 'right' },

      {
        text: [
          {
            text: 'Cobrar a: \n',
            bold: true,
            style: 'subHeader',
          },
          `Razón Social: ${customers.customer_name}
          Contacto: ${customers.contact_name}`,
        ],
      },

      {
        layout: 'headerLineOnly',
        margin: [0, 20],
        table: {
          headerRows: 1,
          widths: [50, '*', 'auto', 'auto', 'auto'],
          body: [
            ['ID', 'Descripción', 'Cantidad', 'Precio', 'Total'],
            ...order_details.map((detail) => [
              detail.order_detail_id.toString(),
              detail.products.product_name,
              detail.quantity.toString(),
              {
                text: CurrencyFormatter.formatterCurrency(
                  +detail.products.price,
                ),
                aligment: 'right',
              },
              {
                text: CurrencyFormatter.formatterCurrency(
                  +detail.products.price * detail.quantity,
                ),
                aligment: 'right',
              },
            ]),
          ],
        },
      },

      '\n\n',

      {
        columns: [
          {
            width: '*',
            text: '',
          },
          {
            width: 'auto',
            layout: 'noBorders',
            table: {
              body: [
                [
                  'Subtotal',
                  {
                    text: CurrencyFormatter.formatterCurrency(subTotal),
                    alignment: 'right',
                    bold: true,
                  },
                ],
                [
                  'Total',
                  {
                    text: CurrencyFormatter.formatterCurrency(total),
                    alignment: 'right',
                    bold: true,
                  },
                ],
              ],
            },
          },
        ],
      },
    ],
  };

  return docDefinition;
};

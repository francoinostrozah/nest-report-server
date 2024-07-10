export class CurrencyFormatter {
  static formatterCurrency(value: number): string {
    return Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  }
}

export class DateParser {
  public static parseDate = (
    timestamp: number | string | Date,
    timeZone = 'America/Sao_Paulo'
  ): string => {
    const date = new Date(timestamp)
    const dateString = date.toLocaleDateString('pt-BR', {
      timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })

    const dateValues = dateString.split('/')
    const [, month, year] = dateValues

    const dateId = year + month
    return dateId
  }
}

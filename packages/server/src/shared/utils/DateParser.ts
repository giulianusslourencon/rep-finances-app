export default class DateParser {

  public static parseDate = (timestamp: number, timeZone = 'America/Sao_Paulo') => {
    const date = new Date(timestamp)
    const dateString = date.toLocaleDateString('pt-BR', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' })

    const dateValues = dateString.split('/')
    const [month, _day, year] = dateValues

    const dateId = year + month
    return dateId
  }

}
export function getISODateStr(date) {
    return date.toISOString().substring(0, 10)
}
export function getEndDate(startDateStr, days) {
    const date = new Date(startDateStr);
    const endDate = new Date(date.setDate(date.getDate() + days));
    return getISODateStr(endDate);
}
export function getDaysBetweenDates(fromDate, toDate) {
    const difference = toDate.getTime() - fromDate.getTime();
    return Math.ceil(difference / (1000 * 3600 * 24));
}
export function getAge(birthDate) {
    const currentDate = new Date();
    const age = currentDate.getFullYear() - birthDate.getFullYear();
    return age - comareMonthDay(currentDate.getMonth(), currentDate.getDate(),
    birthDate.getMonth(), birthDate.getDate() );
}
function comareMonthDay(currentMonth, currentDay, birthMonth, birthDay) {
    let res = currentMonth == birthMonth ? +(currentDay > birthDay) : +(currentMonth > birthMonth);
    return res;
}
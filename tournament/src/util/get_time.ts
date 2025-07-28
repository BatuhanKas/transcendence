// 28.07.2025 20:01:15
const getDateAndHour = () => {
    return new Date().toLocaleString('tr-TR');
};

// "20:01:15" - Time in the format HH:MM:SS
const getHour = () => {
    return new Date().toLocaleTimeString('tr-TR');
}

// "20:01:15" - Time in the format HH:MM:SS with added minutes
const getHourAndAddMinutes = (minutes: number) => {
    const date = new Date();
    date.setMinutes(date.getMinutes() + minutes);
    return date.toLocaleTimeString('tr-TR');
}

// "28.07.2025" - Date in the format DD.MM.YYYY
const getDate = () => {
    return new Date().toLocaleDateString('tr-TR');
}

export { getDateAndHour, getHour, getDate, getHourAndAddMinutes };
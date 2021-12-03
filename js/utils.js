function to12Hour(date, onlyHour = false) {
    let hours = ''
    let affix = ''
    let minutes = date.getMinutes()
    if (date.getHours() < 12) {
        hours = date.getHours()
        affix = 'AM'
    }
    if (date.getHours() >= 12) {
        hours = date.getHours() % 12
        affix = 'PM'
    }

    if (date.getMinutes() < 10) {
        minutes = `0${date.getMinutes()}`
    }

    if (onlyHour) {
        let time = `${hours} ${affix}`
        if(hours == 0) {
            return `12 ${affix}`
        }
        return time
    } else {
        return `${hours}:${minutes} ${affix}`
    }
}
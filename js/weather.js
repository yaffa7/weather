
window.onload = function () {
    console.log(new Date().getMonth())
    let hours = new Date().getHours()
    console.log('Hours:', hours)
    if (6 < hours && hours < 12) {
        console.log('Good Morning')
    }
    if (12 < hours && hours < 18) {
        console.log('Good Afternoon')
    }
    if (18 < hours && hours < 24) {
        console.log('Good Evening')
    }
}
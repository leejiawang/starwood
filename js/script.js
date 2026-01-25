const CONFIG = {
    loveStartDate: "2017/04/27 14:17:41",
    marriageDate: "2024/02/01",
    birthdays: {
        star: {
            type: 'lunar',
            month: 2,
            day: 27,
            year: 1997
        },
        wood: {
            type: 'lunar',
            month: 9,
            day: 17,
            year: 1997
        }
    }
};
const loveStartDate = new Date(CONFIG.loveStartDate);
const marriageDate = new Date(CONFIG.marriageDate);
const els = {
    mainTimer: document.getElementById('main-timer-text'),
    totalDays: document.getElementById('total-days'),
    totalHours: document.getElementById('total-hours'),
    totalMinutes: document.getElementById('total-minutes'),
    totalSeconds: document.getElementById('total-seconds'),
    annLove: document.getElementById('anniversary-love'),
    annMarry: document.getElementById('anniversary-marry'),
    birthStar: document.getElementById('birthday-star'),
    birthWood: document.getElementById('birthday-wood')
};
let lastDay = null;

function updateTimer() {
    const now = new Date();
    const diff = now - loveStartDate;
    const days = Math.floor(diff / 86400000);
    const years = Math.floor(days / 365);
    const daysRemainder = days % 365;
    const hours = Math.floor((diff % 86400000) / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    let timeStr = "";
    let hasPreceding = false;
    let zeroPending = false;

    function appendUnit(value, unit) {
        if (value > 0) {
            if (hasPreceding && zeroPending) {
                timeStr += "零";
                zeroPending = false;
            }
            timeStr += value + unit;
            hasPreceding = true;
        } else if (hasPreceding) {
            zeroPending = true;
        }
    }
    appendUnit(years, "年");
    appendUnit(daysRemainder, "天");
    appendUnit(hours, "时");
    appendUnit(minutes, "分");
    appendUnit(seconds, "秒");
    if (timeStr === "") timeStr = "不到1秒";
    els.mainTimer.innerHTML = timeStr;
    els.totalDays.innerText = `${days}天`;
    els.totalHours.innerText = `${Math.floor(diff / 3600000)}小时`;
    els.totalMinutes.innerText = `${Math.floor(diff / 60000)}分`;
    els.totalSeconds.innerText = `${Math.floor(diff / 1000)}秒`;
    if (now.getDate() !== lastDay) {
        updateAnniversary("love", loveStartDate, "恋爱", els.annLove, now);
        updateAnniversary("marry", marriageDate, "结婚", els.annMarry, now);
        updateBirthdays(now);
        lastDay = now.getDate();
    }
}

function updateAnniversary(type, originalDate, label, el, now) {
    let targetDate = new Date(now.getFullYear(), originalDate.getMonth(), originalDate.getDate());
    if (now > targetDate) targetDate.setFullYear(now.getFullYear() + 1);
    const diffDays = Math.ceil((targetDate - now) / 86400000);
    const anniversaryYear = targetDate.getFullYear() - originalDate.getFullYear();
    const text = diffDays === 0 ? `今天是我们${label}${anniversaryYear}周年纪念日!` : `距${label}${anniversaryYear}周年纪念日还有${diffDays}天.`;
    el.innerHTML = text;
}

function updateBirthdays(now) {
    function getBirthdayText(personKey, name) {
        const setting = CONFIG.birthdays[personKey];
        let targetDate;
        if (setting.type === 'lunar') {
            const currentYear = now.getFullYear();
            let lunar = Lunar.fromYmd(currentYear, setting.month, setting.day);
            let solar = lunar.getSolar();
            targetDate = new Date(solar.getYear(), solar.getMonth() - 1, solar.getDay());
            if (now > targetDate) {
                lunar = Lunar.fromYmd(currentYear + 1, setting.month, setting.day);
                solar = lunar.getSolar();
                targetDate = new Date(solar.getYear(), solar.getMonth() - 1, solar.getDay());
            }
        } else {
            targetDate = new Date(now.getFullYear(), setting.month - 1, setting.day);
            if (now > targetDate) targetDate.setFullYear(now.getFullYear() + 1);
        }
        const age = targetDate.getFullYear() - setting.year;
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const targetDay = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
        if (today.getTime() === targetDay.getTime()) return `今天是${name}${age}岁生日!`;
        else return `距${name}${age}岁生日还有${Math.ceil((targetDay - today) / 86400000)}天.`;
    }
    els.birthStar.innerHTML = getBirthdayText('star', '星星');
    els.birthWood.innerHTML = getBirthdayText('wood', '木头');
}
updateTimer();
setInterval(updateTimer, 1000);
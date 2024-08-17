function parseTime(timeStr) {
    const [time, modifier] = timeStr.split(' ');

    let [hours, minutes, seconds] = time.split(':');
    hours = parseInt(hours, 10);
    minutes = parseInt(minutes, 10);
    seconds = parseInt(seconds, 10);

    if (modifier.toLowerCase() === 'pm' && hours < 12) {
        hours += 12;
    } else if (modifier.toLowerCase() === 'am' && hours === 12) {
        hours = 0;
    }

    return { hours, minutes, seconds };
}

function compareTime(timeA, timeB) {
    const parsedA = parseTime(timeA);
    const parsedB = parseTime(timeB);

    if (parsedA.hours !== parsedB.hours) {
        return parsedA.hours - parsedB.hours;
    } else if (parsedA.minutes !== parsedB.minutes) {
        return parsedA.minutes - parsedB.minutes;
    } else {
        return parsedA.seconds - parsedB.seconds;
    }
}

export function merge(left, right) {
    let result = [];
    let leftIndex = 0;
    let rightIndex = 0;

    while (leftIndex < left.length && rightIndex < right.length) {
        if (compareTime(left[leftIndex].time, right[rightIndex].time) <= 0) {
            result.push(left[leftIndex]);
            leftIndex++;
        } else {
            result.push(right[rightIndex]);
            rightIndex++;
        }
    }

    return result.concat(left.slice(leftIndex)).concat(right.slice(rightIndex));
}
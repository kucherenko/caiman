export function aggregate(data, oldData) {
    let result = [];
    if (oldData) {
        result = result.concat(oldData);
    }
    result.push(data);
    return result;
}

export function summarize(data, oldData) {
    return Number(oldData) + Number(data);
}

export function averages(data, oldData) {
    return (Number(oldData) + Number(data)) / 2;
}
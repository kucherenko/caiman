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
    let result = {};
    result.n = oldData && oldData.n ? Number(oldData.n) : 1;
    result.average = oldData && oldData.average ? Number(oldData.average) : Number(data);
    result.average = (result.average * result.n + Number(data))/(result.n + 1);
    result.n++;
    return result;
}
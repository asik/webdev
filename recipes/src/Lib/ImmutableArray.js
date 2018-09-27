
export function removeAt(array, index) {
    const copy = array.slice();
    copy.splice(index, 1);
    return copy;
}

export function add(array, element) {
    const copy = array.slice();
    copy.push(element);
    return copy;
}
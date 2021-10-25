module.exports = {
    arrayRemove: (arr, value) => {
        return arr.filter((e) => {
            return e !== value;
        });
    }
}
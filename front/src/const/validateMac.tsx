export function validateMacAddress(mac: string) {
    const regex = /^[0-9A-Fa-f]{12}$/;
    return regex.test(mac);
}

export function addColonsToMacAddress(mac: string) {
    const regex =
        /^([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})$/;
    return mac.replace(regex, "$1:$2:$3:$4:$5:$6");
}

// 示例用法
console.log(addColonsToMacAddress("2879940cfb23")); // 28:79:94:0c:fb:23
console.log(addColonsToMacAddress("001a2b3c4d5e")); // 00:1a:2b:3c:4d:5e
console.log(addColonsToMacAddress("1234567890ab")); // 12:34:56:78:90:ab

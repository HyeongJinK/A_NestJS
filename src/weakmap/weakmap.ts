let weakmap = new WeakMap();
let map = new Map();
let test = {};

map.set('key', 'test');
weakmap.set(test, map);
console.log(test);
console.log(weakmap.get(test)); // test
console.log(weakmap.get(test).get('key')); // test
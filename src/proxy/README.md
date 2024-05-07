JavaScript Proxy는 객체의 기본 동작을 가로채고 사용자 지정 동작을 정의할 수 있는 기능입니다. 이를 통해 객체에 대한 다양한 동적인 기능을 추가하거나 수정할 수 있습니다. Proxy는 다음과 같은 목적으로 사용될 수 있습니다:

1. **속성 접근 제어**: Proxy를 사용하여 객체의 속성에 접근할 때 특정 조건을 검사하거나 추가 로직을 실행할 수 있습니다.
2. **속성 값 변경 감지**: 속성에 대한 변경 사항을 감지하고 필요한 조치를 취할 수 있습니다.
3. **속성 삭제 제어**: 속성이 삭제되기 전에 특정 조건을 확인하고 삭제를 방지하거나 추가 동작을 수행할 수 있습니다.
4. **함수 호출 가로채기**: Proxy를 사용하여 함수 호출을 가로채고 호출 전후에 추가 동작을 수행할 수 있습니다.
5. **배열에 대한 접근 제어**: 배열에 대한 접근을 가로채고 특정 동작을 수행할 수 있습니다. 예를 들어, 배열에 새 요소가 추가될 때마다 로그를 남기거나 특정 요소를 필터링할 수 있습니다.

Proxy는 다음과 같이 생성됩니다:

```javascript
const proxy = new Proxy(target, handler);
```

여기서 `target`은 Proxy가 가로챌 대상 객체이고, `handler`는 Proxy에 대한 동작을 정의하는 객체입니다. `handler` 객체는 다양한 동작을 가로채는 메서드를 가질 수 있습니다. 예를 들어, `get`, `set`, `deleteProperty`, `apply` 등의 메서드를 포함할 수 있습니다.

예를 들어, 다음은 Proxy를 사용하여 속성 접근을 제어하는 간단한 예제입니다:

```javascript
const target = {
  name: 'John',
  age: 30
};

const handler = {
  get: function(target, prop) {
    if (prop === 'age') {
      return target[prop] + ' years old';
    } else {
      return target[prop];
    }
  }
};

const proxy = new Proxy(target, handler);

console.log(proxy.name); // "John"
console.log(proxy.age);  // "30 years old"
```

위 예제에서는 Proxy를 사용하여 `age` 속성에 접근할 때 추가로 " years old" 문자열을 붙여 반환하는 동작을 정의하고 있습니다.


------------------------------------------------------------------------------------------------


Proxy 객체를 사용할 때 다양한 동작을 정의하기 위해 다음과 같은 메서드들을 사용할 수 있습니다:

1. **get(target, property, receiver)**: 프로퍼티에 접근할 때 실행되는 메서드입니다. `target`은 원본 객체, `property`는 접근하려는 프로퍼티 이름, `receiver`는 Proxy 객체입니다. 이 메서드를 사용하여 프로퍼티에 접근하기 전에 추가 로직을 수행할 수 있습니다.

2. **set(target, property, value, receiver)**: 프로퍼티에 값을 할당할 때 실행되는 메서드입니다. `target`은 원본 객체, `property`는 할당하려는 프로퍼티 이름, `value`는 할당하려는 값, `receiver`는 Proxy 객체입니다. 이 메서드를 사용하여 프로퍼티에 값을 할당하기 전에 추가 로직을 수행할 수 있습니다.

3. **deleteProperty(target, property)**: 프로퍼티를 삭제할 때 실행되는 메서드입니다. `target`은 원본 객체, `property`는 삭제하려는 프로퍼티 이름입니다. 이 메서드를 사용하여 프로퍼티를 삭제하기 전에 추가 로직을 수행할 수 있습니다.

4. **apply(target, thisArg, argumentsList)**: 함수를 호출할 때 실행되는 메서드입니다. `target`은 호출할 함수 객체, `thisArg`는 함수 내부에서 사용될 this 값, `argumentsList`는 함수에 전달될 인수 목록입니다. 이 메서드를 사용하여 함수 호출을 가로채고 호출 전후에 추가 로직을 수행할 수 있습니다.

예를 들어, 다음은 `set`, `deleteProperty`, `apply` 메서드를 사용하는 간단한 예제입니다:

```javascript
const target = {
  name: 'John',
  age: 30,
  greet: function() {
    console.log(`Hello, my name is ${this.name} and I'm ${this.age} years old.`);
  }
};

const handler = {
  set: function(target, prop, value) {
    if (prop === 'age') {
      if (typeof value !== 'number' || value < 0) {
        throw new Error('Age must be a non-negative number.');
      }
    }
    target[prop] = value;
  },
  deleteProperty: function(target, prop) {
    if (prop === 'age') {
      throw new Error('Cannot delete age property.');
    }
    delete target[prop];
  },
  apply: function(target, thisArg, argumentsList) {
    console.log('Calling greet function...');
    target.apply(thisArg, argumentsList);
  }
};

const proxy = new Proxy(target, handler);

proxy.age = 35; // Works fine
console.log(proxy.age); // 35

proxy.age = -5; // Throws an error

delete proxy.age; // Throws an error

proxy.greet(); // Logs: "Calling greet function... Hello, my name is John and I'm 35 years old."
```

위의 예제에서는 `set` 메서드를 사용하여 `age` 프로퍼티에 할당되는 값이 음수가 아닌지 확인하고, `deleteProperty` 메서드를 사용하여 `age` 프로퍼티가 삭제되지 않도록 방지하고, `apply` 메서드를 사용하여 `greet` 함수 호출 시 로그를 출력하고 원본 함수를 호출합니다.
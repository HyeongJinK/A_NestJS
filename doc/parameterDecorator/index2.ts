function validate(target: Object, propertyKey: string | symbol, parameterIndex: number) {
    const originalMethod = (target as any)[propertyKey]; // 타입을 any로 캐스팅하여 메서드를 가져옴

    if (typeof originalMethod !== 'function') {
        throw new Error(`${String(propertyKey)}는 유효한 함수가 아닙니다.`);
    }

    Object.defineProperty(target, propertyKey, {
        value: function (...args: any[]) {
            if (args[parameterIndex] <= 0) {
                throw new Error(`${String(propertyKey)}의 매개변수는 양수여야 합니다.`);
            }
            return originalMethod.apply(this, args);
        }
    });
}

class Cal {
    multiply(@validate num: number) {
        console.log(`Result: ${num * 2}`);
    }
}

const math = new Cal();
math.multiply(5);  // 정상 실행: Result: 10
math.multiply(-3); // 오류 발생: multiply의 매개변수는 양수여야 합니다.

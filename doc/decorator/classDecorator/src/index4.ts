function Auth(target: Object, propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value;
    console.log(descriptor.value);

    /**
     function (...args: any[])

     TS2730 에러는 "화살표 함수에는 this 매개변수가 있을 수 없습니다"라는 의미입니다.
     TypeScript에서 화살표 함수는 this를 외부 문맥에 바인딩하기 때문에 this 매개변수를 지정할 수 없습니다.

     화살표 함수의 this 바인딩
     JavaScript의 화살표 함수(=>)는 자신을 감싸고 있는 외부 스코프의 this를 상속받습니다.
     그래서 화살표 함수 내부에서는 this가 자동으로 상위 스코프의 this로 고정됩니다.
     그렇기 때문에 화살표 함수에 명시적으로 this 타입을 지정하려고 하면 에러가 발생합니다.
     * */
    descriptor.value = function (this: Dashboard, ...args: any[]) {
        console.log(this);
        if (this.isAdmin) {
            return method.apply(this, args);
        } else {
            console.log("Unauthorized access attempt");
            return null;
        }
    };
}

type Constructor<T = {}> = new (...args: any[]) => T;
/**
 이 코드는 TypeScript에서 제네릭을 활용한 타입 별칭으로, 클래스나 생성자 함수의 타입을 표현할 때 유용합니다. 여기서 각 부분의 의미를 하나씩 살펴보겠습니다.

 1. type Constructor<T = {}>
 * Constructor는 타입 별칭의 이름입니다. 일반적으로 "생성자 타입"을 표현하는 이름으로 사용됩니다.
 * <T = {}>는 제네릭 타입 매개변수로, T라는 이름을 가진 제네릭을 지정합니다. T의 기본값은 {}, 즉 빈 객체 타입입니다.
 이를 통해 T에 특정 타입을 지정하지 않으면 기본적으로 빈 객체를 가리키게 됩니다.
 2. new (...args: any[]) => T
 * new 키워드는 생성자 함수 타입을 정의할 때 사용합니다. 클래스 인스턴스를 생성하기 위해 new를 사용할 수 있는 타입을 의미합니다.
 * (...args: any[])는 가변인자로, 생성자 함수가 어떤 인자들이든 받을 수 있도록 합니다. any[] 배열 타입은 인자들이 어떤 타입이어도 허용된다는 의미입니다.
 * => T는 생성자 함수의 반환 타입을 지정하며, T 타입을 반환합니다. 즉, 생성자는 T 타입의 객체를 반환하도록 정의됩니다.

 요약
 Constructor<T = {}>는 "임의의 타입 T를 생성하는 생성자 함수 타입"으로 해석할 수 있습니다.
 예를 들어 Constructor<Dashboard>라면 Dashboard 클래스의 인스턴스를 생성하는 생성자 타입이 됩니다.
 * */

function SetAdmin(isAdmin: boolean) {
    return <T extends Constructor> (Base: T) => {
        return class extends Base {
            isAdmin = isAdmin;
        };
    };
}
/**
 * function SetAdmin(isAdmin: boolean) {
 *     return (constructor: any) => {
 *         return class extends constructor {
 *             isAdmin = isAdmin;
 *         };
 *     };
 * }
 * TS1270: Decorator function return type typeof (Anonymous class) is not assignable to type void | typeof Dashboard
 * */
@SetAdmin(true)
class Dashboard {
    isAdmin: boolean = false;

    @Auth
    viewSensitiveData() {
        console.log("Sensitive data: [TOP SECRET]");
    }
}

const adminDashboard = new Dashboard();
adminDashboard.viewSensitiveData(); // "Sensitive data: [TOP SECRET]" 출력

const userDashboard = new (SetAdmin(false)(Dashboard));
userDashboard.viewSensitiveData(); // "Unauthorized access attempt" 출력

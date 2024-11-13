/**
 * keyof는 TypeScript에서 객체 타입의 모든 키를 유니언 타입으로 나타내기 위해 사용되는 키워드입니다.
 * 이를 통해 객체의 키를 기반으로 한 타입을 정의할 수 있으며, 객체 타입을 보다 정교하게 다룰 수 있게 해줍니다.
 * */
type User = {
    id: number;
    name: string;
    email: string;
};

// keyof User의 결과는 "id" | "name" | "email"
type UserKeys = keyof User;

const key: UserKeys = "name"; // 가능
// const invalidKey: UserKeys = "age"; // 오류: "age"는 "id" | "name" | "email"에 포함되지 않음








/**
 * 객체의 동적 인덱싱
 * keyof를 사용하면 객체의 키를 안전하게 접근할 수 있도록 코드에 타입 안전성을 추가할 수 있습니다.
 *
 * getProperty 함수에서 key는 keyof T로 제한되어 T 타입의 키만 인덱스로 사용할 수 있게 됩니다. 이렇게 하면 컴파일 타임에 잘못된 키 사용을 방지할 수 있습니다.
 *
 * 응용
 * keyof는 다음과 같은 다양한 경우에 사용됩니다:
 *
 * 타입 안전한 객체 접근: 함수나 메서드에서 객체의 키를 제한할 때 유용합니다.
 * 맵드 타입: 객체 타입의 모든 키에 대해 특정 변형을 적용할 때 사용됩니다.
 * 조건부 타입: 특정 조건에 따라 타입을 결정할 때, keyof를 활용하여 객체의 키 집합을 조건으로 사용할 수 있습니다.
 * 이렇게 keyof는 객체 타입의 키를 기반으로 타입을 더 안전하게 다룰 수 있는 강력한 도구입니다.
 * */

function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
    return obj[key];
}

const user: User = {
    id: 1,
    name: "Alice",
    email: "alice@example.com",
};

const userName = getProperty(user, "name"); // 타입은 string
// const userAge = getProperty(user, "age"); // 오류: "age"는 User의 키가 아님

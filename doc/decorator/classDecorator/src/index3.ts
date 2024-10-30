// constructor 수정
function DefaultName(name: string) {
    return (constructor: any) => {
        return class extends constructor {
            name = name;
        };
    };
}

@DefaultName("Admin")
class AdminUser {
    public name: string;
    constructor(name: string) {
        this.name = name;
    }
}

const user = new AdminUser("User1");
console.log(user.name); // Admin

// src/core/simple-application.ts
export class SimpleApplication {
    async init(module: any) {
        console.log('SimpleApplication initialized with', module.name);
    }

    async listen(port: number) {
        console.log(`Server is running on port ${port}`);
    }
}
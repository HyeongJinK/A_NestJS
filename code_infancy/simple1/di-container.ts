class Container {
    private providers = new Map();
  
    // 서비스 등록
    register(token: any, provider: any) {
      this.providers.set(token, provider);
    }
  
    // 의존성 주입된 인스턴스 반환
    resolve(token: any) {
      const provider = this.providers.get(token);
      if (!provider) throw new Error(`Provider for ${token} not found`);
  
      return new provider();
    }
  }
  
  // IoC 컨테이너 인스턴스 생성
  export const container = new Container();
  
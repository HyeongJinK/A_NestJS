// container.ts
class Container {
  private providers = new Map();

  public set(token:any, provider:any) {
    this.providers.set(token, provider);
  }

  public get(token:any) {
    const provider = this.providers.get(token);
    if (!provider) {
      throw new Error(`Provider not found for ${token.toString()}`);
    }
    return provider;
  }
}

export const container = new Container();

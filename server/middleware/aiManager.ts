// Instead of hardcoded if/else chains, use a registry

type ProviderHandler = (params: any) => Promise<any>;

class AIProviderRegistry {
  private providers = new Map<AIProvider, ProviderHandler>();
  private defaultProvider: AIProvider;
  
  register(provider: AIProvider, handler: ProviderHandler) {
    this.providers.set(provider, handler);
    return this;
  }
  
  setDefault(provider: AIProvider) {
    this.defaultProvider = provider;
  }
  
  async execute(provider: AIProvider, params: any) {
    const handler = this.providers.get(provider);
    if (!handler) throw new Error(`Provider ${provider} not registered`);
    return handler(params);
  }
  
  async executeWithFallback(providers: AIProvider[], params: any) {
    for (const provider of providers) {
      try {
        return await this.execute(provider, params);
      } catch (e) {
        console.log(`${provider} failed, trying next`);
      }
    }
    throw new Error('All providers failed');
  }
}

// Usage
const registry = new AIProviderRegistry();
registry.register(AIProvider.OPENAI, processWithOpenAI);
registry.register(AIProvider.ANTHROPIC, processWithAnthropic);
registry.register(AIProvider.INTERNAL, processWithInternalModel);
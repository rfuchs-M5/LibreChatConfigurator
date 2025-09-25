import fs from 'fs/promises';
import path from 'path';

interface SecretsConfig {
  [key: string]: string;
}

class SecretsManager {
  private secretsPath = path.join(process.cwd(), 'data', 'secrets', 'demo-keys.json');
  private secrets: SecretsConfig | null = null;

  async loadSecrets(): Promise<SecretsConfig> {
    if (this.secrets) {
      return this.secrets;
    }

    try {
      const secretsData = await fs.readFile(this.secretsPath, 'utf-8');
      this.secrets = JSON.parse(secretsData);
      return this.secrets!;
    } catch (error) {
      console.warn('⚠️ Could not load local secrets file. Using empty secrets.');
      this.secrets = {};
      return this.secrets;
    }
  }

  async getSecret(key: string): Promise<string | undefined> {
    const secrets = await this.loadSecrets();
    return secrets[key];
  }

  async getAllSecrets(): Promise<SecretsConfig> {
    return await this.loadSecrets();
  }

  async saveSecret(key: string, value: string): Promise<void> {
    const secrets = await this.loadSecrets();
    secrets[key] = value;
    
    try {
      await fs.writeFile(this.secretsPath, JSON.stringify(secrets, null, 2));
      this.secrets = secrets; // Update cache
    } catch (error) {
      console.error('❌ Failed to save secret:', error);
      throw error;
    }
  }

  async clearAllSecrets(): Promise<void> {
    this.secrets = {};
    try {
      await fs.writeFile(this.secretsPath, JSON.stringify({}, null, 2));
    } catch (error) {
      console.error('❌ Failed to clear secrets:', error);
      throw error;
    }
  }
}

export const secretsManager = new SecretsManager();
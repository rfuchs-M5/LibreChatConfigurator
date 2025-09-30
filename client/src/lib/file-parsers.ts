import yaml from "js-yaml";

export function parseEnvFile(envContent: string): Record<string, string> {
  const envVars: Record<string, string> = {};
  const lines = envContent.split('\n');
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    
    const [key, ...valueParts] = trimmed.split('=');
    if (key && valueParts.length > 0) {
      envVars[key.trim()] = valueParts.join('=').trim();
    }
  }
  return envVars;
}

export function parseYamlFile(yamlContent: string): any {
  try {
    return yaml.load(yamlContent);
  } catch (error) {
    throw new Error(`YAML parsing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

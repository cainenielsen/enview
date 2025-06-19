export interface EnvVariable {
  key: string;
  value: string;
  description?: string;
  isQuoted?: boolean;
}

export interface ParseError {
  line: number;
  content: string;
  error: string;
}

export interface EnvData {
  variables: EnvVariable[];
  format: 'equals' | 'colon'; // var=val vs var: "val"
  parseErrors?: ParseError[];
  hasErrors?: boolean;
}

export class EnvParser {
  static parse(content: string): EnvData {
    const lines = content.split('\n');
    const variables: EnvVariable[] = [];
    const parseErrors: ParseError[] = [];
    let format: 'equals' | 'colon' = 'equals';
    let currentDescription: string | undefined;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      // Skip empty lines
      if (!line) {
        currentDescription = undefined;
        continue;
      }

      // Handle comments (potential descriptions)
      if (line.startsWith('#')) {
        const comment = line.substring(1).trim();
        if (comment && !comment.toLowerCase().includes('env') && !comment.includes('=')) {
          currentDescription = comment;
        }
        continue;
      }

      // Parse variable assignments
      let match = line.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
      if (match) {
        format = 'equals';
      } else {
        match = line.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*:\s*"?([^"]*)"?$/);
        if (match) {
          format = 'colon';
        }
      }

      if (match) {
        const [, key, value] = match;
        const cleanValue = this.cleanValue(value);
        const isQuoted = this.isValueQuoted(value);

        variables.push({
          key: key.trim(),
          value: cleanValue,
          description: currentDescription,
          isQuoted
        });

        currentDescription = undefined;
      } else {
        // Line couldn't be parsed - add to errors
        if (!line.startsWith('#') && line.trim() !== '') {
          parseErrors.push({
            line: i + 1,
            content: lines[i], // Keep original line with whitespace
            error: this.getParseErrorMessage(line)
          });
        }
      }
    }

    return { 
      variables, 
      format, 
      parseErrors,
      hasErrors: parseErrors.length > 0
    };
  }

  private static getParseErrorMessage(line: string): string {
    if (line.includes('=') && !line.match(/^[A-Za-z_][A-Za-z0-9_]*\s*=/)) {
      return 'Invalid variable name. Variable names must start with a letter or underscore and contain only letters, numbers, and underscores.';
    }
    if (line.includes(':') && !line.match(/^[A-Za-z_][A-Za-z0-9_]*\s*:/)) {
      return 'Invalid variable name for colon format. Variable names must start with a letter or underscore.';
    }
    if (!line.includes('=') && !line.includes(':')) {
      return 'Missing assignment operator. Expected format: VARIABLE=value or VARIABLE: "value"';
    }
    return 'Invalid syntax. Expected format: VARIABLE=value or VARIABLE: "value"';
  }

  static serialize(envData: EnvData): string {
    const lines: string[] = [];

    // Filter out variables without keys
    const validVariables = envData.variables.filter(variable =>
      variable.key && variable.key.trim().length > 0
    );

    for (const variable of validVariables) {
      // Add description as comment if provided
      if (variable.description) {
        lines.push(`# ${variable.description}`);
      }

      // Format the variable assignment
      if (envData.format === 'colon') {
        const quotedValue = variable.isQuoted || variable.value.includes(' ')
          ? `"${variable.value}"`
          : variable.value;
        lines.push(`${variable.key}: ${quotedValue}`);
      } else {
        const quotedValue = variable.isQuoted || variable.value.includes(' ')
          ? `"${variable.value}"`
          : variable.value;
        lines.push(`${variable.key}=${quotedValue}`);
      }

      // Add empty line after each variable for readability
      lines.push('');
    }

    // Remove trailing empty line
    if (lines.length > 0 && lines[lines.length - 1] === '') {
      lines.pop();
    }

    return lines.join('\n');
  }

  static formatForPreview(envData: EnvData): string {
    const lines: string[] = [];
    lines.push('# Environment Variables Preview');
    lines.push('');

    for (const variable of envData.variables) {
      if (variable.description) {
        lines.push(`## ${variable.key}`);
        lines.push(variable.description);
        lines.push(`\`\`\`${variable.value}\`\`\``);
      } else {
        lines.push(`**${variable.key}**: \`${variable.value}\``);
      }
      lines.push('');
    }

    return lines.join('\n');
  }

  private static cleanValue(value: string): string {
    const trimmed = value.trim();

    // Remove surrounding quotes if present
    if ((trimmed.startsWith('"') && trimmed.endsWith('"')) ||
      (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
      return trimmed.slice(1, -1);
    }

    return trimmed;
  }

  private static isValueQuoted(value: string): boolean {
    const trimmed = value.trim();
    return (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
      (trimmed.startsWith("'") && trimmed.endsWith("'"));
  }
}

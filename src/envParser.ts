export interface EnvVariable {
  key: string;
  value: string;
  description?: string;
  isQuoted?: boolean;
  disabled?: boolean;
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
    let descriptionLines: string[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      // Skip empty lines
      if (!line) {
        // If we have accumulated description lines, join them
        if (descriptionLines.length > 0) {
          currentDescription = descriptionLines.join('\n');
          descriptionLines = [];
        } else {
          currentDescription = undefined;
        }
        continue;
      }

      // Handle comments (potential descriptions or disabled variables)
      if (line.startsWith('#')) {
        const comment = line.substring(1).trim();

        // Check if this is a commented-out variable assignment
        let disabledMatch = comment.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
        let disabledFormat: 'equals' | 'colon' = 'equals';
        let disabledInlineComment: string | undefined;

        if (disabledMatch) {
          // Check for inline comment in disabled equals format
          const [, key, valuePart] = disabledMatch;
          const inlineCommentMatch = valuePart.match(/^(.*?)\s*#\s*(.+)$/);
          
          if (inlineCommentMatch) {
            const [, valueOnly, inlineCommentText] = inlineCommentMatch;
            disabledMatch = [disabledMatch[0], key, valueOnly.trim()];
            disabledInlineComment = inlineCommentText.trim();
          }
        } else {
          disabledMatch = comment.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*:\s*"?([^"]*)"?$/);
          if (disabledMatch) {
            disabledFormat = 'colon';
            // Check for inline comment in disabled colon format
            const [, key, valuePart] = disabledMatch;
            const inlineCommentMatch = valuePart.match(/^(.*?)\s*#\s*(.+)$/);
            
            if (inlineCommentMatch) {
              const [, valueOnly, inlineCommentText] = inlineCommentMatch;
              disabledMatch = [disabledMatch[0], key, valueOnly.trim()];
              disabledInlineComment = inlineCommentText.trim();
            }
          }
        }

        if (disabledMatch) {
          // This is a disabled variable
          const [, key, value] = disabledMatch;
          const cleanValue = this.cleanValue(value);
          const isQuoted = this.isValueQuoted(value);

          // Combine existing description with inline comment
          let finalDescription = currentDescription;
          if (disabledInlineComment) {
            if (finalDescription) {
              finalDescription += '\n' + disabledInlineComment;
            } else {
              finalDescription = disabledInlineComment;
            }
          }

          variables.push({
            key: key.trim(),
            value: cleanValue,
            description: finalDescription,
            isQuoted,
            disabled: true
          });

          currentDescription = undefined;
          descriptionLines = [];
          format = disabledFormat;
        } else if (comment && !comment.toLowerCase().includes('env') && !comment.includes('=')) {
          // This is a regular comment/description
          descriptionLines.push(comment);
        }
        continue;
      }

      // If we reach a variable assignment, finalize any accumulated description
      if (descriptionLines.length > 0) {
        currentDescription = descriptionLines.join('\n');
        descriptionLines = [];
      }

      // Parse variable assignments (with potential inline comments)
      let match = line.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
      let inlineComment: string | undefined;

      if (match) {
        format = 'equals';
        // Check for inline comment in the value part
        const [, key, valuePart] = match;
        const inlineCommentMatch = valuePart.match(/^(.*?)\s*#\s*(.+)$/);

        if (inlineCommentMatch) {
          const [, valueOnly, comment] = inlineCommentMatch;
          match = [match[0], key, valueOnly.trim()];
          inlineComment = comment.trim();
        }
      } else {
        match = line.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*:\s*"?([^"]*)"?$/);
        if (match) {
          format = 'colon';
          // Check for inline comment in colon format
          const [, key, valuePart] = match;
          const inlineCommentMatch = valuePart.match(/^(.*?)\s*#\s*(.+)$/);

          if (inlineCommentMatch) {
            const [, valueOnly, comment] = inlineCommentMatch;
            match = [match[0], key, valueOnly.trim()];
            inlineComment = comment.trim();
          }
        }
      }

      if (match) {
        const [, key, value] = match;
        const cleanValue = this.cleanValue(value);
        const isQuoted = this.isValueQuoted(value);

        // Combine existing description with inline comment
        let finalDescription = currentDescription;
        if (inlineComment) {
          if (finalDescription) {
            finalDescription += '\n' + inlineComment;
          } else {
            finalDescription = inlineComment;
          }
        }

        variables.push({
          key: key.trim(),
          value: cleanValue,
          description: finalDescription,
          isQuoted
        });

        currentDescription = undefined;
        descriptionLines = [];
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
        // Handle multi-line descriptions by adding # to each line
        const descriptionLines = variable.description.split('\n');
        for (const line of descriptionLines) {
          lines.push(`# ${line}`);
        }
      }

      // Format the variable assignment
      let assignmentLine: string;
      if (envData.format === 'colon') {
        const quotedValue = variable.isQuoted || variable.value.includes(' ')
          ? `"${variable.value}"`
          : variable.value;
        assignmentLine = `${variable.key}: ${quotedValue}`;
      } else {
        const quotedValue = variable.isQuoted || variable.value.includes(' ')
          ? `"${variable.value}"`
          : variable.value;
        assignmentLine = `${variable.key}=${quotedValue}`;
      }

      // Add # prefix if the variable is disabled
      if (variable.disabled) {
        lines.push(`# ${assignmentLine}`);
      } else {
        lines.push(assignmentLine);
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

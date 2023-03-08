export function transformToStruct(input: any): any {
  if (input === null || input === undefined) return input;
  let result = {};

  if (
    typeof input === 'object' &&
    !Array.isArray(input) &&
    Object.keys(input).length > 0
  ) {
    result = transformObjectToStruct(input);
  }

  return result;
}

export function transformFromStruct(input: any): any {
  if (input === null || input === undefined) return input;
  let result = {};

  if (
    typeof input === 'object' &&
    !Array.isArray(input) &&
    Object.keys(input).includes('fields')
  ) {
    result = transformStructToObject(input.fields);
  }
  return result;
}

function transformStructToObject(input: any): any {
  const result = {};

  Object.keys(input).forEach((key) => {
    const value = input[key];
    if (value?.fields !== undefined) {
      result[key] = transformStructToObject(value.fields);
    } else if (value?.listValue?.values !== undefined) {
      result[key] = transformStructToArray(value.listValue.values);
    } else {
      const el = transformStructToPrimitive(value);
      if (el !== undefined) result[key] = el;
    }
  });

  return result;
}

function transformStructToArray(input: any): any[] {
  const result = [];

  (input || []).forEach((value) => {
    if (value?.fields !== undefined) {
      result.push(transformStructToObject(value.fields));
    } else if (value?.listValue?.values !== undefined) {
      result.push(transformStructToArray(value.listValue.values));
    } else {
      const el = transformStructToPrimitive(value);
      if (el !== undefined) result.push(el);
    }
  });

  return result;
}

function transformStructToPrimitive(input: any): any {
  if (input?.nullValue !== undefined) return input.nullValue;
  if (input?.stringValue !== undefined) return String(input.stringValue);
  if (input?.numberValue !== undefined) return Number(input.numberValue);
  if (input?.boolValue !== undefined) return Boolean(input.boolValue);
}

function transformObjectToStruct(input: any): any {
  const fields = {};

  Object.keys(input).forEach((key) => {
    const value = input[key];
    const type = getTypeForStruct(value);
    if (type !== 'unknown') {
      if (type === 'list') {
        fields[key] = transformArrayToStruct(value);
      } else if (type === 'struct') {
        fields[key] = transformObjectToStruct(value);
      } else {
        const el = transformPrimitiveToStructValue(value);
        if (el !== undefined) fields[key] = el;
      }
    }
  });

  return { fields };
}

function transformArrayToStruct(input: any[]): any {
  const values = [];

  (input || []).forEach((value) => {
    const type = getTypeForStruct(value);
    if (type !== 'unknown') {
      if (type === 'list') {
        values.push(transformArrayToStruct(value));
      } else if (type === 'struct') {
        values.push(transformObjectToStruct(value));
      } else {
        const el = transformPrimitiveToStructValue(value);
        if (el !== undefined) values.push(el);
      }
    }
  });

  return { listValue: { values } };
}

function transformPrimitiveToStructValue(input: any): any {
  if (input === null) return { nullValue: input };
  if (typeof input === 'string') return { stringValue: input };
  if (typeof input === 'number') return { numberValue: input };
  if (typeof input === 'boolean') return { boolValue: input };
}

// 'unknown', 'null', 'string', 'number', 'bool', 'struct', 'list'
function getTypeForStruct(input): string {
  const type = typeof input;
  if (input === null) return 'null';
  if (Array.isArray(input)) return 'list';
  if (type === 'object') return 'struct';
  if (type === 'boolean') return 'bool';
  if (type === 'string') return 'string';
  if (type === 'number') return 'number';
  return 'unknown';
}

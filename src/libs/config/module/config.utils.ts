/* eslint-disable new-cap */
/* eslint-disable no-param-reassign */

export function ConfigDefaultValue(value?: any) {
  return (target: any, propertyKey: string): void => {
    const cls = Reflect.getMetadata('design:type', target, propertyKey);
    const isClass = cls.toString().includes('class');

    if (value != null) {
      target[propertyKey] = value;
    } else if (cls != null && isClass) {
      target[propertyKey] = new cls();
    }
  };
}

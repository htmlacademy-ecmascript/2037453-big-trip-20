const toCamelCase = (json) => {
  const reg = new RegExp(/[_-](\w)/gi);
  let str = JSON.stringify(json);
  str = str.replace(reg, (...match) => match[1].toUpperCase());
  return JSON.parse(str);
};

export default toCamelCase;

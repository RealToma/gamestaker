
  export function getProperty<T, K extends keyof T>(o: T, _k: K) {

    return [typeof _k, o[_k]];
  }
  export function setProperty<T, K extends keyof T>(o:T, _k: K, _value: any) {
    o[_k] = _value;
  }


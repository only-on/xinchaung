declare var window: any
declare var require: any

export namespace Random {
  export const getRandomValues = (() => {
    const crypto: any =
      (typeof window !== 'undefined' && (window.crypto || window.msCrypto)) ||
      (typeof require !== 'undefined' && require('crypto')) ||
      null

    if (crypto && typeof crypto.getRandomValues === 'function') {
      return function getRandomValues(buffer: Uint8Array): void {
        return crypto.getRandomValues(buffer)
      }
    }

    if (crypto && typeof crypto.randomFillSync === 'function') {
      return function getRandomValues(buffer: Uint8Array): void {
        return crypto.randomFillSync(buffer)
      }
    }

    if (crypto && typeof crypto.randomBytes === 'function') {
      return function getRandomValues(buffer: Uint8Array): void {
        const bytes = crypto.randomBytes(buffer.length)
        for (let i = 0, n = bytes.length; i < n; ++i) {
          buffer[i] = bytes[i]
        }
      }
    }

    return function getRandomValues(buffer: Uint8Array): void {
      let value = 0
      for (let i = 0, n = buffer.length; i < n; ++i) {
        if (i % 4 === 0) {
          value = (Math.random() * 0xffffffff) >>> 0
        }
        buffer[i] = value & 0xff
        value >>>= 8
      }
    }
  })()
}

export namespace UUID {
  export const uuid4 = (() => {
    const bytes = new Uint8Array(16)

    const lut = new Array<string>(256)

    for (let i = 0; i < 16; ++i) {
      lut[i] = '0' + i.toString(16)
    }

    for (let i = 16; i < 256; ++i) {
      lut[i] = i.toString(16)
    }

    return function uuid4(): string {
      Random.getRandomValues(bytes)

      bytes[6] = 0x40 | (bytes[6] & 0x0f)

      bytes[8] = 0x80 | (bytes[8] & 0x3f)

      return (
        lut[bytes[0]] +
        lut[bytes[1]] +
        lut[bytes[2]] +
        lut[bytes[3]] +
        '-' +
        lut[bytes[4]] +
        lut[bytes[5]] +
        '-' +
        lut[bytes[6]] +
        lut[bytes[7]] +
        '-' +
        lut[bytes[8]] +
        lut[bytes[9]] +
        '-' +
        lut[bytes[10]] +
        lut[bytes[11]] +
        lut[bytes[12]] +
        lut[bytes[13]] +
        lut[bytes[14]] +
        lut[bytes[15]]
      )
    }
  })()
}

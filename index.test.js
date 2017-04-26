import Superposition from './index'

describe('basic', () => {
  const Sum = ({ Constant }) => value => Constant + value
  const Product = ({ Constant }) => value => Constant * value
  const Seven = () => 7

  let system
  beforeEach(() => {
    system = new Superposition({
      Sum,
      Product,
      Constant: Seven
    })
  })

  it('should run', () => {
    const { Sum, Product } = system
    expect(Sum(9)).toBe(16)
    expect(Product(9)).toBe(63)
  })

  it('should be configurable before getting', () => {
    system.affect({ Constant: () => 5 })
    const { Sum, Product } = system
    expect(Sum(9)).toBe(14)
    expect(Product(9)).toBe(45)
  })

  it('should be configurable after getting', () => {
    const { Sum, Product } = system
    system.affect({ Constant: () => 5 })
    expect(Sum(9)).toBe(14)
    expect(Product(9)).toBe(45)
  })

  it('should not configurable after collapse', () => {
    const { Sum } = system
    Sum(9)
    expect(() => system.affect({ Constant: () => 5 })).toThrow("Collapsed due to 'Sum' having been called.")
  })

  it('should not configurable after collapse', () => {
    const { Product } = system
    Product(9)
    expect(() => system.affect({ Constant: () => 5 })).toThrow("Collapsed due to 'Product' having been called.")
  })
})

describe('objects', () => {
  const Sum = ({ Constants }) => () => Constants.x + Constants.y
  const Product = ({ Constants }) => () => Constants.x * Constants.y
  const Constants = () => ({ x: 5, y: 7 })

  let system
  beforeEach(() => {
    system = new Superposition({
      Sum,
      Product,
      Constants
    })
  })

  it('should run', () => {
    const { Sum, Product } = system
    expect(Sum()).toBe(12)
    expect(Product()).toBe(35)
  })

  it('should be configurable before getting', () => {
    system.affect({ Constants: () => ({ x: 6, y: 8 }) })
    const { Sum, Product } = system
    expect(Sum()).toBe(14)
    expect(Product()).toBe(48)
  })

  it('should be configurable after getting', () => {
    const { Sum, Product } = system
    system.affect({ Constants: () => ({ x: 6, y: 8 }) })
    expect(Sum()).toBe(14)
    expect(Product()).toBe(48)
  })

  it('should collapse on property access', () => {
    const { Constants } = system
    expect(Constants.x).toBe(5)
    expect(() => system.affect({ Constants: () => ({ x: 6, y: 8 }) })).toThrow("Collapsed due to 'Constants' having been called.")
  })
})

describe('complex objects', () => {
  const Maths = ({ Constants }) => ({
    sum: () => Constants.x + Constants.y,
    product: () => Constants.x * Constants.y,
    identity: () => 1
  })
  const Constants = () => ({ x: 5, y: 7 })

  let system
  beforeEach(() => {
    system = new Superposition({
      Maths,
      Constants
    })
  })

  it('should run', () => {
    const { Maths } = system
    expect(Maths.sum()).toBe(12)
    expect(Maths.product()).toBe(35)
  })

  it('calling a function should collapse things', () => {
    const { Maths } = system
    expect(Maths.identity()).toBe(1)
    expect(() => system.affect()).toThrow("Collapsed due to 'Maths' having been called.")
  })

  it('should allow Maths to be patched', () => {
    const { Maths } = system
    system.affect({Maths: ({ Constants }) => ({
      sum: () => Constants.x + Constants.x,
      product: () => Constants.y * Constants.y
    })})
    expect(Maths.sum()).toBe(10)
    expect(Maths.product()).toBe(49)
    expect(() => system.affect()).toThrow("Collapsed due to 'Maths' having been called.")
  })

})

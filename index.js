export default _components => {
  const components = {..._components}
  let collapsed = false

  const system = {}
  Object.keys(components).forEach(name => {
    Object.defineProperty(system, name, {
      enumerable: true,
      get() {
        const virtual = components[name](system)
        if (typeof virtual === "function") {
          return (...args) => {
            if (!collapsed) collapsed = name
            return components[name](system)(...args)
          }
        } else if (typeof virtual === "object") {
          return Object.create(virtual, Object.keys(virtual).reduce((defs, k) => {
            return {...defs, [k]: {
              enumerable: true,
              get() {
                if (!collapsed) collapsed = name
                return components[name](system)[k]
              }
            }}
          }, {}))
        } else {
          return virtual
        }
      }
    })
  })

  system.affect = comps => {
    if (collapsed) throw new Error(`Collapsed due to '${collapsed}' having been called.`)
    return Object.assign(components, comps)
  }

  return system
}

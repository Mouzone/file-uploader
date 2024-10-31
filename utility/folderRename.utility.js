module.exports.getNewRoute = (oldRoute, name) => {
    const routeSegments = oldRoute.split("/")
    routeSegments[routeSegments.length - 1] = name
    return routeSegments.join("/")
}
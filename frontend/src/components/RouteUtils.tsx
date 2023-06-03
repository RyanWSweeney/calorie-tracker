// RouteUtils.ts
export function shouldShowAppBar(path: string) {
    const pathsWithoutAppBar = ["/login", "/register", "/password"];
    return !pathsWithoutAppBar.includes(path);
}

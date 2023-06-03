// RouteUtils.ts
export function shouldShowAppBar(path: string) {
    const basePathsWithoutAppBar = ["/login", "/register", "/password", "/resetPassword"];
    return !basePathsWithoutAppBar.some(basePath => path.startsWith(basePath));
}

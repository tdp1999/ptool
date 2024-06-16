// Check if running in a server environment
if (typeof window === 'undefined') {
    global.requestAnimationFrame = (callback: FrameRequestCallback) => {
        // Use a timeout to simulate requestAnimationFrame but with no animation frame
        return setTimeout(() => callback(Date.now()), 16) as unknown as number;
    };

    global.cancelAnimationFrame = (id: number) => {
        clearTimeout(id);
    };
}

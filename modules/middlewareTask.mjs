export function middlewareTask(req, res, next) {
    const { taskName, completed } = req.body;

    if (completed === true) {
        console.log(`${taskName} completed`);
    }

    next();
}

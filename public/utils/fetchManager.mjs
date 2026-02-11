import HTTP from "./http.mjs";

async function get(url, contentType = HTTP.contentTypes.application.json) {
    return await runRequest(HTTP.methods.GET, url, null, contentType);
}

async function post(url, data, contentType = HTTP.contentTypes.application.json) {
    return await runRequest(HTTP.methods.POST, url, data, contentType);
}

async function del(url, contentType = HTTP.contentTypes.application.json) {
    return await runRequest(HTTP.methods.DELETE, url, null, contentType);
}

async function runRequest(method, url, data, contentType) {

    const options = {
        method,
        headers: {
            'Content-Type': contentType,
        }
    };

    if (data) {
        options.body = JSON.stringify(data); 
    }

    let response = await fetch(url, options);

    if (contentType === HTTP.contentTypes.application.json) {
        return await response.json();
    }

    return await response.text();
}

export { get, post, del };

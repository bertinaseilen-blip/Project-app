const methods = {
    GET: "GET",
    POST: "POST",
    DELETE: "DELETE",
    PATCH: "PATCH",
    PUT: "PUT"
}

const successCodes = {
    OK: 200
}

const clientErrorCodes = {
    NOT_FOUND: 404
}

const serverErrorCodes = {
    SERVER_ERROR: 500
}

const contentTypes = {
    text: {
        plain: "text/plain",
        html: "text/html",
        css: "text/css",
    },
    image: {
        jpeg: "image/jpeg",
        png: "image/png",
        gif: "image/gif",
        webp: "image/webp",
        svg: "image/svg+xml",
        bmp: "image/bmp",
        tiff: "image/tiff"
    },

    audio: {
        mpeg: "audio/mpeg",
        wav: "audio/wav",
        ogg: "audio/ogg",
    },

    video: {
        mp4: "video/mp4",
        mpeg: "video/mpeg",
    },

    application: {
        json: "application/json",
        javascript: "application/javascript",
        multipartFormData: "multipart/form-data"
    },

};

const HTTP = {
    methods,
    successCodes,
    clientErrorCodes,
    serverErrorCodes,
    contentTypes

}

export default HTTP
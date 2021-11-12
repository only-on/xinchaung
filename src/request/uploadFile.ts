export default class Upload {
    private url = ""
    public body = {}
    public abort(e:XMLHttpRequest) { }
    public progress(e: ProgressEvent) { }
    public success(e: any) { }
    public error(e: any) { }
    public headers = {}
    public xhr:XMLHttpRequest|null=null
    constructor(options: { url: string, body: Object, headers?: any, success: (e: any) => void, abort?: (e:XMLHttpRequest) => void, progress?: (e: ProgressEvent) => void, error?: (e: any) => void }) {
        const { url, body, abort, progress, success, error, headers } = options
        this.url = url
        this.body = body
        abort ? this.abort = abort : ""
        progress ? this.progress = progress : ""
        error ? this.error = error : ""
        this.success = success
        this.headers = headers
    }
    abortUpload(){
        if (!this.xhr) {
            return
        }
        this.xhr.abort()
        this.abort(this.xhr)
    }
    request() {
        if (typeof XMLHttpRequest === 'undefined') {
            return;
        }
        this.xhr = new XMLHttpRequest();
        if (this.xhr.upload) {
            this.xhr.upload.onprogress = (e: ProgressEvent) => {
                this.progress(e)
            }
        }
        const formData = new FormData();
        if (this.body) {
            Object.keys(this.body).forEach(key => {
                formData.append(key, this.body[key]);
            });
        }

        this.xhr.onerror = (e: any) => {
            console.log(e);
            this.error(e)
        };

        
        this.xhr.onload = () => {
            if (!this.xhr) {
                return
            }
            if (this.xhr.status < 200 || this.xhr.status >= 300) {
                console.log("出错了");
                this.error(this.getError())
                return;
            }
            this.success(this.getBody())
        }
        this.xhr.open("post", this.url, true)
        for (let item in this.headers) {
            if (this.headers.hasOwnProperty(item) && this.headers[item] !== null) {
                this.xhr.setRequestHeader(item, this.headers[item]);
            }
        }
        this.xhr.send(formData)
    }

    getError() {
        let msg;
        if (!this.xhr) {
            return
        }
        if (this.xhr.response) {
            msg = `${this.xhr.response.error || this.xhr.response}`;
        } else if (this.xhr.responseText) {
            msg = `${this.xhr.responseText}`;
        } else {
            msg = `fail to post ${this.url} ${this.xhr.status}`;
        }

        const err: any = new Error(msg);
        err.status = this.xhr.status;
        err.method = 'post';
        err.url = this.url;
        return err;
    }

    getBody() {
        if (!this.xhr) {
            return;
        }
        const text = this.xhr.responseText || this.xhr.response;
        if (!text) {
            return text;
        }

        try {
            return JSON.parse(text);
        } catch (e) {
            return text;
        }
    }
    
}
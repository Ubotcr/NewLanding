// Associate at CloudFront Viewer response. Only the canonical production host is indexable.
function handler(event) {
    var response = event.response;
    var type = response.headers['content-type'];
    if (event.request.headers.host.value !== 'ubotcr.com' && type && type.value.toLowerCase().indexOf('text/html') !== -1) {
        response.headers['x-robots-tag'] = {value: 'noindex'};
    }
    return response;
}
